/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.Setting.Widget.ServerMgr", {
   extend: "WebOs.Kernel.ProcessModel.AbstractWidget",
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT("SERVER_MGR");
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("SERVER_MGR");
   },
   metaInfoGrid: null,
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
         maximizable: true
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         items: [
            this.getServiceMetaInfoConfig()
         ],
         buttonAlign : "left",
         buttons: [{
               text: this.LANG_TEXT.BTN.ADD_NEW_ITEM,
//               listeners: {
//                  click: this.addNewItemHandler,
//                  scope: this
//               }
            }]
      });
      this.callParent();
   },
   addNewItemHandler: function()
   {
      var LABEL = this.LANG_TEXT.LABEL;
      var win = new Ext.window.Window({
         title: this.LANG_TEXT.META_INFO_WIN_TITLE,
         modal: true,
         autoShow: true,
         width: 600,
         minWidth: 600,
         height: 300,
         minHeight: 300,
         constrainHeader: true,
         layout: "fit",
         bodyPadding: 10,
         items: {
            xtype: "form",
            items: [{
                  xtype: "textfield",
                  fieldLabel: LABEL.KEY,
                  allowBlank: false,
                  name : "key"
               }, {
                  xtype: "textfield",
                  fieldLabel: LABEL.NAME,
                  allowBlank: false,
                  name : "name"
               }, {
                  xtype: "textfield",
                  fieldLabel: LABEL.IP,
                  allowBlank: false,
                  name : "ip"
               }, {
                  xtype: "numberfield",
                  fieldLabel: LABEL.PORT,
                  allowBlank: false,
                  minValue : 0,
                  name : "port"
               }]
         },
         buttons: [{
               text: Cntysoft.GET_LANG_TEXT("UI.BTN.SAVE"),
               listeners : {
                  click : function()
                  {
                     var form = win.child("form");
                     if(form.isValid()){
                        this.metaInfoGrid.store.add(form.getForm().getValues());
                        win.close();
                     }
                  },
                  scope : this
               }
            }]
      });
   },
   saveHandler: function()
   {
      var items = [];
      this.metaInfoGrid.store.each(function(record){
         var data = record.getData();
         delete data.id;
         items.push(data);
      }, this);
      this.setLoading(Cntysoft.GET_LANG_TEXT("MSG.SAVE"));
      this.appRef.setServiceServerAddressMeta(items, function(response){
         this.loadMask.hide();
         if(response.status){
            this.loadMetaData();
         }else{
            Cntysoft.raiseError(Ext.getClassName(this), "saveHandler", response.getErrorString());
         }
      }, this);
   },
   getServiceMetaInfoConfig: function()
   {
      var COLS = this.LANG_TEXT.COLS;
      return {
         xtype: "grid",
         columns: [
            {text: COLS.ID, dataIndex: "id", width : 80, resizable: false, menuDisabled: true},
            {text: COLS.IP, dataIndex: "ip", width: 250, resizable: false, menuDisabled: true},
            {text: COLS.TYPE, dataIndex: "type", width: 150, resizable: false, menuDisabled: true},
             {text: COLS.DESCRIPTION, dataIndex: "type", flex: 1, resizable: false, menuDisabled: true}
         ],
         autoScroll: true,
         store: new Ext.data.Store({
            fields: [
               {name: "name", type: "string"},
               {name: "ip", type: "string"},
               {name: "port", type: "string"},
               {name: "key", type: "string"}
            ]
         }),
         listeners: {
            afterrender: function(grid)
            {
               this.metaInfoGrid = grid;
               //this.loadMetaData();
            },
            scope: this
         }
      };
   },
   loadMetaData: function()
   {
      this.setLoading(Cntysoft.GET_LANG_TEXT("MSG.LOAD"))
      this.appRef.getServiceServerAddressMeta(function(response){
         this.loadMask.hide();
         if(response.status){
            this.metaInfoGrid.store.loadData(response.getExtraData());
         }else{
            Cntysoft.raiseError(Ext.getClassName(this), "loadMetaData", response.getErrorString());
         }
      }, this);
   },
   destroy: function()
   {
      delete this.metaInfoGrid;
      this.callParent();
   }
});