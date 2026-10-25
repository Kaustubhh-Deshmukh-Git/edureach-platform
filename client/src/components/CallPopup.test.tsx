import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CallPopup from "./CallPopup.tsx";
import * as AuthContextModule from "../context/AuthContext.tsx";
import * as vapiService from "../services/vapi.service.ts";

vi.mock("../context/AuthContext.tsx", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../services/vapi.service.ts", () => ({
  initiateCall: vi.fn(),
}));

describe("CallPopup Component & 4-State Machine Tests", () => {
  const mockOnClose = vi.fn();
  const mockUser = {
    id: "user-test-123",
    name: "Rohan Patel",
    email: "rohan@example.com",
    phone: "9876543210",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  it("does not render dialog when open is false", () => {
    render(
      <MemoryRouter>
        <CallPopup open={false} onClose={mockOnClose} />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders accessible dialog with prefilled name, phone, and optional selectors when open is true", () => {
    render(
      <MemoryRouter>
        <CallPopup open={true} onClose={mockOnClose} />
      </MemoryRouter>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "call-popup-title");

    expect(screen.getByLabelText(/Student Name/i)).toHaveValue("Rohan Patel");
    expect(screen.getByLabelText(/Mobile Number/i)).toHaveValue("9876543210");
    expect(screen.getByLabelText(/Preferred Program/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Topic of Interest/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/I agree to receive one phone call from EduReach's AI counselor/i),
    ).not.toBeChecked();
  });

  it("strips non-digits and limits mobile number input to 10 characters", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CallPopup open={true} onClose={mockOnClose} />
      </MemoryRouter>,
    );

    const phoneInput = screen.getByLabelText(/Mobile Number/i);
    await user.clear(phoneInput);
    await user.type(phoneInput, "abc987-654-3210999extra");

    expect(phoneInput).toHaveValue("9876543210");
  });

  it("blocks submission and shows error message when phone number is invalid", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CallPopup open={true} onClose={mockOnClose} />
      </MemoryRouter>,
    );

    const phoneInput = screen.getByLabelText(/Mobile Number/i);
    await user.clear(phoneInput);
    await user.type(phoneInput, "5123456789"); // Starts with 5, invalid for Indian mobile

    const consentBox = screen.getByLabelText(/I agree to receive one phone call/i);
    await user.click(consentBox);

    const submitBtn = screen.getByRole("button", { name: /Call Me Now/i });
    await user.click(submitBtn);

    expect(
      screen.getByText(
        /Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9/i,
      ),
    ).toBeInTheDocument();
    expect(vapiService.initiateCall).not.toHaveBeenCalled();
  });

  it("blocks submission and shows error message when consent checkbox is unchecked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CallPopup open={true} onClose={mockOnClose} />
      </MemoryRouter>,
    );

    const phoneInput = screen.getByLabelText(/Mobile Number/i);
    await user.clear(phoneInput);
    await user.type(phoneInput, "9876543210"); // Valid number

    // Do NOT check consent
    const submitBtn = screen.getByRole("button", { name: /Call Me Now/i });
    await user.click(submitBtn);

    expect(
      screen.getByText(/Consent is required to receive an AI counselor phone call/i),
    ).toBeInTheDocument();
    expect(vapiService.initiateCall).not.toHaveBeenCalled();
  });

  it("handles happy path: transitions from form → calling → done upon success", async () => {
    const user = userEvent.setup();
    let resolveCall: (val: any) => void = () => {};
    const callPromise = new Promise((resolve) => {
      resolveCall = resolve;
    });

    vi.mocked(vapiService.initiateCall).mockImplementation(() => callPromise as any);

    render(
      <MemoryRouter>
        <CallPopup open={true} onClose={mockOnClose} />
      </MemoryRouter>,
    );

    // Select course and topic
    await user.selectOptions(
      screen.getByLabelText(/Preferred Program/i),
      "B.Tech Computer Science & Engineering",
    );
    await user.selectOptions(screen.getByLabelText(/Topic of Interest/i), "Admissions");

    // Check consent
    const consentBox = screen.getByLabelText(/I agree to receive one phone call/i);
    await user.click(consentBox);

    // Submit
    const submitBtn = screen.getByRole("button", { name: /Call Me Now/i });
    await user.click(submitBtn);

    // Should enter calling state
    expect(screen.getByText(/Connecting…/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Initiating Voice Agent…/i })).toBeDisabled();

    // Verify service call args
    expect(vapiService.initiateCall).toHaveBeenCalledWith({
      phone: "9876543210",
      course: "B.Tech Computer Science & Engineering",
      topic: "Admissions",
    });

    // Resolve API call
    resolveCall({
      success: true,
      data: {
        callId: "vapi-call-123",
        status: "queued",
        message: "Call initiated successfully. You will receive a call shortly.",
      },
    });

    // Should enter done state
    await waitFor(() => {
      expect(screen.getByText(/Call Dispatched!/i)).toBeInTheDocument();
    });
    expect(
      screen.getAllByText(/Call initiated successfully. You will receive a call shortly/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/\+91 9876543210/i)).toBeInTheDocument();

    // Clicking "Done" button calls onClose
    const doneBtn = screen.getByRole("button", { name: /Done/i });
    await user.click(doneBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("handles failure: transitions to error state and allows Try Again to return to form", async () => {
    const user = userEvent.setup();
    const mockAxiosError = {
      isAxiosError: true,
      response: {
        status: 502,
        data: { message: "Voice agent upstream service is temporarily down." },
      },
    };

    vi.mocked(vapiService.initiateCall).mockRejectedValue(mockAxiosError);

    render(
      <MemoryRouter>
        <CallPopup open={true} onClose={mockOnClose} />
      </MemoryRouter>,
    );

    const consentBox = screen.getByLabelText(/I agree to receive one phone call/i);
    await user.click(consentBox);

    const submitBtn = screen.getByRole("button", { name: /Call Me Now/i });
    await user.click(submitBtn);

    // Should transition to error state
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Connection Failed/i })).toBeInTheDocument();
    });
    expect(
      screen.getAllByText(/Voice agent upstream service is temporarily down/i).length,
    ).toBeGreaterThanOrEqual(1);

    // Click "Try Again"
    const tryAgainBtn = screen.getByRole("button", { name: /Try Again/i });
    await user.click(tryAgainBtn);

    // Should return to form state with phone number still populated
    expect(screen.getByRole("heading", { name: /Call with Ava/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile Number/i)).toHaveValue("9876543210");
  });

  it("handles 429 rate limit error showing server rate limit message", async () => {
    const user = userEvent.setup();
    const rateLimitError = {
      isAxiosError: true,
      response: {
        status: 429,
        data: {
          message: "Call limit reached. Maximum 3 calls per hour allowed. Please try again later.",
        },
      },
    };

    vi.mocked(vapiService.initiateCall).mockRejectedValue(rateLimitError);

    render(
      <MemoryRouter>
        <CallPopup open={true} onClose={mockOnClose} />
      </MemoryRouter>,
    );

    const consentBox = screen.getByLabelText(/I agree to receive one phone call/i);
    await user.click(consentBox);

    const submitBtn = screen.getByRole("button", { name: /Call Me Now/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getAllByText(
          /Call limit reached. Maximum 3 calls per hour allowed. Please try again later/i,
        ).length,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  it("closes modal on Escape key press, close button, or backdrop click", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <MemoryRouter>
        <CallPopup open={true} onClose={mockOnClose} />
      </MemoryRouter>,
    );

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    // Click Close Button
    const closeBtn = screen.getByRole("button", { name: /Close call modal/i });
    await user.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(2);

    // Click Cancel Button
    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(3);

    // Click backdrop
    const backdrop = screen.getByRole("dialog");
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalledTimes(4);

    // Re-render as closed
    rerender(
      <MemoryRouter>
        <CallPopup open={false} onClose={mockOnClose} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
