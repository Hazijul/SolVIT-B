# DUKAAN 

## Overview
### Link to original project -> https://github.com/adityjoshi/Dosahostel
This project is a comprehensive procurement and inventory management system designed to streamline order processing, vendor communication, and customer invoicing. It consists of the following three main components:

1. **Chatbot for Procurement and Tracking** – A WhatsApp chatbot that allows users to place orders, track orders, and automatically send email notifications to vendors.
2. **Web App for Inventory Management** – A web-based dashboard for managing inventory, tracking stock levels, and handling procurement orders efficiently.
3. **Invoice Generation & Customer Email Notifications** – Automated invoice generation for completed orders, with email notifications sent to customers.

## Features & Technologies Used

### 1. Chatbot for Procurement and Tracking

- Developed using **Twilio WhatsApp API** to handle order placement and tracking.
- Uses **Redis** for caching frequently accessed data, reducing response time.
- Automatically extracts vendor details and sends email notifications using **SMTP**.
- Secure authentication using **OTP + JWT**.
- Kafka-based event-driven architecture for order processing.

### 2. Web App for Inventory Management

- Built using a **sharded database** architecture across 4 regions for optimized performance.
- Supports real-time inventory tracking and procurement requests.
- Containerized using **Docker** for seamless deployment and scalability.
- Kafka integration for efficient stock updates and event-driven operations.

### 3. Invoice Generation & Customer Email Notifications

- Generates invoices automatically upon order completion.
- Sends invoice details to customers via email.
- Kafka-based event handling ensures reliability in processing and sending invoices.
- Uses **Redis** for caching order details and reducing load on the primary database.

## Deployment & Setup

### Prerequisites

- Docker installed
- Kafka cluster setup
- Redis for caching
- PostgreSQL (sharded across 4 regions)
- Twilio account for chatbot functionality

### Running the System

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/procurement-chatbot.git
   cd procurement-chatbot
   ```
2. Set up environment variables for authentication (Twilio, email, database, etc.).
3. Start Docker containers:
   ```bash
   docker-compose up --build
   ```
4. Ensure Kafka brokers and Redis are running properly.
5. Access the chatbot via WhatsApp and the web app via your browser.

## Future Enhancements

- AI-powered insights for inventory demand forecasting.
- Multi-vendor marketplace integration.
- Support for additional messaging platforms (Telegram, Slack, etc.).

This system is providing a powerful and scalable solution for procurement, inventory management, and invoicing, leveraging cutting-edge technologies to ensure efficiency and reliability



```

Sample Logs 

[+] Building 94.9s (16/16) FINISHED                                                                                                                 docker:desktop-linux 
 => [auth-service internal] load build definition from Dockerfile                                                                                                   0.0s 
 => => transferring dockerfile: 683B                                                                                                                                0.0s 
 => [auth-service internal] load metadata for docker.io/library/golang:1.24                                                                                         1.9s 
 => [auth-service internal] load metadata for docker.io/library/debian:bullseye-slim                                                                                1.9s 
 => [auth-service auth] library/debian:pull token for registry-1.docker.io                                                                                          0.0s
 => [auth-service auth] library/golang:pull token for registry-1.docker.io                                                                                          0.0s 
 => [auth-service internal] load .dockerignore                                                                                                                      0.0s
 => => transferring context: 2B                                                                                                                                     0.0s 
 => [auth-service builder 1/4] FROM docker.io/library/golang:1.24@sha256:52ff1b35ff8de185bf9fd26c70077190cd0bed1e9f16a2d498ce907e5c421268                           0.0s
 => [auth-service internal] load build context                                                                                                                      0.1s 
 => => transferring context: 43.50kB                                                                                                                                0.0s
 => [auth-service stage-1 1/3] FROM docker.io/library/debian:bullseye-slim@sha256:e4b93db6aad977a95aa103917f3de8a2b16ead91cf255c3ccdb300c5d20f3015                  0.0s 
 => CACHED [auth-service builder 2/4] WORKDIR /app                                                                                                                  0.0s
 => [auth-service builder 3/4] COPY . .                                                                                                                             0.1s 
 => [auth-service builder 4/4] RUN go mod tidy && go build -o auth-service .                                                                                       92.4s 
 => CACHED [auth-service stage-1 2/3] WORKDIR /app                                                                                                                  0.0s 
 => [auth-service stage-1 3/3] COPY --from=builder /app/auth-service .                                                                                              0.1s 
 => [auth-service] exporting to image                                                                                                                               0.1s 
 => => exporting layers                                                                                                                                             0.0s 
 => => writing image sha256:94fa312ce6f015fbd0c52f84a8a7ae90a4d6d6c266e93457f880bc085b84b7f5                                                                        0.0s
[+] Running 4/4o docker.io/library/hostel-hack-auth-service                                                                                                         0.0s
 ✔ Service auth-service                 Built                                                                                                                      95.1s 
 ✔ Container hostel-hack-boys_one-db-1  Created                                                                                                                     0.0s 
 ✔ Container hostel-hack-big_boys-db-1  Created                                                                                                                     0.0s 
 ✔ Container go-app                     Recreated                                                                                                                   0.1s 
