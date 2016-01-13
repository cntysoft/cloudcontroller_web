/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.DeliveryOrder.Comp.ActivityTree', {
   extend : 'Ext.tree.Panel',
   alias : 'widget.zhuchaodeliveryordercompactivitytree',
   requires : [
      'SenchaExt.Data.Proxy.ApiProxy',
      'SenchaExt.Tree.DisableNodePlugin',
      'SenchaExt.Data.TreeStore'
   ],
   mixins : {
      fcm : 'Cntysoft.Mixin.ForbidContextMenu',
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.DeliveryOrder',
   
   invokeMetaInfo : {
      module : 'ZhuChao',
      name : 'DeliveryOrder',
      method : 'Mgr/getActivityList'
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
      this.callParent();
   },
   
   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         useArrows : true,
         border : false,
         title : this.GET_LANG_TEXT('COMP.ACTIVITY_TREE.ROOT_TEXT')
      });
   },
   
   createTreeStore : function()
   {
      return Ext.create('SenchaExt.Data.TreeStore', {
         root : {
            id : '0',
            text : this.GET_LANG_TEXT('COMP.ACTIVITY_TREE.ROOT_TEXT'),
            expanded : true
         },
         fields : [
            {name : 'id', type : 'integer', persist : false},
            {name : 'text', type : 'string', persist : false}
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
            }
         }
      });
   }
});

