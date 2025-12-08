import { useQuery } from "@tanstack/react-query";
import { WorldMap, Threat } from "./WorldMap";
import { AlertCircle, Loader2 } from "lucide-react";

// --- Mock API ---
// In a real application, this data would come from your backend.
const mockThreats: Threat[] = [
  { id: "1", position: [48.85, 2.35], type: "Malware", severity: "High", source: "192.168.1.10" },
  { id: "2", position: [34.05, -118.24], type: "Phishing", severity: "Medium", source: "10.0.0.5" },
  { id: "3", position: [35.68, 139.76], type: "DDoS", severity: "Critical", source: "203.0.113.22" },
  { id: "4", position: [-33.86, 151.20], type: "SQL Injection", severity: "High", source: "172.16.5.8" },
  { id: "5", position: [51.50, -0.12], type: "Malware", severity: "Low", source: "198.51.100.1" },
];

// This function simulates fetching data from an API.
const fetchThreats = async (): Promise<Threat[]> => {
  console.log("Fetching threat data...");
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // To simulate a random error, uncomment the following lines:
  // if (Math.random() > 0.7) {
  //   throw new Error("Failed to fetch threat data from the server.");
  // }

  return mockThreats;
};
// --- End Mock API ---

export function ThreatMap() {
  const { data: threats, isLoading, isError, error } = useQuery({
    queryKey: ["threats"],
    queryFn: fetchThreats,
    // Refetch the data every 30 seconds (30000 milliseconds)
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Map Data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-destructive/10 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="mt-2 font-semibold">Error loading data</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return <WorldMap threats={threats} />;
}