import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import toast from "react-hot-toast";
import SignupPage from "./SignupPage.tsx";
import * as authService from "../services/auth.service.ts";
import { AuthProvider } from "../context/AuthContext.tsx";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("SignupPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("shows validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider>
          <SignupPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /Create Student Account/i }));

    expect(await screen.findByText("Full name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
  });

  it("shows validation error when passwords do not match or phone is invalid", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider>
          <SignupPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/Full Name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/Email Address/i), "jane@edureach.edu");
    await user.type(screen.getByLabelText(/Phone Number/i), "123");
    await user.type(screen.getByLabelText(/^Password \*/i), "Password123!");
    await user.type(screen.getByLabelText(/^Confirm Password \*/i), "DifferentPassword123!");

    await user.click(screen.getByRole("button", { name: /Create Student Account/i }));

    expect(await screen.findByText("Phone number must be exactly 10 digits.")).toBeInTheDocument();
    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
  });

  it("creates account and redirects upon successful submission", async () => {
    const user = userEvent.setup();
    vi.spyOn(authService, "registerUser").mockResolvedValueOnce({
      token: "signup-token",
      user: {
        id: "2",
        name: "Jane Doe",
        email: "jane@edureach.edu",
      },
    });
    vi.spyOn(authService, "getMe").mockResolvedValueOnce({
      user: {
        id: "2",
        name: "Jane Doe",
        email: "jane@edureach.edu",
      },
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <SignupPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/Full Name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/Email Address/i), "jane@edureach.edu");
    await user.type(screen.getByLabelText(/^Password \*/i), "Password123!");
    await user.type(screen.getByLabelText(/^Confirm Password \*/i), "Password123!");

    await user.click(screen.getByRole("button", { name: /Create Student Account/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Account created successfully!");
    });
  });
});
