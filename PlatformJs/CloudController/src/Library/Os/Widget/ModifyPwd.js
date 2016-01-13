/*
 * Cntysoft Cloud Software Team
 *
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('CloudController.Os.Widget.ModifyPwd', {
   extend : 'WebOs.Component.Window',
   requires : [
      'Ext.form.Panel',
      'Ext.form.field.Text',
      'Ext.layout.container.VBox'
   ],
   mixins : {
      langTextProvider : 'Cntysoft.Mixin.LangTextProvider',
      callSys : 'Cntysoft.Mixin.CallSys'
   },
   LANG_NAMESPACE : 'CloudController.Lang',
   scriptName : 'WebOs',
   formRef : null,
   constructor : function (config)
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('WIDGET.MODIFY_PWD');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function (config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE,
         width : 650,
         height : 300,
         minWidth : 650,
         minHieght : 300,
         resizable : false,
         modal : true,
         closeAction : 'hide',
         maximizable : false,
         scrollable : true
      });
   },
   initComponent : function ()
   {
      var BTN = this.LANG_TEXT.BTN;
      var MSG = this.LANG_TEXT.MSG;
      Ext.apply(this, {
         items : this.getFormConfig(),
         buttons : [{
               text : BTN.SAVE,
               listeners : {
                  click : function (){
                     var form = this.formRef;
                     if(form.isValid()){
                        var values = form.getValues();
                        delete values.checkPassword;
                        values.newPassword = Cntysoft.Utils.Common.hashPwd(values.newPassword);
                        values.oldPassword = Cntysoft.Utils.Common.hashPwd(values.oldPassword);
                        Cntysoft.showQuestionWindow(MSG.SAVE, function (btn){
                           if('yes' === btn){
                              this.setLoading(MSG.SAVING);
                              this.callSys('modifyPwd', values, function (response){
                                 this.loadMask.hide();
                                 if(response.status){
                                    Cntysoft.showInfoMsgWindow(Cntysoft.GET_LANG_TEXT('MSG.SAVE_OK'), function (){
                                       WebOs.ME.logout(window.location.href, true);
                                    }, this);
                                 } else{
                                    Cntysoft.Kernel.Utils.processApiError(response, this.LANG_TEXT.ERROR);
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
                  click : function (){
                     Cntysoft.showQuestionWindow(MSG.CLOSE, function (btn){
                        if('yes' == btn){
                           this.close();
                        }
                     }, this);
                  },
                  scope : this
               }
            }]
      });
      this.callParent();
   },
   getFormConfig : function ()
   {
      var LABEL = this.LANG_TEXT.LABEL;
      return [{
            xtype : 'form',
            layout : 'vbox',
            bodyPadding : 15,
            width : '90%',
            defaults : {
               width : 405,
               labelWidth : 100,
               allowBlank : false
            },
            items : [{
                  xtype : 'textfield',
                  name : 'oldPassword',
                  fieldLabel : LABEL.ORIGIN_PWD,
                  inputType : 'password'
               }, {
                  xtype : 'fieldcontainer',
                  layout : 'hbox',
                  fieldLabel : LABEL.NEW_PWD,
                  width : 505,
                  items : [{
                        xtype : 'textfield',
                        inputType : 'password',
                        width : 300,
                        validator : Ext.bind(this.pwdValidator, this),
                        validateOnChange : false,
                        name : 'newPassword',
                        listeners : {
                           afterrender : function (pw){
                              this.pw = pw;
                           },
                           scope : this
                        }
                     }, {
                        xtype : 'label',
                        html : '',
                        width : 100,
                        margin : '3 0 0 5',
                        listeners : {
                           afterrender : function (label){
                              this.pwdDegreeLabel = label;
                           },
                           scope : this
                        }
                     }]
               }, , {
                  xtype : 'textfield',
                  inputType : 'password',
                  fieldLabel : LABEL.CHECK_PWD,
                  width : 405,
                  validator : Ext.bind(this.reChkPwdValidator, this),
                  validateOnChange : false,
                  name : 'checkPassword'
               }],
            listeners : {
               afterrender : function (formRef){
                  this.formRef = formRef;
               },
               scope : this
            }
         }];
   },
   /**
    * 检验密码的强度
    * 
    * @param {string} value
    * @returns {window.alias|ModifyPwd.LANG_TEXT.MSG.B_TEXT.PWD|Boolean}
    */
   pwdValidator : function (value)
   {
      var userInfo = WebOs.getSysEnv().get(WebOs.Kernel.Const.ENV_CUR_USER);
      if('' == value){
         return this.LANG_TEXT.MSG.B_TEXT.PWD;
      } else if(value.length < 6){
         return Cntysoft.GET_LANG_TEXT('MSG.PWD_TOO_SHORT');
      } else{
         //测试强度
         var level = Cntysoft.Utils.Common.markPwdDegree(userInfo.name, value);
         var MSG = Cntysoft.GET_LANG_TEXT('MSG');
         if(level < 30){
            this.pwdDegreeLabel.update('<span style = "color:red">' + MSG.PWD_LEVEL_1 + '</span>');
         } else if(level >= 30 && level < 70){
            this.pwdDegreeLabel.update('<span style = "color:#FBA800">' + MSG.PWD_LEVEL_2 + '</span>');
         } else{
            this.pwdDegreeLabel.update('<span style = "color:blue">' + MSG.PWD_LEVEL_3 + '</span>');
         }
         return true;
      }
   },
   /**
    * 验证两个输入的密码是否一样
    * 
    * @param {string} value
    * @returns {ModifyPwd.LANG_TEXT.ERROR.PWD_NOT_EQUAL|Boolean}
    */
   reChkPwdValidator : function (value)
   {
      var pwd = this.pw.getValue();
      if(pwd != value){
         return this.LANG_TEXT.ERROR.PWD_NOT_EQUAL;
      } else{
         return true;
      }
   },
   destroy : function ()
   {
      delete this.formRef;
      this.callParent();
   }
});