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
         UPGRADE_CLOUD_CONTROLLER: {
            WIDGET_TITLE: "更新云控制系统面板",
            TASK_BTN_TEXT: "云系统更新"
         },
         UPGRADE_UPGRADEMGR_MASTER: {
            WIDGET_TITLE: "更新UpgradeMgr主系统",
            TASK_BTN_TEXT: "UpgradeMgr主系统更新"
         },
         UPGRADE_UPGRADEMGR_SLAVE: {
            WIDGET_TITLE: "更新UpgradeMgr从系统",
            TASK_BTN_TEXT: "UpgradeMgr从系统更新"
         },
         SERVER_MGR: {
            WIDGET_TITLE: "服务器信息管理面板",
            TASK_BTN_TEXT: "服务器信息管理"
         },
         UPGRADE_META_SERVER: {
            WIDGET_TITLE: "更新MetaServer主系统",
            TASK_BTN_TEXT: "MetaServer主系统更新"
         },
         UPGRADE_LUOXI: {
            WIDGET_TITLE: "更新LuoXi从系统",
            TASK_BTN_TEXT: "LuoXi从系统更新"
         }
      },
      WIDGET_NAMES: {
         WALL_PAPER: "桌面壁纸设置",
         META_INFO: "元信息设置",
         VERSION_INFO: "版本信息",
         SYS_UPGRADE: "系统更新",
         UPGRADE_META_INFO: "升级元信息管理",
         UPGRADE_CC: "升级云控制系统",
         UPGRADE_UPGRADEMGR_MASTER: "更新主系统升级",
         UPGRADE_UPGRADEMGR_SLAVE: "更新从系统升级",
         SERVER_MGR: "服务器信息管理",
         UPGRADE_METASERVER : "更新运维主系统",
         UPGRADE_LUOXI : "更新运维从系统"
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
         BTN: {
            SAVE: "保存服务元信息",
            ADD_NEW_ITEM: "添加服务器信息"
         },
         LABEL: {
            KEY: "识别KEY",
            NAME: "服务名称",
            IP: "服务器地址",
            PORT: "服务器端口"
         },
         META_INFO_WIN_TITLE: "服务器元信息配置窗口"
      },
      UPGRADE_CLOUD_CONTROLLER: {
         BTN: {
            START: "开始更新系统",
            RANGE: "设置升级范围"
         },
         LABEL: {
            FROM: "起始版本",
            TO: "目标版本"
         },
         COLS: {
            MSG: "升级信息"
         },
         MSG: {
            RANGE_TEXT: "当前升级范围 {0} - {1}",
            RANGE_INFO_WIN_TITLE: "升级范围设置窗口"
         }
      },
      UPGRADE_UPGRADEMGR_MASTER: {
         BTN: {
            START: "开始更新系统",
            TARGET: "设置升级版本"
         },
         COLS: {
            MSG: "升级信息"
         },
         LABEL: {
            VERSION: "目标版本号"
         },
         MSG: {
            TARGET_VERSION_WIN_TITLE: "目标升级版本设置窗口",
            TARGET_VERSION_TEXT: "目标升级版本: {0}"
         }
      },
      SERVER_MGR: {
         SERVER_INFO_WIN_TITLE: "服务器信息添加/修改窗口",
         COLS: {
            ID: "ID",
            IP: "服务器地址",
            TYPE: "类型",
            DESCRIPTION: "描述"
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
      UPGRADE_UPGRADEMGR_SLAVE: {
         COLS: {
            ID: "ID",
            IP: "服务器地址",
            TYPE: "类型",
            DESCRIPTION: "描述"
         },
         MSG: {
            VERSION_TITLE: "目标升级版本号输入窗口",
            VERSION: "目标版本"
         },
         MENU: {
            UPGRADE: "升级服务器"
         }
      },
      UPGRADE_META_SERVER: {
         BTN: {
            START: "开始更新系统",
            TARGET: "设置升级版本"
         },
         COLS: {
            MSG: "升级信息"
         },
         LABEL: {
            VERSION: "目标版本号"
         },
         MSG: {
            TARGET_VERSION_WIN_TITLE: "目标升级版本设置窗口",
            TARGET_VERSION_TEXT: "目标升级版本: {0}"
         }
      },
      UPGRADE_LUOXI: {
         COLS: {
            ID: "ID",
            IP: "服务器地址",
            TYPE: "类型",
            DESCRIPTION: "描述"
         },
         MSG: {
            VERSION_TITLE: "目标升级版本号输入窗口",
            VERSION: "目标版本"
         },
         MENU: {
            UPGRADE: "升级服务器"
         }
      },
      
      COMP: {
         SERVER_INFO_EDITOR_WIN: {
            LABEL: {
               TYPE: "服务器类型",
               IP: "服务器IP",
               DESCRIPTION: "描述"
            },
            SERVER_TYPES: [
               {name: "主控服务器", value: 1},
               {name: "站点部署服务器", value: 2},
               {name: "消息队列服务器", value: 3},
               {name: "数据库服务器", value: 4},
               {name: "备份服务器", value: 5}
            ]
         },
         UPGRADE_UPGRADEMGR_SLAVE_PROGRESS_WIN: {
            COLS: {
               MSG: "升级信息"
            },
            TITLE : "升级进度显示窗口",
            MSG : {
               UPGRADE_TPL : "目标升级版本:{0}"
            }
         },
         OPERATE_PROGRESS_WIN : {
            TITLE : "操作进度显示窗口",
            COLS : {
               MSG : "日志信息"
            }
         }
      }
   }
});