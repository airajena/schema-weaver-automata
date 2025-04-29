
import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, Lock, Hash } from "lucide-react";
import { SchemaRelationDiagram } from './SchemaRelationDiagram';

interface Column {
  name: string;
  type: string;
  isPrimary: boolean;
  isNullable: boolean;
}

interface TableInfo {
  name: string;
  columns: Column[];
  primaryKeys: string[];
  indexes: { name: string; columns: string[] }[];
}

interface Relationship {
  name: string;
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
}

interface SchemaData {
  tables: TableInfo[];
  relationships: Relationship[];
}

interface SchemaViewerProps {
  schema: SchemaData;
}

export const SchemaViewer: React.FC<SchemaViewerProps> = ({ schema }) => {
  const [activeTable, setActiveTable] = useState(schema.tables[0]?.name || "");
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="tables" className="w-full">
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="diagram">ER Diagram</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tables" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Tables</h3>
                <ul className="space-y-1">
                  {schema.tables.map((table) => (
                    <li key={table.name}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          activeTable === table.name
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-secondary"
                        }`}
                        onClick={() => setActiveTable(table.name)}
                      >
                        {table.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="md:col-span-3">
              {schema.tables
                .filter((table) => table.name === activeTable)
                .map((table) => (
                  <Card key={table.name}>
                    <CardContent className="p-0">
                      <Table>
                        <TableCaption>Table: {table.name}</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/4">Column</TableHead>
                            <TableHead className="w-1/4">Type</TableHead>
                            <TableHead className="w-1/4">Attributes</TableHead>
                            <TableHead className="w-1/4">Indexes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {table.columns.map((column) => (
                            <TableRow key={column.name}>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-2">
                                  {column.isPrimary && (
                                    <Key className="h-3 w-3 text-schema-primary" />
                                  )}
                                  <span>{column.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{column.type}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {column.isPrimary && (
                                    <Badge variant="outline" className="border-schema-primary text-schema-primary">
                                      Primary Key
                                    </Badge>
                                  )}
                                  {!column.isNullable && (
                                    <Badge variant="outline">
                                      NOT NULL
                                    </Badge>
                                  )}
                                  {schema.relationships.some(
                                    (rel) =>
                                      rel.sourceTable === table.name &&
                                      rel.sourceColumn === column.name
                                  ) && (
                                    <Badge variant="outline" className="border-schema-foreign text-schema-foreign">
                                      Foreign Key
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {table.indexes
                                    .filter((index) =>
                                      index.columns.includes(column.name)
                                    )
                                    .map((index) => (
                                      <Badge
                                        key={index.name}
                                        variant="outline"
                                        className="border-schema-index text-schema-index"
                                      >
                                        <Hash className="h-3 w-3 mr-1" />
                                        {index.name}
                                      </Badge>
                                    ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="relationships" className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Constraint Name</TableHead>
                <TableHead>Source Table</TableHead>
                <TableHead>Source Column</TableHead>
                <TableHead></TableHead>
                <TableHead>Target Table</TableHead>
                <TableHead>Target Column</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schema.relationships.map((rel) => (
                <TableRow key={rel.name}>
                  <TableCell className="font-medium">{rel.name}</TableCell>
                  <TableCell>{rel.sourceTable}</TableCell>
                  <TableCell>{rel.sourceColumn}</TableCell>
                  <TableCell>→</TableCell>
                  <TableCell>{rel.targetTable}</TableCell>
                  <TableCell>{rel.targetColumn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="diagram" className="pt-4">
          <SchemaRelationDiagram schema={schema} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
