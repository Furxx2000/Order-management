import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import type { Todo } from "./TodoList";
import { XIcon } from "lucide-react";
import { Button } from "./ui/button";

interface TodoItemProp {
  todo: Todo;
  toggleCompleted: (id: string) => void;
  removeTodo: (id: string) => void;
}

const TodoItem = ({ todo, toggleCompleted, removeTodo }: TodoItemProp) => {
  return (
    <div className="flex items-center gap-3 w-fit px-2 py-1 border rounded-md">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => toggleCompleted(todo.id)}
      />
      <Label
        htmlFor={`todo-${todo.id}`}
        className={`${todo.completed && "line-through text-gray-500"}`}
      >
        {todo.todo}
      </Label>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="w-[24px] h-[24px] cursor-pointer"
        onClick={() => removeTodo(todo.id)}
        aria-label={`Remove do-to ${todo.todo}`}
      >
        <XIcon />
      </Button>
    </div>
  );
};

export default TodoItem;
