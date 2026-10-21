import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App.tsx";

describe("App smoke test", () => {
  it("renders EduReach College heading and tagline", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /EduReach College/i })).toBeInTheDocument();
    expect(screen.getByText(/Your Gateway to Smarter Education Decisions/i)).toBeInTheDocument();
  });
});
