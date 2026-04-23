use axum::{http::StatusCode, Json};
use crate::models::markdown_model::{ConvertRequest, ConvertResponse, ErrorResponse};
use crate::services::markdown_service::convert_to_html;
use tracing::{info, error};

pub async fn convert_markdown(
    Json(payload): Json<ConvertRequest>,
) -> Result<Json<ConvertResponse>, (StatusCode, Json<ErrorResponse>)> {
    if payload.markdown.trim().is_empty() {
        error!("Empty markdown payload received");
        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                error: "Markdown content cannot be empty".to_string(),
            }),
        ));
    }

    info!("Converting markdown of length: {}", payload.markdown.len());
    let html = convert_to_html(&payload.markdown);

    Ok(Json(ConvertResponse { html }))
}
