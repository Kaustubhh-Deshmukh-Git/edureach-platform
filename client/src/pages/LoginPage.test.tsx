import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import toast from "react-hot-toast";
import LoginPage from "./LoginPage.tsx";
import * as authService from "../services/auth.service.ts";
import { AuthProvider } from "../context/AuthContext.tsx";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("LoginPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("shows validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
  });

  it("shows validation error for invalid email and short password", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/Email Address/i), "invalid-email");
    await user.type(screen.getByLabelText(/^Password$/i), "short");
    await user.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(await screen.findByText("Please enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Password must be at least 8 characters.")).toBeInTheDocument();
  });

  it("shows toast error when login request fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(authService, "loginUser").mockRejectedValueOnce({
      response: {
        data: {
          success: false,
          message: "Invalid email or password.",
        },
      },
      isAxiosError: true,
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/Email Address/i), "student@edureach.edu");
    await user.type(screen.getByLabelText(/^Password$/i), "Password123!");
    await user.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid email or password.");
    });
  });

  it("logs in successfully and shows success toast", async () => {
    const user = userEvent.setup();
    vi.spyOn(authService, "loginUser").mockResolvedValueOnce({
      token: "test-jwt-token",
      user: {
        id: "1",
        name: "Test User",
        email: "student@edureach.edu",
      },
    });
    vi.spyOn(authService, "getMe").mockResolvedValueOnce({
      user: {
        id: "1",
        name: "Test User",
        email: "student@edureach.edu",
      },
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/Email Address/i), "student@edureach.edu");
    await user.type(screen.getByLabelText(/^Password$/i), "Password123!");
    await user.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Signed in successfully!");
    });
  });
});
