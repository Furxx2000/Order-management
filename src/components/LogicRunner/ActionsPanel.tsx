import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface ActionsPanelProps {
  activeTab: "part1" | "part2" | null;
  onRunCalculation: (type: "part1" | "part2") => void;
}

export function ActionsPanel({
  activeTab,
  onRunCalculation,
}: ActionsPanelProps) {
  return (
    <div className="flex flex-col gap-3 p-4 md:p-6 md:w-1/3 border-b md:border-b-0 md:border-r bg-gray-50/50 shrink-0">
      <div className="space-y-1">
        <h3 className="font-medium leading-none">Actions</h3>
        <p className="text-xs text-muted-foreground">Select a logic to run.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 md:flex md:flex-col">
        <Button
          variant={activeTab === "part1" ? "default" : "outline"}
          className="justify-start text-xs md:text-sm shadow-sm"
          onClick={() => onRunCalculation("part1")}
        >
          <Play className="mr-2 h-3 w-3 md:h-4 md:w-4" />
          Run Part 1
        </Button>

        <Button
          variant={activeTab === "part2" ? "default" : "outline"}
          className="justify-start text-xs md:text-sm shadow-sm"
          onClick={() => onRunCalculation("part2")}
        >
          <Play className="mr-2 h-3 w-3 md:h-4 md:w-4" />
          Run Part 2
        </Button>
      </div>
    </div>
  );
}
