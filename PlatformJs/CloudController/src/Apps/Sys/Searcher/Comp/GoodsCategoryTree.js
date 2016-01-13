/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 * @createtime 2015/08/07 3:31 PM
 */
Ext.define('App.Sys.Searcher.Comp.GoodsCategoryTree', {
   extend : 'Ext.tree.Panel',
   alias : 'widget.syssearchercompgoodscategorytree',
   requires : [
      'SenchaExt.Data.Proxy.ApiProxy',
      'SenchaExt.Tree.DisableNodePlugin',
      'SenchaExt.Data.TreeStore'
   ],
   mixins : {
      fcm : 'Cntysoft.Mixin.ForbidContextMenu',
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.Sys.Searcher',
   plugins : [{
      ptype : 'nodedisabled'
   }],
   inheritableStatics : {
      NODE_TYPE: {
         NODE_TYPE_TOP_CATEGORY: 1,
         NODE_TYPE_SUB_CATEGORY: 2,
         NODE_TYPE_DETAIL_CATEGORY: 3
      },
      /**
       * 判断节点类型是否支持
       *
       * @param {int} type
       */
      isNodeTypeSupported: function (type) {
         var exist = false;
         Ext.iterate(this.NODE_TYPE, function (k, v) {
            if (v == type) {
               exist = true;
            }
         });
         return exist;
      }
   },
   invokeMetaInfo : {
      module : 'ZhuChao',
      name : 'CategoryMgr',
      method : 'Mgr/getChildren'
   },
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
      this.addListener({
         beforeitemexpand : function (obj){
            var proxy = this.getStore().getProxy();
            proxy.setInvokeParams({
               id : obj.getId()
            });
         },
         scope : this
      });
      this.callParent();
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         useArrows : true,
         frame : false,
         border : false,
         title : this.GET_LANG_TEXT('COMP.GOODS_CATEGORY_TREE.PANEL_TITLE')
      });
   },

   /**
    * @returns {SenchaExt.Data.TreeStore}
    */
   createTreeStore : function()
   {
      return new SenchaExt.Data.TreeStore({
         //listeners : {
         //   load : this.setupNodeRecordsHandler,
         //   scope : this
         //},
         root : {
            text : this.GET_LANG_TEXT('COMP.GOODS_CATEGORY_TREE.ROOT_NODE'),
            id : 0,
            expanded : true
         },
         fields : [
            {name : 'text', type : 'string', persist : false},
            {name : 'nodeType', type : 'integer', persist : false},
            {name : 'id', type : 'integer', persist : false}
         ],
         nodeParam : 'id',
         tree : this,
         proxy : {
            type : 'apigateway',
            callType : 'App',
            invokeMetaInfo : this.invokeMetaInfo,
            reader : {
               type : 'json',
               rootProperty : 'data'
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
   },

   reload : function()
   {
      this.store.load({
         params : {
            id : 0
         }
      });
   }
});