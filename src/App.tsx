import { Toaster } from "sonner";

import TodoList from "./components/TodoList";
import OrderTable from "./components/order/OrderTable";
import LogicRunner from "./components/LogicRunner";

function App() {
  return (
    <>
      <Toaster />
      <main className="flex justify-center min-h-screen">
        <div className="max-w-[1024px] flex flex-col gap-8 w-full my-8 px-4">
          <LogicRunner />
          <TodoList />
          <OrderTable />
        </div>
      </main>
    </>
  );
}

export default App;
