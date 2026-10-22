import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./AuthContext.tsx";
import * as authService from "../services/auth.service.ts";
import type { User } from "../types/index.ts";

const mockUser: User = {
  id: "user-123",
  name: "Jane Student",
  email: "jane@edureach.edu",
  phone: "9876543210",
};

function TestConsumer() {
  const { user, loading, login, logout } = useAuth();
  if (loading) return <div>Loading session...</div>;
  return (
    <div>
      <div data-testid="user">{user ? user.name : "Guest"}</div>
      <button onClick={() => login("mock-valid-token")}>Login Button</button>
      <button onClick={logout}>Logout Button</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("restores session from token on mount when token exists in localStorage", async () => {
    localStorage.setItem("token", "stored-token-xyz");
    vi.spyOn(authService, "getMe").mockResolvedValueOnce({ user: mockUser });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByText("Loading session...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("Jane Student");
    });
    expect(authService.getMe).toHaveBeenCalledTimes(1);
  });

  it("clears token and remains guest if getMe fails on mount", async () => {
    localStorage.setItem("token", "expired-token-xyz");
    vi.spyOn(authService, "getMe").mockRejectedValueOnce(new Error("Unauthorized"));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("Guest");
    });
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("logs in successfully and populates user profile", async () => {
    vi.spyOn(authService, "getMe").mockResolvedValueOnce({ user: mockUser });
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("Guest");
    });

    await user.click(screen.getByText("Login Button"));

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("Jane Student");
    });
    expect(localStorage.getItem("token")).toBe("mock-valid-token");
  });

  it("logs out and clears localStorage and user state", async () => {
    localStorage.setItem("token", "valid-token");
    vi.spyOn(authService, "getMe").mockResolvedValueOnce({ user: mockUser });
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("Jane Student");
    });

    await user.click(screen.getByText("Logout Button"));

    expect(screen.getByTestId("user")).toHaveTextContent("Guest");
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("responds to auth:logout window event by clearing session", async () => {
    localStorage.setItem("token", "valid-token");
    vi.spyOn(authService, "getMe").mockResolvedValueOnce({ user: mockUser });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("Jane Student");
    });

    act(() => {
      window.dispatchEvent(new Event("auth:logout"));
    });

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("Guest");
    });
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("throws error when useAuth is used outside AuthProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow("useAuth must be used within an AuthProvider");
    consoleError.mockRestore();
  });
});
