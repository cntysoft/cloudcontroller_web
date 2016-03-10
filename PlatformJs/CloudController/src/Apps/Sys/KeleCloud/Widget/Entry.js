/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.KeleCloud.Widget.Entry", {
   extend : "WebOs.OsWidget.TreeNavWidget",

   initPmTextRef : function()
   {
      this.pmText = this.GET_PM_TEXT("ENTRY");
   },

   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config,{
         width : 800,
         minWidth : 800,
         height : 400,
         minHeight : 400,
         maximizable : false
      });
   },
   getNavTreeData : function()
   {
      var U_NAMES = this.GET_LANG_TEXT("WIDGET_NAMES");
      return {
         id : "root",
         name : this.pmText.DISPLAY_TEXT,
         children : [{
            text : U_NAMES.PACKAGE_REPO,
            id : "PackageRepo",
            leaf : true
         },{
            text : U_NAMES.SERVER_MGR,
            id : "ServerMgr",
            leaf : true
         },{
            text : U_NAMES.VERSION_MGR,
            id : "VersionMgr",
            leaf : true
         },{
            text : U_NAMES.SITE_MGR,
            id : "SiteMgr",
            leaf : true
         }]
      };
   }
});