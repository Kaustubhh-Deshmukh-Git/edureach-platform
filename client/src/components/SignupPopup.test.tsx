import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SignupPopup from "./SignupPopup.tsx";

describe("SignupPopup Accessibility & Interactions", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when show is false", () => {
    render(
      <MemoryRouter>
        <SignupPopup show={false} onClose={mockOnClose} />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders with correct accessibility attributes and CTAs when show is true", () => {
    render(
      <MemoryRouter>
        <SignupPopup show={true} onClose={mockOnClose} />
      </MemoryRouter>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "signup-popup-title");

    expect(screen.getByRole("link", { name: /Create Free Account/i })).toHaveAttribute(
      "href",
      "/signup",
    );
    expect(screen.getByRole("link", { name: /Sign In instead/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("closes modal on Escape key press", () => {
    render(
      <MemoryRouter>
        <SignupPopup show={true} onClose={mockOnClose} />
      </MemoryRouter>,
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("closes modal on backdrop click", () => {
    render(
      <MemoryRouter>
        <SignupPopup show={true} onClose={mockOnClose} />
      </MemoryRouter>,
    );

    const backdrop = screen.getByRole("dialog");
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("closes modal on close button click", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SignupPopup show={true} onClose={mockOnClose} />
      </MemoryRouter>,
    );

    const closeBtn = screen.getByRole("button", { name: /Close dialog/i });
    await user.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
