/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.KeleCloud.Widget.SiteMgr", {
   extend: "WebOs.Kernel.ProcessModel.AbstractWidget",
   requires: [
      "App.Sys.KeleCloud.Comp.VersionInfoEditorWin",
      "Cntysoft.Utils.ColRenderer",
      "App.Sys.KeleCloud.Comp.SiteMgr.ServerInfoTree"
   ],
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT("SITE_MGR");
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("SITE_MGR");
   },
   metaInfoFormRef: null,
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         width: 1000,
         minWidth: 1000,
         minHeight: 500,
         height: 500,
         layout: "fit",
         maximizable: true,
         resizable: true
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         items: this.getTabPanelConfig()
      });
      this.callParent();
   },
   saveMetaInfoHandler: function()
   {
      var form = this.metaInfoFormRef.getForm();
      if(form.isValid()){
         this.setLoading(Cntysoft.GET_LANG_TEXT("MSG.SAVE"));
         this.appRef.saveInstanceMetaInfo(form.getValues(), function(response){
            this.loadMask.hide();
            if(!response.status){
               Cntysoft.showErrorWindow(response.msg);
            }
         }, this);
      }
   },
   getTabPanelConfig: function()
   {
      return {
         xtype: "tabpanel",
         items: [
            this.getSiteMgrConfig(),
            this.getMetaConfig()
         ],
         tabPosition: "top"
      };
   },
   getSiteMgrConfig: function()
   {
      var L = this.LANG_TEXT.SITE_INSTANCE;
      return {
         xtype: "panel",
         title: L.TITLE,
         layout: "border",
         items: [{
               xtype: "syskelecloudcompsitemgrserverinfotree",
               width: 240,
               region: "west",
               margin: "0 1 0 0"
            }, this.getSiteInstanceListGridConfig()]
      };
   },
   getSiteInstanceListGridConfig: function()
   {
      var COLS = this.LANG_TEXT.SITE_INSTANCE.COLS;
      return {
         xtype: "grid",
         region: "center",
         columns: [
            {text: COLS.ID, dataIndex: "id", width: 80, resizable: false, menuDisabled: true},
            {text: COLS.NAME, dataIndex: "fromVersion", width: 250, resizable: false, menuDisabled: true},
            {text: COLS.CREATE_TIME, dataIndex: "toVersion", width: 250, resizable: false, menuDisabled: true}
         ],
         autoScroll: true,
//         store: new Ext.data.Store({
//            autoLoad: true,
//            fields: [
//               {name: "id", type: "integer"},
//               {name: "fromVersion", type: "string"},
//               {name: "toVersion", type: "string"},
//               {name: "releaseTime", type: "string"},
//               {name: "description", type: "string"}
//            ],
//            proxy: {
//               type: "apigateway",
//               callType: "App",
//               invokeMetaInfo: {
//                  module: "Sys",
//                  name: "KeleCloud",
//                  method: "VersionInfo/getVersionList"
//               },
//               reader: {
//                  type: "json",
//                  rootProperty: "items",
//                  totalProperty: "total"
//               }
//            }
//         }),
//         listeners: {
//            afterrender: function(grid)
//            {
//               this.versionInfoGrid = grid;
//            },
//            itemcontextmenu: this.gridItemContextClickHandler,
//            scope: this
//         }
      };
   },
   getMetaConfig: function()
   {
      var L = this.LANG_TEXT.META_INFO;
      return {
         xtype: "form",
         title: L.TITLE,
         bodyPadding: 10,
         buttons: [{
               text: Cntysoft.GET_LANG_TEXT("UI.BTN.SAVE"),
               listeners: {
                  click: this.saveMetaInfoHandler,
                  scope: this
               }
            }],
         items: [{
               xtype: "textfield",
               fieldLabel: L.FIELD_LABLES.CURRENT_VERSION,
               allowBlank: false,
               name: "currentVersion"
            }],
         listeners: {
            afterrender: function(form)
            {
               this.metaInfoFormRef = form;
               this.setLoading(Cntysoft.GET_LANG_TEXT("MSG.LOAD"));
               this.appRef.getInstanceMetaInfo(function(response){
                  this.loadMask.hide();
                  if(!response.status){
                     Cntysoft.showErrorWindow(response.msg);
                  }else{
                     form.getForm().setValues(response.data);
                  }
               }, this);
            },
            scope: this
         }
      };
   },
   destroy: function()
   {
      delete this.metaInfoFormRef;
      this.callParent();
   }
});
