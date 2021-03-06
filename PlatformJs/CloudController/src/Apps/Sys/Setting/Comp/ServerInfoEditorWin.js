/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.Setting.Comp.ServerInfoEditorWin", {
   extend: "WebOs.Component.Window",
   mixins: {
      langTextPrinfoEditorRefovider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   /**
    * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey: 'App.Sys.Setting',
   /**
    * 编辑器模式
    * 
    * @var {Integer} mode
    */
   mode: CloudController.Const.NEW_MODE,
   LANG_TEXT: null,
   formRef : null,
   targetServerId : null,
   applyConstraintConfig: function(config)
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("COMP.SERVER_INFO_EDITOR_WIN");
      this.callParent([config]);
      Ext.apply(config, {
         width: 800,
         minWidth: 800,
         minHeight: 300,
         height: 300,
         layout: "fit",
         closeAction:"hide",
         maximizable: false,
         modal: true
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         items: this.getFormConfig(),
         buttons: [{
               text: Cntysoft.GET_LANG_TEXT("UI.BTN.SAVE"),
               listeners : {
                  click : this.saveHandler,
                  scope : this
               }
            }, {
               text: Cntysoft.GET_LANG_TEXT("UI.BTN.CANCEL"),
               listeners : {
                  click : function(){
                     this.close();
                  },
                  scope : this
               }
            }]
      });
      this.addListener({
         close : function(){
            this.formRef.getForm().reset();
            this.formRef.child("combo").setValue(2);
            this.mode = CloudController.Const.NEW_MODE;
         },
         scope : this
      });
      this.callParent();
   },
   saveHandler : function()
   {
      if(this.formRef.getForm().isValid()){
         if(this.hasListeners.saverequest){
            var values = this.formRef.getForm().getValues();
            if(CloudController.Const.MODIFY_MODE == this.mode){
               values.id = this.targetServerId;
            }
            this.fireEvent("saverequest", this.mode, values);
         }
         this.close();
      }
   },
   setValue : function(id, values)
   {
      if(!this.rendered){
         this.addListener("afterrender", function(){
            this.setValue(id, values);
         }, this, {
            single : true
         });
         return;
      }
      this.targetServerId = id;
      this.formRef.getForm().setValues(values);
      this.gotoModifyMode();
   },
   
   gotoNewMode: function()
   {
      if(this.mode!=CloudController.Const.NEW_MODE){
         this.mode = CloudController.Const.NEW_MODE;
         this.formRef.getForm().reset();
         this.formRef.child("combo").setValue(2);
      }
   },
   
   gotoModifyMode : function()
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
               xtype: "combo",
               fieldLabel: LABEL.TYPE,
               store: new Ext.data.Store({
                  fields: ['value', 'name'],
                  data: this.LANG_TEXT.SERVER_TYPES
               }),
               allowBlank : false,
               queryMode: 'local',
               displayField: 'name',
               valueField: 'value',
               name : "type",
               listeners : {
                  afterrender : function(comp)
                  {
                     comp.setValue(2);
                  },
                  scope : this
               }
            }, {
               xtype: "textfield",
               fieldLabel: LABEL.IP,
               allowBlank : false,
               name : "ip"
            }, {
               xtype: "textarea",
               fieldLabel: LABEL.DESCRIPTION,
               width: 600,
               height: 80,
               name : "description"
            }],
         listeners : {
            afterrender : function(form)
            {
               this.formRef = form;
            },
            scope : this
         }
      };
   },
   destroy : function()
   {
      delete this.LANG_TEXT;
      delete this.formRef;
      delete this.targetServerId;
      this.callParent();
   }
});