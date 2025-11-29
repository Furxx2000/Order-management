import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal } from "lucide-react";

interface ResultDisplayProps {
  result: unknown | null;
  activeTab: "part1" | "part2" | null;
}

export function ResultDisplay({ result, activeTab }: ResultDisplayProps) {
  return (
    <div className="flex-1 p-4 md:p-6 min-w-0 flex flex-col bg-white">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <h3 className="font-medium text-sm md:text-base">Execution Result</h3>
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
                <p className="text-sm">Select an action to view results</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
