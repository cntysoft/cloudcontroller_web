/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.SoftwareRepo.Main', {
   extend: 'WebOs.Kernel.ProcessModel.App',
   requires : [
      "App.Sys.SoftwareRepo.Lang.zh_CN",
      "App.Sys.SoftwareRepo.Widget.Entry",
      "Cntysoft.Framework.Rpc.ServiceInvoker",
      "Cntysoft.Framework.Rpc.Request"
   ],
   /**
    * @inheritdoc
    */
   id: 'Sys.SoftwareRepo',
   /**
    * @inheritdoc
    */
   widgetMap: {
      Entry: 'App.Sys.SoftwareRepo.Widget.Entry'
   },
   
   /**
    * @var {Cntysoft.Framework.Rpc.ServiceInvoker} serviceInvoker
    */
   serviceInvoker : null,
   
   run : function()
   {
      var websocketUrl = CloudController.Kernel.Funcs.getWebSocketEntry("upgrademgr");
      this.serviceInvoker = new Cntysoft.Framework.Rpc.ServiceInvoker({
         serviceHost: websocketUrl,
         listeners : {
            connecterror : function(invoker, event){
               Cntysoft.showErrorWindow(Ext.String.format(this.GET_LANG_TEXT("ENTRY.ERROR.CONNECT_WEBSOCKET_FAIL"), websocketUrl));
               Cntysoft.raiseError(Ext.getClassName(this), "run", "connect to websocket server " + websocketUrl + " error");
               
            },
            scope : this
         }
      });
      this.callParent(arguments);
   },
   
   getRepoFileList : function()
   {
      var request = new Cntysoft.Framework.Rpc.Request("Repo/Info", "lsSoftwareRepoDir");
      this.serviceInvoker.request(request, function(data){
         console.log(data)
      });
   },
   
   destroy : function()
   {
      this.serviceInvoker.disconnectFromServer();
      delete this.serviceInvoker;
      this.callParent();
   }
});