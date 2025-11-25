import { useState } from "react";
import { MOCK_ORDERS } from "@/data/orders";
import { part1Calculation, part2Calculation } from "@/lib/calculations";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Calculator, Play, Terminal } from "lucide-react";

const LogicRunner = () => {
  const [result, setResult] = useState<unknown | null>(null);
  const [activeTab, setActiveTab] = useState<"part1" | "part2" | null>(null);

  const runCalculation = (type: "part1" | "part2") => {
    setActiveTab(type);
    const data =
      type === "part1"
        ? part1Calculation(MOCK_ORDERS)
        : part2Calculation(MOCK_ORDERS);
    setResult(data);
  };

  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Logic Runner</CardTitle>
        </div>
        <CardDescription>
          Execute complex calculations on the current dataset.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row md:h-[400px]">
          <div className="flex flex-col gap-3 p-4 md:p-6 md:w-1/3 border-b md:border-b-0 md:border-r bg-gray-50/50 shrink-0">
            <div className="space-y-1">
              <h3 className="font-medium leading-none">Actions</h3>
              <p className="text-xs text-muted-foreground">
                Select a logic to run.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 md:flex md:flex-col">
              <Button
                variant={activeTab === "part1" ? "default" : "outline"}
                className="justify-start text-xs md:text-sm shadow-sm"
                onClick={() => runCalculation("part1")}
              >
                <Play className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                Run Part 1
              </Button>

              <Button
                variant={activeTab === "part2" ? "default" : "outline"}
                className="justify-start text-xs md:text-sm shadow-sm"
                onClick={() => runCalculation("part2")}
              >
                <Play className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                Run Part 2
              </Button>
            </div>
          </div>

          <div className="flex-1 p-4 md:p-6 min-w-0 flex flex-col bg-white">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <h3 className="font-medium text-sm md:text-base">
                Execution Result
              </h3>
              {activeTab && (
                <span className="text-[10px] md:text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded border border-gray-200 font-medium">
                  {activeTab === "part1" ? "Part 1" : "Part 2"}
                </span>
              )}
            </div>

            <div className="bg-slate-50 rounded-lg flex-1 w-full border border-slate-200 relative min-h-[250px] md:min-h-0 overflow-hidden shadow-inner">
              <ScrollArea className="h-[350px] md:h-full w-full">
                <div className="p-4">
                  {result ? (
                    <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap break-all leading-relaxed">
                      <code>{JSON.stringify(result, null, 2)}</code>
                    </pre>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3 p-4 text-center">
                      <Terminal className="h-10 w-10 opacity-20" />
                      <p className="text-sm">
                        Select an action to view results
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogicRunner;
