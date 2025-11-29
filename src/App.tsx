import { Toaster } from "sonner";

import TodoList from "./components/TodoList/TodoList";
import LogicRunner from "./components/LogicRunner/LogicRunner";
import OrderManagementClient from "./components/orders/client-managed/OrderManagementClient";
import OrderManagementServer from "./components/orders/server-managed/OrderManagementServer";

function App() {
  return (
    <>
      <Toaster />
      <main className="flex justify-center min-h-screen">
        <div className="max-w-[1024px] flex flex-col gap-8 w-full my-8 px-4">
          <LogicRunner />
          <TodoList />
          <OrderManagementServer />
          <OrderManagementClient />
        </div>
      </main>
    </>
  );
}

export default App;
