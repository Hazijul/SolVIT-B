# Use Golang base image to build the app
FROM golang:1.24 AS builder

ENV GOARCH=amd64
ENV GOOS=linux
# Set the working directory in the container
WORKDIR /app

# Copy all Go files into the container
COPY . .

# Download dependencies and build the binary
RUN go mod tidy && go build -o auth-service .

# Create the final image and copy only the binary
FROM debian:bullseye-slim

# Set working directory for the final image
WORKDIR /app

# Copy the built binary from the builder image
COPY --from=builder /app/auth-service .

RUN apt-get update && apt-get install -y ca-certificates


# Expose the port the app will listen on
EXPOSE 8001

# Command to run the auth-service directly
CMD ["./auth-service"]