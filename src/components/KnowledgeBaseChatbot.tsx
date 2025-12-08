import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function KnowledgeBaseChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your SOC Knowledge Base assistant. I can help you find security documentation, incident response playbooks, and answer questions about SOC procedures. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const getMockResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Keyword-based responses
    if (input.includes("ransomware") || input.includes("malware")) {
      return "For ransomware incidents, immediately isolate affected systems from the network. Follow the Ransomware Response Playbook:\n\n1. Contain: Disconnect infected systems\n2. Identify: Determine ransomware variant\n3. Eradicate: Remove malware using approved tools\n4. Recover: Restore from clean backups\n5. Document: Complete incident report\n\nRefer to KB article 'Ransomware Incident Response Guide' for detailed steps.";
    }
    
    if (input.includes("phishing") || input.includes("email")) {
      return "For phishing incidents:\n\n1. Verify the threat by examining email headers and links\n2. Block sender domain/IP at email gateway\n3. Search for similar emails across organization\n4. Notify affected users via security awareness channels\n5. Update email filters and threat intelligence feeds\n\nSee 'Phishing Response Procedures' in the knowledge base for complete workflow.";
    }
    
    if (input.includes("ddos") || input.includes("denial of service")) {
      return "DDoS mitigation steps:\n\n1. Activate DDoS protection services\n2. Implement rate limiting and traffic filtering\n3. Scale infrastructure (if cloud-based)\n4. Contact ISP for upstream filtering\n5. Monitor attack patterns and adjust defenses\n\nConsult 'DDoS Mitigation Strategies' article for advanced techniques.";
    }
    
    if (input.includes("vulnerability") || input.includes("patch") || input.includes("cve")) {
      return "Vulnerability management process:\n\n1. Review CVE details and CVSS score\n2. Assess impact on your environment\n3. Prioritize based on exploitability and exposure\n4. Test patches in staging environment\n5. Deploy patches per change management policy\n6. Verify remediation with vulnerability scans\n\nSee 'Vulnerability Remediation Guide' for prioritization matrix.";
    }
    
    if (input.includes("incident") || input.includes("response")) {
      return "Standard incident response workflow:\n\n1. **Preparation**: Ensure team readiness and tools available\n2. **Identification**: Detect and verify the incident\n3. **Containment**: Limit damage and prevent spread\n4. **Eradication**: Remove threat from environment\n5. **Recovery**: Restore systems to normal operation\n6. **Lessons Learned**: Document and improve processes\n\nRefer to 'Security Incident Response Playbook' for detailed procedures.";
    }
    
    if (input.includes("siem") || input.includes("log")) {
      return "SIEM best practices:\n\n- Configure log sources to forward all security-relevant events\n- Create correlation rules for common attack patterns\n- Set up alerts with appropriate thresholds to reduce false positives\n- Regularly review and tune detection rules\n- Maintain log retention per compliance requirements\n\nCheck 'SIEM Configuration Guide' for detailed setup instructions.";
    }
    
    if (input.includes("threat intel") || input.includes("ioc") || input.includes("indicator")) {
      return "Threat intelligence integration:\n\n1. Subscribe to reputable threat feeds (MISP, STIX/TAXII)\n2. Import IoCs into SIEM and security tools\n3. Correlate IoCs with internal logs and alerts\n4. Share relevant threats with ISAC/ISAOs\n5. Update blocklists on firewalls and proxies\n\nSee 'Threat Intelligence Platform Guide' for feed configuration.";
    }
    
    if (input.includes("firewall") || input.includes("network")) {
      return "Network security best practices:\n\n- Implement network segmentation and VLANs\n- Apply principle of least privilege for firewall rules\n- Enable logging for all firewall deny/allow decisions\n- Regularly review and clean up unused rules\n- Document all rule changes with business justification\n\nRefer to 'Firewall Management Procedures' for detailed policies.";
    }
    
    if (input.includes("password") || input.includes("authentication") || input.includes("mfa")) {
      return "Authentication security guidelines:\n\n- Enforce strong password policies (minimum 12 characters, complexity)\n- Require MFA for all privileged accounts and remote access\n- Implement passwordless authentication where possible\n- Monitor for credential stuffing and brute force attempts\n- Regularly audit privileged account usage\n\nSee 'Access Control Standards' for complete requirements.";
    }
    
    if (input.includes("compliance") || input.includes("audit") || input.includes("policy")) {
      return "Compliance and audit preparation:\n\n- Maintain current security policies and procedures documentation\n- Conduct regular security control assessments\n- Keep evidence of security activities (logs, tickets, reports)\n- Perform periodic access reviews\n- Document exceptions and compensating controls\n\nRefer to 'Security Compliance Framework' for audit readiness checklist.";
    }
    
    // Default response
    return "I can help you with:\n\n• Incident response procedures (ransomware, phishing, DDoS)\n• Vulnerability management and patching\n• SIEM configuration and log analysis\n• Threat intelligence and IoC handling\n• Network security and firewall management\n• Authentication and access controls\n• Compliance and audit requirements\n\nWhat specific topic would you like to know more about?";
  };

  const simulateTyping = async (response: string) => {
    // Add empty assistant message
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);
    
    // Simulate typing effect
    const words = response.split(" ");
    let currentText = "";
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? " " : "") + words[i];
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: currentText
        };
        return newMessages;
      });
      
      // Random delay between 30-80ms per word for natural typing
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 30));
    }
    
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    // Get mock response and simulate typing
    const response = getMockResponse(userInput);
    await simulateTyping(response);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-soc hover:bg-soc/90"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl border-soc/20 flex flex-col">
      <CardHeader className="border-b bg-soc/5 flex-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-soc/10">
              <Bot className="h-5 w-5 text-soc" />
            </div>
            <CardTitle className="text-base">SOC Assistant</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-soc text-white"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Bot className="h-4 w-4 inline-block mr-2 mb-1" />
                  )}
                  <span className="text-sm whitespace-pre-wrap">{message.content}</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4 flex-none">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about security procedures..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="bg-soc hover:bg-soc/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
