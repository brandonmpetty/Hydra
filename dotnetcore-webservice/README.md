# DotNet Core Webservice Demo
A lightweight RESTful web service template, written in C#, based on ASP .Net Core that exposes a Data Mart with OData.  The Entity ORM is used for database abstraction and management.

## Under Construction
This project is not ready for public consumption.

## Initializing project with Entity ORM
```
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate --output-dir Entity/Migrations
dotnet ef database update
```

## Testing
Run Unit Tests with Code Coverage
```
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=cobertura
```
A code coverage report should be generated at: TestResults\coverage-report\index.html