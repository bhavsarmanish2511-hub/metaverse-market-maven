import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { ValidationResult } from "@/lib/workflowValidation";

interface ValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  validationResult: ValidationResult;
  onProceed: () => void;
  actionType: "save" | "test";
}

export function ValidationDialog({
  open,
  onOpenChange,
  validationResult,
  onProceed,
  actionType,
}: ValidationDialogProps) {
  const hasErrors = validationResult.errors.length > 0;
  const hasWarnings = validationResult.warnings.length > 0;
  const hasIssues = hasErrors || hasWarnings;

  const getTitle = () => {
    if (!hasIssues) return "Validation Passed";
    if (hasErrors) return "Validation Errors Found";
    return "Validation Warnings";
  };

  const getDescription = () => {
    if (!hasIssues) return "Your workflow is valid and ready to use.";
    if (hasErrors)
      return "Critical errors must be fixed before proceeding.";
    return "The workflow has some warnings. You can proceed but may want to review them.";
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {!hasIssues && <CheckCircle className="h-6 w-6 text-soc" />}
            {hasErrors && <AlertCircle className="h-6 w-6 text-destructive" />}
            {hasWarnings && !hasErrors && (
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            )}
            <AlertDialogTitle>{getTitle()}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{getDescription()}</AlertDialogDescription>
        </AlertDialogHeader>

        {hasIssues && (
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {/* Errors */}
              {validationResult.errors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <h4 className="font-semibold text-destructive">
                      Errors ({validationResult.errors.length})
                    </h4>
                  </div>
                  {validationResult.errors.map((error, idx) => (
                    <div
                      key={idx}
                      className="border-l-4 border-destructive bg-destructive/10 p-3 rounded-r space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm">{error.message}</p>
                        <Badge variant="destructive" className="shrink-0">
                          {error.category}
                        </Badge>
                      </div>
                      {error.nodeIds && error.nodeIds.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Affected nodes: {error.nodeIds.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Warnings */}
              {validationResult.warnings.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <h4 className="font-semibold text-yellow-700 dark:text-yellow-500">
                      Warnings ({validationResult.warnings.length})
                    </h4>
                  </div>
                  {validationResult.warnings.map((warning, idx) => (
                    <div
                      key={idx}
                      className="border-l-4 border-yellow-500 bg-yellow-500/10 p-3 rounded-r space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm">{warning.message}</p>
                        <Badge
                          variant="outline"
                          className="shrink-0 border-yellow-500 text-yellow-700 dark:text-yellow-500"
                        >
                          {warning.category}
                        </Badge>
                      </div>
                      {warning.nodeIds && warning.nodeIds.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Affected nodes: {warning.nodeIds.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {!hasErrors && (
            <AlertDialogAction
              onClick={onProceed}
              className="bg-soc hover:bg-soc/90"
            >
              {hasWarnings ? "Proceed Anyway" : "Continue"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
