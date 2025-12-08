import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { playbookTemplates, PlaybookTemplate } from "@/data/playbookTemplates";
import { Search, Clock, Layers, Tag, FileText, Shield, Database, Network, Mail } from "lucide-react";

interface TemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: PlaybookTemplate) => void;
}

const categoryIcons = {
  "Email Security": Mail,
  "Endpoint Security": Shield,
  "Data Loss Prevention": Database,
  "Identity & Access": Shield,
  "Network Security": Network,
};

const difficultyColors = {
  beginner: "bg-green-500/10 text-green-500 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function TemplateGallery({ open, onOpenChange, onSelectTemplate }: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(playbookTemplates.map(t => t.category)))];

  const filteredTemplates = playbookTemplates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: PlaybookTemplate) => {
    onSelectTemplate(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Playbook Templates</DialogTitle>
          <DialogDescription>
            Choose from pre-built security playbooks and customize them for your needs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category === "all" ? "All Templates" : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Templates Grid */}
          <ScrollArea className="h-[500px]">
            <div className="grid gap-4 md:grid-cols-2 pr-4">
              {filteredTemplates.map((template) => {
                const CategoryIcon = categoryIcons[template.category as keyof typeof categoryIcons] || FileText;
                
                return (
                  <Card 
                    key={template.id} 
                    className="hover:border-soc/50 transition-colors cursor-pointer group"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 rounded-lg bg-soc/10 group-hover:bg-soc/20 transition-colors">
                            <CategoryIcon className="h-5 w-5 text-soc" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base mb-1">{template.name}</CardTitle>
                            <CardDescription className="text-xs line-clamp-2">
                              {template.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={difficultyColors[template.difficulty]}
                        >
                          {template.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          <span>{template.nodes.length} nodes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{template.estimatedTime}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 4).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs px-2 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 4 && (
                          <Badge variant="secondary" className="text-xs px-2 py-0">
                            +{template.tags.length - 4}
                          </Badge>
                        )}
                      </div>

                      <Button 
                        className="w-full bg-soc hover:bg-soc/90"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTemplate(template);
                        }}
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
