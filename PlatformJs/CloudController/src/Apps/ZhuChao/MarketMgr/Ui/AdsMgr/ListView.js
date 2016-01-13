/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.AdsMgr.ListView', {
   extend : 'Ext.grid.Panel',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   requires : [
      'SenchaExt.Data.Proxy.ApiProxy'
   ],
   runableLangKey : 'App.ZhuChao.MarketMgr',
   panelType : 'ListView',
   gridStoreRef : null,
   menuRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('ADSMGR.LISTVIEW');
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
         store : this.gridStoreConfig(),
         columns : [
            {text : this.LANG_TEXT.ID, dataIndex : 'id', resizable : false, menuDisabled : true, width : 80},
            {text : this.LANG_TEXT.NAME, dataIndex : 'name', resizable : false, menuDisabled : true, width : 120},
            {text : this.LANG_TEXT.LOCATION, dataIndex : 'location', resizable : false, menuDisabled : true, width : 120},
            {text : this.LANG_TEXT.CONTENTURL, dataIndex : 'contentUrl', resizable : false, menuDisabled : true, flex : 1},
            {text : this.LANG_TEXT.STARTTIME, dataIndex : 'startTime', resizable : false, menuDisabled : true, width : 130},
            {text : this.LANG_TEXT.ENDTIME, dataIndex : 'endTime', resizable : false, menuDisabled : true, width : 130}
         ],
         listeners : {
            afterrender : function (grid){
               this.gridRef = grid;
               this.mainPanelRef.gridRef = grid;
               this.gotoModifyMode();
            },
            itemcontextmenu : this.gridItemContextClickHandler,
            itemdblclick : this.gridItemDbClickHandler,
            scope : this
         }
      });
      this.callParent();
   },
   /**
    * 表单双击处理事件
    * 
    * @param {type} grid
    * @param {type} record
    * @param {type} item
    * @param {type} index
    * @param {type} e
    * @param {type} eOpts
    * @returns {undefined}
    */
   gridItemDbClickHandler : function (grid, record, item, index, e, eOpts)
   {
      var C = CloudController.Const;
      this.mainPanelRef.renderPanel('AdsEditor', {
         tbar : this.mainPanelRef.tbarConfig(),
         record : record,
         type : 'modify',
         mode : C.MODIFY_MODE,
         gridRef : this.gridRef
      });
   },
   /**
    * 表单菜单处理事件
    * 
    * @param {type} grid
    * @param {type} record
    * @param {type} item
    * @param {type} index
    * @param {type} e
    * @param {type} eOpts
    * @returns {undefined}
    */
   gridItemContextClickHandler : function (grid, record, item, index, e, eOpts)
   {
      var menu = this.getContextMenu(grid, record);
      menu.record = record;
      var pos = e.getXY();
      e.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },
   /**
    * 表单右键获取菜单
    * 
    * @param {type} grid
    * @param {type} record
    * @returns {Ext.menu.Menu}
    */
   getContextMenu : function (grid, record)
   {
      if(null == this.menuRef){
         this.menuRef = new Ext.menu.Menu({
            width : 145,
            items : [{
                  text : this.LANG_TEXT.MODIFYAD,
                  grid : grid,
                  mode : 'modify',
                  record : record
               }, {
                  text : this.LANG_TEXT.DELETEAD,
                  grid : grid,
                  mode : 'delete',
                  record : record
               }],
            listeners : {
               click : this.contextMenuClickHandler,
               scope : this
            }
         });
      }
      return this.menuRef;
   },
   gotoNewMode : function ()
   {

   },
   gotoModifyMode : function ()
   {
      this.gridRef.store.getProxy().setPermanentArg('moduleId', this.record);
      this.gridRef.store.reload();
   },
   contextMenuClickHandler : function (menu, item)
   {
      var C = CloudController.Const;
      if('modify' == item.mode){
         this.mainPanelRef.renderPanel('AdsEditor', {
            tbar : this.mainPanelRef.tbarConfig(),
            record : menu.record,
            type : item.mode,
            mode : C.MODIFY_MODE,
            gridRef : this.gridRef
         });
      } else if('delete' == item.mode){
         this.setLoading(this.LANG_TEXT.INDELETEAD);
         this.mainPanelRef.appRef.deleteAds(menu.record.id, function (response){
            this.loadMask.hide();
            if(!response.status){
               Cntysoft.showErrorWindow(response.msg);
            } else{
               this.gridRef.store.reload();
               Cntysoft.showAlertWindow(this.LANG_TEXT.DELETEADSUCCESS);
            }
         }, this);
      }
   },
   gridStoreConfig : function ()
   {
      if(null == this.gridStoreRef){
         this.gridStoreRef = new Ext.data.Store({
            autoLoad : true,
            pageSize : 25,
            fields : [
               {name : 'id', type : 'integer', persist : false},
               {name : 'name', type : 'string', persist : false},
               {name : 'location', type : 'string', persist : false},
               {name : 'contentUrl', type : 'string', persist : false},
               {name : 'startTime', type : 'string', persist : false},
               {name : 'endTime', type : 'string', persist : false},
               {name : 'gbcolor', type : 'string', persist : false},
               {name : 'image', type : 'string', persist : false},
               {name : 'module', type : 'string', persist : false},
               {name : 'moduleId', type : 'integer', persist : false},
               {name : 'fileRefs', type : 'integer', persist : false}
            ],
            proxy : {
               type : 'apigateway',
               callType : 'App',
               invokeMetaInfo : {
                  module : 'ZhuChao',
                  name : 'MarketMgr',
                  method : 'AdsMgr/getAdsList'
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
      return this.gridStoreRef;
   },
   destroy : function ()
   {
      delete this.gridStoreRef;
      if(this.menuRef){
         this.menuRef.destroy();
      }
      delete this.menuRef;
      this.callParent();
   }
});
