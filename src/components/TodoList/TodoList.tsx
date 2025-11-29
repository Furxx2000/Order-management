import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ListTodoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TodoItem from "./TodoItem";
import { toast } from "sonner";

const formSchema = z.object({
  input: z
    .string()
    .min(1, "Task must be at least 1 character long.")
    .max(30, "Task must be at most 30 characters long."),
});

export interface Todo {
  id: string;
  todo: string;
  completed: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (todos.length >= 5) {
      toast.error("Maximum of 5 tasks reached.");
      return;
    }
    if (!data.input) return;
    setTodos((prev) => [
      ...prev,
      { id: String(Date.now()), todo: data.input, completed: false },
    ]);
    form.reset();
  }

  function toggleCompleted(id: Todo["id"]) {
    const newTodos = [...todos];
    for (const todo of newTodos) {
      if (todo.id === id) {
        todo.completed = !todo.completed;
        break;
      }
    }
    setTodos(newTodos);
  }

  function removeTodo(id: Todo["id"]) {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  }

  return (
    <section className="flex flex-wrap gap-6 w-full">
      <Card className="basis-50 grow shadow-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold">My Tasks</CardTitle>
          <CardDescription>
            Stay organized and boost your productivity. Add a task to get
            started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="todo-form" onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              name="input"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="todo-form-input">New Task</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="todo-form-input"
                      aria-invalid={fieldState.invalid}
                      placeholder="What's your next task?"
                      autoComplete="off"
                    ></InputGroupInput>
                    <InputGroupAddon>
                      <ListTodoIcon />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              className="cursor-pointer"
              variant="outline"
              onClick={() => form.reset()}
            >
              Clear
            </Button>
            <Button type="submit" className="cursor-pointer" form="todo-form">
              Add Task
            </Button>
          </Field>
        </CardFooter>
      </Card>

      <Card className="basis-50 grow shadow-none">
        <CardHeader>
          <CardTitle>Your Task List</CardTitle>
          <CardDescription>
            Click the checkbox to mark a task as complete.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <ul className="flex flex-col gap-2">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleCompleted={toggleCompleted}
                removeTodo={removeTodo}
              />
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
};

export default TodoList;
