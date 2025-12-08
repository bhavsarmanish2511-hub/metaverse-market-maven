import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
            <Construction className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Coming Soon</CardTitle>
          <CardDescription>
            This module is currently under development and will be available soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            We're working hard to bring you this feature. Check back soon for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
