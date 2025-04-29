
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';

interface ConnectionFormProps {
  onConnect: (connectionData: ConnectionData) => void;
  isLoading: boolean;
}

interface ConnectionData {
  hostname: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

export const ConnectionForm: React.FC<ConnectionFormProps> = ({ onConnect, isLoading }) => {
  const [connectionData, setConnectionData] = useState<ConnectionData>({
    hostname: 'localhost',
    port: '3306',
    database: '',
    username: 'root',
    password: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConnectionData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(connectionData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hostname">Hostname</Label>
          <Input
            id="hostname"
            name="hostname"
            placeholder="localhost"
            value={connectionData.hostname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            name="port"
            placeholder="3306"
            value={connectionData.port}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="database">Database Name</Label>
        <Input
          id="database"
          name="database"
          placeholder="my_database"
          value={connectionData.database}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="root"
            value={connectionData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={connectionData.password}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          'Connect to Database'
        )}
      </Button>
      
      <div className="text-xs text-center text-muted-foreground">
        Connection details are only used to connect to your database and are not stored.
      </div>
    </form>
  );
};
