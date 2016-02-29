/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('CloudController.Kernel.Funcs', {
   inheritableStatics: {
      /**
       * 根据类型获取websocket地址
       * 
       * @return {String}
       */
      getWebSocketEntry : function(type)
      {
         var C = CloudController.Const;
         var map = CC.getSysEnv().get(C.ENV_WEBSOCKET);
         return "ws://"+ window.location.host +"/"+map[type];
      }
   }
});