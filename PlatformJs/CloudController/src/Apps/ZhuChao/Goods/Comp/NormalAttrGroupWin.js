/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.Goods.Comp.NormalAttrGroupWin', {
   extend: 'WebOs.Component.Window',
   mixins : {
      fcm : 'Cntysoft.Mixin.ForbidContextMenu',
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.Goods',
   formRef : null,
   targetGrid : null,
   mode : 1,
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('COMP.NORMAL_ATTR_GROUP_WIN');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         layout : 'fit',
         resizable : false,
         width : 600,
         height : 160,
         modal : true,
         closeAction : 'hide',
         title : this.LANG_TEXT.TITLE
      });
   },

   initComponent : function()
   {
      Ext.apply(this,{
         items : this.getFormConfig(),
         listeners : {
            close : function()
            {
               this.formRef.getForm().reset();
               this.mode = CloudController.Const.NEW_MODE;
            },
            scope : this
         }
      });
      this.callParent();
   },

   loadInfo : function(values)
   {
      if(!this.rendered){
         this.addListener('afterrender', function(){
            this.loadInfo(values);
         }, this, {
            single : true
         });
         return;
      }
      this.$_current_id_$ = values.id;
      this.mode = CloudController.Const.MODIFY_MODE;
      this.formRef.getForm().setValues(values);
   },

   getFormConfig : function()
   {
      var L = this.LANG_TEXT.FIELDS;
      return {
         xtype : 'form',
         bodyPadding : 10,
         defaults : {
            xtype : 'textfield'
         },
         items : [{
            fieldLabel : L.GROUP_NAME,
            allowBlank : false,
            name : 'groupName',
            labelWidth : 120,
            width : 550,
            validator : function(value){
               if('' == Ext.String.trim(value)){
                  return false;
               }else{
                  return true;
               }
            }
         }],
         buttons : [{
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
            listeners : {
               click : this.saveHandler,
               scope : this
            }
         },{
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
            listeners : {
               click : function()
               {
                  this.close();
               },
               scope : this
            }
         }],
         listeners : {
            afterrender : function(comp)
            {
               this.formRef = comp;
            },
            scope : this
         }
      };
   },

   saveHandler : function()
   {
      var form = this.formRef.getForm();
      if(form.isValid()){
         var values = form.getValues();
         if(this.mode == CloudController.Const.MODIFY_MODE){
            values.id = this.$_current_id_$;
         }
         if(this.hasListeners.saverequest){
            this.fireEvent('saverequest', this.targetForm, values, this.mode);
         }
         this.close();
      }
   },

   destroy : function()
   {
      delete this.formRef;
      delete this.targetForm;
      this.callParent();
   }
});