/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.ZhuChao.Widget.BackupRepo", {
   extend: "WebOs.Kernel.ProcessModel.AbstractWidget",
   requires: [
      "CloudController.Comp.FsView.GridView"
   ],
   LANG_TEXT: null,
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT("BACKUP_REPO");
   },

   contextMenu: null,
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         width: 1100,
         minWidth: 1100,
         height: 500,
         minHeight: 500,
         maximizable: true,
         layout: "fit"
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         items: this.getFsViewConfig()
      });
      this.callParent(arguments);
   },
   
   getFsViewConfig : function()
   {
      return {
         xtype : "cloudcontrollercompfsviewgridview",
         startPaths : [
            "/zhuchao/dbbackup"
         ],
         isCreateFsTree : true,
         websocketEntry : "metaserver"
      };
   },
   
   destroy: function()
   {
      delete this.fsview;
      if(this.contextMenu){
         this.contextMenu.destroy();
         delete this.contextMenu;
      }
      this.callParent();
   }
});