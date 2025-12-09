import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { CommandCenterLayout } from "./components/CommandCenterLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import { IRCLeaderProvider } from "./contexts/IRCLeaderContext";
import { RoleProvider } from "./contexts/RoleContext";
import Dashboard from "./pages/Dashboard";
import SocOverview from "./pages/SocOverview";
import NocOverview from "./pages/NocOverview";
import PerformanceMonitoring from "./pages/PerformanceMonitoring";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LogCollection from "./pages/LogCollection";
import SiemIntegration from "./pages/SiemIntegration";
import ThreatIntelligence from "./pages/ThreatIntelligence";
import IncidentTicketing from "./pages/IncidentTicketing";
import Reports from "./pages/Reports";
import KnowledgeBase from "./pages/KnowledgeBase";
import Playbooks from "./pages/Playbooks";
import PlaybookDesigner from "./pages/PlaybookDesigner";
import FaultManagement from "./pages/FaultManagement";
import ConfigurationManagement from "./pages/ConfigurationManagement";
import TrafficAnalysis from "./pages/TrafficAnalysis";
import PredictiveMaintenance from "./pages/PredictiveMaintenance";
import SelfHealing from "./pages/SelfHealing";
import QuantumSecurity from "./pages/QuantumSecurity";
import NetworkTopology from "./pages/NetworkTopology";
import DeepfakeAnalysis from "./pages/DeepfakeAnalysis";
import IRCLeaderPage from "./pages/IRCLeaderPage";
import AttackSurface from "./pages/offensive/AttackSurface";
import VulnerabilityScanner from "./pages/offensive/VulnerabilityScanner";
import PenetrationTesting from "./pages/offensive/PenetrationTesting";
import ExploitFramework from "./pages/offensive/ExploitFramework";
import CredentialTesting from "./pages/offensive/CredentialTesting";
import AdminConsole from "./pages/AdminConsole";
import IntegratedAnalystDashboard from "./pages/IntegratedAnalystDashboard";
import OffensiveTesterDashboardPage from "./pages/OffensiveTesterDashboardPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <IRCLeaderProvider>
            <RoleProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Command Center - No sidebar layout for main dashboard */}
                <Route path="/" element={<ProtectedRoute><CommandCenterLayout /></ProtectedRoute>}>
                  <Route index element={<Dashboard />} />
                </Route>
                {/* App Layout with sidebar for other pages */}
                <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                  <Route path="analyst" element={<IntegratedAnalystDashboard />} />
                  <Route path="soc-overview" element={<SocOverview />} />
                  <Route path="noc-overview" element={<NocOverview />} />
                  <Route path="quantum" element={<QuantumSecurity />} />
                  <Route path="network-topology" element={<NetworkTopology />} />
                  <Route path="deepfake" element={<DeepfakeAnalysis />} />
                  <Route path="irc-leader" element={<IRCLeaderPage />} />
                  <Route path="soc" element={<SocOverview />} />
                  <Route path="soc/logs" element={<LogCollection />} />
                  <Route path="soc/siem" element={<SiemIntegration />} />
                  <Route path="soc/threats" element={<ThreatIntelligence />} />
                  <Route path="soc/incidents" element={<IncidentTicketing />} />
                  <Route path="soc/playbooks" element={<Playbooks />} />
                  <Route path="soc/playbooks/designer" element={<PlaybookDesigner />} />
                  <Route path="soc/reports" element={<Reports />} />
                  <Route path="soc/knowledge" element={<KnowledgeBase />} />
                  <Route path="noc" element={<NocOverview />} />
                  <Route path="noc/performance" element={<PerformanceMonitoring />} />
                  <Route path="noc/faults" element={<FaultManagement />} />
                  <Route path="noc/config" element={<ConfigurationManagement />} />
                  <Route path="noc/traffic" element={<TrafficAnalysis />} />
                  <Route path="noc/maintenance" element={<PredictiveMaintenance />} />
                  <Route path="noc/healing" element={<SelfHealing />} />
                  <Route path="offensive/attack-surface" element={<AttackSurface />} />
                  <Route path="offensive/vuln-scanner" element={<VulnerabilityScanner />} />
                  <Route path="offensive/pentest" element={<PenetrationTesting />} />
                  <Route path="offensive/exploits" element={<ExploitFramework />} />
                  <Route path="offensive/credentials" element={<CredentialTesting />} />
                  <Route path="offensive-tester" element={<OffensiveTesterDashboardPage />} />
                  <Route path="admin" element={<AdminConsole />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </RoleProvider>
          </IRCLeaderProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
