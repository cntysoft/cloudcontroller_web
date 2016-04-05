/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.ZhuChao.Widget.ShopDbUpgrader", {
   extend: "WebOs.Kernel.ProcessModel.AbstractWidget",
   requires: [
      "App.Sys.ZhuChao.Comp.OperateProgress"
   ],
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT("SHOP_DB_UPGRADER");
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("SHOP_DB_UPGRADER");
   },
   targetServerAddress: null,
   fromVersion : null,
   toVersion : null,
   startBtnRef: null,
   serverAddressComboRef: null,
   progressGridRef: null,
   forceDownloadPackageRef: null,
   setMetaBtnRef : null,
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
         items: {
            xtype: "appsyszhuchaocompoperateprogress",
            listeners: {
               afterrender: function(comp)
               {
                  this.progressGridRef = comp;
               },
               scope: this
            }
         },
         buttons: this.getBarBtnsConfig()
      });
      this.callParent();
   },

   getBarBtnsConfig: function()
   {
      return [{
            xtype: "checkboxfield",
            fieldLabel: this.LANG_TEXT.BTN.FORCE_DOWNLOAD_PACKAGE,
            inputValue: true,
            labelWidth : 110,
            listeners: {
               afterrender: function(comp)
               {
                  this.forceDownloadPackageRef = comp;
               },
               scope: this
            }
         },{
            text: this.LANG_TEXT.BTN.SET_META,
            listeners: {
               click: this.setUpgradeMetaInfoHandler,
               afterrender: function(btn)
               {
                  this.setMetaBtnRef = btn;
               },
               scope: this
            }
         }, {
            text: this.LANG_TEXT.BTN.START_UPGRADE,
            disabled: false,
            listeners: {
               click: this.startUpgradeHandler,
               afterrender: function(comp)
               {
                  this.startBtnRef = comp;
               },
               scope: this
            }
         }]
   },
   setUpgradeMetaInfoHandler: function()
   {
      var LABEL = this.LANG_TEXT.LABEL;
      var me = this;
      var win = new Ext.window.Window({
         title: this.LANG_TEXT.MSG.TARGET_VERSION_WIN_TITLE,
         modal: true,
         autoShow: true,
         width: 350,
         minWidth: 350,
         height: 250,
         minHeight: 250,
         constrainHeader: true,
         layout: "fit",
         bodyPadding: 10,
         resizable: false,
         items: {
            xtype: "form",
            items: [{
                  xtype: "combo",
                  fieldLabel: LABEL.SERVER_ADDRESS,
                  editable : false,
                  store: new Ext.data.Store({
                     fields: ["ip"],
                     proxy: {
                        type: "apigateway",
                        callType: "App",
                        pArgs: {
                           cond: "type = 6"
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
                  allowBlank: false,
                  queryMode: "remote",
                  displayField: "ip",
                  valueField: "ip",
                  name: "serverAddress"
               }, {
                  xtype: "textfield",
                  fieldLabel: LABEL.FROM_VERSION,
                  allowBlank: false,
                  name: "fromVersion"
               }, {
                  xtype: "textfield",
                  fieldLabel: LABEL.TO_VERSION,
                  allowBlank: false,
                  name: "toVersion"
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
                        this.fromVersion = values.fromVersion;
                        this.toVersion = values.toVersion;
                        this.targetServerAddress = values.serverAddress;
                        this.progressGridRef.addMsg(Ext.String.format(this.LANG_TEXT.MSG.TARGET_VERSION_TEXT, this.targetServerAddress, this.fromVersion, this.toVersion));
                        this.startBtnRef.setDisabled(false);
                        this.setMetaBtnRef.setDisabled(true);
                        win.close();
                     }
                  },
                  scope: me
               }
            }]
      });
   },
   startUpgradeHandler: function()
   {
      this.startBtnRef.setDisabled(true);
      this.fromVersion = "0.0.2rc";
      this.toVersion = "0.0.3alpha";
      this.targetServerAddress = "127.0.0.1";
      this.appRef.zhuchaoShopDbUpgrade(this.targetServerAddress, this.fromVersion, this.toVersion, this.forceDownloadPackageRef.getValue(), function(response){
         if(response.status){
            var msg = response.getDataItem("msg");
            var key = response.getSignature();
            var repeat = response.getDataItem("repeat");
            if(repeat){
               this.progressGridRef.addMsg(msg, key, true);
            }else{
               if(msg){
                  this.progressGridRef.addMsg(msg, key);
               }
            }
         }else{
            var msg = "<span style = \"color:red\">"+response.getErrorString()+"</span>";
            this.progressGridRef.addMsg(msg);
            this.startBtnRef.setDisabled(false);
         }
      }, this);
   },
   destroy: function()
   {
      delete this.targetServerAddress;
      delete this.fromVersion;
      delete this.toVersion;
      delete this.startBtnRef;
      delete this.setMetaBtnRef;
      delete this.progressGridRef;
      delete this.serverAddressComboRef;
      this.callParent();
   }
});