Attaching to go-app, big_boys-db-1, boys_one-db-1
big_boys-db-1  | 
big_boys-db-1  | PostgreSQL Database directory appears to contain a database; Skipping initialization
boys_one-db-1  | 
big_boys-db-1  | 
boys_one-db-1  | PostgreSQL Database directory appears to contain a database; Skipping initialization
boys_one-db-1  | 
big_boys-db-1  | 2025-03-21 06:27:22.232 UTC [1] LOG:  starting PostgreSQL 17.4 (Debian 17.4-1.pgdg120+2) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit
boys_one-db-1  | 2025-03-21 06:27:22.232 UTC [1] LOG:  starting PostgreSQL 17.4 (Debian 17.4-1.pgdg120+2) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit
boys_one-db-1  | 2025-03-21 06:27:22.232 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
big_boys-db-1  | 2025-03-21 06:27:22.232 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
boys_one-db-1  | 2025-03-21 06:27:22.232 UTC [1] LOG:  listening on IPv6 address "::", port 5432
big_boys-db-1  | 2025-03-21 06:27:22.233 UTC [1] LOG:  listening on IPv6 address "::", port 5432
big_boys-db-1  | 2025-03-21 06:27:22.239 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
boys_one-db-1  | 2025-03-21 06:27:22.239 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
big_boys-db-1  | 2025-03-21 06:27:22.246 UTC [29] LOG:  database system was shut down at 2025-03-21 06:25:35 UTC
boys_one-db-1  | 2025-03-21 06:27:22.247 UTC [29] LOG:  database system was shut down at 2025-03-21 06:25:35 UTC
big_boys-db-1  | 2025-03-21 06:27:22.256 UTC [1] LOG:  database system is ready to accept connections
boys_one-db-1  | 2025-03-21 06:27:22.258 UTC [1] LOG:  database system is ready to accept connections
go-app         | Big Boys and Boys One Database connections successful
go-app         | Big Boys Database migrations completed successfully
go-app         | Boys One Database migrations completed successfully
go-app         | jai shree ram 
go-app         | [GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.
go-app         | 
go-app         | [GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
go-app         |  - using env:  export GIN_MODE=release
go-app         |  - using code: gin.SetMode(gin.ReleaseMode)
go-app         | 
go-app         | [GIN-debug] POST   /student/register         --> github.com/adityjoshi/Dosahostel/controllers.StudentRegistration (3 handlers)
go-app         | [GIN-debug] GET    /student/login            --> github.com/adityjoshi/Dosahostel/controllers.StudentLogin (3 handlers)
go-app         | [GIN-debug] POST   /student/complaint        --> github.com/adityjoshi/Dosahostel/controllers.PostComplaint (4 handlers)
go-app         | [GIN-debug] GET    /PING                     --> main.main.func1 (3 handlers)
go-app         | 2025/03/21 06:27:22 Server is running at :8001...
go-app         | [GIN] 2025/03/21 - 06:28:01 | 200 |   33.917667ms |      172.22.0.1 | POST     "/student/complaint"
go-app exited with code 2
boys_one-db-1  | 2025-03-21 06:29:02.884 UTC [1] LOG:  received fast shutdown request
big_boys-db-1  | 2025-03-21 06:29:02.886 UTC [1] LOG:  received fast shutdown request
boys_one-db-1  | 2025-03-21 06:29:02.889 UTC [1] LOG:  aborting any active transactions
boys_one-db-1  | 2025-03-21 06:29:02.889 UTC [43] FATAL:  terminating connection due to administrator command
big_boys-db-1  | 2025-03-21 06:29:02.899 UTC [1] LOG:  aborting any active transactions
boys_one-db-1  | 2025-03-21 06:29:02.900 UTC [1] LOG:  background worker "logical replication launcher" (PID 32) exited with exit code 1
boys_one-db-1  | 2025-03-21 06:29:02.904 UTC [27] LOG:  shutting down
boys_one-db-1  | 2025-03-21 06:29:02.908 UTC [27] LOG:  checkpoint starting: shutdown immediate
big_boys-db-1  | 2025-03-21 06:29:02.908 UTC [1] LOG:  background worker "logical replication launcher" (PID 32) exited with exit code 1
big_boys-db-1  | 2025-03-21 06:29:02.908 UTC [27] LOG:  shutting down
big_boys-db-1  | 2025-03-21 06:29:02.911 UTC [27] LOG:  checkpoint starting: shutdown immediate
big_boys-db-1  | 2025-03-21 06:29:02.972 UTC [27] LOG:  checkpoint complete: wrote 3 buffers (0.0%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.022 s, sync=0.027 s, total=0.064 s; sync files=2, longest=0.025 s, average=0.014 s; distance=0 kB, estimate=0 kB; lsn=0/1989C78, redo lsn=0/1989C78
boys_one-db-1  | 2025-03-21 06:29:02.975 UTC [27] LOG:  checkpoint complete: wrote 8 buffers (0.0%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.025 s, sync=0.030 s, total=0.071 s; sync files=6, longest=0.028 s, average=0.005 s; distance=0 kB, estimate=0 kB; lsn=0/198A220, redo lsn=0/198A220
big_boys-db-1  | 2025-03-21 06:29:02.977 UTC [1] LOG:  database system is shut down
boys_one-db-1  | 2025-03-21 06:29:02.989 UTC [1] LOG:  database system is shut down
big_boys-db-1 exited with code 0
boys_one-db-1 exited with code 0
```
