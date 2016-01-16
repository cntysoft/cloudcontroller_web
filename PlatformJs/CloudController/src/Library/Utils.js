/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 凤凰筑巢系统工具类定义
 */
Ext.define('CloudController.Utils',{
   requires : [
      'CloudController.Kernel.StdPath'
   ],
   inheritableStatics : {
      /**
       * 获取站点的模板路径
       *
       * @returns {string}
       */
      getTplPath : function()
      {
         //var cfg = CC.getSysEnv().get(CloudController.Const.ENV_SITE_SETTING);
         var base = CloudController.Kernel.StdPath.getTplBasePath();
         return base + '/Pc';
      }
   }
});