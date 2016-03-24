/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.ZhuChao.Widget.DatabaseBackup", {
   extend: "WebOs.Kernel.ProcessModel.AbstractWidget",
   requires: [
      "App.Sys.ZhuChao.Comp.OperateProgress"
   ],
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT("DB_BACKUP");
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("DB_BACKUP");
   },
   targetServerAddress: null,
   startBtnRef: null,
   serverAddressComboRef: null,
   progressGridRef : null,
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
            listeners : {
               afterrender : function(comp)
               {
                  this.progressGridRef = comp;
               },
               scope : this
            }
         },
         buttons: [{
               xtype: "combo",
               fieldLabel: this.LANG_TEXT.BTN.SERVER_ADDRESS,
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
               editable: false,
               allowBlank: false,
               queryMode: "remote",
               displayField: "ip",
               valueField: "ip",
               labelWidth: 120,
               name: "serverAddress",
               listeners: {
                  afterrender: function(comp)
                  {
                     this.serverAddressComboRef = comp;
                  },
                  change : function(combo, newValue){
                     
                     if(!Ext.isEmpty(newValue)){
                        this.targetServerAddress = newValue;
                        this.startBtnRef.setDisabled(false);
                     }
                  },
                  scope: this
               }
            }, {
               text: this.LANG_TEXT.BTN.START_BACKUP,
               disabled : true,
               listeners: {
                  click: this.startBackupHandler,
                  afterrender: function(comp)
                  {
                     this.startBtnRef = comp;
                  },
                  scope: this
               }
            }]
      });
      this.callParent();
   },
   startBackupHandler: function()
   {
      this.startBtnRef.setDisabled(true);
      this.appRef.backupZhuChaoDatabase(this.targetServerAddress, function(response){
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
      },this);
   },
   destroy: function()
   {
      delete this.targetServerAddress;
      delete this.startBtnRef;
      delete this.progressGridRef;
      delete this.serverAddressComboRef;
      this.callParent();
   }
});