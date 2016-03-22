/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.Setting.Widget.MetaServerStatusMgr", {
   extend: "WebOs.Kernel.ProcessModel.AbstractWidget",
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT("META_SERVER_STATUS_MGR");
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("META_SERVER_STATUS_MGR");
   },
   metaInfoGridRef: null,
   contextMenuRef: null,
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         width: 500,
         minWidth: 500,
         minHeight: 200,
         height: 200,
         resizable: false,
         bodyPadding: 4,
         layout: {
            type: "hbox",
            align: "middle"
         },
         modal: true,
         maximizable: false
      });
   },
   initComponent: function()
   {
      var L = this.LANG_TEXT.BTN;
      Ext.apply(this, {
         items: [{
               xtype: "button",
               text: L.START,
               flex: 1,
               margin: "0 4 0 0",
               height: 50,
               listeners: {
                  click: this.startMetaServerHandler,
                  scope: this
               }
            }, {
               xtype: "button",
               text: L.RESTART,
               flex: 1,
               margin: "0 4 0 0",
               height: 50,
               listeners: {
                  click: this.restartMetaServerHandler,
                  scope: this
               }
            }, {
               xtype: "button",
               text: L.STOP,
               flex: 1,
               height: 50,
               listeners: {
                  click: this.stopMetaServerHandler,
                  scope: this
               }
            }]
      });
      this.callParent();
   },
   startMetaServerHandler: function()
   {
      this.setLoading(Cntysoft.GET_LANG_TEXT("MSG.OP"));
      this.appRef.startMetaServer(function(response){
         this.loadMask.hide();
         Cntysoft.showAlertWindow(response.getDataItem("msg"));
      }, this);
   },
   restartMetaServerHandler : function()
   {
      this.setLoading(Cntysoft.GET_LANG_TEXT("MSG.OP"));
      this.appRef.restartMetaServer(function(response){
         this.loadMask.hide();
         Cntysoft.showAlertWindow(response.getDataItem("msg"));
      }, this);
   },
   stopMetaServerHandler : function()
   {
      this.setLoading(Cntysoft.GET_LANG_TEXT("MSG.OP"));
      this.appRef.stopMetaServer(function(response){
         this.loadMask.hide();
         Cntysoft.showAlertWindow(response.getDataItem("msg"));
      }, this);
   }
});