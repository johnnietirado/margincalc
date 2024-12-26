# Use this script to start a docker container for a local development database

$DB_CONTAINER_NAME = "web-postgres"
$ENV_FILE_PATH = "./.env"

# Function to read .env file
function Get-EnvVariables($envFile) {
    $content = Get-Content $envFile -ErrorAction SilentlyContinue
    $envVars = @{}
    foreach ($line in $content) {
        if ($line -match '^([^=]+)=(.*)$') {
            $envVars[$matches[1]] = $matches[2].Trim('"')
        }
    }
    return $envVars
}

# Check if .env file exists
if (-not (Test-Path $ENV_FILE_PATH)) {
    Write-Host "Error: $ENV_FILE_PATH file not found. Please create this file with the necessary environment variables."
    exit 1
}

# Read .env file
$envVars = Get-EnvVariables $ENV_FILE_PATH

# Extract DATABASE_URL
$DATABASE_URL = $envVars["DATABASE_URL"]

if (-not $DATABASE_URL) {
    Write-Host "Error: DATABASE_URL not found in $ENV_FILE_PATH"
    exit 1
}

# Parse DATABASE_URL
if ($DATABASE_URL -match "postgresql://(?<user>.+):(?<password>.+)@(?<host>.+):(?<port>\d+)/(?<dbname>.+)") {
    $DB_USER = $matches['user']
    $DB_PASSWORD = $matches['password']
    $DB_HOST = $matches['host']
    $DB_PORT = $matches['port']
    $DB_NAME = $matches['dbname']
}
else {
    Write-Host "Error: Invalid DATABASE_URL format in $ENV_FILE_PATH"
    exit 1
}

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is not installed. Please install Docker and try again.`nDocker install guide: https://docs.docker.com/engine/install/"
    exit 1
}

# Check if the database container is already running
if (docker ps -q -f "name=$DB_CONTAINER_NAME") {
    Write-Host "Database container '$DB_CONTAINER_NAME' is already running"
    exit 0
}

# Check if the database container exists and start it
if (docker ps -q -a -f "name=$DB_CONTAINER_NAME") {
    docker start $DB_CONTAINER_NAME
    Write-Host "Existing database container '$DB_CONTAINER_NAME' started"
    exit 0
}

# Ensure POSTGRES_PASSWORD is not empty
if (-not $DB_PASSWORD) {
    Write-Host "Error: POSTGRES_PASSWORD is not set. Please check your DATABASE_URL."
    exit 1
}

# Create and start a new container
docker run -d `
    --name $DB_CONTAINER_NAME `
    -e POSTGRES_USER=$DB_USER `
    -e POSTGRES_PASSWORD=$DB_PASSWORD `
    -e POSTGRES_DB=$DB_NAME `
    -p "${DB_PORT}:5432" `
    postgres

Write-Host "Database container '$DB_CONTAINER_NAME' was successfully created and started"

# Wait for the container to be ready
Write-Host "Waiting for database to be ready..."
Start-Sleep -Seconds 5

# Output the container ID
$containerId = docker ps -q -f name=$DB_CONTAINER_NAME
Write-Host "Database container '$DB_CONTAINER_NAME' is running with ID: $containerId"