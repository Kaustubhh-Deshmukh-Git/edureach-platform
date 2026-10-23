import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import FloatingChatButton from "./FloatingChatButton.tsx";
import * as AuthContextModule from "../context/AuthContext.tsx";
import * as chatService from "../services/chat.service.ts";
import type { User } from "../types/index.ts";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../context/AuthContext.tsx", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../services/chat.service.ts", () => ({
  sendMessage: vi.fn(),
}));

// Mock scrollIntoView for jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

const mockUser: User = {
  id: "u-101",
  name: "Aarav Sharma",
  email: "aarav@edureach.edu",
};

describe("FloatingChatButton and ChatDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Logged-out state", () => {
    it("redirects to /login when clicked by an unauthenticated visitor", async () => {
      vi.mocked(AuthContextModule.useAuth).mockReturnValue({
        user: null,
        loading: false,
        login: vi.fn(),
        logout: vi.fn(),
      });

      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FloatingChatButton />
        </MemoryRouter>,
      );

      const button = screen.getByRole("button", {
        name: /Chat with EduReach AI Assistant/i,
      });
      await user.click(button);

      expect(mockNavigate).toHaveBeenCalledWith("/login");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Logged-in state and Chat Interactions", () => {
    beforeEach(() => {
      vi.mocked(AuthContextModule.useAuth).mockReturnValue({
        user: mockUser,
        loading: false,
        login: vi.fn(),
        logout: vi.fn(),
      });
    });

    it("opens drawer and displays personalized greeting and suggested questions", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FloatingChatButton />
        </MemoryRouter>,
      );

      const trigger = screen.getByRole("button", {
        name: /Chat with EduReach AI Assistant/i,
      });
      await user.click(trigger);

      expect(
        screen.getByRole("dialog", { name: /EduReach Campus AI Assistant/i }),
      ).toBeInTheDocument();

      // Greeting with user name
      expect(screen.getByText(/Hello Aarav!/i)).toBeInTheDocument();

      // Quick question chips visible initially
      expect(screen.getByRole("button", { name: /B\.Tech CSE Fees/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Admissions/i })).toBeInTheDocument();
    });

    it("sending a message calls chat service and renders bot reply", async () => {
      const botReply =
        "The annual tuition fee for B.Tech in CSE at EduReach College is ₹1,50,000 per year.";
      vi.mocked(chatService.sendMessage).mockResolvedValueOnce({
        response: botReply,
      });

      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FloatingChatButton />
        </MemoryRouter>,
      );

      // Open drawer
      await user.click(
        screen.getByRole("button", {
          name: /Chat with EduReach AI Assistant/i,
        }),
      );

      const textarea = screen.getByLabelText(/Type your message/i);
      const sendButton = screen.getByLabelText(/Send message/i);

      // Send button disabled initially with empty input
      expect(sendButton).toBeDisabled();

      await user.type(textarea, "What is the fee for B.Tech CSE?");
      expect(sendButton).not.toBeDisabled();

      await user.click(sendButton);

      // User message rendered
      expect(screen.getByText("What is the fee for B.Tech CSE?")).toBeInTheDocument();

      // Chat service called
      expect(chatService.sendMessage).toHaveBeenCalledWith("What is the fee for B.Tech CSE?");

      // Bot reply rendered
      await waitFor(() => {
        expect(screen.getByText(botReply)).toBeInTheDocument();
      });

      // Quick chips hidden after first user message
      expect(screen.queryByRole("button", { name: /B\.Tech CSE Fees/i })).not.toBeInTheDocument();
    });

    it("clicking a suggested question chip sends the question immediately", async () => {
      vi.mocked(chatService.sendMessage).mockResolvedValueOnce({
        response: "EduReach admissions open in May every year based on merit and entrance tests.",
      });

      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FloatingChatButton />
        </MemoryRouter>,
      );

      await user.click(
        screen.getByRole("button", {
          name: /Chat with EduReach AI Assistant/i,
        }),
      );

      const admissionChip = screen.getByRole("button", { name: /Admissions/i });
      await user.click(admissionChip);

      expect(chatService.sendMessage).toHaveBeenCalledWith("How does the admission process work?");

      await waitFor(() => {
        expect(screen.getByText(/EduReach admissions open in May/i)).toBeInTheDocument();
      });
    });

    it("shows error bubble when assistant service fails", async () => {
      vi.mocked(chatService.sendMessage).mockRejectedValueOnce(
        new Error("Network connection dropped"),
      );

      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FloatingChatButton />
        </MemoryRouter>,
      );

      await user.click(
        screen.getByRole("button", {
          name: /Chat with EduReach AI Assistant/i,
        }),
      );

      const textarea = screen.getByLabelText(/Type your message/i);
      await user.type(textarea, "What are the hostel charges?");
      await user.click(screen.getByLabelText(/Send message/i));

      await waitFor(() => {
        expect(
          screen.getByText(/The assistant is temporarily unavailable. Please try again./i),
        ).toBeInTheDocument();
      });
    });

    it("closes drawer when close button is clicked or Escape key is pressed", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FloatingChatButton />
        </MemoryRouter>,
      );

      // Open drawer
      await user.click(
        screen.getByRole("button", {
          name: /Chat with EduReach AI Assistant/i,
        }),
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Press Escape
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // Open drawer again
      await user.click(
        screen.getByRole("button", {
          name: /Chat with EduReach AI Assistant/i,
        }),
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Click Close button inside header
      await user.click(screen.getByLabelText(/Close assistant drawer/i));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
