# A multi-stage build pipeline resulting in a production docker image

# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /source
COPY *.sln .
COPY webservice/*.csproj ./webservice/
RUN dotnet restore ./webservice/webservice.csproj

COPY webservice/. ./webservice/
WORKDIR /source/webservice
RUN dotnet publish -c release -o /app

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:3.1
WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["dotnet", "webservice.dll"]