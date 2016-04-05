/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.ZhuChao.Lang.zh_CN", {
   extend: "Cntysoft.Kernel.AbstractLangHelper",
   data: {
      PM_TEXT: {
         DISPLAY_TEXT: "凤凰筑巢运维",
         ENTRY: {
            WIDGET_TITLE: "欢迎使用凤凰筑巢运维应用",
            TASK_BTN_TEXT: "凤凰筑巢运维"
         },
         PACKAGE_REPO: {
            WIDGET_TITLE: "欢迎使用软件库管理应用",
            TASK_BTN_TEXT: "软件库管理"
         },
         NEW_DEPLOY: {
            WIDGET_TITLE: "欢迎使用凤凰筑巢全新部署管理应用",
            TASK_BTN_TEXT: "全新部署"
         },
         UPGRADE_DEPLOY: {
            WIDGET_TITLE: "欢迎使用凤凰筑巢升级部署管理应用",
            TASK_BTN_TEXT: "升级部署"
         },
         DB_BACKUP: {
            WIDGET_TITLE: "欢迎使用凤凰筑巢数据库备份应用程序",
            TASK_BTN_TEXT: "数据库备份"
         },
         BACKUP_REPO: {
            WIDGET_TITLE: "欢迎使用凤凰筑巢数据库备份文件管理应用程序",
            TASK_BTN_TEXT: "数据库备份文件管理"
         },
         SHOP_DB_UPGRADER: {
            WIDGET_TITLE: "欢迎使用凤凰筑巢商家数据库升级应用程序",
            TASK_BTN_TEXT: "商家数据库升级"
         }
      },
      WIDGET_NAMES: {
         SERVER_MGR: "服务器管理",
         PACKAGE_REPO: "程序包管理",
         NEW_DEPLOY: "全新部署",
         UPGRADE: "升级部署",
         DB_BACKUP: "数据库备份",
         BACKUP_REPO: "备份文件浏览",
         SHOP_DB_UPGRADER: "商家数据库升级"
      },
      NEW_DEPLOY: {
         BTN: {
            START: "开始部署系统",
            TARGET: "设置部署元信息",
            WITHOUT_DB: "不包含数据库"
         },
         COLS: {
            MSG: "操作信息"
         },
         LABEL: {
            VERSION: "目标版本号",
            SERVER_ADDRESS: "目标部署服务器"
         },
         MSG: {
            TARGET_VERSION_WIN_TITLE: "目标部署版本设置窗口",
            TARGET_VERSION_TEXT: "目标部署服务器 : {0} ,部署版本: {1}"
         }
      },
      UPGRADE_DEPLOY: {
         BTN: {
            START: "开始升级系统",
            TARGET: "设置升级元信息",
            FORCE: "强制升级",
            NO_UPGRADE_SCRIPT: "不运行升级脚本"
         },
         COLS: {
            MSG: "操作信息"
         },
         LABEL: {
            FROM_VERSION: "起始版本号",
            TO_VERSION: "目标版本号",
            SERVER_ADDRESS: "目标部署服务器"
         },
         MSG: {
            TARGET_VERSION_WIN_TITLE: "目标升级版本设置窗口",
            TARGET_VERSION_TEXT: "目标部署服务器 : {0} ,版本范围 : {1} -> {2}"
         }
      },
      DB_BACKUP: {
         BTN: {
            START_BACKUP: "开始备份数据库",
            SERVER_ADDRESS: "部署服务器地址"
         }
      },
      SHOP_DB_UPGRADER: {
         BTN: {
            START_UPGRADE: "开始升级数据库",
            SERVER_ADDRESS: "部署服务器地址",
            FORCE_DOWNLOAD_PACKAGE: "强制下载升级包",
            SET_META: "设置升级元信息"
         },
         MSG: {
            TARGET_VERSION_WIN_TITLE: "目标升级版本设置窗口",
            TARGET_VERSION_TEXT: "目标升级服务器 : {0} ,版本范围 : {1} -> {2}"
         },
         LABEL: {
            FROM_VERSION: "起始版本号",
            TO_VERSION: "目标版本号",
            SERVER_ADDRESS: "目标部署服务器"
         },
      },
      COMP: {
         OPERATE_PROGRESS: {
            COLS: {
               MSG: "日志信息"
            }
         }
      }
   }
});