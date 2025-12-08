import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./WorldMap.css";
import L from "leaflet";

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
  position: [number, number];
  type: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  source: string;
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
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {threats.map((threat) => (
        <Marker key={threat.id} position={threat.position}>
          <Popup>
            Severity: {threat.severity}
            <br />
            Type: {threat.type}
            <br />
            Source: {threat.source}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}