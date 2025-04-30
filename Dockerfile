FROM mcr.microsoft.com/dotnet/sdk:9.0

# Node.js ekleniyor (React client .csproj içinden çalışacak)
RUN apt-get update && apt-get install -y curl gnupg \
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs \
  && npm install -g npm

WORKDIR /src

# Proje dosyaları
COPY CabirCRM.API/CabirCRM.API.csproj ./CabirCRM.API/
COPY CabirCRM.Application/CabirCRM.Application.csproj ./CabirCRM.Application/
COPY CabirCRM.Infrastructure/CabirCRM.Infrastructure.csproj ./CabirCRM.Infrastructure/
COPY CabirCRM.Domain/CabirCRM.Domain.csproj ./CabirCRM.Domain/
COPY CabirCRM.Client/CabirCRM.Client.csproj ./CabirCRM.Client/

# Restore
RUN dotnet restore CabirCRM.API/CabirCRM.API.csproj

# Kodu kopyala
COPY . .

# Publish (npm install ve npm run build .csproj'dan tetiklenir)
WORKDIR /src/CabirCRM.API
RUN dotnet publish -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
EXPOSE 5001
COPY --from=0 /app/publish .
ENTRYPOINT ["dotnet", "CabirCRM.API.dll"]