import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, HelpCircle, Wrench, ListTodo, History, Users, Zap } from "lucide-react";

export function HeliosAssistantPanel() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <CardTitle>HELIOS AI Assistant</CardTitle>
        </div>
        <CardDescription>
          Quick actions and insights from the AI engine.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button variant="outline" className="justify-start gap-2">
          <HelpCircle className="h-4 w-4" />
          Explain Incident
        </Button>
        <Button variant="outline" className="justify-start gap-2">
          <Wrench className="h-4 w-4" />
          Recommend Fix
        </Button>
        <Button variant="outline" className="justify-start gap-2">
          <ListTodo className="h-4 w-4" />
          Summarize Risks
        </Button>
        <Button variant="outline" className="justify-start gap-2">
          <History className="h-4 w-4" />
          Predict 24h
        </Button>
        <Button variant="outline" className="justify-start gap-2">
          <Users className="h-4 w-4" />
          Show Risky Users
        </Button>
        <Button variant="outline" className="justify-start gap-2 text-primary border-primary/50 hover:bg-primary/10 hover:text-primary">
          <Zap className="h-4 w-4" />
          Auto-Remediate
        </Button>
      </CardContent>
    </Card>
  );
}