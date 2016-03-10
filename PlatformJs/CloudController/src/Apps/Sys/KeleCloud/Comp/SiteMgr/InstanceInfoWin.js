/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.KeleCloud.Comp.SiteMgr.InstanceInfoWin", {
   extend: "WebOs.Component.Window",
   mixins: {
      langTextPrinfoEditorRefovider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   /**
    * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey: 'App.Sys.KeleCloud',
   /**
    * 编辑器模式
    * 
    * @var {Integer} mode
    */
   mode: CloudController.Const.NEW_MODE,
   LANG_TEXT: null,
   applyConstraintConfig: function(config)
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("COMP.SITE_MGR.INSTANCE_INFO_WIN");
      this.callParent([config]);
      Ext.apply(config, {
         title: this.LANG_TEXT.TITLE,
         width: 500,
         minWidth: 500,
         minHeight: 400,
         height: 400,
         layout: "fit",
         closeAction: "hide",
         maximizable: false,
         resizable: false,
         modal: true
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         items: this.getFormConfig(),
         buttons: [{
               text: this.LANG_TEXT.BTN.CREATE_SITE,
               listeners : {
                  click : this.saveHandler,
                  scope : this
               }
            }, {
               text: Cntysoft.GET_LANG_TEXT("UI.BTN.CANCEL"),
               listeners: {
                  click: function(){
                     this.close();
                  },
                  scope: this
               }
            }]
      });
      this.addListener({
         close: function(){
            this.formRef.getForm().reset();
            this.mode = CloudController.Const.NEW_MODE;
         },
         scope: this
      });
      this.callParent();
   },
   saveHandler: function()
   {
      if(this.formRef.getForm().isValid()){
         if(this.hasListeners.saverequest){
            var values = this.formRef.getForm().getValues();
            values.serverId = this.targetServerId;
            this.fireEvent("saverequest", this.mode, values);
         }
         this.close();
      }
   },
   setValue: function(id, values)
   {
      if(!this.rendered){
         this.addListener("afterrender", function(){
            this.setValue(id, values);
         }, this, {
            single: true
         });
         return;
      }
      this.targetServerId = id;
      this.formRef.getForm().setValues(values);
      this.gotoModifyMode();
   },
   setTargetServerId: function(id)
   {
      this.targetServerId = id;
   },
   gotoNewMode: function()
   {
      if(this.mode!=CloudController.Const.NEW_MODE){
         this.mode = CloudController.Const.NEW_MODE;
         this.formRef.getForm().reset();
         this.formRef.child("combo").setValue(2);
      }
   },
   gotoModifyMode: function()
   {
      if(this.mode!=CloudController.Const.MODIFY_MODE){
         this.mode = CloudController.Const.MODIFY_MODE;
      }
   },
   getFormConfig: function()
   {
      var LABEL = this.LANG_TEXT.LABEL;
      return {
         xtype: "form",
         bodyPadding: 15,
         items: [{
               xtype: "textfield",
               fieldLabel: LABEL.NAME,
               allowBlank: false,
               name: "name",
               width: 400
            }, {
               xtype: "textfield",
               fieldLabel: LABEL.SITE_KEY,
               allowBlank: false,
               name: "instanceKey",
               width: 400
            }, {
               xtype: "datefield",
               fieldLabel: LABEL.END_TIME,
               allowBlank: false,
               format: "Y-m-d H:i:s",
               editable: false,
               name: "serviceEndTime",
               width: 400,
               minValue: new Date()
            }, {
               xtype: "textfield",
               fieldLabel: LABEL.ADMIN,
               name: "admin",
               width: 400
            }, {
               xtype: "textfield",
               fieldLabel: LABEL.PHONE,
               name: "phone",
               width: 400
            }],
         listeners: {
            afterrender: function(form)
            {
               this.formRef = form;
            },
            scope: this
         }
      };
   },
   destroy: function()
   {
      delete this.LANG_TEXT;
      delete this.formRef;
      delete this.targetServerId;
      this.callParent();
   }
});