import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import LogicRunner from "./LogicRunner";

// Mock the calculation functions
vi.mock("@/lib/calculations", () => ({
  part1Calculation: vi.fn(() => ({
    userTotals: { Alice: 500, Bob: 300 },
    topUser: { name: "Alice", total: 500 },
    completionRate: 0.75,
  })),
  part2Calculation: vi.fn(() => ({
    paidButNotDelivered: [
      {
        id: "1",
        user: "Alice",
        amount: 100,
        status: "processing",
        paymentStatus: "paid",
        deliveryStatus: "pending",
        date: "2024-01-01",
      },
    ],
    deliveryStats: {
      pending: { count: 2, totalAmount: 200 },
      delivered: { count: 3, totalAmount: 450 },
    },
    anomalies: [],
  })),
}));

describe("LogicRunner", () => {
  it("renders correctly with initial state", () => {
    render(<LogicRunner />);

    // Verify main title
    expect(screen.getByText("Logic Runner")).toBeInTheDocument();
    expect(
      screen.getByText("Execute complex calculations on the current dataset.")
    ).toBeInTheDocument();

    // Verify action buttons
    expect(
      screen.getByRole("button", { name: /Run Part 1/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Run Part 2/i })
    ).toBeInTheDocument();

    // Verify empty state message
    expect(
      screen.getByText("Select an action to view results")
    ).toBeInTheDocument();
  });

  it("runs Part 1 calculation when button is clicked", async () => {
    render(<LogicRunner />);
    const user = userEvent.setup();

    const part1Button = screen.getByRole("button", { name: /Run Part 1/i });
    await user.click(part1Button);

    // Verify Part 1 badge appears
    await waitFor(() => {
      expect(screen.getByText("Part 1")).toBeInTheDocument();
    });

    // Verify result is displayed
    await waitFor(() => {
      expect(screen.getByText(/userTotals/i)).toBeInTheDocument();
      expect(screen.getByText(/Alice/i)).toBeInTheDocument();
      expect(screen.getByText(/topUser/i)).toBeInTheDocument();
      expect(screen.getByText(/completionRate/i)).toBeInTheDocument();
    });

    // Verify empty state message is gone
    expect(
      screen.queryByText("Select an action to view results")
    ).not.toBeInTheDocument();
  });

  it("runs Part 2 calculation when button is clicked", async () => {
    render(<LogicRunner />);
    const user = userEvent.setup();

    const part2Button = screen.getByRole("button", { name: /Run Part 2/i });
    await user.click(part2Button);

    // Verify Part 2 badge appears
    await waitFor(() => {
      expect(screen.getByText("Part 2")).toBeInTheDocument();
    });

    // Verify result is displayed
    await waitFor(() => {
      expect(screen.getByText(/paidButNotDelivered/i)).toBeInTheDocument();
      expect(screen.getByText(/deliveryStats/i)).toBeInTheDocument();
      expect(screen.getByText(/anomalies/i)).toBeInTheDocument();
    });

    // Verify empty state message is gone
    expect(
      screen.queryByText("Select an action to view results")
    ).not.toBeInTheDocument();
  });

  it("switches between Part 1 and Part 2 correctly", async () => {
    render(<LogicRunner />);
    const user = userEvent.setup();

    // Click Part 1
    const part1Button = screen.getByRole("button", { name: /Run Part 1/i });
    await user.click(part1Button);

    await waitFor(() => {
      expect(screen.getByText("Part 1")).toBeInTheDocument();
      expect(screen.getByText(/completionRate/i)).toBeInTheDocument();
    });

    // Click Part 2
    const part2Button = screen.getByRole("button", { name: /Run Part 2/i });
    await user.click(part2Button);

    await waitFor(() => {
      expect(screen.getByText("Part 2")).toBeInTheDocument();
      expect(screen.getByText(/paidButNotDelivered/i)).toBeInTheDocument();
    });

    // Part 1 specific content should be replaced
    expect(screen.queryByText(/completionRate/i)).not.toBeInTheDocument();
  });

  it("displays result as formatted JSON", async () => {
    render(<LogicRunner />);
    const user = userEvent.setup();

    const part1Button = screen.getByRole("button", { name: /Run Part 1/i });
    await user.click(part1Button);

    // Verify JSON formatting (indentation, structure)
    await waitFor(() => {
      const codeElement = screen.getByText(/userTotals/i);
      expect(codeElement.tagName).toBe("CODE");
    });
  });
});
