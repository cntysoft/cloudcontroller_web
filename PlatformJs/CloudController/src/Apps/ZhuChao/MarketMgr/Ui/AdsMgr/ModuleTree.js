/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.AdsMgr.ModuleTree', {
   extend : 'Ext.tree.Panel',
   alias : 'widget.appzhuchaomarketmgruiadsmgrmoduletree',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.MarketMgr',
   treeStore : null,
   treeRef : null,
   contextMenuRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('ADSMGR.MODULETREE');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function (config)
   {
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE
      });
   },
   initComponent : function ()
   {
      Ext.apply(this, {
         store : this.createTreeStore(),
         listeners : {
            itemcontextmenu : this.createContextMenuHandler,
            itemclick : this.treeItemClickHandler,
            afterrender : function (tree){
               this.treeRef = tree;
               this.mainPanelRef.treeRef = tree;
            },
            scope : this
         }
      });
      this.callParent();
   },
   createContextMenuHandler : function (tree, record, item, index, event, eOpts)
   {
      if(!record.root){
         var menu = this.createContextMenu(record);
         menu.record = record;
         var pos = event.getXY();
         event.stopEvent();
         menu.showAt(pos[0], pos[1]);
      }
   },
   createContextMenu : function (record)
   {
      if(null == this.contextMenuRef){
         this.contextMenuRef = new Ext.menu.Menu({
            width : 190,
            record : record,
            items : [{
                  text : this.LANG_TEXT.ADD,
                  mode : 'add'
               }, {
                  text : this.LANG_TEXT.MODIFY,
                  mode : 'modify'
               }, {
                  text : this.LANG_TEXT.DELETE,
                  mode : 'delete'
               }],
            listeners : {
               click : this.contextMenuClickHandler,
               scope : this
            }
         });
      }
      return this.contextMenuRef;
   },
   /**
    * 树形图菜单点击事件
    * 
    * @param {type} menu
    * @param {type} item
    * @returns {undefined}
    */
   contextMenuClickHandler : function (menu, item)
   {
      var C = CloudController.Const;
      if('add' == item.mode){
         this.mainPanelRef.renderPanel('AdsEditor', {
            tbar : this.mainPanelRef.tbarConfig(),
            record : menu.record,
            gridRef : this.mainPanelRef.gridRef,
            mode : C.NEW_MODE
         });
      } else if('modify' == item.mode){
         this.mainPanelRef.renderPanel('AdsModuleEditor', {
            tbar : this.mainPanelRef.tbarConfig(),
            treeRef : this.mainPanelRef.treeRef,
            record : menu.record,
            type : item.mode,
            mode : C.MODIFY_MODE
         });
      } else if('delete' == item.mode){
         this.setLoading(this.LANG_TEXT.INDELETEMODULE);
         this.mainPanelRef.appRef.deleteAdsModule(menu.record.id, function (response){
            this.loadMask.hide();
            if(!response.status){
               Cntysoft.showErrorWindow(response.msg);
            } else{
               this.treeRef.store.reload();
               Cntysoft.showAlertWindow(this.LANG_TEXT.DELETEMODULESUCCESS);
            }
         }, this);
      }
   },
   /**
    * 树形图点击事件
    * 
    * @param {type} tree
    * @param {type} record
    * @param {type} item
    * @param {type} index
    * @param {type} e
    * @param {type} eOpts
    * @returns {undefined}
    */
   treeItemClickHandler : function (tree, record, item, index, e, eOpts)
   {
      var C = CloudController.Const;
      this.mainPanelRef.renderPanel('ListView', {
         tbar : this.mainPanelRef.tbarConfig(),
         record : record.id,
         mode : C.MODIFY_MODE,
         listeners : {
            afterrender : function (grid){
               this.mainPanelRef.gridRef = grid;
            },
            scope : this
         }
      });
   },
   /**
    * treeStore
    * @returns {SenchaExt.Data.TreeStore}
    */
   createTreeStore : function ()
   {
      if(null == this.treeStore){
         this.treeStore = new SenchaExt.Data.TreeStore({
            root : {
               text : 'ROOT',
               id : 0
            },
            fields : [
               {name : 'text', type : 'string', persist : false},
               {name : 'id', type : 'integer', persist : false}
            ],
            nodeParam : 'id',
            tree : this,
            proxy : {
               type : 'apigateway',
               callType : 'App',
               invokeMetaInfo : {
                  module : 'ZhuChao',
                  name : 'MarketMgr',
                  method : 'AdsMgr/getAdsModuleList'
               },
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
               }
            }
         });
      }
      return this.treeStore;
   },
   destroy : function ()
   {
      delete  this.treeRef;
      delete this.treeStore;
      if(this.contextMenuRef){
         this.contextMenuRef.destroy();
      }
      this.callParent();
   }
});
