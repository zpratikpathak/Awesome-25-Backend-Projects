use axum::{extract::DefaultBodyLimit, routing::post, Router};
use crate::controllers::markdown_controller::convert_markdown;

pub fn create_routes() -> Router {
    Router::new().route("/api/v1/convert", post(convert_markdown)).layer(DefaultBodyLimit::max(64 * 1024))
}
