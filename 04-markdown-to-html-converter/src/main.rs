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
