import { WorldMap, Threat } from "./WorldMap";

/**
 * This component is now a simple wrapper. The main logic has been moved to
 * `src/components/widgets/ThreatMap.tsx`.
 * This file could be removed in a future refactor if the widget calls WorldMap directly.
 */
export function ThreatMap({ threats }: { threats?: Threat[] }) {
  return <WorldMap threats={threats} />
}