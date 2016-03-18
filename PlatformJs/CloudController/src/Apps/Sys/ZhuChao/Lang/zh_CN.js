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
         PACKAGE_REPO : {
            WIDGET_TITLE: "欢迎使用软件库管理应用",
            TASK_BTN_TEXT: "软件库管理"
         },
         NEW_DEPLOY : {
            WIDGET_TITLE: "欢迎使用凤凰筑巢全新部署管理应用",
            TASK_BTN_TEXT: "全新部署"
         }
      },
      WIDGET_NAMES: {
         SERVER_MGR : "服务器管理",
         PACKAGE_REPO : "程序包管理",
         NEW_DEPLOY : "全新部署",
         UPGRADE : "升级部署"
      },
      PACKAGE_REPO : {
         
      },
      NEW_DEPLOY : {
         BTN: {
            START: "开始部署系统",
            TARGET: "设置目标部署版本",
            WITHOUT_DB : "不包含数据库"
         },
         COLS: {
            MSG: "操作信息"
         },
         LABEL: {
            VERSION: "目标版本号"
         },
         MSG: {
            TARGET_VERSION_WIN_TITLE: "目标部署版本设置窗口",
            TARGET_VERSION_TEXT: "目标部署版本: {0}"
         }
      }
   }
});