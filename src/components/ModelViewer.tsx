
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, FileDown, Code } from "lucide-react";
import { toast } from '@/components/ui/use-toast';

interface Field {
  name: string;
  type: string;
  isPrimary: boolean;
}

interface Relationship {
  type: string;
  name: string;
  targetEntity: string;
  mappedBy?: string;
  joinColumn?: string;
}

interface JavaModel {
  name: string;
  tableName: string;
  fields: Field[];
  relationships: Relationship[];
  imports: string[];
  code: string;
}

interface ModelViewerProps {
  models: JavaModel[];
}

export const ModelViewer: React.FC<ModelViewerProps> = ({ models }) => {
  const [activeModel, setActiveModel] = useState(models[0]?.name || "");
  const [copied, setCopied] = useState<string | null>(null);
  
  const handleCopyCode = (code: string, modelName: string) => {
    navigator.clipboard.writeText(code);
    setCopied(modelName);
    toast({
      title: "Copied to clipboard",
      description: `${modelName}.java code has been copied to clipboard`
    });
    
    setTimeout(() => setCopied(null), 2000);
  };
  
  const downloadJavaFile = (code: string, className: string) => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${className}.java`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded file",
      description: `${className}.java has been downloaded`
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Generated Models</h3>
            <ul className="space-y-1">
              {models.map((model) => (
                <li key={model.name}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeModel === model.name
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => setActiveModel(model.name)}
                  >
                    {model.name}
                  </button>
                </li>
              ))}
            </ul>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => {
                models.forEach(model => {
                  downloadJavaFile(model.code, model.name);
                });
                
                toast({
                  title: "Downloaded all models",
                  description: `${models.length} Java model files have been downloaded`
                });
              }}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Download All Models
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-3">
          {models
            .filter((model) => model.name === activeModel)
            .map((model) => (
              <Card key={model.name}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{model.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Table: {model.tableName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyCode(model.code, model.name)}
                      >
                        {copied === model.name ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Code
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadJavaFile(model.code, model.name)}
                      >
                        <FileDown className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="code" className="w-full">
                    <TabsList>
                      <TabsTrigger value="code">Java Code</TabsTrigger>
                      <TabsTrigger value="structure">Class Structure</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="code" className="pt-4">
                      <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                        <code className="block whitespace-pre">{model.code}</code>
                      </pre>
                    </TabsContent>
                    
                    <TabsContent value="structure" className="pt-4">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Imports</h4>
                          <pre className="bg-muted p-3 rounded-md overflow-auto text-xs">
                            <code>
                              {model.imports.join('\n')}
                            </code>
                          </pre>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Fields</h4>
                          <ul className="space-y-2">
                            {model.fields.map((field) => (
                              <li 
                                key={field.name} 
                                className="bg-muted p-2 rounded-md flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  <span className="font-mono text-sm">{field.name}: {field.type}</span>
                                </div>
                                <div>
                                  {field.isPrimary && (
                                    <Badge variant="outline" className="border-schema-primary text-schema-primary">
                                      Primary Key
                                    </Badge>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Relationships</h4>
                          <ul className="space-y-2">
                            {model.relationships.map((rel) => (
                              <li 
                                key={rel.name} 
                                className="bg-muted p-2 rounded-md flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  <Badge variant="secondary" className="mr-2">
                                    {rel.type}
                                  </Badge>
                                  <span className="font-mono text-sm">{rel.name}: {rel.targetEntity}</span>
                                </div>
                                <div>
                                  {rel.mappedBy && (
                                    <Badge variant="outline">
                                      mappedBy="{rel.mappedBy}"
                                    </Badge>
                                  )}
                                  {rel.joinColumn && (
                                    <Badge variant="outline">
                                      joinColumn="{rel.joinColumn}"
                                    </Badge>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};
