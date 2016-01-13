/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.AppInstaller.Lang.zh_CN', {
   extend : 'Cntysoft.Kernel.AbstractLangHelper',
   data : {
      PM_TEXT : {
         DISPLAY_TEXT : '应用商城应用',
         ENTRY : {
            WIDGET_TITLE : '欢迎使用栏目管理程序',
            TASK_BTN_TEXT : '栏目管理程序'
         },
         PERM_RES_MGR : {
            WIDGET_TITLE : '权限资源管理程序',
            TASK_BTN_TEXT : '权限资源管理'
         }
      },
      WIDGET_NAMES : {
         PERM_RES_MGR : '权限资源挂载'
      },
      COMP : {
         MODULE_COMBO: {
            EMPTY_TEXT: '选择模块'
         }
      },
      PERM_RES_MGR : {
         TITLE : '站点权限资源挂载面板',
         BTN : {
            SAVE : '保存修改',
            CLEAR_QUEUE : '清除任务队列'
         },
         PROCESS_MSG : '正在处理 APP : <span style = "color:blue">{0}</span> 请稍后 ... '
      },
      UI : {
         PERM_RES_MGR : {
            RES_MOUNT_VIEW : {
               TITLE : '站点当前挂载情况列表',
               MOUNTED : '已挂载',
               UNMOUNTED : '未挂载',
               L_TITLE : [
                  '系统所有APP列表',
                  '已经挂载的APP列表',
                  '还没有挂载的APP列表'
               ],
               L_MODULE_TITLE : {
                  ALL : '所有模块'
               },
               TYPE : '类型：',
               MODULE_SELECT : '模块选择 ：',
               TYPE_COMBO : {
                  EMPTY_TEXT : '选择查询条件',
                  ALL_APP : '所有APP',
                  MOUNTED_APP : '已挂载APP',
                  UNMOUNTED_APP : '未挂载APP'
               },
               COLS : {
                  MODULE : '模块',
                  APP_NAME : '程序名称',
                  STATUS : '程序状态'
               },
               MENU : {
                  UNMOUNT : '卸载此APP权限树',
                  REMOUNT : '重新挂载APP权限树',
                  MOUNT_APP : '挂载此APP权限树'
               }
            },
            RES_MOUNT_QUEUE : {
               TITLE : '资源挂载队列',
               EMPTY_TEXT : '操作队列为空，您可以在左边的列表进行添加',
               COLS : {
                  MODULE : '模块',
                  TEXT : '程序名称',
                  TYPE : '操作类型',
                  STATUS : '状态'
               },
               MENU : {
                  DELETE : '移除选中项',
                  SHOW_ERROR : '查看错误信息'
               },
               REMOUNT : '重新挂载',
               UNMOUNT : '取消挂载',
               MOUNT : '全新挂载',
               OP_MSG : [
                  '准备就绪',
                  '正在操作',
                  '操作失败',
                  '操作成功'
               ],
               SHOW_ERROR_WIN_TITLE : '操作错误信息查看窗口'
            }
         }
      }
   }
});