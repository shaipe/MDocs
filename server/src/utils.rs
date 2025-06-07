//! copyright © htui.tech 2025 - present
//! 处理一些工具函数
//! created shaipe by 2025-06-07 11:44:48

use std::{net::UdpSocket, str::FromStr};

use actix_web::{Error, HttpResponse};
use awc::http::StatusCode;
use serde_json::Value;

/// 根据相对路径获取绝对路径,在release模式下根据应用目录进行匹配
/// debug模式下使用相对路径
pub fn get_abs_path(rel_path: &str) -> String {
    let mut temp_path = rel_path.to_owned();
    // 只有非调试模式下才使用下面的配置
    if !cfg!(debug_assertions) {
        // 给定了相对顶层路径时不处理
        if !rel_path.starts_with("/") {
            if let Ok(p) = std::env::current_exe() {
                let work_dir = format!("{}", p.parent().unwrap().display());
                temp_path = format!("{}/{}", &work_dir, rel_path.replace("./", ""));
            }
        }
    }
    temp_path
}

/// get the local ip address, return an `Option<String>`. when it fail, return `None`.
pub fn get_ip_addr() -> Option<String> {
    let socket = match UdpSocket::bind("0.0.0.0:0") {
        Ok(s) => s,
        Err(_) => return None,
    };

    match socket.connect("8.8.8.8:80") {
        Ok(()) => (),
        Err(_) => return None,
    };

    match socket.local_addr() {
        Ok(addr) => Some(addr.ip().to_string()),
        Err(_) => None,
    }
}

/// 成功返回
pub fn get_success(content: &Value) -> Result<HttpResponse, Error> {
    // log!("content {content:?}");
    let cnt = match content {
        Value::String(v) => {
            // 处理数组
            // if v.starts_with("[") && v.ends_with("]") && is_valid_json(v) {
            //     // 再加一层判断，是否为正确的json格式
            //     format!("{}", v.replace("\"", ""))
            // }
            // // 处理大对象
            // else if v.starts_with("{") && v.ends_with("}") && is_valid_json(v) {
            // 	// log!("content {v:?}");
            //     format!("{}", v)
            // } else {
            //     format!("{v:?}")
            // }

            match Value::from_str(v) {
                Ok(vv) => format!("{}", vv),
                Err(_) => format!("{:?}", v),
            }
        }

        _ => content.to_string(),
    };
    // let cnt = content.to_string();

    let str_val = format!(
        r#"{{
        "code": 200,
        "result": {},
        "message": ""
    }}"#,
        cnt.replace("\\\'", "\'") // replace 是为了解决html文本中有单引号（\'）时导致json格式不正确的问题
    );

    // log!("response res {}", str_val);

    Ok(HttpResponse::build(StatusCode::OK)
        .content_type("application/json; charset=utf-8")
        .body(str_val))
}

/// 根据统一错误信息获取HttpResponse
pub fn get_error(err: Error) -> Result<HttpResponse, Error> {
    let str_val = json!({
        "code": 40001,
        "result": "{}" ,
        "message": err.to_string(),
    })
    .to_string();
    // println!("{str_val}");
    Ok(HttpResponse::build(StatusCode::OK)
        .content_type("application/json; charset=utf-8")
        .body(str_val))
}
