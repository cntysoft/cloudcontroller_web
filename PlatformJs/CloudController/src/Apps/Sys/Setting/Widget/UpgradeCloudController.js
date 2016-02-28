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
   displayer : null,
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
               text: this.LANG_TEXT.BTN.START,
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
   startUpgradeHandler: function()
   {
      this.startBtn.setDisabled(true);
//      console.log(this.displayer);
      this.appRef.upgradeCloudController(function(response){
         if(response.status){
            var value = this.displayer.getValue();
            var msg = response.getDataItem("msg");
            if("" == value){
               value = msg;
            }else{
               value += "\n"+msg;
            }
            this.displayer.setValue(value);
         }else{
            var value = this.displayer.getValue();
            var msg = response.getErrorString();
            if("" == value){
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
         listeners : {
            afterrender : function(displayer)
            {
               this.displayer = displayer;
               
            },
            scope : this
         }
      };
   },
   destroy: function()
   {
      delete this.startBtn;
      delete this.displayer;
      var serviceInvoker = this.appRef.getServiceInvoker("upgrademgr");
      serviceInvoker.disconnectFromServer();
      this.callParent();
   }
});