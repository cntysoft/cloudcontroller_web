/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.KeleCloud.Widget.VersionMgr", {
   extend: "WebOs.Kernel.ProcessModel.AbstractWidget",
   requires: [
      "App.Sys.KeleCloud.Comp.VersionInfoEditorWin",
      "Cntysoft.Utils.ColRenderer"
   ],
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT("VERSION_MGR");
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("VERSION_MGR");
   },
   infoEditorRef: null,
   versionInfoGrid: null,
   contextMenuRef : null,
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         width: 1000,
         minWidth: 1000,
         minHeight: 500,
         height: 500,
         layout: "fit",
         maximizable: false,
         resizable: false
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         buttonAlign: "left",
         items: this.getVersionInfoConfig(),
         buttons: [{
               text: this.LANG_TEXT.BTN.ADD_NEW_ITEM,
               listeners: {
                  click: this.addNewItemHandler,
                  scope: this
               }
            }]
      });
      this.callParent();
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
                  text: MENU_TEXT.MODIFY_ITEM,
                  listeners: {
                     click: this.modifyHandler,
                     scope: this
                  }
               }, {
                  text: MENU_TEXT.DELETE_ITEM,
                  listeners: {
                     click: this.deleteServerHandler,
                     scope: this
                  }
               }]
         });
      }
      return this.contextMenuRef;
   },
   
    modifyHandler: function(item)
   {
      var record = item.parentMenu.record;
      var win = this.getInfoEditor();
      var values = record.getData();
      win.center();
      win.setValue(values.id, values);
      win.show();
   },
   
   deleteServerHandler : function(item)
   {
      var record = item.parentMenu.record;
       Cntysoft.showQuestionWindow(this.LANG_TEXT.MSG.DELETE_ASK, function(btn){
            if("yes" == btn){
                this.setLoading(Cntysoft.GET_LANG_TEXT("MSG.OP"));
                this.appRef.deleteVersionInfo(record.get("id"), function(response){
                    this.loadMask.hide();
                    if(!response.status){
                        Cntysoft.showErrorWindow(response.msg);
                    } else{
                        this.versionInfoGrid.store.reload();
                    }
                }, this);
            }
        }, this);
   },
   
   addNewItemHandler: function()
   {
      var win = this.getInfoEditor();
      win.gotoNewMode();
      win.center();
      win.show();
   },
   getInfoEditor: function()
   {
      if(null==this.infoEditorRef){
         this.infoEditorRef = new App.Sys.KeleCloud.Comp.VersionInfoEditorWin({
            listeners: {
               saverequest: this.saveHandler,
               scope: this
            }
         });
      }
      return this.infoEditorRef;
   },
   saveHandler: function(mode, values)
   {
      var fn;
      if(mode==CloudController.Const.NEW_MODE){
         fn = "addVersionInfo";
      }else if(mode==CloudController.Const.MODIFY_MODE){
         fn = "updateVersionInfo";
      }
      this.setLoading(Cntysoft.GET_LANG_TEXT("MSG.SAVE"));
      this.appRef[fn](values, function(response){
         this.loadMask.hide();
         if(!response.status){
            Cntysoft.showErrorWindow(response.msg);
            Cntysoft.raiseError(Ext.getClassName(this), "saveHandler", response.msg);
         }else{
            this.versionInfoGrid.store.reload();
         }
      }, this);
   },
   getVersionInfoConfig: function()
   {
      var COLS = this.LANG_TEXT.COLS;
      return {
         xtype: "grid",
         columns: [
            {text: COLS.ID, dataIndex: "id", width: 80, resizable: false, menuDisabled: true},
            {text: COLS.FROM_VERSION, dataIndex: "fromVersion", width: 250, resizable: false, menuDisabled: true},
            {text: COLS.TO_VERSION, dataIndex: "toVersion", width: 250, resizable: false, menuDisabled: true},
            {text: COLS.RELEASE_TIME, dataIndex: "releaseTime", width: 200, resizable: false, menuDisabled: true, renderer: Cntysoft.Utils.ColRenderer.timestampRenderer},
            {text: COLS.DESCRIPTION, dataIndex: "description", width: 200, resizable: false, menuDisabled: true}
         ],
         autoScroll: true,
         store: new Ext.data.Store({
            autoLoad: true,
            fields: [
               {name: "id", type: "integer"},
               {name: "fromVersion", type: "string"},
               {name: "toVersion", type: "string"},
               {name: "releaseTime", type: "string"},
               {name: "description", type: "string"}
            ],
            proxy: {
               type: "apigateway",
               callType: "App",
               invokeMetaInfo: {
                  module: "Sys",
                  name: "KeleCloud",
                  method: "VersionInfo/getVersionList"
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
               this.versionInfoGrid = grid;
            },
            itemcontextmenu: this.gridItemContextClickHandler,
            scope: this
         }
      };
   },
   destroy: function()
   {
      delete this.versionInfoGrid;
      if(this.infoEditorRef){
         this.infoEditorRef.destroy();
         delete this.infoEditorRef;
      }
      if(this.contextMenuRef){
         this.contextMenuRef.destroy();
         delete this.contextMenuRef;
      }
      this.callParent();
   }
});