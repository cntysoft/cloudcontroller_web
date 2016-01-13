/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 凤凰筑巢核心标准路径类
 */
Ext.define('CloudController.Kernel.StdPath',{
   extend : 'Cntysoft.Kernel.StdPath',
   inheritableStatics : {
      getTplBasePath : function()
      {
         return '/Statics/Templates';
      },
      getSkinBasePath : function()
      {
         return '/Statics/Skins';
      },
      /**
       * 获取平台上传文件路径
       *
       * @return {String}
       */
      getUploadPath : function()
      {
         return this.getPrivatePath();
      },
      /**
       * @return {String}
       */
      getPrivatePath : function()
      {
         return '/PrivateSpace';
      },

      /**
       * @return string
       */
      getTagBasePath : function()
      {
         return '/TagLibrary'
      }
   }
});
