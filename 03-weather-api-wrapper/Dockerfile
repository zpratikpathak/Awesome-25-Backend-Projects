FROM golang:1.26-bookworm
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY main.go main_test.go ./
COPY src ./src
RUN go build -o /app/weather . && go test -run '^$' ./...
ENV ENVIRONMENT=production GOPROXY=off GOTOOLCHAIN=local
EXPOSE 8080
CMD ["/app/weather"]