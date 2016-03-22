/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.Setting.Widget.LuoXiServerStatusMgr", {
   extend: "WebOs.Kernel.ProcessModel.AbstractWidget",
   requires: [
      "App.Sys.Setting.Comp.ServerInfoEditorWin"
   ],
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT("LUOXI_SERVER_STATUS");
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("LUOXI_SERVER_STATUS_MGR");
   },
   metaInfoGrid: null,
   infoEditorRef: null,
   contextMenuRef: null,
   /**
    * @template
    * @inheritdoc
    */
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         width: 1000,
         minWidth: 1000,
         minHeight: 500,
         height: 500,
         layout: "fit",
         maximizable: false
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         items: [
            this.getServerMetaInfoConfig()
         ]
      });
      this.callParent();
   },
   addNewItemHandler: function()
   {
      var win = this.getInfoEditor();
      win.gotoNewMode();
      win.center();
      win.show();
   },
   gridItemContextClickHandler: function(grid, record, htmlItem, index, event)
   {
      var menu;
      var pos = event.getXY();
      menu = this.getContextMenu(record);
      menu.record = record;
      event.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },
   getContextMenu: function(record)
   {
      if(null==this.contextMenuRef){
         var MENU_TEXT = this.LANG_TEXT.MENU;
         this.contextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks: true,
            items: [{
                  text: MENU_TEXT.START,
                  listeners: {
                     click: this.startServerHandler,
                     scope: this
                  }
               }, {
                  text: MENU_TEXT.RESTART,
                  listeners: {
                     click: this.restartServerHandler,
                     scope: this
                  }
               }, {
                  text: MENU_TEXT.STOP,
                  listeners: {
                     click: this.stopServerHandler,
                     scope: this
                  }
               }]
         });
      }
      return this.contextMenuRef;
   },
   
   startServerHandler : function()
   {
      
   },
   
   restartServerHandler : function()
   {
      
   },
   
   stopServerHandler : function()
   {
      
   },
   
   typeRenderer: function(value)
   {
      var L = this.GET_LANG_TEXT("COMP.SERVER_INFO_EDITOR_WIN.SERVER_TYPES");
      for(var i = 0; i<L.length; i++){
         var item = L[i];
         if(item.value==value){
            return item.name;
         }
      }
   },
   
   saveHandler: function(mode, values)
   {
      var fn;
      if(mode==CloudController.Const.NEW_MODE){
         fn = "addServerInfo";
      }else if(mode==CloudController.Const.MODIFY_MODE){
         fn = "updateServerInfo";
      }
      this.setLoading(Cntysoft.GET_LANG_TEXT("MSG.SAVE"));
      this.appRef[fn](values, function(response){
         this.loadMask.hide();
         if(!response.status){
            Cntysoft.showErrorWindow(response.msg);
            Cntysoft.raiseError(Ext.getClassName(this), "saveHandler", response.msg);
         }else{
            this.metaInfoGrid.store.reload();
         }
      }, this);
   },
   getServerMetaInfoConfig: function()
   {
      var COLS = this.LANG_TEXT.COLS;
      return {
         xtype: "grid",
         columns: [
            {text: COLS.ID, dataIndex: "id", width: 80, resizable: false, menuDisabled: true},
            {text: COLS.IP, dataIndex: "ip", width: 250, resizable: false, menuDisabled: true},
            {text: COLS.TYPE, dataIndex: "type", width: 150, resizable: false, menuDisabled: true, renderer: Ext.bind(this.typeRenderer, this)},
            {text: COLS.DESCRIPTION, dataIndex: "description", flex: 1, resizable: false, menuDisabled: true}
         ],
         autoScroll: true,
         store: new Ext.data.Store({
            autoLoad: true,
            fields: [
               {name: "id", type: "integer"},
               {name: "ip", type: "string"},
               {name: "type", type: "integer"},
               {name: "description", type: "string"}
            ],
            proxy: {
               type: "apigateway",
               callType: "App",
               invokeMetaInfo: {
                  module: "Sys",
                  name: "Setting",
                  method: "ServerInfo/getServerList"
               },
               pArgs: {
                  cond: "type = 2"
               },
               reader: {
                  type: "json",
                  rootProperty: "items",
                  totalProperty: "total"
               }
            }
         }),
         listeners: {
            afterrender: function(grid)
            {
               this.metaInfoGrid = grid;
            },
            itemcontextmenu: this.gridItemContextClickHandler,
            scope: this
         }
      };
   },
   destroy: function()
   {
      delete this.metaInfoGrid;
      if(this.contextMenuRef){
         this.contextMenuRef.destroy();
         delete this.contextMenuRef;
      }
      this.callParent();
   }
});