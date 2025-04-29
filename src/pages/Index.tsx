
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from '@/components/ui/use-toast';
import { Loader2, Database, Table2, Key, ArrowRight, FileCode, CheckCircle2, Settings } from 'lucide-react';
import { ConnectionForm } from '@/components/ConnectionForm';
import { SchemaViewer } from '@/components/SchemaViewer';
import { ModelViewer } from '@/components/ModelViewer';
import { ConfigurationEditor } from '@/components/ConfigurationEditor';

const Index = () => {
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [schemaData, setSchemaData] = useState(null);
  const [generatedModels, setGeneratedModels] = useState(null);
  const [configuration, setConfiguration] = useState(null);
  
  const handleConnect = (connectionData) => {
    setIsLoading(true);
    
    // Simulate API call to connect to database
    setTimeout(() => {
      console.log("Connected to database with:", connectionData);
      setConnected(true);
      setIsLoading(false);
      toast({
        title: "Connection successful",
        description: `Connected to ${connectionData.database} on ${connectionData.hostname}`,
      });
      
      // Simulate fetching schema data
      fetchSchemaData(connectionData);
    }, 1500);
  };
  
  const fetchSchemaData = (connectionData) => {
    // Simulate API call to get schema data
    setTimeout(() => {
      const mockSchemaData = {
        tables: [
          {
            name: "users",
            columns: [
              { name: "id", type: "INT", isPrimary: true, isNullable: false },
              { name: "username", type: "VARCHAR(255)", isPrimary: false, isNullable: false },
              { name: "email", type: "VARCHAR(255)", isPrimary: false, isNullable: false },
              { name: "password_hash", type: "VARCHAR(255)", isPrimary: false, isNullable: false },
              { name: "created_at", type: "TIMESTAMP", isPrimary: false, isNullable: true }
            ],
            primaryKeys: ["id"],
            indexes: [
              { name: "idx_username", columns: ["username"] },
              { name: "idx_email", columns: ["email"] }
            ]
          },
          {
            name: "posts",
            columns: [
              { name: "id", type: "INT", isPrimary: true, isNullable: false },
              { name: "user_id", type: "INT", isPrimary: false, isNullable: false },
              { name: "title", type: "VARCHAR(255)", isPrimary: false, isNullable: false },
              { name: "content", type: "TEXT", isPrimary: false, isNullable: true },
              { name: "created_at", type: "TIMESTAMP", isPrimary: false, isNullable: true }
            ],
            primaryKeys: ["id"],
            indexes: [
              { name: "idx_user_id", columns: ["user_id"] }
            ]
          },
          {
            name: "comments",
            columns: [
              { name: "id", type: "INT", isPrimary: true, isNullable: false },
              { name: "post_id", type: "INT", isPrimary: false, isNullable: false },
              { name: "user_id", type: "INT", isPrimary: false, isNullable: false },
              { name: "content", type: "TEXT", isPrimary: false, isNullable: false },
              { name: "created_at", type: "TIMESTAMP", isPrimary: false, isNullable: true }
            ],
            primaryKeys: ["id"],
            indexes: [
              { name: "idx_post_id", columns: ["post_id"] },
              { name: "idx_user_id", columns: ["user_id"] }
            ]
          }
        ],
        relationships: [
          {
            name: "fk_posts_user_id",
            sourceTable: "posts",
            sourceColumn: "user_id",
            targetTable: "users",
            targetColumn: "id"
          },
          {
            name: "fk_comments_post_id",
            sourceTable: "comments",
            sourceColumn: "post_id",
            targetTable: "posts",
            targetColumn: "id"
          },
          {
            name: "fk_comments_user_id",
            sourceTable: "comments",
            sourceColumn: "user_id",
            targetTable: "users",
            targetColumn: "id"
          }
        ]
      };
      
      setSchemaData(mockSchemaData);
      console.log("Schema data fetched:", mockSchemaData);
    }, 1000);
  };
  
  const handleGenerateModels = () => {
    if (!schemaData) return;
    
    setIsLoading(true);
    
    // Simulate API call to generate models
    setTimeout(() => {
      const mockModels = {
        models: [
          {
            name: "User",
            tableName: "users",
            fields: [
              { name: "id", type: "Integer", isPrimary: true },
              { name: "username", type: "String", isPrimary: false },
              { name: "email", type: "String", isPrimary: false },
              { name: "passwordHash", type: "String", isPrimary: false },
              { name: "createdAt", type: "LocalDateTime", isPrimary: false }
            ],
            relationships: [
              { type: "OneToMany", name: "posts", targetEntity: "Post", mappedBy: "user" },
              { type: "OneToMany", name: "comments", targetEntity: "Comment", mappedBy: "user" }
            ],
            imports: [
              "import java.time.LocalDateTime;",
              "import javax.persistence.*;",
              "import java.util.Set;"
            ],
            code: `@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String email;
    
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Post> posts;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Comment> comments;
    
    // Getters and setters
}`
          },
          {
            name: "Post",
            tableName: "posts",
            fields: [
              { name: "id", type: "Integer", isPrimary: true },
              { name: "userId", type: "Integer", isPrimary: false },
              { name: "title", type: "String", isPrimary: false },
              { name: "content", type: "String", isPrimary: false },
              { name: "createdAt", type: "LocalDateTime", isPrimary: false }
            ],
            relationships: [
              { type: "ManyToOne", name: "user", targetEntity: "User", joinColumn: "user_id" },
              { type: "OneToMany", name: "comments", targetEntity: "Comment", mappedBy: "post" }
            ],
            imports: [
              "import java.time.LocalDateTime;",
              "import javax.persistence.*;",
              "import java.util.Set;"
            ],
            code: `@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String title;
    
    @Column
    private String content;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private Set<Comment> comments;
    
    // Getters and setters
}`
          },
          {
            name: "Comment",
            tableName: "comments",
            fields: [
              { name: "id", type: "Integer", isPrimary: true },
              { name: "postId", type: "Integer", isPrimary: false },
              { name: "userId", type: "Integer", isPrimary: false },
              { name: "content", type: "String", isPrimary: false },
              { name: "createdAt", type: "LocalDateTime", isPrimary: false }
            ],
            relationships: [
              { type: "ManyToOne", name: "post", targetEntity: "Post", joinColumn: "post_id" },
              { type: "ManyToOne", name: "user", targetEntity: "User", joinColumn: "user_id" }
            ],
            imports: [
              "import java.time.LocalDateTime;",
              "import javax.persistence.*;"
            ],
            code: `@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String content;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Getters and setters
}`
          }
        ]
      };
      
      setGeneratedModels(mockModels);
      setIsLoading(false);
      toast({
        title: "Models generated",
        description: `Successfully generated ${mockModels.models.length} Java model classes`,
      });
    }, 2000);
  };

  const handleSaveConfiguration = (config) => {
    setConfiguration(config);
    console.log("Configuration saved:", config);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-primary">MySQL Schema Crawler</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Connect to a MySQL database, extract its schema, and generate Java models with Spring Boot
        </p>
        <Separator className="my-4" />
      </header>
      
      <Tabs defaultValue="connect" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="connect">
            <Database className="mr-2 h-4 w-4" /> Connect
          </TabsTrigger>
          <TabsTrigger value="schema" disabled={!connected}>
            <Table2 className="mr-2 h-4 w-4" /> Schema
          </TabsTrigger>
          <TabsTrigger value="models" disabled={!schemaData}>
            <FileCode className="mr-2 h-4 w-4" /> Generated Models
          </TabsTrigger>
          <TabsTrigger value="config">
            <Settings className="mr-2 h-4 w-4" /> Configuration
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connect">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Database Connection
              </CardTitle>
              <CardDescription>
                Enter your MySQL database connection details below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectionForm onConnect={handleConnect} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Table2 className="mr-2 h-5 w-5" />
                Database Schema
              </CardTitle>
              <CardDescription>
                View and analyze the extracted database schema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schemaData ? (
                <SchemaViewer schema={schemaData} />
              ) : (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerateModels} 
                disabled={!schemaData || isLoading} 
                className="ml-auto"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCode className="mr-2 h-4 w-4" />}
                Generate Java Models
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCode className="mr-2 h-5 w-5" />
                Generated Java Models
              </CardTitle>
              <CardDescription>
                Review and download the generated Java model classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedModels ? (
                <ModelViewer models={generatedModels.models} />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 space-y-4">
                  <Button onClick={handleGenerateModels} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCode className="mr-2 h-4 w-4" />}
                    Generate Models
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="config">
          <ConfigurationEditor onSave={handleSaveConfiguration} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
