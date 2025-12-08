import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Knowledge base context for the AI
const knowledgeBaseContext = `
You are an AI assistant for a Security Operations Center (SOC) Knowledge Base. Your role is to help security analysts find information, suggest relevant articles, and answer questions about security procedures.

Available Knowledge Base Articles:

PLAYBOOKS & RUNBOOKS:
1. Ransomware Incident Response Playbook - Step-by-step guide for identifying, containing, and remediating ransomware attacks
2. Phishing Attack Response Procedure - Comprehensive playbook for handling phishing incidents and email-based threats
3. DDoS Mitigation Playbook - Procedures for detecting, analyzing, and mitigating distributed denial-of-service attacks
4. Data Breach Response Protocol - Critical procedures for handling data breach incidents and maintaining compliance

TECHNICAL DOCUMENTATION:
5. SIEM Configuration Guide - Complete setup and configuration documentation for security information and event management systems
6. Network Architecture Overview - Detailed documentation of organizational network topology and security zones
7. Endpoint Detection & Response (EDR) Guide - Technical documentation for EDR deployment and management
8. YARA Rules Repository - Collection of YARA rules for malware detection and threat hunting

THREAT INTELLIGENCE:
9. MITRE ATT&CK Framework Guide - Understanding and applying the MITRE ATT&CK framework for threat detection
10. Current Threat Landscape Report - Latest threat intelligence on active threat actors and attack campaigns
11. Indicators of Compromise (IoC) Database - Repository of known malicious IPs, domains, hashes, and file signatures
12. AI-Powered Threat Detection Guide - Leveraging AI and machine learning for advanced threat detection

FAQs & TROUBLESHOOTING:
13. Common SIEM Alert Triage Questions - Frequently asked questions about alert prioritization and investigation
14. False Positive Reduction Strategies - Best practices for tuning detection rules and reducing false alerts
15. Log Source Integration Issues - Troubleshooting guide for common log collection and parsing problems

POLICIES & PROCEDURES:
16. Security Incident Classification Policy - Guidelines for categorizing and prioritizing security incidents
17. Data Retention and Disposal Policy - Policies for security data retention, archival, and secure disposal
18. Compliance Framework Mapping - SOC procedures mapped to NIST, ISO 27001, and PCI DSS requirements

VULNERABILITY MANAGEMENT:
19. Critical Vulnerability Assessment Guide - Methodology for assessing and prioritizing critical vulnerabilities
20. Patch Management Procedures - Standard procedures for vulnerability remediation and patch deployment
21. Zero-Day Vulnerability Response - Emergency procedures for responding to zero-day exploits

When answering questions:
- Be concise and focused on security operations
- Suggest specific articles by number and title when relevant
- Provide actionable guidance based on best practices
- If a question is about a specific topic, recommend 2-3 related articles
- Always maintain a professional, helpful tone
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Incoming chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: knowledgeBaseContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Successfully started streaming response");
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
