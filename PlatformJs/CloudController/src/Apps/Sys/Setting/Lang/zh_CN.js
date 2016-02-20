/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.Setting.Lang.zh_CN", {
   extend: "Cntysoft.Kernel.AbstractLangHelper",
   data: {
      PM_TEXT: {
         DISPLAY_TEXT: "系统设置",
         ENTRY: {
            WIDGET_TITLE: "欢迎使用系统设置中心",
            TASK_BTN_TEXT: "系统设置"
         },
         META_INFO: {
            WIDGET_TITLE: "欢迎使用系统元信息设置程序",
            TASK_BTN_TEXT: "元信息设置"
         },
         VERSION_INFO: {
            WIDGET_TITLE: "可乐云商云控制系统版本号显示面板",
            TASK_BTN_TEXT: "系统版本信息"
         },
         UPGRADE_META_INFO: {
            WIDGET_TITLE: "系统环境服务器元信息配置",
            TASK_BTN_TEXT: "服务元信息配置"
         },
         UPGRADE_CLOUD_CONTROLLER : {
            WIDGET_TITLE: "更新云控制系统面板",
            TASK_BTN_TEXT: "云系统更新"
         }
      },
      WIDGET_NAMES: {
         WALL_PAPER: "桌面壁纸设置",
         META_INFO: "元信息设置",
         VERSION_INFO: "版本信息",
         SYS_UPGRADE: "系统更新",
         UPGRADE_META_INFO: "升级元信息管理",
         UPGRADE_CC : "升级云控制系统"
      },
      META_INFO: {
         BTN: {
            GENERATE_SITE_KEY_MAP: "生成站点ID映射"
         }
      },
      SYS_NAMES: {
         CLOUD_CONTROLLER: "云控制中心WEB系统",
         META_SERVER: "元信息服务器",
         UPGRADEMGR_MASTER: "更新服务器master系统"
      },
      VERSION_INFO: {
         COLS: {
            NAME: "系统名称",
            VERSION: "版本号"
         },
         MSG: {
            QUERY: "正在查询中 ... "
         }
      },
      UPGRADE_META_INFO: {
         COLS: {
            NAME: "服务名称",
            IP: "服务器地址",
            PORT: "端口号"
         },
         BTN : {
            SAVE : "保存服务元信息",
            ADD_NEW_ITEM : "添加服务器信息"
         },
         LABEL : {
            KEY : "识别KEY",
            NAME : "服务名称",
            IP : "服务器地址",
            PORT : "服务器端口"
         },
         META_INFO_WIN_TITLE : "服务器元信息配置窗口"
      },
      UPGRADE_CLOUD_CONTROLLER: {
         BTN : {
            START : "开始更新系统"
         }
      }
   }
});