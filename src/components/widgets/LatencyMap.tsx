import { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { MetricsChart } from "@/components/widgets/MetricsChart";
import { Activity, Zap, Wifi, Users } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface DataCenter {
  name: string;
  coordinates: [number, number];
  latency: number;
  packetLoss: number;
  bandwidth: number;
  activeConnections: number;
}

const initialDataCenters: DataCenter[] = [
  { name: 'N. Virginia (US-East)', coordinates: [-77.43, 38.95], latency: 35, packetLoss: 0.01, bandwidth: 45.2, activeConnections: 120430 },
  { name: 'Frankfurt (EU-Central)', coordinates: [8.68, 50.11], latency: 85, packetLoss: 0.03, bandwidth: 33.8, activeConnections: 98760 },
  { name: 'Singapore (APAC-SE)', coordinates: [103.81, 1.35], latency: 150, packetLoss: 0.05, bandwidth: 28.1, activeConnections: 75430 },
  { name: 'Tokyo (APAC-NE)', coordinates: [139.69, 35.68], latency: 120, packetLoss: 0.02, bandwidth: 30.5, activeConnections: 89120 },
  { name: 'São Paulo (SA-East)', coordinates: [-46.63, -23.55], latency: 180, packetLoss: 0.08, bandwidth: 15.7, activeConnections: 45670 },
  { name: 'Mumbai (India)', coordinates: [72.87, 19.07], latency: 165, packetLoss: 0.06, bandwidth: 19.3, activeConnections: 62340 },
];

const getLatencyColor = (latency: number) => {
  if (latency < 70) return 'hsl(var(--success))'; // green
  if (latency < 150) return 'hsl(var(--warning))'; // yellow
  return 'hsl(var(--error))'; // red
};

export function LatencyMap() {
  const [dataCenters, setDataCenters] = useState<DataCenter[]>(initialDataCenters);
  const [selectedDataCenter, setSelectedDataCenter] = useState<DataCenter | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataCenters(prevDataCenters =>
        prevDataCenters.map(dc => ({
          ...dc,
          latency: Math.max(20, dc.latency + (Math.random() - 0.5) * 10),
          packetLoss: Math.max(0.01, Math.min(0.15, dc.packetLoss + (Math.random() - 0.5) * 0.01)),
          bandwidth: Math.max(10, dc.bandwidth + (Math.random() - 0.5) * 2),
          activeConnections: Math.max(40000, dc.activeConnections + Math.floor((Math.random() - 0.5) * 1000)),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 rounded-lg border border-border bg-card relative">
      <h3 className="font-semibold mb-4 text-lg">Global Data Center Latency</h3>
      <div className="w-full h-[400px] bg-muted/30 rounded-md">
        <TooltipProvider>
          <ComposableMap
            projectionConfig={{
              scale: 140,
              rotate: [-11, 0, 0],
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(var(--border))"
                    stroke="hsl(var(--card))"
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            {dataCenters.map((dc) => (
              <Marker key={dc.name} coordinates={dc.coordinates}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g 
                      onClick={() => setSelectedDataCenter(dc)}
                      className="cursor-pointer"
                    >
                      <circle
                        r={5}
                        fill={getLatencyColor(dc.latency)}
                        stroke="hsl(var(--background))"
                        strokeWidth={1}
                        className="cursor-pointer"
                      />
                      <circle
                        r={5}
                        fill={getLatencyColor(dc.latency)}
                        className="animate-ping-slow origin-center"
                      />
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">{dc.name}</p>
                    <p>Latency: <span className="font-bold">{dc.latency.toFixed(0)}ms</span></p>
                  </TooltipContent>
                </Tooltip> 
              </Marker>
            ))}
          </ComposableMap>
        </TooltipProvider>
      </div>
    </div>
  );
}