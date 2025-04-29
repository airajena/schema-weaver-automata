# MySQL Schema Crawler and Java Model Generator

This project provides a web interface to a Java-based crawler that connects to MySQL databases, extracts schema information, and automatically generates Java model classes for use in Spring Boot applications.

## Project Structure

The project consists of a React frontend application built with Tailwind CSS and a Java Spring Boot backend API that performs the database connection, schema extraction, and model generation.

## Features

- **MySQL Database Connection**: Connect to any MySQL database using JDBC.
- **Schema Extraction**: Extract metadata about tables, columns, primary keys, foreign keys, and indexes.
- **Relationship Detection**: Automatically detect and visualize relationships between tables.
- **Java Model Generation**: Generate Java model classes with appropriate annotations for JPA/Hibernate.
- **REST API**: Provides endpoints to connect to databases, extract schemas, and generate models.

## Backend Technical Details (Java/Spring Boot)

### Core Components

1. **Database Connector**: Uses JDBC to connect to MySQL databases and extract metadata.
2. **Schema Extractor**: Extracts database schema information:
   - Tables and their properties
   - Columns with data types and constraints
   - Primary keys and foreign keys
   - Indexes and constraints

3. **Model Generator**: Generates Java classes from the extracted schema:
   - Maps SQL types to Java types
   - Creates appropriate JPA annotations
   - Establishes entity relationships (OneToMany, ManyToOne, etc.)
   - Handles complex cases like composite keys and join tables

4. **REST API Controllers**: Exposes endpoints for client applications.

### Key Java Classes

```java
// Main crawler class for database metadata extraction
@Service
public class DatabaseMetadataCrawler {
    
    public DatabaseSchema extractSchema(Connection connection) {
        DatabaseSchema schema = new DatabaseSchema();
        
        // Extract tables
        extractTables(connection, schema);
        
        // Extract columns for each table
        for (TableMetadata table : schema.getTables()) {
            extractColumns(connection, table);
            extractPrimaryKeys(connection, table);
            extractForeignKeys(connection, table, schema);
            extractIndexes(connection, table);
        }
        
        return schema;
    }
    
    private void extractTables(Connection connection, DatabaseSchema schema) {
        try (ResultSet rs = connection.getMetaData().getTables(
                null, null, null, new String[]{"TABLE"})) {
            
            while (rs.next()) {
                String tableName = rs.getString("TABLE_NAME");
                TableMetadata table = new TableMetadata(tableName);
                schema.addTable(table);
            }
        } catch (SQLException e) {
            throw new SchemaExtractionException("Error extracting tables", e);
        }
    }
    
    // Other extraction methods for columns, keys, etc.
    // ...
}

// Model generator for Java classes
@Service
public class JavaModelGenerator {

    public List<JavaModel> generateModels(DatabaseSchema schema) {
        List<JavaModel> models = new ArrayList<>();
        
        for (TableMetadata table : schema.getTables()) {
            JavaModel model = new JavaModel();
            model.setName(toClassName(table.getName()));
            model.setTableName(table.getName());
            
            // Add fields
            for (ColumnMetadata column : table.getColumns()) {
                FieldMetadata field = new FieldMetadata();
                field.setName(toCamelCase(column.getName()));
                field.setType(mapSqlTypeToJava(column.getType(), column.getSize()));
                field.setPrimary(table.getPrimaryKeys().contains(column.getName()));
                model.addField(field);
            }
            
            // Add relationships
            addRelationships(model, table, schema);
            
            // Generate code
            model.setCode(generateJavaCode(model, schema));
            
            models.add(model);
        }
        
        return models;
    }
    
    private String generateJavaCode(JavaModel model, DatabaseSchema schema) {
        // Code generation logic
        // ...
    }
    
    // Helper methods
    // ...
}

// REST Controller for exposing the crawler and generator functionality
@RestController
@RequestMapping("/api/schema")
public class SchemaController {

    private final DatabaseConnectionService connectionService;
    private final DatabaseMetadataCrawler crawler;
    private final JavaModelGenerator modelGenerator;
    
    // Constructor injection
    
    @PostMapping("/connect")
    public ResponseEntity<?> connectToDatabase(@RequestBody ConnectionRequest request) {
        try {
            Connection connection = connectionService.connect(
                request.getHostname(),
                request.getPort(),
                request.getDatabase(),
                request.getUsername(),
                request.getPassword()
            );
            
            // Store connection in session or return token
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Connection failed: " + e.getMessage()));
        }
    }
    
    @GetMapping("/extract")
    public ResponseEntity<DatabaseSchema> extractSchema() {
        try {
            Connection connection = connectionService.getCurrentConnection();
            DatabaseSchema schema = crawler.extractSchema(connection);
            return ResponseEntity.ok(schema);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
        }
    }
    
    @PostMapping("/generate-models")
    public ResponseEntity<List<JavaModel>> generateModels(@RequestBody DatabaseSchema schema) {
        List<JavaModel> models = modelGenerator.generateModels(schema);
        return ResponseEntity.ok(models);
    }
}
```

### Data Types Mapping

The application includes comprehensive mapping from MySQL data types to Java types:

| MySQL Type | Java Type |
|------------|-----------|
| CHAR, VARCHAR, TEXT | String |
| TINYINT(1) | Boolean |
| TINYINT, SMALLINT | Short |
| INT, INTEGER | Integer |
| BIGINT | Long |
| FLOAT | Float |
| DOUBLE, DECIMAL | Double |
| DATE | LocalDate |
| TIME | LocalTime |
| DATETIME, TIMESTAMP | LocalDateTime |
| BLOB, MEDIUMBLOB, LONGBLOB | byte[] |

## Configuration

The application supports configuration through a JSON file or environment variables:

```json
{
  "database": {
    "default-port": 3306,
    "connection-timeout": 30000
  },
  "generator": {
    "package-name": "com.example.model",
    "generate-getters-setters": true,
    "generate-toString": true,
    "include-lombok": true
  }
}
```

## Getting Started

1. Clone the repository
2. Start the Spring Boot application: `./mvnw spring-boot:run`
3. Access the web interface at http://localhost:8080

## Requirements

- Java 17 or higher
- MySQL/MariaDB (for connecting to databases)

## License

MIT

## Project info

**URL**: https://lovable.dev/projects/e34f65f7-7ba9-4eef-9296-68464bf51abf

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e34f65f7-7ba9-4eef-9296-68464bf51abf) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e34f65f7-7ba9-4eef-9296-68464bf51abf) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
