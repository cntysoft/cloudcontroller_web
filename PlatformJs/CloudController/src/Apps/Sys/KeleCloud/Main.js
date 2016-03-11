/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.KeleCloud.Main", {
   extend: "WebOs.Kernel.ProcessModel.App",
   requires : [
      "App.Sys.KeleCloud.Lang.zh_CN",
      "App.Sys.KeleCloud.Widget.Entry",
      "App.Sys.KeleCloud.Widget.ServerMgr",
      "App.Sys.KeleCloud.Widget.VersionMgr",
      "App.Sys.KeleCloud.Widget.SiteMgr",
      "App.Sys.KeleCloud.Widget.PackageRepo"
   ],
   /**
    * @inheritdoc
    */
   id: "Sys.KeleCloud",
   /**
    * @inheritdoc
    */
   widgetMap: {
      Entry: "App.Sys.KeleCloud.Widget.Entry",
      PackageRepo : "App.Sys.KeleCloud.Widget.PackageRepo",
      ServerMgr : "App.Sys.KeleCloud.Widget.ServerMgr",
      VersionMgr : "App.Sys.KeleCloud.Widget.VersionMgr",
      SiteMgr : "App.Sys.KeleCloud.Widget.SiteMgr"
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
               Cntysoft.showErrorWindow(Ext.String.format(this.GET_LANG_TEXT("ERROR.CONNECT_WEBSOCKET_FAIL"), websocketUrl));
               Cntysoft.raiseError(Ext.getClassName(this), "run", "connect to websocket server " + websocketUrl + " error");
               
            },
            scope : this
         }
      });
      this.callParent(arguments);
   },
   
   addServerInfo : function(data, callback, scope)
   {
      this.callApp("ServerInfo/addServer", data, callback, scope);
   },
   
   updateServerInfo : function(values, callback, scope)
   {
      this.callApp("ServerInfo/updateServerInfo", values, callback, scope);
   },
   
   deleteServerInfo : function(id, callback, scope)
   {
      this.callApp("ServerInfo/deleteServerInfo", {
         id : id
      }, callback, scope);
   },
   addVersionInfo : function(data, callback, scope)
   {
      this.callApp("VersionInfo/addVersion", data, callback, scope);
   },
   
   updateVersionInfo : function(values, callback, scope)
   {
      this.callApp("VersionInfo/updateVersion", values, callback, scope);
   },
   
   deleteVersionInfo : function(id, callback, scope)
   {
      this.callApp("VersionInfo/deleteVersion", {
         id : id
      }, callback, scope);
   },
   
   saveInstanceMetaInfo : function(data, callback, scope)
   {
      this.callApp("InstanceMgr/setMetaInfo", data, callback, scope);
   },
   
   getInstanceMetaInfo : function(callback, scope)
   {
      this.callApp("InstanceMgr/getMetaInfo", null, callback, scope);
   },
   
   removeSoftware : function(filename, callback, scope)
   {
      var request = new Cntysoft.Framework.Rpc.Request("SoftwareRepo/RepoInfo", "removeSoftware",{
         filename : filename
      });
      this.serviceInvoker.request(request, callback, scope);
   },
   
   instanceDeploy : function(serverAddress, instanceKey, currenVersion, callback, scope)
   {
      this.serviceInvoker.callService("KeleCloud/InstanceDeploy", "deploy", {
         serverAddress : serverAddress,
         instanceKey : instanceKey,
         currentVersion : currenVersion
      }, callback, scope);
   },
   
   destroy : function()
   {
      this.serviceInvoker.disconnectFromServer();
      delete this.serviceInvoker;
      this.callParent();
   }
});