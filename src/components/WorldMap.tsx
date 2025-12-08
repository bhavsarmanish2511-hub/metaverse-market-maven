import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./WorldMap.css";
import L from "leaflet";
import { useEffect } from "react";

// This is a workaround for a known issue with react-leaflet and webpack.
// It ensures that the default marker icon is displayed correctly.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface Threat {
  id: string;
  sourcePosition: [number, number];
  destinationPosition: [number, number];
  type: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  source: string;
  destination: string;
  tooltipDirection?: "top" | "bottom" | "left" | "right";
}

// Helper to create custom severity-based icons
const getSeverityIcon = (severity: Threat["severity"]) => {
  const severityClasses = {
    Low: "bg-blue-500",
    Medium: "bg-yellow-500",
    High: "bg-orange-500",
    Critical: "bg-red-600",
  };

  return L.divIcon({
    className: "custom-threat-icon",
    html: `<div class="relative flex h-3 w-3">
             <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${severityClasses[severity]} opacity-75"></span>
             <span class="relative inline-flex rounded-full h-3 w-3 ${severityClasses[severity]}"></span>
           </div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

// Helper to calculate a precise [x, y] offset for tooltips to prevent overlap
const getTooltipOffset = (
  direction: Threat["tooltipDirection"]
): L.PointExpression => {
  const offsetVal = 12;
  switch (direction) {
    case "top": return [0, -offsetVal];
    case "bottom": return [0, offsetVal];
    case "left": return [-offsetVal, 0];
    case "right": return [offsetVal, 0];
    default: return [0, -offsetVal];
  }
};

function MapController({ threats }: { threats: Threat[] }) {
  const map = useMap();
  useEffect(() => {
    if (!threats || threats.length === 0) {
      map.setView([20, 0], 2); // Reset view if no threats
      return;
    };
    const allPoints: [number, number][] = threats.flatMap(t => [t.sourcePosition, t.destinationPosition]);
    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [threats, map]);
  return null;
}

interface WorldMapProps {
  center?: [number, number];
  zoom?: number;
  threats?: Threat[];
}

export function WorldMap({
  center = [20, 0],
  zoom = 2,
  threats = [],
}: WorldMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {threats?.map((threat) => (
        <div key={threat.id}>
          {/* Pulsing marker at the destination */}
          <Marker position={threat.destinationPosition} icon={getSeverityIcon(threat.severity)}>
            <Tooltip
              permanent
              direction={threat.tooltipDirection || "top"}
              offset={getTooltipOffset(threat.tooltipDirection)}
              className="custom-tooltip"
            >
              {threat.type}
            </Tooltip>
            <Popup>
              <div className="font-sans">
                <div className="font-bold text-base mb-1">{threat.destination}</div>
                <strong>Severity:</strong> {threat.severity}<br />
                <strong>Source:</strong> {threat.source}
              </div>
            </Popup>
          </Marker>
        </div>
      ))}
      <MapController threats={threats || []} />
    </MapContainer>
  );
}