/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.UserAskfor.ListView', {
   extend : 'Ext.grid.Panel',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   requires : [
      'SenchaExt.Data.Proxy.ApiProxy'
   ],
   panelType : 'ListView',
   runableLangKey : 'App.ZhuChao.MarketMgr',
   gridTbar : null,
   gridStore : null,
   gridRef : null,
   tbarFormRef : null,
   isDeal : null,
   menuRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('USERASKFOR.LISTVIEW');
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
      var store = this.createGridStore();
      Ext.apply(this, {
         tbar : this.gridTbarItems(),
         bbar : Ext.create('Ext.PagingToolbar', {
            store : store,
            displayInfo : true,
            emptyMsg : this.LANG_TEXT.EMPTYMSG
         }),
         store : store,
         columns : [
            {text : this.LANG_TEXT.ID, dataIndex : 'id', resizable : false, menuDisabled : true},
            {text : this.LANG_TEXT.NAME, dataIndex : 'name', resizable : false, menuDisabled : true, flex : 1},
            {text : this.LANG_TEXT.AREA, dataIndex : 'area', resizable : false, menuDisabled : true, flex : 1},
            {text : this.LANG_TEXT.PHONENUM, dataIndex : 'phoneNum', resizable : false, menuDisabled : true, width : 200},
            {text : this.LANG_TEXT.SIGNTIME, dataIndex : 'askforTime', resizable : false, menuDisabled : true, width : 200},
            {text : this.LANG_TEXT.ISDEAL, dataIndex : 'isDeal', resizable : false, menuDisabled : true, renderer : this.gridIsDealRenderer}
         ],
         listeners : {
            afterrender : function (grid){
               this.gridRef = grid;
            },
            itemcontextmenu : this.gridRightClickHandler,
            scope : this
         }
      });
      this.callParent();
   },
   gridIsDealRenderer : function (value){
      if(3 == value){
         return this.LANG_TEXT.GESHIBEFOREDEAL;
      } else if(1 == value){
         return this.LANG_TEXT.GESHIAFTERDEAL;
      } else if(2 == value){
         return this.LANG_TEXT.GESHIINDEAL;
      }
   },
   /**
    * 表单元素右键点击处理
    * 
    * @param {type} grid
    * @param {type} record
    * @param {type} item
    * @param {type} index
    * @param {type} e
    * @param {type} eOpts
    * @returns {undefined}
    */
   gridRightClickHandler : function (grid, record, item, index, e, eOpts)
   {
      var menu = this.getContextMenu();
      menu.record = record;
      var pos = e.getXY();
      e.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },
   /**
    * 表单右键生成菜单
    * 
    * @returns {Ext.menu.Menu}
    */
   getContextMenu : function ()
   {
      if(null == this.menuRef){
         this.menuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            width : 150,
            items : [{
                  text : this.LANG_TEXT.GOTOINDEAL,
                  isDeal : 2,
                  listeners : {
                     click : this.contextMenuClickHandler,
                     scope : this
                  }
               }, {
                  text : this.LANG_TEXT.GOTOAFTERDEAL,
                  isDeal : 1,
                  listeners : {
                     click : this.contextMenuClickHandler,
                     scope : this
                  }
               }, {
                  text : this.LANG_TEXT.GOTOBEFOREDEAL,
                  isDeal : 3,
                  listeners : {
                     click : this.contextMenuClickHandler,
                     scope : this
                  }
               }, {
                  text : this.LANG_TEXT.DELETE,
                  isDeal : 4,
                  listeners : {
                     click : this.contextMenuClickHandler,
                     scope : this
                  }
               }]
         });
      }
      return this.menuRef;
   },
   /**
    * 右键菜单点击处理
    * 
    * @param {type} menuItem
    * @returns {undefined}
    */
   contextMenuClickHandler : function (menuItem)
   {
      var res = [];
      res['id'] = this.menuRef.record.getId();
      res['isDeal'] = menuItem.isDeal;
      this.mainPanelRef.appRef.askforUserContextMenuClick(res, function (response){
         if(!response.status){
            Cntysoft.showErrorWindow(response.msg);
         } else{
            this.reloadGridPageFirst(this.gridRef.getStore());
         }
      }, this);
   },
   reloadGridPageFirst : function(store, params)
   {
      store.addListener('load', function(store, records){
         store.currentPage = 1;
         if(params){
            store.load({
               params : params
            });
         }else{
            store.load();
         }
      }, this, {
         single : true
      });
      if(params){
         store.load({
            params : params
         });
      }else {
         store.load();
      }
   },
   /**
    * 表单数据Store
    * 
    * @returns {Ext.data.Store}
    */
   createGridStore : function ()
   {
      if(null == this.gridStore){
         this.gridStore = new Ext.data.Store({
            autoLoad : true,
            pageSize : 25,
            fields : [
               {name : 'id', type : 'integer', persist : false},
               {name : 'name', type : 'string', persist : false},
               {name : 'privince', type : 'string', persist : false},
               {name : 'city', type : 'string', persist : false},
               {name : 'area', type : 'integer', persist : false},
               {name : 'phoneNum', type : 'string', persist : false},
               {name : 'askforTime', type : 'string', persist : false},
               {name : 'isDeal', type : 'string', persist : false}
            ],
            proxy : {
               type : 'apigateway',
               callType : 'App',
               invokeMetaInfo : {
                  module : 'ZhuChao',
                  name : 'MarketMgr',
                  method : 'UserAskfor/getAskforUserList'
               },
               reader : {
                  type : 'json',
                  rootProperty : 'items',
                  totalProperty : 'total'
               }
            }
         });
      }
      ;
      return this.gridStore;
   },
   gridTbarItems : function ()
   {
      if(null == this.gridTbar){
         this.gridTbar = [{
               xtype : 'tbfill'
            }, {
               xtype : 'form',
               layout : 'hbox',
               items : [{
                     fieldLabel : this.LANG_TEXT.DEALCD,
                     margin : '0 5 0 5',
                     store : this.createComboStore(),
                     labelWidth : 70,
                     displayField : 'isDeal',
                     editable : false,
                     emptyText : this.LANG_TEXT.SEARCH,
                     valueField : 'id',
                     width : 200,
                     allowBlank : false,
                     name : 'isDeal',
                     xtype : 'combobox',
                     listeners : {
                        change : this.comboValueChangHandler,
                        scope : this
                     }
                  }],
               listeners : {
                  afterrender : function (form){
                     this.tbarFormRef = form;
                  },
                  scope : this
               }
            }];
      }
      return this.gridTbar;
   },
   comboValueChangHandler : function ()
   {
      this.isDeal = this.tbarFormRef.getValues().isDeal;
      this.gridRef.store.getProxy().setPermanentArg('isDeal', this.isDeal);
      this.gridRef.store.reload();
   },
   createComboStore : function ()
   {
      return new Ext.data.Store({
         fields : [
            {name : 'id', type : 'integer', persist : false},
            {name : 'isDeal', type : 'string', persist : false}
         ],
         data : [
            {id : 0, 'isDeal' : this.LANG_TEXT.SUOYOU},
            {'id' : 3, 'isDeal' : this.LANG_TEXT.BEFOREDEAL},
            {'id' : 1, 'isDeal' : this.LANG_TEXT.AFTERDEAL},
            {'id' : 2, 'isDeal' : this.LANG_TEXT.INDEAL}
         ]
      });
   },
   destroy : function ()
   {
      delete this.appRef;
      this.mixins.langTextProvider.destroy.call(this);
      if(this.menuRef){
         delete this.menuRef;
      }
      delete this.gridRef;
      delete this.tbarFormRef;
      delete this.gridTbar;
      delete this.gridStore;
      delete this.isDeal;
      this.callParent();
   }
});