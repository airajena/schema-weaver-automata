
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneratorConfig, GeneratorConfigData } from "./GeneratorConfig";
import { toast } from '@/components/ui/use-toast';

interface ConfigurationEditorProps {
  onSave: (config: any) => void;
}

export const ConfigurationEditor: React.FC<ConfigurationEditorProps> = ({ onSave }) => {
  const [activeTab, setActiveTab] = useState('generator');
  const [generatorConfig, setGeneratorConfig] = useState<GeneratorConfigData | null>(null);
  
  const handleSaveGeneratorConfig = (config: GeneratorConfigData) => {
    setGeneratorConfig(config);
  };
  
  const handleSaveAll = () => {
    const fullConfig = {
      generator: generatorConfig,
      // Add other configuration sections here if needed
    };
    
    onSave(fullConfig);
    toast({
      title: "Configuration saved",
      description: "Your settings have been saved and will be applied to generated models."
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-1 mb-4">
            <TabsTrigger value="generator">Model Generator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator">
            <GeneratorConfig onSave={handleSaveGeneratorConfig} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSaveAll}>
          Save All Settings
        </Button>
      </CardFooter>
    </Card>
  );
};
