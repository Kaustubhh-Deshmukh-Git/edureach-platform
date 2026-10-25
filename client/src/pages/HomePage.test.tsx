import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import HomePage, { SIGNUP_POPUP_STORAGE_KEY } from "./HomePage.tsx";
import * as AuthContextModule from "../context/AuthContext.tsx";
import type { User } from "../types/index.ts";

vi.mock("../context/AuthContext.tsx", () => ({
  useAuth: vi.fn(),
}));

const mockUser: User = {
  id: "u-999",
  name: "Kavya Patel",
  email: "kavya@edureach.edu",
  phone: "9876543210",
};

let observerCallback: IntersectionObserverCallback | null = null;

class TestIntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly scrollMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [0.5];
  constructor(cb: IntersectionObserverCallback) {
    observerCallback = cb;
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}

describe("HomePage Gating & Gated Behavior", () => {
  beforeEach(() => {
    sessionStorage.clear();
    observerCallback = null;
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
    vi.clearAllMocks();
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it("visitor sees public sections and teaser, but does not see gated sections", () => {
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    // Public sections present
    expect(screen.getByRole("heading", { name: /EduReach College/i })).toBeInTheDocument();
    expect(screen.getByText(/About Our Institution/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Empowering Minds, Shaping Tomorrow/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Rankings & Institutional Milestones/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Comprehensive Degree Programs/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Alumni & Student Stories/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Meet Our Distinguished Mentors/i }),
    ).toBeInTheDocument();

    // Visitor teaser present
    expect(screen.getByRole("heading", { name: /Want to See More\?/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sign Up to Unlock/i })).toBeInTheDocument();

    // Gated sections absent
    expect(
      screen.queryByRole("heading", { name: /Vibrant Student Life & Infrastructure/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Events & Annual Highlights/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Have Admissions Questions\? Talk Directly to/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Comprehensive Placement Insights/i }),
    ).not.toBeInTheDocument();
  });

  it("logged-in user sees gated sections and does not see visitor teaser", () => {
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    // Visitor teaser absent
    expect(screen.queryByRole("heading", { name: /Want to See More\?/i })).not.toBeInTheDocument();

    // Gated sections present
    expect(
      screen.getByRole("heading", { name: /Vibrant Student Life & Infrastructure/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Events & Annual Highlights/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Have Admissions Questions\? Talk Directly to/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Comprehensive Placement Insights/i }),
    ).toBeInTheDocument();
  });

  it("opens signup popup once per session when visitor reaches mentors section", () => {
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    // Popup initially not open
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(sessionStorage.getItem(SIGNUP_POPUP_STORAGE_KEY)).toBeNull();

    // Simulate mentors section becoming 50% visible
    act(() => {
      observerCallback?.(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.6,
            target: document.createElement("div"),
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    // Popup is now displayed
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Unlock Full Campus Insights")).toBeInTheDocument();
    expect(sessionStorage.getItem(SIGNUP_POPUP_STORAGE_KEY)).toBe("true");

    // Close the popup
    const closeBtn = screen.getByRole("button", { name: /Close dialog/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Second trigger in the same session does not re-open the popup
    act(() => {
      observerCallback?.(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.6,
            target: document.createElement("div"),
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("never opens signup popup for logged-in user when reaching mentors section", () => {
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    act(() => {
      observerCallback?.(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.6,
            target: document.createElement("div"),
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens and closes CallPopup when logged-in user clicks Counselor CTA", async () => {
    const user = userEvent.setup();
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    const callBtn = screen.getByRole("button", { name: /Start Voice Session/i });
    await user.click(callBtn);

    expect(screen.getByRole("dialog", { name: /Call with Ava/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Request an instant outbound phone call from Ava/i),
    ).toBeInTheDocument();

    // Click close
    const closeBtn = screen.getByRole("button", { name: /Close call modal/i });
    await user.click(closeBtn);

    expect(screen.queryByRole("dialog", { name: /Call with Ava/i })).not.toBeInTheDocument();
  });
});
