# SportSpace Reservation System

This project is a full-stack application for managing sports facility reservations, consisting of a Spring Boot backend and a React frontend.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. **Configure environment variables**:
   - Copy the example environment file:
     ```
     cp .env.example .env
     ```
   - Edit `.env` and fill in the required values:
     - `DB_USERNAME`: Your PostgreSQL username
     - `DB_PASSWORD`: Your PostgreSQL password
     - `JWT_SECRET`: A secret key for JWT tokens
     - `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`: Email configuration (optional)

2. **Start the application**:

   ```
   docker-compose up --build
   ```

   This will:
   - Start a PostgreSQL database on port 5432
   - Build and start the Spring Boot backend on port 8080
   - Build and start the React frontend on port 5173

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

## Stopping the Application

To stop the application:

```
docker-compose down
```

To stop and remove volumes (including database data):

```
docker-compose down -v
```
