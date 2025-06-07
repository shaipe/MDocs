//! copyright © htui.tech 2025 - present
//!	clap子命令
//! created shaipe by 2025-06-07 11:38:06

use clap::Subcommand;

/// 应用命令
#[derive(Subcommand)]
pub enum AppCommand {
    /// 安装
    Install {
        /// 调试模式
        #[arg(short, long, default_value_t = false)]
        debug: bool,
    },
    /// 卸载
    Uninstall {
        /// 调试模式
        #[arg(short, long, default_value_t = false)]
        debug: bool,
    },
}
