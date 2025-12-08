import { useState } from "react";
import { Book, Search, FileText, Shield, AlertTriangle, Database, Settings, Scale, Bug, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KnowledgeBaseChatbot from "@/components/KnowledgeBaseChatbot";

interface KnowledgeArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  lastUpdated: string;
  views: number;
}

const knowledgeArticles: KnowledgeArticle[] = [
  // Playbooks & Runbooks
  {
    id: "pb-001",
    title: "Ransomware Incident Response Playbook",
    description: "Step-by-step guide for identifying, containing, and remediating ransomware attacks",
    category: "playbooks",
    tags: ["ransomware", "critical", "incident-response"],
    lastUpdated: "2024-01-15",
    views: 1247
  },
  {
    id: "pb-002",
    title: "Phishing Attack Response Procedure",
    description: "Comprehensive playbook for handling phishing incidents and email-based threats",
    category: "playbooks",
    tags: ["phishing", "email-security", "social-engineering"],
    lastUpdated: "2024-01-12",
    views: 892
  },
  {
    id: "pb-003",
    title: "DDoS Mitigation Playbook",
    description: "Procedures for detecting, analyzing, and mitigating distributed denial-of-service attacks",
    category: "playbooks",
    tags: ["ddos", "network-security", "availability"],
    lastUpdated: "2024-01-10",
    views: 654
  },
  {
    id: "pb-004",
    title: "Data Breach Response Protocol",
    description: "Critical procedures for handling data breach incidents and maintaining compliance",
    category: "playbooks",
    tags: ["data-breach", "compliance", "critical"],
    lastUpdated: "2024-01-08",
    views: 1523
  },

  // Technical Documentation
  {
    id: "td-001",
    title: "SIEM Configuration Guide",
    description: "Complete setup and configuration documentation for security information and event management systems",
    category: "technical",
    tags: ["siem", "configuration", "setup"],
    lastUpdated: "2024-01-14",
    views: 743
  },
  {
    id: "td-002",
    title: "Network Architecture Overview",
    description: "Detailed documentation of organizational network topology and security zones",
    category: "technical",
    tags: ["network", "architecture", "infrastructure"],
    lastUpdated: "2024-01-11",
    views: 521
  },
  {
    id: "td-003",
    title: "Endpoint Detection & Response (EDR) Guide",
    description: "Technical documentation for EDR deployment and management",
    category: "technical",
    tags: ["edr", "endpoint-security", "monitoring"],
    lastUpdated: "2024-01-09",
    views: 834
  },
  {
    id: "td-004",
    title: "YARA Rules Repository",
    description: "Collection of YARA rules for malware detection and threat hunting",
    category: "technical",
    tags: ["yara", "malware", "threat-hunting"],
    lastUpdated: "2024-01-07",
    views: 1092
  },

  // Threat Intelligence
  {
    id: "ti-001",
    title: "MITRE ATT&CK Framework Guide",
    description: "Understanding and applying the MITRE ATT&CK framework for threat detection",
    category: "threat-intel",
    tags: ["mitre", "attack", "framework"],
    lastUpdated: "2024-01-13",
    views: 1654
  },
  {
    id: "ti-002",
    title: "Current Threat Landscape Report",
    description: "Latest threat intelligence on active threat actors and attack campaigns",
    category: "threat-intel",
    tags: ["apt", "threat-actors", "intelligence"],
    lastUpdated: "2024-01-16",
    views: 2341
  },
  {
    id: "ti-003",
    title: "Indicators of Compromise (IoC) Database",
    description: "Repository of known malicious IPs, domains, hashes, and file signatures",
    category: "threat-intel",
    tags: ["ioc", "indicators", "malware"],
    lastUpdated: "2024-01-15",
    views: 987
  },
  {
    id: "ti-004",
    title: "AI-Powered Threat Detection Guide",
    description: "Leveraging AI and machine learning for advanced threat detection",
    category: "threat-intel",
    tags: ["ai", "machine-learning", "detection"],
    lastUpdated: "2024-01-06",
    views: 1432
  },

  // FAQs & Troubleshooting
  {
    id: "faq-001",
    title: "Common SIEM Alert Triage Questions",
    description: "Frequently asked questions about alert prioritization and investigation",
    category: "faqs",
    tags: ["alerts", "triage", "investigation"],
    lastUpdated: "2024-01-10",
    views: 645
  },
  {
    id: "faq-002",
    title: "False Positive Reduction Strategies",
    description: "Best practices for tuning detection rules and reducing false alerts",
    category: "faqs",
    tags: ["false-positives", "tuning", "optimization"],
    lastUpdated: "2024-01-08",
    views: 876
  },
  {
    id: "faq-003",
    title: "Log Source Integration Issues",
    description: "Troubleshooting guide for common log collection and parsing problems",
    category: "faqs",
    tags: ["logs", "troubleshooting", "integration"],
    lastUpdated: "2024-01-05",
    views: 432
  },

  // Policies & Procedures
  {
    id: "pp-001",
    title: "Security Incident Classification Policy",
    description: "Guidelines for categorizing and prioritizing security incidents",
    category: "policies",
    tags: ["policy", "classification", "incident-management"],
    lastUpdated: "2024-01-12",
    views: 567
  },
  {
    id: "pp-002",
    title: "Data Retention and Disposal Policy",
    description: "Policies for security data retention, archival, and secure disposal",
    category: "policies",
    tags: ["data-retention", "compliance", "policy"],
    lastUpdated: "2024-01-09",
    views: 423
  },
  {
    id: "pp-003",
    title: "Compliance Framework Mapping",
    description: "SOC procedures mapped to NIST, ISO 27001, and PCI DSS requirements",
    category: "policies",
    tags: ["compliance", "nist", "iso27001", "pci-dss"],
    lastUpdated: "2024-01-11",
    views: 789
  },

  // Vulnerabilities
  {
    id: "vul-001",
    title: "Critical Vulnerability Assessment Guide",
    description: "Methodology for assessing and prioritizing critical vulnerabilities",
    category: "vulnerabilities",
    tags: ["vulnerability", "assessment", "cvss"],
    lastUpdated: "2024-01-14",
    views: 934
  },
  {
    id: "vul-002",
    title: "Patch Management Procedures",
    description: "Standard procedures for vulnerability remediation and patch deployment",
    category: "vulnerabilities",
    tags: ["patching", "remediation", "vulnerability-management"],
    lastUpdated: "2024-01-07",
    views: 712
  },
  {
    id: "vul-003",
    title: "Zero-Day Vulnerability Response",
    description: "Emergency procedures for responding to zero-day exploits",
    category: "vulnerabilities",
    tags: ["zero-day", "critical", "emergency"],
    lastUpdated: "2024-01-13",
    views: 1245
  }
];

