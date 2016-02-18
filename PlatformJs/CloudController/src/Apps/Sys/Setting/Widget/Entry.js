/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.Setting.Widget.Entry", {
   extend: "WebOs.OsWidget.TreeNavWidget",
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT("ENTRY");
   },
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         width: 1000,
         height: 400,
         maximizable: false
      });
   },
   getNavTreeData: function()
   {
      var U_NAMES = this.GET_LANG_TEXT("WIDGET_NAMES");
      var me = this;
      return {
         id: "root",
         name: this.pmText.DISPLAY_TEXT,
         children: [
            //    {
            //    text : U_NAMES.WALL_PAPER,
            //    id : "WallPaper",
            //    leaf : true
            //}
            {
               text: U_NAMES.VERSION_INFO,
               id: "VersionInfo",
               leaf: true
            }, {
               text: U_NAMES.SYS_UPGRADE,
               id: "SysUpgrade",
               leaf: false,
               children: [{
                     text: U_NAMES.UPGRADE_META_INFO,
                     id: "UpgradeMetaInfo",
                     leaf: true
                  }]
            }]
      };
   }
});