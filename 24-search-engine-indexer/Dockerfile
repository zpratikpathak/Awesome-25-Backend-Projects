FROM golang:1.26-alpine AS test
WORKDIR /app
COPY . .
CMD ["go", "test", "-v", "./..."]
FROM test AS build
RUN CGO_ENABLED=0 go build -o /service .
FROM alpine:3.23
COPY --from=build /service /service
USER 65534:65534
EXPOSE 8024
ENTRYPOINT ["/service"]