const categories = [
  { id: "all", label: "All Resources", icon: Book },
  { id: "playbooks", label: "Playbooks & Runbooks", icon: FileText },
  { id: "technical", label: "Technical Documentation", icon: Database },
  { id: "threat-intel", label: "Threat Intelligence", icon: AlertTriangle },
  { id: "faqs", label: "FAQs & Troubleshooting", icon: Settings },
  { id: "policies", label: "Policies & Procedures", icon: Scale },
  { id: "vulnerabilities", label: "Vulnerability Management", icon: Bug }
];

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredArticles = knowledgeArticles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return knowledgeArticles.length;
    return knowledgeArticles.filter(a => a.category === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <KnowledgeBaseChatbot />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-soc/10">
                <Book className="h-6 w-6 text-soc" />
              </div>
              <h1 className="text-3xl font-bold text-gradient-soc">Knowledge Base</h1>
            </div>
            <p className="text-muted-foreground">
              Comprehensive security documentation, playbooks, and best practices for SOC analysts
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles, playbooks, or documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-soc/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-soc">{knowledgeArticles.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
              </CardContent>
            </Card>
            <Card className="border-soc/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Playbooks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-soc">
                  {knowledgeArticles.filter(a => a.category === "playbooks").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Incident response guides</p>
              </CardContent>
            </Card>
            <Card className="border-soc/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Threat Intel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-soc">
                  {knowledgeArticles.filter(a => a.category === "threat-intel").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Intelligence reports</p>
              </CardContent>
            </Card>
            <Card className="border-soc/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-soc">Today</p>
                <p className="text-xs text-muted-foreground mt-1">Continuous updates</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start flex-wrap h-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                  <Badge variant="secondary" className="ml-1">
                    {getCategoryCount(category.id)}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            {filteredArticles.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No articles found</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArticles.map((article) => (
                  <Card 
                    key={article.id}
                    className="hover:shadow-lg transition-smooth hover:border-soc/50 cursor-pointer"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-2 rounded-lg bg-soc/10">
                          <FileText className="h-5 w-5 text-soc" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(article.lastUpdated).toLocaleDateString()}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {article.views.toLocaleString()} views
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-base">{article.title}</CardTitle>
                      <CardDescription className="text-sm">{article.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {article.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="text-xs bg-soc/5 text-soc border-soc/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Reference Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-soc" />
                  Critical Response Procedures
                </CardTitle>
                <CardDescription>Emergency playbooks for immediate threats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {knowledgeArticles
                  .filter(a => a.tags.includes("critical") || a.tags.includes("emergency"))
                  .slice(0, 3)
                  .map(article => (
                    <div 
                      key={article.id}
                      className="p-2 rounded-md bg-secondary/50 hover:bg-secondary transition-smooth cursor-pointer"
                    >
                      <p className="text-sm font-medium">{article.title}</p>
                      <p className="text-xs text-muted-foreground">{article.category}</p>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Recently Updated
                </CardTitle>
                <CardDescription>Latest additions and updates to knowledge base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {knowledgeArticles
                  .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
                  .slice(0, 3)
                  .map(article => (
                    <div 
                      key={article.id}
                      className="p-2 rounded-md bg-secondary/50 hover:bg-secondary transition-smooth cursor-pointer"
                    >
                      <p className="text-sm font-medium">{article.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(article.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
