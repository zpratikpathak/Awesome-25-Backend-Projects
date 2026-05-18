FROM rust:1-slim-trixie
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
# ponytail: stale source lock reconciled in image; refresh source lock before requiring --locked builds.
RUN cargo build --release && cargo test --no-run
EXPOSE 3000
CMD ["/app/target/release/markdown-converter"]