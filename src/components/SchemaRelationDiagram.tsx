
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface TableInfo {
  name: string;
  columns: {
    name: string;
    type: string;
    isPrimary: boolean;
    isNullable: boolean;
  }[];
  primaryKeys: string[];
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

interface SchemaRelationDiagramProps {
  schema: SchemaData;
}

export const SchemaRelationDiagram: React.FC<SchemaRelationDiagramProps> = ({ schema }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate positions for tables in the diagram
  const calculateTablePositions = (tables: TableInfo[]) => {
    const positions: Record<string, { x: number, y: number, width: number, height: number }> = {};
    const tableWidth = 180;
    const tableHeaderHeight = 30;
    const rowHeight = 24;
    const horizontalGap = 50;
    const verticalGap = 80;
    
    let currentX = 50;
    let currentY = 50;
    let maxHeightInRow = 0;
    let tablesPerRow = Math.floor(Math.sqrt(tables.length));
    if (tablesPerRow < 2) tablesPerRow = 2;
    
    tables.forEach((table, index) => {
      const tableHeight = tableHeaderHeight + (table.columns.length * rowHeight);
      
      // New row if we've placed enough tables in the current row
      if (index % tablesPerRow === 0 && index > 0) {
        currentX = 50;
        currentY += maxHeightInRow + verticalGap;
        maxHeightInRow = 0;
      }
      
      positions[table.name] = {
        x: currentX,
        y: currentY,
        width: tableWidth,
        height: tableHeight
      };
      
      maxHeightInRow = Math.max(maxHeightInRow, tableHeight);
      currentX += tableWidth + horizontalGap;
    });
    
    return positions;
  };
  
  useEffect(() => {
    if (!canvasRef.current || !schema.tables.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Setup canvas
    const positions = calculateTablePositions(schema.tables);
    const scale = window.devicePixelRatio || 1;
    
    // Find the required canvas size
    let maxX = 0;
    let maxY = 0;
    
    Object.values(positions).forEach(pos => {
      maxX = Math.max(maxX, pos.x + pos.width);
      maxY = Math.max(maxY, pos.y + pos.height);
    });
    
    // Set canvas size with some padding
    canvas.width = (maxX + 100) * scale;
    canvas.height = (maxY + 100) * scale;
    canvas.style.width = `${maxX + 100}px`;
    canvas.style.height = `${maxY + 100}px`;
    
    // Scale context to account for high DPI displays
    ctx.scale(scale, scale);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw tables
    ctx.lineWidth = 1;
    ctx.font = '12px sans-serif';
    
    // Draw relationships first (so they appear behind tables)
    ctx.strokeStyle = '#8b5cf6'; // Purple color for relationships
    
    schema.relationships.forEach((rel) => {
      const sourceTable = positions[rel.sourceTable];
      const targetTable = positions[rel.targetTable];
      
      if (!sourceTable || !targetTable) return;
      
      // Find the column position in the source table
      const sourceColumnIndex = schema.tables
        .find(t => t.name === rel.sourceTable)
        ?.columns.findIndex(c => c.name === rel.sourceColumn) || 0;
        
      const targetColumnIndex = schema.tables
        .find(t => t.name === rel.targetTable)
        ?.columns.findIndex(c => c.name === rel.targetColumn) || 0;
      
      // Calculate start and end points
      const startX = sourceTable.x + sourceTable.width;
      const startY = sourceTable.y + 30 + (sourceColumnIndex * 24) + 12;
      
      const endX = targetTable.x;
      const endY = targetTable.y + 30 + (targetColumnIndex * 24) + 12;
      
      // Draw arrow
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      // Create a curved line
      const controlPointX = (startX + endX) / 2;
      ctx.bezierCurveTo(
        controlPointX, startY, // First control point
        controlPointX, endY,   // Second control point
        endX, endY             // End point
      );
      
      ctx.stroke();
      
      // Draw arrow head
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX + 10, endY - 5);
      ctx.lineTo(endX + 10, endY + 5);
      ctx.closePath();
      ctx.fillStyle = '#8b5cf6';
      ctx.fill();
    });
    
    // Now draw tables on top
    schema.tables.forEach((table) => {
      const pos = positions[table.name];
      
      // Table border
      ctx.fillStyle = '#f8fafc'; // Light background
      ctx.strokeStyle = '#94a3b8'; // Border color
      ctx.lineWidth = 1;
      
      // Draw table rectangle with rounded corners
      const radius = 6;
      ctx.beginPath();
      ctx.moveTo(pos.x + radius, pos.y);
      ctx.lineTo(pos.x + pos.width - radius, pos.y);
      ctx.quadraticCurveTo(pos.x + pos.width, pos.y, pos.x + pos.width, pos.y + radius);
      ctx.lineTo(pos.x + pos.width, pos.y + pos.height - radius);
      ctx.quadraticCurveTo(pos.x + pos.width, pos.y + pos.height, pos.x + pos.width - radius, pos.y + pos.height);
      ctx.lineTo(pos.x + radius, pos.y + pos.height);
      ctx.quadraticCurveTo(pos.x, pos.y + pos.height, pos.x, pos.y + pos.height - radius);
      ctx.lineTo(pos.x, pos.y + radius);
      ctx.quadraticCurveTo(pos.x, pos.y, pos.x + radius, pos.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Table header
      ctx.fillStyle = '#3b82f6'; // Blue header
      ctx.beginPath();
      ctx.moveTo(pos.x + radius, pos.y);
      ctx.lineTo(pos.x + pos.width - radius, pos.y);
      ctx.quadraticCurveTo(pos.x + pos.width, pos.y, pos.x + pos.width, pos.y + radius);
      ctx.lineTo(pos.x + pos.width, pos.y + 30);
      ctx.lineTo(pos.x, pos.y + 30);
      ctx.lineTo(pos.x, pos.y + radius);
      ctx.quadraticCurveTo(pos.x, pos.y, pos.x + radius, pos.y);
      ctx.closePath();
      ctx.fill();
      
      // Table name
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(table.name, pos.x + 10, pos.y + 20);
      
      // Draw columns
      ctx.fillStyle = '#1e293b'; // Text color
      ctx.font = '12px sans-serif';
      
      table.columns.forEach((column, index) => {
        const y = pos.y + 30 + (index * 24) + 16;
        
        // Indicate primary key with a symbol
        if (column.isPrimary) {
          ctx.fillStyle = '#ef4444'; // Red for primary key
          ctx.fillText('🔑', pos.x + 10, y);
          ctx.fillStyle = '#1e293b'; // Reset to text color
          ctx.fillText(`${column.name} (${column.type})`, pos.x + 30, y);
        } else {
          // Check if it's a foreign key
          const isForeignKey = schema.relationships.some(
            rel => rel.sourceTable === table.name && rel.sourceColumn === column.name
          );
          
          if (isForeignKey) {
            ctx.fillStyle = '#f59e0b'; // Orange for foreign key
            ctx.fillText('🔗', pos.x + 10, y);
            ctx.fillStyle = '#1e293b'; // Reset to text color
            ctx.fillText(`${column.name} (${column.type})`, pos.x + 30, y);
          } else {
            ctx.fillText(`${column.name} (${column.type})`, pos.x + 10, y);
          }
        }
      });
    });
    
  }, [schema]);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 overflow-auto max-h-[600px]">
        <div className="p-4">
          <canvas ref={canvasRef} className="mx-auto" />
        </div>
      </CardContent>
    </Card>
  );
};
