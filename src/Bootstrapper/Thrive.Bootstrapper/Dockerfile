FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/Bootstrapper/Thrive.Bootstrapper/Thrive.Bootstrapper.csproj", "src/Bootstrapper/Thrive.Bootstrapper/"]
RUN dotnet restore "src/Bootstrapper/Thrive.Bootstrapper/Thrive.Bootstrapper.csproj"
COPY . .
WORKDIR "/src/src/Bootstrapper/Thrive.Bootstrapper"
RUN dotnet build "Thrive.Bootstrapper.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Thrive.Bootstrapper.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Thrive.Bootstrapper.dll"]
