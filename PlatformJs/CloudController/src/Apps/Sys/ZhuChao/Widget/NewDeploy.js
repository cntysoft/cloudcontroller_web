/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.ZhuChao.Widget.NewDeploy", {
   extend: "WebOs.Kernel.ProcessModel.AbstractWidget",
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT("NEW_DEPLOY");
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("NEW_DEPLOY");
   },
   statics: {
      KEY_SEED_ID: 1
   },
   startBtn: null,
   targetBtn: null,
   displayer: null,
   withoutDbCheckboxRef: null,
   targetVersion: null,
   serverAddress : null,
   /**
    * @template
    * @inheritdoc
    */
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         width: 800,
         minWidth: 800,
         minHeight: 400,
         height: 400,
         resizable: false,
         layout: "fit",
         modal: true,
         maximizable: false
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         items: this.getDisplayerConfig(),
         buttons: [{
               xtype: "checkboxfield",
               fieldLabel: this.LANG_TEXT.BTN.WITHOUT_DB,
               inputValue: true,
               listeners: {
                  afterrender: function(comp)
                  {
                     this.withoutDbCheckboxRef = comp;
                  },
                  scope: this
               }
            }, {
               text: this.LANG_TEXT.BTN.TARGET,
               listeners: {
                  click: this.setDeployMetaInfoHandler,
                  afterrender: function(btn)
                  {
                     this.targetBtn = btn;
                  },
                  scope: this
               }
            }, {
               text: this.LANG_TEXT.BTN.START,
               disabled: true,
               listeners: {
                  click: this.startDeployHandler,
                  afterrender: function(btn)
                  {
                     this.startBtn = btn;
                  },
                  scope: this
               }
            }]
      });
      this.callParent();
   },
   addMsg: function(msg, key, replace)
   {
      replace = !!replace;
      if(!key){
         key = "key"+this.self.KEY_SEED_ID++;
      }
      var store = this.displayer.store;
      if(replace){
         var record = store.findRecord("key", key);
         if(record){
            record.set("msg", msg);
            this.displayer.getView().focusRow(record);
            return;
         }
      }else{
         var record = store.findRecord("key", key);
         if(record){
            key += this.self.KEY_SEED_ID++;
         }
      }
      var added = this.displayer.store.add({
         key: key,
         msg: msg
      });
      this.displayer.getView().focusRow(added.pop());
   },
   setDeployMetaInfoHandler: function()
   {
      var LABEL = this.LANG_TEXT.LABEL;
      var win = new Ext.window.Window({
         title: this.LANG_TEXT.MSG.TARGET_VERSION_WIN_TITLE,
         modal: true,
         autoShow: true,
         width: 350,
         minWidth: 350,
         height: 200,
         minHeight: 200,
         constrainHeader: true,
         layout: "fit",
         bodyPadding: 10,
         resizable: false,
         items: {
            xtype: "form",
            items: [{
                  xtype: "combo",
                  fieldLabel: LABEL.SERVER_ADDRESS,
                  store: new Ext.data.Store({
                     fields: ["ip"],
                     proxy: {
                        type: "apigateway",
                        callType: "App",
                        pArgs : {
                           cond : "type = 6"
                        },
                        invokeMetaInfo: {
                           module: "Sys",
                           name: "Setting",
                           method: "ServerInfo/getServerList"
                        },
                        reader: {
                           type: "json",
                           rootProperty: "items",
                           totalProperty: "total"
                        }
                     }
                  }),
                  editable : false,
                  allowBlank: false,
                  queryMode: "remote",
                  displayField: "ip",
                  valueField: "ip",
                  name: "serverAddress"
               }, {
                  xtype: "textfield",
                  fieldLabel: LABEL.VERSION,
                  allowBlank: false,
                  name: "version"
               }]
         },
         buttons: [{
               text: Cntysoft.GET_LANG_TEXT("UI.BTN.OK"),
               listeners: {
                  click: function()
                  {
                     var form = win.child("form");
                     if(form.isValid()){
                        var values = form.getForm().getValues();
                        this.targetVersion = values.version;
                        this.serverAddress = values.serverAddress;
                        this.addMsg(Ext.String.format(this.LANG_TEXT.MSG.TARGET_VERSION_TEXT, this.serverAddress, this.targetVersion));
                        this.startBtn.setDisabled(false);
                        this.targetBtn.setDisabled(true);
                        win.close();
                     }
                  },
                  scope: this
               }
            }]
      });
   },
   startDeployHandler: function()
   {
      this.startBtn.setDisabled(true);
      this.appRef.newDeployZhuChao(this.serverAddress, this.targetVersion, this.withoutDbCheckboxRef.getValue(), function(response){
         if(response.status){
            var msg = response.getDataItem("msg");
            var key = response.getSignature();
            var repeat = response.getDataItem("repeat");
            if(repeat){
               this.addMsg(msg, key, true);
            }else{
               if(msg){
                  this.addMsg(msg, key);
               }
            }
         }else{
            var msg = "<span style = \"color:red\">"+response.getErrorString()+"</span>";
            this.addMsg(msg);
         }
      },this);
   },
   getDisplayerConfig: function()
   {
      var COLS = this.LANG_TEXT.COLS;
      return {
         xtype: "grid",
         columns: [
            {text: COLS.MSG, dataIndex: "msg", flex: 1, resizable: false, sortable: false, menuDisabled: true}
         ],
         autoScroll: true,
         store: new Ext.data.Store({
            fields: [
               {name: "msg", type: "string"},
               {name: "key", type: "string"}
            ]
         }),
         listeners: {
            afterrender: function(grid)
            {
               this.displayer = grid;
            },
            scope: this
         }
      };
   },
   destroy: function()
   {
      delete this.startBtn;
      delete this.targetBtn;
      delete this.targetVersion;
      delete this.serverAddress;
      delete this.displayer;
      delete this.withoutDbCheckboxRef;
      this.callParent();
   }
});