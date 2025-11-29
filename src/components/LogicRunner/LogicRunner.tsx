import { useState } from "react";
import { MOCK_ORDERS } from "@/data/orders";
import { part1Calculation, part2Calculation } from "@/lib/calculations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calculator } from "lucide-react";
import { ActionsPanel } from "./ActionsPanel";
import { ResultDisplay } from "./ResultDisplay";

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
          <ActionsPanel
            activeTab={activeTab}
            onRunCalculation={runCalculation}
          />
          <ResultDisplay result={result} activeTab={activeTab} />
        </div>
      </CardContent>
    </Card>
  );
};

export default LogicRunner;
