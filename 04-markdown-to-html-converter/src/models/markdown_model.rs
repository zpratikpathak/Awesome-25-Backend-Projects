use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct ConvertRequest {
    pub markdown: String,
}

#[derive(Debug, Serialize)]
pub struct ConvertResponse {
    pub html: String,
}

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub error: String,
}
