/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.ZhuChao.Widget.Entry", {
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
      return {
         id: "root",
         name: this.pmText.DISPLAY_TEXT,
         children: [{
               text: U_NAMES.PACKAGE_REPO,
               id: "PackageRepo",
               leaf: true
            },{
               text: U_NAMES.NEW_DEPLOY,
               id: "NewDeploy",
               leaf: true
            },{
               text: U_NAMES.UPGRADE,
               id: "UpgradeDeploy",
               leaf: true
            },{
               text: U_NAMES.SHOP_DB_UPGRADER,
               id: "ShopDbUpgrader",
               leaf: true
            },{
               text: U_NAMES.DB_BACKUP,
               id: "DatabaseBackup",
               leaf: true
            },{
               text: U_NAMES.BACKUP_REPO,
               id: "BackupRepo",
               leaf: true
            }]
      };
   }
});