# Rate Limiter Middleware

A Go HTTP server with IP-based rate limiting middleware using \`golang.org/x/time/rate\`.

## Setup
\`\`\`bash
go mod tidy
go run main.go
\`\`\`

Test with \`curl http://localhost:8080/\` repeatedly.
