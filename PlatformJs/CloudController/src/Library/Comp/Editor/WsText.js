/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("CloudController.Comp.Editor.WsText", {
   extend: "WebOs.Component.Editor.Text",
   requires : [
      "CloudController.Framework.Core.WsFilesystem"
   ],
   /**
    * @return {CloudController.Framework.Core.WsFilesystem}
    */
   getFsObject : function()
   {
      if(null == this.fs){
         this.fs = new CloudController.Framework.Core.WsFilesystem({
            websocketEntry : this.fsViewRef.websocketEntry
         });
      }
      return this.fs;
   },
});