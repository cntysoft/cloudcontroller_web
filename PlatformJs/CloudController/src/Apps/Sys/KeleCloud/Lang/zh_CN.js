/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.KeleCloud.Lang.zh_CN", {
   extend: "Cntysoft.Kernel.AbstractLangHelper",
   data: {
      PM_TEXT: {
         DISPLAY_TEXT: "可乐云商管理平台",
         ENTRY: {
            WIDGET_TITLE: "欢迎使用可乐云商管理平台",
            TASK_BTN_TEXT: "可乐云商"
         },
         SERVER_MGR: {
            WIDGET_TITLE: "欢迎使用服务器信息管理程序",
            TASK_BTN_TEXT: "服务器管理"
         },
         VERSION_MGR: {
            WIDGET_TITLE: "欢迎使用服务器版本信息管理程序",
            TASK_BTN_TEXT: "版本信息管理"
         },
         SITE_MGR : {
            WIDGET_TITLE: "欢迎使用站点管理程序",
            TASK_BTN_TEXT: "站点管理"
         }
      },
      WIDGET_NAMES: {
         SERVER_MGR: "服务器信息管理",
         VERSION_MGR: "版本管理",
         SITE_MGR: "站点管理"
      },
      SERVER_MGR: {
         SERVER_INFO_WIN_TITLE: "服务器信息添加/修改窗口",
         COLS: {
            ID: "ID",
            IP: "服务器地址",
            NAME: "服务器名称",
            INSTANCE_COUNT: "实例数量"
         },
         MENU: {
            DELETE_ITEM: "删除当前服务器信息",
            MODIFY_ITEM: "修改服务器信息"
         },
         MSG: {
            DELETE_ASK: "确定要删除该服务器吗？"
         },
         BTN: {
            ADD_NEW_ITEM: "添加服务器"
         }
      },
      VERSION_MGR: {
         BTN: {
            ADD_NEW_ITEM: "添加版本升级信息"
         },
         COLS: {
            ID: "ID",
            FROM_VERSION: "起始版本",
            TO_VERSION: "目标版本",
            DESCRIPTION: "版本描述",
            RELEASE_TIME: "发布时间"
         },
         MENU: {
            DELETE_ITEM: "删除当前版本信息",
            MODIFY_ITEM: "修改版本信息"
         },
         MSG : {
            DELETE_ASK : "确定要删除该版本号吗？"
         }
      },
      SITE_MGR : {
         SITE_INSTANCE : {
            TITLE : "站点实例管理",
            COLS : {
               ID : "ID",
               NAME : "实例名称",
               CREATE_TIME : "创建时间"
            }
         },
         META_INFO : {
            TITLE : "元信息设置",
            FIELD_LABLES : {
               CURRENT_VERSION : "当前版本号"
            }
         }
      },
      COMP: {
         SERVER_INFO_EDITOR_WIN: {
            LABEL: {
               NAME: "服务器名称",
               IP: "服务器IP"
            }
         },
         VERSION_INFO_EDITOR_WIN: {
            LABEL: {
               FROM_VERSION: "起始版本号",
               TO_VERSION: "目标版本号",
               DESCRIPTION: "简单描述"
            }
         },
         SITE_MGR : {
            SERVER_INFO_TREE : {
               ROOT_NODE : "服务器列表"
            }
         }
      }
   }
});