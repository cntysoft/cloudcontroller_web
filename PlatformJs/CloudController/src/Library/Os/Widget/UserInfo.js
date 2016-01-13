/*
 * Cntysoft Cloud Software Team
 *
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('CloudController.Os.Widget.UserInfo', {
   extend : 'WebOs.Component.Window',
   requires : [
      'Ext.form.Panel',
      'Ext.form.field.Date',
      'Ext.form.field.Number',
      'Ext.form.field.Text',
      'Ext.form.RadioGroup',
      'Ext.layout.container.VBox'
   ],
   mixins : {
      langTextProvider : 'Cntysoft.Mixin.LangTextProvider',
      callSys : 'Cntysoft.Mixin.CallSys'
   },
   LANG_NAMESPACE : 'CloudController.Lang',
   scriptName : 'WebOs',
   formRef : null,
   constructor : function(config)
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('WIDGET.ACCOUNT');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE,
         width : 700,
         height : 470,
         minWidth : 700,
         minHieght : 470,
         resizable : false,
         modal : true,
         closeAction : 'hide',
         maximizable : false,
         scrollable : true
      });
   },
   initComponent : function()
   {
      var BTN = this.LANG_TEXT.BTN;
      var MSG = this.LANG_TEXT.MSG;
      Ext.apply(this, {
         items : this.getFormConfig(),
         buttons : [{
            text : BTN.SAVE,
            listeners : {
               click : function(){
                  if(this.formRef.isValid()){
                     Cntysoft.showQuestionWindow(MSG.SAVE, function(btn){
                        if('yes' === btn){
                           this.setLoading(MSG.SAVING);
                           var values = this.formRef.getValues();
                           this.callSys('saveUserInfo', values, function(response){
                              this.loadMask.hide();
                              if(!response.status){
                                 Cntysoft.Utils.processApiError(response);
                              }else{
                                 Cntysoft.showAlertWindow(MSG.SAVE_SUCCESS);
                                 this.close();
                              }
                           }, this);
                        }
                     }, this);
                  }
               },
               scope : this
            }
            
         }, {
            text : BTN.CLOSE,
            listeners : {
               click : function(){
                  this.close();
               },
               scope : this
            }
         }],
         listeners : {
            render : function(){
               this.callSys('getCurrentUserInfo', '', function(response){
                  if(!response.status){
                     Cntysoft.Kernel.Utils.processApiError(response);
                  }else{
                     this.down('form').getForm().setValues(response.data);
                  }
               }, this);
            },
            scope : this
         }
      });
      this.callParent();
   },
   getFormConfig : function()
   {
      var LABEL = this.LANG_TEXT.LABEL;
      return [{
         xtype : 'form',
         layout : 'vbox',
         bodyPadding : 15,
         width : '90%',
         defaults : {
            width : 450,
            labelWidth : 150
         },
         items : [{
            xtype : 'textfield',
            name : 'name',
            fieldLabel : LABEL.NAME,
            editable : false
         }, {
            xtype : 'radiogroup',
            fieldLabel : LABEL.ENABLE_MULTI_LOGIN,
            allowBlank : false,
            items : [{
               boxLabel : LABEL.ALLOW,
               name : 'enableMultiLogin',
               inputValue : 1
            }, {
               boxLabel : LABEL.DENY,
               name : 'enableMultiLogin',
               inputValue : 0
            }]
         }, {
            xtype : 'numberfield',
            name : 'loginTimes',
            fieldLabel : LABEL.LOGIN_TIMES,
            minValue : 0
         }, {
            xtype : 'datefield',
            name : 'lastLoginTime',
            fieldLabel : LABEL.LAST_LOGIN_TIME,
            format : 'Y-m-d'
         }, {
            xtype : 'datefield',
            name : 'lastLogoutTime',
            fieldLabel : LABEL.LAST_LOGOUT_TIME,
            format : 'Y-m-d'
         }, {
            xtype : 'textfield',
            name : 'lastLoginIp',
            fieldLabel : LABEL.LAST_LOGIN_IP
         }, {
            xtype : 'datefield',
            name : 'lastModifyPwdTime',
            fieldLabel : LABEL.LAST_LMODIFY_PWD_TIME,
            format : 'Y-m-d'
         }, {
            xtype : 'numberfield',
            name : 'loginErrorTimes',
            fieldLabel : LABEL.LOGIN_ERROR_TIMES,
            allowBlank : false,
            minValue : 0
         }],
      listeners : {
         afterrender : function(formRef){
            this.formRef = formRef;
         },
         scope : this
      }
      }];
   },
   destroy : function()
   {
      delete this.formRef;
      this.callParent();
   }
});