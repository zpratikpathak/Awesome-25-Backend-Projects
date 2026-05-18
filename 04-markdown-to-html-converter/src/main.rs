mod controllers;
mod models;
mod routes;
mod services;
mod utils;

use axum::Router;
use dotenvy::dotenv;
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;
use tracing::info;

#[tokio::main]
async fn main() {
    // Load environment variables
    dotenv().ok();

    // Initialize structured logging
    utils::logger::init_logger();

    // App Router with Middleware
    let app = Router::new()
        .merge(routes::markdown_routes::create_routes())
        .layer(TraceLayer::new_for_http());

    // Bind and Serve
    let port = std::env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr: SocketAddr = format!("0.0.0.0:{}", port).parse().unwrap();
    
    info!("Server listening on {}", addr);
    
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

#[cfg(test)]
mod smoke {
    use super::*;
    use axum::{body::Body, http::{Request, StatusCode}};
    use tower::ServiceExt;

    #[tokio::test]
    async fn conversion_and_validation() {
        let html = services::markdown_service::convert_to_html("# Hello\n\n<script>alert(1)</script>\n\n[x](javascript:alert%281%29)");
        assert!(html.contains("<h1>Hello</h1>"));
        assert!(!html.contains("<script"));
        assert!(!html.contains("javascript:"));
        let app = routes::markdown_routes::create_routes();
        for (body, expected) in [
            (r##"{"markdown":"# Hello"}"##.to_string(), StatusCode::OK),
            (r#"{"markdown":"  "}"#.to_string(), StatusCode::BAD_REQUEST),
            (r#"{"markdown":7}"#.to_string(), StatusCode::UNPROCESSABLE_ENTITY),
            ("{".to_string(), StatusCode::BAD_REQUEST),
            (format!(r#"{{"markdown":"{}"}}"#, "x".repeat(65536)), StatusCode::PAYLOAD_TOO_LARGE),
        ] {
            let response = app.clone().oneshot(Request::post("/api/v1/convert")
                .header("content-type", "application/json").body(Body::from(body)).unwrap()).await.unwrap();
            assert_eq!(response.status(), expected);
        }
    }
}
