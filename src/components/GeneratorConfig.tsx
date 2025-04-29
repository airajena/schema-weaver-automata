
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';

interface GeneratorConfigProps {
  onSave: (config: GeneratorConfigData) => void;
}

export interface GeneratorConfigData {
  packageName: string;
  generateGettersSetters: boolean;
  generateToString: boolean;
  useLombok: boolean;
  namingStrategy: string;
  mappers: Record<string, string>;
}

export const GeneratorConfig: React.FC<GeneratorConfigProps> = ({ onSave }) => {
  const [config, setConfig] = useState<GeneratorConfigData>({
    packageName: 'com.example.model',
    generateGettersSetters: true,
    generateToString: true,
    useLombok: false,
    namingStrategy: 'camelCase',
    mappers: {
      'VARCHAR': 'String',
      'TEXT': 'String',
      'CHAR': 'String',
      'INT': 'Integer',
      'BIGINT': 'Long',
      'TINYINT(1)': 'Boolean',
      'TINYINT': 'Byte',
      'SMALLINT': 'Short',
      'DECIMAL': 'BigDecimal',
      'FLOAT': 'Float',
      'DOUBLE': 'Double',
      'DATE': 'LocalDate',
      'TIME': 'LocalTime',
      'DATETIME': 'LocalDateTime',
      'TIMESTAMP': 'LocalDateTime',
      'BLOB': 'byte[]',
      'BINARY': 'byte[]'
    }
  });
  
  const handleChange = (field: keyof GeneratorConfigData, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleMapperChange = (sqlType: string, javaType: string) => {
    setConfig(prev => ({
      ...prev,
      mappers: {
        ...prev.mappers,
        [sqlType]: javaType
      }
    }));
  };
  
  const handleSave = () => {
    onSave(config);
    toast({
      title: "Configuration saved",
      description: "Your model generation settings have been saved."
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Generator Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="packageName">Base Package Name</Label>
            <Input
              id="packageName"
              value={config.packageName}
              onChange={(e) => handleChange('packageName', e.target.value)}
              placeholder="com.example.model"
            />
            <p className="text-sm text-muted-foreground">
              The base package name for generated model classes
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Code Generation Options</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="generateGettersSetters" className="flex-1">
                Generate Getters and Setters
              </Label>
              <Switch
                id="generateGettersSetters"
                checked={config.generateGettersSetters}
                onCheckedChange={(checked) => handleChange('generateGettersSetters', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="generateToString" className="flex-1">
                Generate toString() Method
              </Label>
              <Switch
                id="generateToString"
                checked={config.generateToString}
                onCheckedChange={(checked) => handleChange('generateToString', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="useLombok" className="flex-1">
                Use Lombok Annotations
              </Label>
              <Switch
                id="useLombok"
                checked={config.useLombok}
                onCheckedChange={(checked) => handleChange('useLombok', checked)}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="namingStrategy">Field Naming Strategy</Label>
              <Select
                value={config.namingStrategy}
                onValueChange={(value) => handleChange('namingStrategy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a naming strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="camelCase">camelCase</SelectItem>
                  <SelectItem value="snake_case_unchanged">Keep snake_case</SelectItem>
                  <SelectItem value="PascalCase">PascalCase</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                How to convert database column names to Java field names
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">SQL to Java Type Mappings</h3>
            <p className="text-sm text-muted-foreground">
              Customize how SQL types are mapped to Java types
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto p-2 bg-muted/50 rounded-md">
              {Object.entries(config.mappers).map(([sqlType, javaType]) => (
                <div key={sqlType} className="flex items-center space-x-2">
                  <div className="w-1/2">
                    <Label className="text-xs">{sqlType}</Label>
                  </div>
                  <div className="w-1/2">
                    <Select
                      value={javaType}
                      onValueChange={(value) => handleMapperChange(sqlType, value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="String">String</SelectItem>
                        <SelectItem value="Integer">Integer</SelectItem>
                        <SelectItem value="Long">Long</SelectItem>
                        <SelectItem value="Double">Double</SelectItem>
                        <SelectItem value="Float">Float</SelectItem>
                        <SelectItem value="Boolean">Boolean</SelectItem>
                        <SelectItem value="BigDecimal">BigDecimal</SelectItem>
                        <SelectItem value="LocalDate">LocalDate</SelectItem>
                        <SelectItem value="LocalDateTime">LocalDateTime</SelectItem>
                        <SelectItem value="byte[]">byte[]</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <Button className="w-full" onClick={handleSave}>
          Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
};
