/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MetaInfo.Comp.CategoryTree', {
   extend : 'Ext.tree.Panel',
   alias : 'widget.zhuchaometainfocompcategorytree',
   requires : [
      'SenchaExt.Data.Proxy.ApiProxy',
      'SenchaExt.Tree.DisableNodePlugin',
      'SenchaExt.Data.TreeStore'
   ],
   mixins : {
      fcm : 'Cntysoft.Mixin.ForbidContextMenu',
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.MetaInfo',
   plugins : [{
      ptype : 'nodedisabled'
   }],
   appRef : null,
   invokeMetaInfo : {
      module : 'ZhuChao',
      name : 'MetaInfo',
      method : 'Trademark/getChildren'
   },

   trademarkId : -1,

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
         afterrender : this.loadTreeDataHandler,
         scope : this
      });
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

   /**
    * @returns {SenchaExt.Data.TreeStore}
    */
   createTreeStore : function()
   {
      return new SenchaExt.Data.TreeStore({
         root : {
            text : this.GET_LANG_TEXT('COMP.CATEGORY_TREE.ROOT_NODE'),
            id : 0,
            expanded : true
         },
         fields : [
            {name : 'text', type : 'string', persist : false},
            {name : 'nodeType', type : 'integer', persist : false},
            {name : 'id', type : 'integer', persist : false}
         ],
         nodeParam : 'id'
      });
   },
   loadTreeDataHandler : function()
   {
       this.setLoading('Loading');
       this.appRef.getNodes(this.trademarkId, function(response) {
           this.loadMask.hide();
           if(response.status) {
                this.store.setRootNode({
                    id : 0,
                    text : this.GET_LANG_TEXT('COMP.CATEGORY_TREE.ROOT_NODE'),
                    expanded : true,
                    children : response.data
                });
           }
       }, this);
   },
   destroy : function()
   {
      delete this.trademarkId;
      delete this.appRef;
      this.callParent();
   }
});