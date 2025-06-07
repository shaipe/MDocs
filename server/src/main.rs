//! copyright © htui.tech 2025 - present
//!
//! created shaipe by 2025-06-07 11:38:06

use actix_web::{get, middleware, web, App, HttpResponse, HttpServer, Responder};
use clap::Parser;
use command::AppCommand;
use std::fs;

use crate::handler::api_handler;

mod command;
mod handler;
mod utils;

#[macro_use]
extern crate serde_json;

// 默认的配置文件路径
const DEF_CONFIG_PATH: &'static str = "conf/docs.yml";

/// 主命令行界面结构体
#[derive(Parser)]
#[command(name = "docs")]
#[command(version = "0.1.0")]
#[command(about = "markdown docs服务", long_about = None)]
struct Args {
    /// 子命令
    #[command(subcommand)]
    command: Option<AppCommand>,

    /// 配置文件路径
    #[arg(short, long, default_value = DEF_CONFIG_PATH)]
    config: String,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let arg = Args::parse();

    // 处理命令行参数
    if let Some(cmd) = arg.command {
        match cmd {
            AppCommand::Install { debug: _ } => {
                println!("start install ...");
                // 安装注册服务
                // match tube::cmd::Service::auto_install(DEF_CONFIG_PATH) {
                //     Ok(_) => {
                //         println!("install service success");
                //     }
                //     Err(err) => {
                //         println!("install service failed {err}");
                //     }
                // }
                return Ok(());
            }
            AppCommand::Uninstall { debug: _ } => {
                println!("start uninstall ...");
                // match tube::cmd::Service::auto_uninstall() {
                //     Ok(_) => {
                //         println!("uninstall service success");
                //     }
                //     Err(err) => {
                //         println!("uninstall service failed {err}");
                //     }
                // }
                return Ok(());
            }
        }
    }

    // 加载配置文件
    let conf_path = utils::get_abs_path(&arg.config);

    // 启动web服务
    start_web_server(&conf_path).await
}

/// web服务启动
async fn start_web_server(conf_path: &str) -> std::io::Result<()> {
    // // 加载配置信息
    // let conf = match Config::load_yaml(conf_path) {
    //     Ok(conf) => conf,
    //     Err(err) => {
    //         println!("load config failed: {err}");
    //         Config::default()
    //     }
    // };

    // // 将配置信息写入缓存
    // Config::set(conf.clone());

    // // 初始化日志输出
    // initialize_logging("");

    let mut tmp_ip = "0.0.0.0".to_string();
    // 获取本机ip地址
    // if let Some(ip_addr) = utils::get_ip_addr() {
    //     tmp_ip = ip_addr;
    // }

    // 设置服务器运行ip和端口信息
    let ip = format!("{}:{}", tmp_ip, 8080);
    // let default_static_path = Path::new(&format!("{}/index.html", conf.web.static_dir));

    println!("start {ip}");

    // 启动一个web服务
    HttpServer::new(move || {
        App::new()
            .wrap(middleware::Logger::default())
            .wrap(
                // 设置允许跨域请求
                actix_cors::Cors::default()
                    .allow_any_origin()
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                    .max_age(3600),
            )
            .app_data(web::PayloadConfig::new(5242880))
            // 基础接口
            .service(
                web::scope("api")
                    .service(web::resource("/{cls}").route(web::to(api_handler))) // /xxx 路径的处理
                    .service(
                        web::resource("/{cls}/{tail:.*}").route(web::to(api_handler)), // /xxx/yyy/... 的路径处理
                    ),
            )
    })
    .bind(ip)?
    .run()
    .await
}
