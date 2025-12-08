import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Video, Mic, Image, FileText, Upload, Play, 
  CheckCircle2, AlertTriangle, XCircle, Loader2,
  Database, ScanFace, Fingerprint, Filter, Cpu, BarChart3,
  Shield, Eye, Brain
} from "lucide-react";

type MediaType = "video" | "audio" | "image" | "text";
type AnalysisStage = "idle" | "data-collection" | "face-detection" | "feature-extraction" | "feature-selection" | "model-selection" | "model-evaluation" | "complete";

interface StageResult {
  stage: string;
  status: "pending" | "processing" | "complete";
  confidence?: number;
  details?: string;
}

const stages = [
  { id: "data-collection", name: "Data Collection", icon: Database, description: "Collecting and organizing media data" },
  { id: "face-detection", name: "Face Detection", icon: ScanFace, description: "Identifying facial regions and characteristics" },
  { id: "feature-extraction", name: "Feature Extraction", icon: Fingerprint, description: "Extracting candidate features from detected faces" },
  { id: "feature-selection", name: "Feature Selection", icon: Filter, description: "Selecting most useful features for detection" },
  { id: "model-selection", name: "Model Selection", icon: Cpu, description: "Selecting optimal classification model" },
  { id: "model-evaluation", name: "Model Evaluation", icon: BarChart3, description: "Evaluating model performance metrics" },
];

