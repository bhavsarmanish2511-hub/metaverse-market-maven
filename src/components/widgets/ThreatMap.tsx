import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { WorldMap, Threat } from "@/components/WorldMap";
import { AlertCircle, Loader2 } from "lucide-react";

// --- Mock API ---
// This logic is moved here from the old ThreatMap component to be used by both the map and the list.

// A larger pool of possible threats to make the map dynamic
const allPossibleThreats: Omit<Threat, 'id'>[] = [
  { sourcePosition: [22.31, 114.16], destinationPosition: [48.85, 2.35], type: "Malware", severity: "High", source: "Hong Kong", destination: "Paris", tooltipDirection: 'left' },
  { sourcePosition: [40.71, -74.00], destinationPosition: [34.05, -118.24], type: "Phishing", severity: "Medium", source: "New York", destination: "Los Angeles", tooltipDirection: 'top' },
  { sourcePosition: [55.75, 37.61], destinationPosition: [35.68, 139.76], type: "DDoS", severity: "Critical", source: "Moscow", destination: "Tokyo", tooltipDirection: 'top' },
  { sourcePosition: [-23.55, -46.63], destinationPosition: [-33.86, 151.20], type: "SQL Injection", severity: "High", source: "São Paulo", destination: "Sydney", tooltipDirection: 'bottom' },
  { sourcePosition: [1.35, 103.81], destinationPosition: [51.50, -0.12], type: "Malware", severity: "Low", source: "Singapore", destination: "London", tooltipDirection: 'right' },
  { sourcePosition: [39.90, 116.40], destinationPosition: [37.77, -122.41], type: "Ransomware", severity: "Critical", source: "Beijing", destination: "San Francisco", tooltipDirection: 'top' },
  { sourcePosition: [28.61, 77.20], destinationPosition: [30.04, 31.23], type: "Zero-day Exploit", severity: "High", source: "New Delhi", destination: "Cairo", tooltipDirection: 'right' },
  { sourcePosition: [52.52, 13.40], destinationPosition: [41.90, 12.49], type: "Phishing", severity: "Medium", source: "Berlin", destination: "Rome", tooltipDirection: 'bottom' },
  { sourcePosition: [34.69, 135.50], destinationPosition: [37.56, 126.97], type: "DDoS", severity: "High", source: "Osaka", destination: "Seoul", tooltipDirection: 'left' },
  { sourcePosition: [-34.60, -58.38], destinationPosition: [19.43, -99.13], type: "Malware", severity: "Low", source: "Buenos Aires", destination: "Mexico City", tooltipDirection: 'top' },
  { sourcePosition: [53.34, -6.26], destinationPosition: [43.65, -79.38], type: "SQL Injection", severity: "Medium", source: "Dublin", destination: "Toronto", tooltipDirection: 'right' },
  { sourcePosition: [-26.20, 28.04], destinationPosition: [6.52, 3.37], type: "Ransomware", severity: "Critical", source: "Johannesburg", destination: "Lagos", tooltipDirection: 'top' },
];

const fetchThreats = async (): Promise<Threat[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 1. Shuffle the array to get a random order
  const shuffled = [...allPossibleThreats].sort(() => 0.5 - Math.random());

  // 2. Determine a random number of threats to show (between 5 and 10)
  const count = Math.floor(Math.random() * 6) + 5; // Generates a number from 5 to 10

  // 3. Take a slice of the shuffled array
  const selectedThreats = shuffled.slice(0, count);

  // 4. Assign a unique ID to each threat for this fetch operation
  const dynamicThreats = selectedThreats.map((threat, index) => ({
    ...threat,
    id: `${Date.now()}-${index}`, // Unique ID using timestamp
  }));

  return dynamicThreats;
};
// --- End Mock API ---

const getSeverityColor = (severity: Threat["severity"]) => {
  switch (severity) {
    case "Critical": return "bg-red-600";
    case "High": return "bg-orange-500";
    case "Medium": return "bg-yellow-500";
    case "Low": return "bg-blue-500";
    default: return "bg-gray-500";
  }
};

export function ThreatMap() {
  const { data: threats, isLoading, isError } = useQuery({
    queryKey: ["threats"],
    queryFn: fetchThreats,
    refetchInterval: 30000,
  });

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-gradient-soc">Real-Time Threat Map</span>
          {threats && threats.length > 0 && (
            <Badge variant="outline" className="bg-error/10 text-error border-error/20">
              {threats.length} Active Threats
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-[500px] w-full rounded-lg border bg-card text-card-foreground shadow-sm">
          {isLoading && <div className="flex h-full w-full items-center justify-center bg-muted/50"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
          {isError && <div className="flex h-full w-full items-center justify-center bg-destructive/10 text-destructive"><AlertCircle className="h-8 w-8" /></div>}
          {threats && <WorldMap threats={threats} />}
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Recent Threats</h4>
          {threats?.map((threat) => (
            <div key={threat.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${getSeverityColor(threat.severity)}`} />
                <div className="text-sm">
                  <div className="font-medium">{threat.type}</div>
                  <div className="text-xs text-muted-foreground">{threat.source} &rarr; {threat.destination}</div>
                </div>
              </div>
              <Badge variant="outline" className="capitalize text-xs">{threat.severity}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
