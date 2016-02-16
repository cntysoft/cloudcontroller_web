/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.SoftwareRepo.Lang.zh_CN', {
   extend: 'Cntysoft.Kernel.AbstractLangHelper',
   data: {
      PM_TEXT: {
         DISPLAY_TEXT: '软件仓库管理',
         ENTRY: {
            WIDGET_TITLE: '欢迎使用软件仓库管理应用',
            TASK_BTN_TEXT: '软件仓库管理'
         }
      },
      ENTRY : {
         ERROR : {
            CONNECT_WEBSOCKET_FAIL : "连接到 [{0}] WebSocket服务器失败"
         },
         COLS : {
            FILE_NAME : "文件名称",
            FILE_SIZE : "文件大小"
         }
      }
   }
});