export function DeepfakeAnalysis() {
  const [mediaType, setMediaType] = useState<MediaType>("video");
  const [currentStage, setCurrentStage] = useState<AnalysisStage>("idle");
  const [stageResults, setStageResults] = useState<StageResult[]>([]);
  const [overallResult, setOverallResult] = useState<"authentic" | "deepfake" | "uncertain" | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setCurrentStage("idle");
      setStageResults([]);
      setOverallResult(null);
    }
  };

  const simulateAnalysis = async () => {
    if (!fileName) return;
    
    setStageResults([]);
    setOverallResult(null);

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      setCurrentStage(stage.id as AnalysisStage);
      
      // Add processing state
      setStageResults(prev => [...prev, { stage: stage.id, status: "processing" }]);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
      
      // Update to complete with random confidence
      const confidence = 75 + Math.random() * 20;
      setStageResults(prev => 
        prev.map(r => r.stage === stage.id 
          ? { ...r, status: "complete", confidence, details: getStageDetails(stage.id, confidence) }
          : r
        )
      );
    }

    setCurrentStage("complete");
    // Random result
    const rand = Math.random();
    setOverallResult(rand > 0.6 ? "deepfake" : rand > 0.2 ? "authentic" : "uncertain");
  };

  const getStageDetails = (stageId: string, confidence: number): string => {
    const details: Record<string, string[]> = {
      "data-collection": ["Frame extraction complete", "Audio track isolated", "Metadata parsed"],
      "face-detection": ["2 faces detected", "Facial landmarks identified", "Expression analysis ready"],
      "feature-extraction": ["512 features extracted", "Temporal inconsistencies flagged", "Micro-expressions analyzed"],
      "feature-selection": ["Top 128 features selected", "Correlation analysis complete", "Noise features filtered"],
      "model-selection": ["EfficientNet-B4 selected", "XceptionNet ensemble ready", "Attention mechanism active"],
      "model-evaluation": [`Confidence: ${confidence.toFixed(1)}%`, "Cross-validation complete", "ROC-AUC: 0.94"],
    };
    return details[stageId]?.[Math.floor(Math.random() * 3)] || "Processing complete";
  };

  const getResultColor = (result: typeof overallResult) => {
    switch (result) {
      case "authentic": return "text-success";
      case "deepfake": return "text-error";
      case "uncertain": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  const getResultIcon = (result: typeof overallResult) => {
    switch (result) {
      case "authentic": return <CheckCircle2 className="h-8 w-8 text-success" />;
      case "deepfake": return <XCircle className="h-8 w-8 text-error" />;
      case "uncertain": return <AlertTriangle className="h-8 w-8 text-warning" />;
      default: return null;
    }
  };

  const mediaTypes = [
    { id: "video", name: "Video Analysis", icon: Video, accept: "video/*" },
    { id: "audio", name: "Audio Analysis", icon: Mic, accept: "audio/*" },
    { id: "image", name: "Image Analysis", icon: Image, accept: "image/*" },
    { id: "text", name: "Text Analysis", icon: FileText, accept: ".txt,.doc,.docx,.pdf" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-soc" />
            Deepfake Analysis
          </h2>
          <p className="text-muted-foreground mt-1">
            Detect, Verify, Decide - AI-powered media authenticity verification
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-soc/10 text-soc border-soc/30">
            <Eye className="h-3 w-3 mr-1" />
            Detect
          </Badge>
          <Badge variant="outline" className="bg-quantum-primary/10 text-quantum-primary border-quantum-primary/30">
            <Brain className="h-3 w-3 mr-1" />
            Verify
          </Badge>
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Decide
          </Badge>
        </div>
      </div>

      {/* Media Type Tabs */}
      <Tabs value={mediaType} onValueChange={(v) => { setMediaType(v as MediaType); setFileName(""); setCurrentStage("idle"); setStageResults([]); setOverallResult(null); }}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-muted/50">
          {mediaTypes.map((type) => (
            <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-2 data-[state=active]:bg-soc/20 data-[state=active]:text-soc">
              <type.icon className="h-4 w-4" />
              {type.name.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {mediaTypes.map((type) => (
          <TabsContent key={type.id} value={type.id} className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upload Section */}
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5 text-soc" />
                    Upload {type.name.split(" ")[0]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-soc/50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept={type.accept}
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <type.icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Drop {type.name.split(" ")[0].toLowerCase()} file here or click to browse
                    </p>
                    {fileName && (
                      <Badge className="mt-3 bg-soc/20 text-soc">
                        {fileName}
                      </Badge>
                    )}
                  </div>
                  
                  <Button 
                    onClick={simulateAnalysis} 
                    disabled={!fileName || (currentStage !== "idle" && currentStage !== "complete")}
                    className="w-full bg-soc hover:bg-soc/80"
                  >
                    {currentStage !== "idle" && currentStage !== "complete" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Analysis
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Analysis Pipeline */}
              <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-quantum-primary" />
                    6-Stage Detection Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stages.map((stage, index) => {
                      const result = stageResults.find(r => r.stage === stage.id);
                      const isActive = currentStage === stage.id;
                      const isComplete = result?.status === "complete";
                      const isProcessing = result?.status === "processing";
                      
                      return (
                        <div 
                          key={stage.id}
                          className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                            isActive ? "border-soc bg-soc/10" : 
                            isComplete ? "border-success/30 bg-success/5" : 
                            "border-border/30 bg-muted/20"
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            isComplete ? "bg-success/20" : 
                            isProcessing ? "bg-soc/20" : 
                            "bg-muted/30"
                          }`}>
                            {isProcessing ? (
                              <Loader2 className="h-5 w-5 text-soc animate-spin" />
                            ) : isComplete ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : (
                              <stage.icon className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${isActive || isComplete ? "text-foreground" : "text-muted-foreground"}`}>
                                {index + 1}. {stage.name}
                              </span>
                              {isComplete && result?.confidence && (
                                <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
                                  {result.confidence.toFixed(1)}%
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {isProcessing ? "Processing..." : isComplete ? result?.details : stage.description}
                            </p>
                            {isProcessing && (
                              <Progress value={50} className="h-1 mt-2" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            {overallResult && (
              <Card className={`mt-6 border-2 ${
                overallResult === "authentic" ? "border-success/50 bg-success/5" :
                overallResult === "deepfake" ? "border-error/50 bg-error/5" :
                "border-warning/50 bg-warning/5"
              }`}>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getResultIcon(overallResult)}
                      <div>
                        <h3 className={`text-xl font-bold ${getResultColor(overallResult)}`}>
                          {overallResult === "authentic" ? "AUTHENTIC MEDIA" :
                           overallResult === "deepfake" ? "DEEPFAKE DETECTED" :
                           "UNCERTAIN - MANUAL REVIEW REQUIRED"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Analysis complete • {stageResults.length} stages processed • {fileName}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Export Report</Button>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
