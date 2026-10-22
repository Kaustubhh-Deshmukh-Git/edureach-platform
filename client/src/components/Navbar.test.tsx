import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar.tsx";
import * as AuthContextModule from "../context/AuthContext.tsx";
import type { User } from "../types/index.ts";

vi.mock("../context/AuthContext.tsx", () => ({
  useAuth: vi.fn(),
}));

const mockUser: User = {
  id: "u-123",
  name: "Dr. Ramesh Sharma",
  email: "ramesh@edureach.edu",
  phone: "9876543210",
};

describe("Navbar", () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders brand logo, navigation links, and visitor auth links when not logged in", () => {
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    // Brand logo
    expect(screen.getByText("EduReach")).toBeInTheDocument();
    expect(screen.getByText(/Hyderabad/i)).toBeInTheDocument();

    // Nav links
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "#hero");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "#about");
    expect(screen.getByRole("link", { name: "Achievements" })).toHaveAttribute(
      "href",
      "#achievements",
    );
    expect(screen.getByRole("link", { name: "Courses" })).toHaveAttribute("href", "#courses");
    expect(screen.getByRole("link", { name: "Quotes" })).toHaveAttribute("href", "#quotes");
    expect(screen.getByRole("link", { name: "Mentors" })).toHaveAttribute("href", "#mentors");

    // Visitor links
    expect(screen.getByRole("link", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign Up" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Log out/i })).not.toBeInTheDocument();
  });

  it("renders user name and logout button when user is logged in", async () => {
    const user = userEvent.setup();
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    // Shows user name
    expect(screen.getByText("Dr. Ramesh Sharma")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Sign In" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Sign Up" })).not.toBeInTheDocument();

    // Clicking logout invokes logout()
    const logoutBtn = screen.getByRole("button", { name: /Log out of account/i });
    expect(logoutBtn).toBeInTheDocument();
    await user.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("toggles mobile menu and expands navigation", async () => {
    const user = userEvent.setup();
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const toggleButton = screen.getByRole("button", { name: /Toggle navigation menu/i });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });
});
