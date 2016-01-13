/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 节点树面板，封装一些过滤,其他程序可能进行继承,
 * 这里就提供一些基本的显示
 */
Ext.define('App.Site.Content.Comp.CategoryTree', {
   extend : 'Ext.tree.Panel',
   alias : 'widget.sitecontentcompcategorytree',
   requires : [
      'SenchaExt.Data.Proxy.ApiProxy',
      'SenchaExt.Tree.DisableNodePlugin',
      'SenchaExt.Data.TreeStore'
   ],
   mixins : {
      fcm : 'Cntysoft.Mixin.ForbidContextMenu',
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.Site.Content',
   plugins : [{
      ptype : 'nodedisabled'
   }],
   inheritableStatics : {
      NODE_TYPE : {
         N_TYPE_SINGLE : 1,
         N_TYPE_LINK : 2,
         N_TYPE_GENERAL : 3,
         N_TYPE_INDEX : 4,
         N_TYPE_ROOT : 0
      },
      /*
       * 判断节点类型是否支持
       *
       * @param {int} type
       */
      isNodeTypeSupported : function(type)
      {
         var exist = false;
         Ext.iterate(this.NODE_TYPE, function(k, v){
            if(v == type){
               exist = true;
            }
         });
         return exist;
      },
      /*
       * 根据节点类型获取节点图标
       *
       * @param {int} type
       * @return {String}
       */
      getNodeIcon : function(type)
      {
         var TYPES = this.NODE_TYPE;
         var icon;
         switch (type) {
            case TYPES.N_TYPE_SINGLE:
            case TYPES.N_TYPE_INDEX:
               icon = 'Single';
               break;
            case TYPES.N_TYPE_LINK:
               icon = 'Link';
               break;
            case TYPES.N_TYPE_GENERAL:
               icon = 'General';
               break;
         }
         return icon;
      }
   },
   invokeMetaInfo : {
      module : 'Site',
      name : 'Category',
      method : 'Structure/getChildren'
   },
   allowTypes : [3],
   extraFields : ['contentModels'],

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
         store : this.createTreeStore(),
         listeners : {
            beforeitemexpand : function (obj){
               var proxy = this.getStore().getProxy();
               proxy.setInvokeParams({
                  id : obj.getId()
               });
            },
            scope : this
         }
      });
      this.callParent();
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         useArrows : true,
         frame : false,
         border : false,
         rootVisible : true
      });
   },
   /*
    * 根据相关的nodeType设置相关的模型图标
    */
   setupNodeRecordsHandler : function(store,records)
   {
      var S = this.self;
      Ext.each(records, function(record){
         record.set('iconCls', 'app-site-content-'+S.getNodeIcon(record.get('nodeType')).toLowerCase() +'-type-icon');
         this.extrNodeRecordSetter(record);
      }, this);
   },

   /*
    * 额外的节点数据设置函数
    *
    * @template
    * @param {Ext.data.Model} node
    */
   extrNodeRecordSetter : Ext.emptyFn,

   /*
    * @returns {SenchaExt.Data.TreeStore}
    */
   createTreeStore : function()
   {
      return new SenchaExt.Data.TreeStore({
         listeners : {
            load : this.setupNodeRecordsHandler,
            scope : this
         },
         root : {
            text : this.GET_LANG_TEXT('COMP.CATEGORY_TREE.ROOT_NODE'),
            id : 0
         },
         fields : [
            {name : 'text', type : 'string', persist : false},
            {name : 'nodeType', type : 'integer', persist : false},
            {name : 'id', type : 'integer', persist : false},
            {name : 'contentModels', type : 'auto', persist : false},
            {name : 'disabled', type : 'boolean', persist : false}
         ],
         nodeParam : 'id',
         tree : this,
         proxy : {
            type : 'apigateway',
            callType : 'App',
            invokeMetaInfo : this.invokeMetaInfo,
            pArgs : [{
               key : 'allowTypes',
               value : this.allowTypes
            }, {
               key : 'extraFields',
               value : this.extraFields
            }],
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
   }
});