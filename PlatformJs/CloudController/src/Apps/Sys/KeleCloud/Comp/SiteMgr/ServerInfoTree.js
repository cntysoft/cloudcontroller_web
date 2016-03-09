/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.KeleCloud.Comp.SiteMgr.ServerInfoTree", {
   extend : "Ext.tree.Panel",
   alias : "widget.syskelecloudcompsitemgrserverinfotree",
   requires : [
      "SenchaExt.Data.Proxy.ApiProxy",
      "SenchaExt.Tree.DisableNodePlugin",
      "SenchaExt.Data.TreeStore"
   ],
   mixins : {
      fcm : "Cntysoft.Mixin.ForbidContextMenu",
      langTextProvider : "WebOs.Mixin.RunableLangTextProvider"
   },
   runableLangKey : "App.Sys.KeleCloud",
   plugins : [{
         ptype : "nodedisabled"
      }],
   
   constructor : function(config)
   {
      config = config || {};
      this.applyConstraintConfig(config);
      this.callParent([config]);
      this.mixins.fcm.forbidContextMenu.call(this);
   },
   
   initComponent : function()
   {
      Ext.apply(this, {
         store : this.createTreeStore()
      });
//      this.addListener({
//         beforeitemexpand : function (obj){
//            var proxy = this.getStore().getProxy();
//            proxy.setInvokeParams({
//               id : obj.getId()
//            });
//         },
//         scope : this
//      });
      this.callParent();
   },
   
   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         useArrows : true,
         frame : false,
         border : false
      });
   },
   
   /*
    * @returns {SenchaExt.Data.TreeStore}
    */
   createTreeStore : function()
   {
      return new SenchaExt.Data.TreeStore({
         root : {
            text : this.GET_LANG_TEXT("COMP.SITE_MGR.SERVER_INFO_TREE.ROOT_NODE"),
            id : 0,
            expanded : true
         },
         fields : [
            {name : "text", type : "string", persist : false},
            {name : "id", type : "integer", persist : false},
            {name : "ip", type : "string", persist : false}
         ],
         nodeParam : "id",
         proxy : {
            type : "apigateway",
            callType : "App",
            invokeMetaInfo : {
               module : "Sys",
               name : "KeleCloud",
               method : "ServerInfo/getServerListForTree"
            },
            reader : {
               type : "json",
               rootProperty : "data"
            },
            invokeParamsReady : function(params)
            {
               if(!Ext.isDefined(params.id)){
                  params.id = 0;
               }
               return params;
            }
         }
      });
   }
});