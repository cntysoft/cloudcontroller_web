/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.ZhuChao.Main", {
   extend: "WebOs.Kernel.ProcessModel.App",
   requires: [
      "App.Sys.ZhuChao.Lang.zh_CN",
      //"App.Sys.User.Const",
      "App.Sys.Setting.Widget.Entry",
      "App.Sys.ZhuChao.Widget.PackageRepo",
      "App.Sys.ZhuChao.Widget.NewDeploy",
      "App.Sys.ZhuChao.Widget.UpgradeDeploy",
      "App.Sys.ZhuChao.Widget.DatabaseBackup"
   ],
   /**
    * @inheritdoc
    */
   id: "Sys.ZhuChao",
   widgetMap: {
      Entry: "App.Sys.ZhuChao.Widget.Entry",
      PackageRepo : "App.Sys.ZhuChao.Widget.PackageRepo",
      NewDeploy : "App.Sys.ZhuChao.Widget.NewDeploy",
      UpgradeDeploy : "App.Sys.ZhuChao.Widget.UpgradeDeploy",
      DatabaseBackup : "App.Sys.ZhuChao.Widget.DatabaseBackup"
   },
   /**
    * @var {Cntysoft.Framework.Rpc.ServiceInvoker} serviceInvoker
    */
   serviceInvoker : null,
   run : function()
   {
      var websocketUrl = CloudController.Kernel.Funcs.getWebSocketEntry("metaserver");
      this.serviceInvoker = new Cntysoft.Framework.Rpc.ServiceInvoker({
         serviceHost: websocketUrl,
         listeners : {
            connecterror : function(invoker, event){
               Cntysoft.showErrorWindow("connect to websocket server " + websocketUrl + " error");
               Cntysoft.raiseError(Ext.getClassName(this), "run", "connect to websocket server " + websocketUrl + " error");
               
            },
            scope : this
         }
      });
      this.callParent(arguments);
   },
   
   newDeployZhuChao : function(serverAddress, targetVersion, withoutDb, callback, scope)
   {
      this.serviceInvoker.callService("ZhuChao/NewDeploy", "deploy", {
         serverAddress : serverAddress,
         targetVersion : targetVersion,
         withoutDb : withoutDb
      }, callback, scope);
   },
   
   upgradeDeployZhuChao : function(serverAddress, fromVersion, toVersion, forceUpgrade, withoutUpgradeScript, callback, scope)
   {
      this.serviceInvoker.callService("ZhuChao/UpgradeDeploy", "upgrade", {
         serverAddress : serverAddress,
         fromVersion : fromVersion,
         toVersion : toVersion,
         forceUpgrade : forceUpgrade,
         withoutUpgradeScript: withoutUpgradeScript
      }, callback, scope);
   },
   
   backupZhuChaoDatabase : function(serverAddress, callback, scope)
   {
      this.serviceInvoker.callService("ZhuChao/DbBackup", "backup", {
         serverAddress : serverAddress
      }, callback, scope);
   },
   
   destroy : function()
   {
      this.serviceInvoker.disconnectFromServer();
      delete this.serviceInvoker;
      this.callParent();
   }
});