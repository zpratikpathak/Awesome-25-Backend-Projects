FROM golang:1.26-trixie@sha256:74b756a8621f299bc587991ac19d1f26aa415006eb23c50132c467c29f8f5a25
WORKDIR /app
COPY go.mod main.go smoke_test.go ./
COPY controllers ./controllers
COPY models ./models
COPY routes ./routes
COPY services ./services
RUN go build -o /app/polling .
USER 10001
ENV GOCACHE=/tmp/go-cache
EXPOSE 8080
CMD ["/app/polling"]