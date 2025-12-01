import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoList from "./TodoList";
import { describe, it, expect, vi } from "vitest";
import { toast } from "sonner";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("TodoList Component", () => {
  it("renders correctly", () => {
    render(<TodoList />);
    expect(screen.getByText("My Tasks")).toBeInTheDocument();
    expect(screen.getByText("Your Task List")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("What's your next task?")
    ).toBeInTheDocument();
  });

  it("shows validation error when submitting empty input", async () => {
    render(<TodoList />);
    const user = userEvent.setup();
    const addButton = screen.getByRole("button", { name: /add task/i });

    await user.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Task must be at least 1 character long/i)
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for task exceeding 30 characters", async () => {
    render(<TodoList />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("What's your next task?");
    const addButton = screen.getByRole("button", { name: /add task/i });

    // Type 31 characters
    await user.type(
      input,
      "This is a very long task name that exceeds the limit"
    );
    await user.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Task must be at most 30 characters long/i)
      ).toBeInTheDocument();
    });
  });

  it("adds a new task", async () => {
    render(<TodoList />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("What's your next task?");
    const addButton = screen.getByRole("button", { name: /add task/i });

    await user.type(input, "New Task Item");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("New Task Item")).toBeInTheDocument();
    });

    // Input should be cleared
    expect(input).toHaveValue("");
  });

  it("adds task with minimum length (1 character)", async () => {
    render(<TodoList />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("What's your next task?");
    const addButton = screen.getByRole("button", { name: /add task/i });

    await user.type(input, "A");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("A")).toBeInTheDocument();
    });
  });

  it("adds task with maximum length (30 characters)", async () => {
    render(<TodoList />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("What's your next task?");
    const addButton = screen.getByRole("button", { name: /add task/i });

    const maxLengthTask = "A".repeat(30);
    await user.type(input, maxLengthTask);
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(maxLengthTask)).toBeInTheDocument();
    });
  });

  it("clears input when Clear button is clicked", async () => {
    render(<TodoList />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("What's your next task?");
    const clearButton = screen.getByRole("button", { name: /clear/i });

    await user.type(input, "Some task");
    expect(input).toHaveValue("Some task");

    await user.click(clearButton);
    expect(input).toHaveValue("");
  });

  it("toggles task completion", async () => {
    render(<TodoList />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("What's your next task?");
    const addButton = screen.getByRole("button", { name: /add task/i });

    // Add a task
    await user.type(input, "Task to Toggle");
    await user.click(addButton);

    const checkbox = await screen.findByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    // Toggle
    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    // Toggle back
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("removes a task", async () => {
    render(<TodoList />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("What's your next task?");
    const addButton = screen.getByRole("button", { name: /add task/i });

    // Add a task
    await user.type(input, "Task to Remove");
    await user.click(addButton);

    expect(screen.getByText("Task to Remove")).toBeInTheDocument();

    const deleteButton = screen.getByLabelText(`Remove do-to Task to Remove`);
    await user.click(deleteButton);

    expect(screen.queryByText("Task to Remove")).not.toBeInTheDocument();
  });

  it("handles multiple tasks correctly", async () => {
    render(<TodoList />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("What's your next task?");
    const addButton = screen.getByRole("button", { name: /add task/i });

    // Add 3 tasks
    for (let i = 1; i <= 3; i++) {
      await user.type(input, `Task ${i}`);
      await user.click(addButton);
    }

    // Verify all tasks are present
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();

    // Remove middle task
    const deleteButton = screen.getByLabelText("Remove do-to Task 2");
    await user.click(deleteButton);

    // Verify only Task 2 is removed
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
  });

  it("toggles completion status of multiple tasks independently", async () => {
    render(<TodoList />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("What's your next task?");
    const addButton = screen.getByRole("button", { name: /add task/i });

    // Add 2 tasks
    await user.type(input, "Task 1");
    await user.click(addButton);
    await user.type(input, "Task 2");
    await user.click(addButton);

    const checkboxes = await screen.findAllByRole("checkbox");

    // Toggle first task
    await user.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();

    // Toggle second task
    await user.click(checkboxes[1]);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });

  it("limits to 5 tasks and shows toast error", async () => {
    render(<TodoList />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("What's your next task?");
    const addButton = screen.getByRole("button", { name: /add task/i });

    // Add 5 tasks
    for (let i = 0; i < 5; i++) {
      await user.type(input, `Task ${i}`);
      await user.click(addButton);
      await waitFor(() =>
        expect(screen.getByText(`Task ${i}`)).toBeInTheDocument()
      );
    }

    // Try adding 6th task
    await user.type(input, "Task 6");
    await user.click(addButton);

    // Verify toast.error was called
    expect(toast.error).toHaveBeenCalledWith("Maximum of 5 tasks reached.");

    // Verify task was not added
    expect(screen.queryByText("Task 6")).not.toBeInTheDocument();
  });
});
