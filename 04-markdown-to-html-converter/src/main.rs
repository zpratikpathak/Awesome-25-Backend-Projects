use axum::{
    routing::post,
    Json, Router,
};
use pulldown_cmark::{html, Parser};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct MarkdownRequest {
    markdown: String,
}

#[derive(Serialize)]
struct HtmlResponse {
    html: String,
}

async fn convert_markdown(Json(payload): Json<MarkdownRequest>) -> Json<HtmlResponse> {
    let parser = Parser::new(&payload.markdown);
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);

    Json(HtmlResponse { html: html_output })
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/api/convert", post(convert_markdown));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    println!("Markdown to HTML Converter listening on 127.0.0.1:3000");
    axum::serve(listener, app).await.unwrap();
}
