/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 该类用来展示面板左侧树形图
 * 
 * @param {type} param1
 * @param {type} param2
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.PreferAct.PreferActTree', {
   extend : 'Ext.tree.Panel',
   alias : 'widget.appzhuchaomarketuipreferactpreferacttree',
   requires : [
      'App.ZhuChao.MarketMgr.Const'
   ],
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.MarketMgr',
   treeStoreRef : null,
   treeRef : null,
   menuRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('PREFERACT.PREFERACTTREE');
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
            afterrender : function (tree){
               this.mainPanelRef.treeRef = tree;
               this.treeRef = tree;
            },
            itemcontextmenu : this.contextMenuHandler,
            itemclick : this.itemClickHandler,
            scope : this
         }
      });
      this.callParent();
   },
   itemClickHandler : function (tree, record, item, index, e, eOpts)
   {
      var preferactId = record.getId();
      this.mainPanelRef.renderPanel('ListView', {
         tbar : this.mainPanelRef.tbarConfig(),
         preferactId : preferactId
      });
   },
   contextMenuHandler : function (tree, record, item, index, event, eOpts)
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
      var MENU = App.ZhuChao.MarketMgr.Const;
      if(null == this.menuRef){
         this.menuRef = new Ext.menu.Menu({
            width : 140,
            record : record,
            items : [{
                  text : this.LANG_TEXT.JOINMERCHANT,
                  identifier : MENU.MENU_SHANGJIA
               }, {
                  text : this.LANG_TEXT.MODIFYPREFERACT,
                  identifier : MENU.MENU_MODIFY_PREFERACT
               }, {
                  text : this.LANG_TEXT.FREEZEPREFERACT,
                  identifier : MENU.MENU_FREEZE_PREFERACT
               }],
            listeners : {
               click : this.contextMenuClickHandler,
               scope : this
            }
         });
      }
      ;
      return this.menuRef;
   },
   contextMenuClickHandler : function (menu, item)
   {
      var MENU = App.ZhuChao.MarketMgr.Const;
      if(MENU.MENU_SHANGJIA == item.identifier){
         this.mainPanelRef.renderPanel('JoinMerchant', {
            tbar : this.mainPanelRef.tbarConfig(),
            preferactId : menu.record.getId()
         })
      } else if(MENU.MENU_MODIFY_PREFERACT == item.identifier){
         this.mainPanelRef.renderPanel('PreferActEditor', {
            tbar : this.mainPanelRef.tbarConfig(),
            record : menu.record
         })
      } else if(MENU.MENU_FREEZE_PREFERACT == item.identifier){
         var values = menu.record.getId();
         this.setLoading(this.LANG_TEXT.INFREEZE);
         this.mainPanelRef.appRef.freezePreferAct({id : values}, function (response){
            this.loadMask.hide();
            if(!response.status){
               Cntysoft.showErrorWindow(response.msg);
            } else{
               this.mainPanelRef.treeRef.store.reload();
               Cntysoft.showAlertWindow(this.LANG_TEXT.FREEZESUCCESS);
            }
         }, this);
      }
   },
   createTreeStore : function ()
   {
      var MENU = App.ZhuChao.MarketMgr.Const;
      if(null == this.treeStoreRef){
         this.treeStoreRef = new SenchaExt.Data.TreeStore({
            root : {
               text : this.LANG_TEXT.TREETITLE,
               id : 0
            },
            fields : [
               {name : 'text', type : 'string', persist : false},
               {name : 'id', type : 'integer', persist : false},
               {name : 'intro', type : 'string', persist : false},
               {name : 'status', type : 'integer', persist : false}
            ],
            nodeParam : 'id',
            tree : this,
            proxy : {
               type : 'apigateway',
               callType : 'App',
               invokeMetaInfo : {
                  module : 'ZhuChao',
                  name : 'MarketMgr',
                  method : 'PreferAct/getPreferActTreeList'
               },
               pArgs : [{
                     key : 'status',
                     value : MENU.PREFERACT_STATUS_ACTIVE
                  }],
               reader : {
                  type : 'json',
                  rootProperty : 'data'
               }
            }
         });
      }
      ;
      return this.treeStoreRef;
   },
   destroy : function ()
   {
      delete this.treeRef;
      delete this.treeStoreRef;
      if(this.menuRef){
         this.menuRef.destroy();
      }
      delete this.menuRef;
      this.callParent();
   }
});
