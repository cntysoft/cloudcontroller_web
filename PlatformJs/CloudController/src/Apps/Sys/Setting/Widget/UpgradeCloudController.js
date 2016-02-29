/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.Setting.Widget.UpgradeCloudController", {
   extend: "WebOs.Kernel.ProcessModel.AbstractWidget",
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT("UPGRADE_CLOUD_CONTROLLER");
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("UPGRADE_CLOUD_CONTROLLER");
   },
   startBtn: null,
   rangeBtn : null,
   displayer: null,
   upgradeFromVersion: null,
   upgradeToVersion: null,
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
         maximizable: false
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         items: this.getDisplayerConfig(),
         buttons: [{
               text: this.LANG_TEXT.BTN.RANGE,
               listeners: {
                  click: this.setUpgradeRangeHandler,
                  afterrender: function(btn)
                  {
                     this.rangeBtn = btn;
                  },
                  scope: this
               }
            }, {
               text: this.LANG_TEXT.BTN.START,
               disabled: true,
               listeners: {
                  click: this.startUpgradeHandler,
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
   setUpgradeRangeHandler: function()
   {
      var LABEL = this.LANG_TEXT.LABEL;
      var win = new Ext.window.Window({
         title: this.LANG_TEXT.MSG.RANGE_INFO_WIN_TITLE,
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
                  xtype: "textfield",
                  fieldLabel: LABEL.FROM,
                  allowBlank: false,
                  name: "from"
               }, {
                  xtype: "textfield",
                  fieldLabel: LABEL.TO,
                  allowBlank: false,
                  name: "to"
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
                        this.upgradeFromVersion = values.from;
                        this.upgradeToVersion = values.to;
                        var value = this.displayer.getValue();
                        var msg = Ext.String.format(this.LANG_TEXT.MSG.RANGE_TEXT, this.upgradeFromVersion, this.upgradeToVersion);
                        if(""==value){
                           value = msg;
                        }else{
                           value += "\n"+msg;
                        }
                        this.displayer.setValue(value);
                        this.startBtn.setDisabled(false);
                        this.rangeBtn.setDisabled(true);
                        win.close();
                     }
                  },
                  scope: this
               }
            }]
      });
   },
   startUpgradeHandler: function()
   {
      this.startBtn.setDisabled(true);
      this.appRef.upgradeCloudController(this.upgradeFromVersion, this.upgradeToVersion, function(response){
         if(response.status){
            var value = this.displayer.getValue();
            var msg = response.getDataItem("msg");
            if(""==value){
               value = msg;
            }else{
               value += "\n"+msg;
            }
            this.displayer.setValue(value);
         }else{
            var value = this.displayer.getValue();
            var msg = response.getErrorString();
            if(""==value){
               value = msg;
            }else{
               value += "\n"+msg;
            }
            this.displayer.setValue(value);
         }
      }, this);
   },
   getDisplayerConfig: function()
   {
      return {
         xtype: "textareafield",
         readOnly: true,
         listeners: {
            afterrender: function(displayer)
            {
               this.displayer = displayer;

            },
            scope: this
         }
      };
   },
   destroy: function()
   {
      delete this.startBtn;
      delete this.rangeBtn;
      delete this.upgradeFromVersion;
      delete this.upgradeToVersion;
      delete this.displayer;
      var serviceInvoker = this.appRef.getServiceInvoker("upgrademgr");
      serviceInvoker.disconnectFromServer();
      this.callParent();
   }
});