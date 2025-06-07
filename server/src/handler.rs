//! copyright © htui.tech 2025 - present
//! 请求事件处理
//! created shaipe by 2025-06-07 11:47:05

use std::{fs, path::Path};

use actix_web::{web, Error, HttpRequest, HttpResponse};

use crate::utils::{get_error, get_success};

/// api接口处理
pub async fn api_handler(req: HttpRequest, payload: web::Payload) -> Result<HttpResponse, Error> {
    // // 解析请求数据
    // let param = tube_web::parse_request(req.clone(), payload).await;

    // // 对日志进行特殊处理
    // if param.module.to_lowercase().as_str() == "logs" {
    //     return tube_web::logs::distribute_response(&req, &param).await;
    // }

    // 模块分发
    // match distribute(&param).await {
    //     Ok(s) => get_success(&s),
    //     Err(v) => get_error(v),
    // }

    println!("---- {}", req.path());

    let file_path = req.path().replace("/api/", "../documents/");
    let md_path = format!("{}.md", file_path);
    let md_index_path = format!("{}/index.md", file_path);

    println!("------ {}", file_path);

    if req.method() == "GET" {
        let md_p = Path::new(&md_path);
        let md_index_p = Path::new(&md_index_path);
        if md_p.exists() {
            return match fs::read_to_string(&md_path) {
                Ok(content) => Ok(HttpResponse::Ok().body(content)),
                Err(_) => Ok(HttpResponse::Ok().body("::hero File not found::")),
            };
        } else if md_index_p.exists() {
            return match fs::read_to_string(&md_index_path) {
                Ok(content) => Ok(HttpResponse::Ok().body(content)),
                Err(_) => Ok(HttpResponse::Ok().body("::hero File not found::")),
            };
        } else {
            return Ok(HttpResponse::Ok().body("::hero File not found::"));
        }
    }

    get_success(&json!({ "result": "success" }))
}
