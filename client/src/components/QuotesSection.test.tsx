import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import QuotesSection from "./QuotesSection.tsx";
import { quotesContent } from "../data/content.ts";

describe("QuotesSection", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("renders initial quote correctly", () => {
    render(<QuotesSection />);

    const firstQuote = quotesContent[0];
    expect(screen.getByText(new RegExp(firstQuote.author, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(firstQuote.role, "i"))).toBeInTheDocument();
  });

  it("auto-rotates to the next quote after 5000ms", () => {
    render(<QuotesSection />);

    const firstQuote = quotesContent[0];
    const secondQuote = quotesContent[1];

    expect(screen.getByText(new RegExp(firstQuote.author, "i"))).toBeInTheDocument();

    // Advance by 5000ms (interval) + 150ms (fade transition timeout)
    act(() => {
      vi.advanceTimersByTime(5000);
      vi.advanceTimersByTime(150);
    });

    expect(screen.getByText(new RegExp(secondQuote.author, "i"))).toBeInTheDocument();
  });

  it("pauses rotation on mouse hover and resumes on mouse leave", () => {
    const { container } = render(<QuotesSection />);
    const section = container.querySelector("#quotes")!;

    const firstQuote = quotesContent[0];
    const secondQuote = quotesContent[1];

    // Hover pauses timer
    fireEvent.mouseEnter(section);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Still on first quote because it's paused
    expect(screen.getByText(new RegExp(firstQuote.author, "i"))).toBeInTheDocument();
    expect(screen.queryByText(new RegExp(secondQuote.author, "i"))).not.toBeInTheDocument();

    // Mouse leave resumes timer
    fireEvent.mouseLeave(section);

    act(() => {
      vi.advanceTimersByTime(5000);
      vi.advanceTimersByTime(150);
    });

    expect(screen.getByText(new RegExp(secondQuote.author, "i"))).toBeInTheDocument();
  });

  it("allows manual navigation via next and prev buttons", () => {
    render(<QuotesSection />);

    const firstQuote = quotesContent[0];
    const secondQuote = quotesContent[1];

    expect(screen.getByText(new RegExp(firstQuote.author, "i"))).toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: /Next testimonial/i });
    fireEvent.click(nextBtn);

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(screen.getByText(new RegExp(secondQuote.author, "i"))).toBeInTheDocument();

    const prevBtn = screen.getByRole("button", { name: /Previous testimonial/i });
    fireEvent.click(prevBtn);

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(screen.getByText(new RegExp(firstQuote.author, "i"))).toBeInTheDocument();
  });

  it("navigates directly when dot indicator is clicked", () => {
    render(<QuotesSection />);

    const thirdQuote = quotesContent[2];
    const dotBtn = screen.getByRole("button", { name: /Go to slide 3/i });

    fireEvent.click(dotBtn);

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(screen.getByText(new RegExp(thirdQuote.author, "i"))).toBeInTheDocument();
  });

  it("cleans up interval on unmount", () => {
    const clearIntervalSpy = vi.spyOn(window, "clearInterval");
    const { unmount } = render(<QuotesSection />);

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
