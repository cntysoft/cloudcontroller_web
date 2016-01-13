/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Ui.Ui.Tag.LabelMeta', {
   extend : 'Ext.form.Panel',
   alias : 'widget.siteuiuitaglabelmeta',
   requires : [
      'App.Site.Ui.Comp.TagClassifyCombo',
      'App.Site.Ui.Lib.Const',
      'Cntysoft.Utils.HtmlTpl',
      'Cntysoft.Kernel.Utils'
   ],
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },

   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.Ui',
   /*
    * 信息提示
    *
    * @property {Ext.tip.ToolTip} toolTipRef
    */
   toolTipRef : null,
   //private
   nsFieldRef : null,
   //private
   clsFieldRef : null,
   //private
   classifyComboRef : null,
   //private
   staticChkboxRef : null,
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('TAG.TAG_EDITOR.LABEL_META');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE,
         border : true,
         bodyPadding : 10,
         autoScroll : true
      });
   },

   initComponent : function()
   {
      Ext.apply(this, {
         defaults : {
            xtype : 'textfield',
            width : 400,
            labelWidth : 130,
            listeners : this.getFormItemListener()
         },
         items : this.getFormConfig()
      });
      this.toolTipRef = new Ext.tip.ToolTip({
         autoHide : false,
         anchor : 'left'
      });
      this.addListener('afterrender', function(){
         if(this.mainPanelRef.mode == CloudController.Const.MODIFY_MODE/*修改模式*/){
            this.remove(this.staticChkboxRef);
         }
      }, this, {
         single : true
      });
      this.callParent();
   },

   /*
    * 设置分类
    *
    * @param {String} classify
    */
   setClassify : function(classify)
   {
      this.classifyComboRef.setValue(classify);
   },

   reset : function()
   {
      this.getForm().reset();
   },

   isValid : function()
   {
      return this.getForm().isValid();
   },

   setValues : function(values)
   {
      this.staticChkboxChangeHandler(this, values['static']);
      this.getForm().setValues(values);
   },

   getValues : function()
   {
      var values = this.getForm().getValues();
      values['static'] =  values.hasOwnProperty('namespace') ? false : true;
      return values;
   },

   getFormItemListener : function(callback)
   {
      var me = this;
      callback = Ext.isFunction(callback) ? callback : Ext.emptyFn;
      return {
         afterrender : function(self){
            callback.call(me, self);
            self.el.addListener({
               mouseenter : function(){
                  if(undefined != self.toolTipText){
                     me.toolTipRef.setTarget(self.el);
                     me.toolTipRef.update(self.toolTipText);
                     me.toolTipRef.show();
                     self.focus();
                  }
               },
               mouseleave : function(){
                  me.toolTipRef.hide();
                  self.focus();
               }
            });
         }
      };
   },

   tagNameValidator : function(value)
   {
      var C = CloudController.Const;
      if('' == Ext.String.trim(value)){
         return this.LANG_TEXT.B_TEXT.NAME;
      } else{
         if(C.NEW_MODE == this.mainPanelRef.mode || (C.MODIFY_MODE == this.mainPanelRef.mode && value !== this.mainPanelRef.orgValues.id)){
            this.checkTagNameExist(value);
         }
         return true;
      }
   },

   checkTagNameExist : function(name)
   {
      this.mainPanelRef.mainPanelRef.appRef.tagNameExist(this.mainPanelRef.tagType, this.classifyComboRef.getValue(), name, function(response){
         if(response.status){
            if(response.data.exist){
               this.down('textfield[name="id"]').markInvalid(this.LANG_TEXT.ERROR.TAG_NAME_EXIST);
            }
         } else{
            Cntysoft.processApiError(response);
         }
      }, this);
   },

   tagClassValidator : function(value)
   {
      var C = CloudController.Const;
      if('' == Ext.String.trim(value)){
         return this.LANG_TEXT.B_TEXT.TAG_CLS;
      } else{
         if(C.NEW_MODE == this.mainPanelRef.mode || (C.MODIFY_MODE == this.mainPanelRef.mode && value !== this.mainPanelRef.orgValues.cls)){
            this.checkTagClassExist(value);
         }
         return true;
      }
   },

   checkTagClassExist : function(tagClass)
   {
      this.mainPanelRef.mainPanelRef.appRef.tagClassExist(this.mainPanelRef.tagType, this.classifyComboRef.getValue(), tagClass, function(response){
         if(response.status){
            if(response.data.exist){
               this.down('textfield[name="cls"]').markInvalid(this.LANG_TEXT.ERROR.TAG_CLS_EXIST);
            }
         } else{
            Cntysoft.processApiError(response);
         }
      }, this);
   },

   staticChkboxChangeHandler : function(box, newValue)
   {
      var mainPanel = this.mainPanelRef;
      if(newValue){
         this.remove(this.nsFieldRef, false);
         this.remove(this.clsFieldRef, false);
         //按钮的改变
         mainPanel.saveBtnRef.setDisabled(false);
         mainPanel.nextBtnRef.setDisabled(true);
      } else{
         this.add(3, this.nsFieldRef);
         this.add(4, this.clsFieldRef);
         //按钮的改变
         mainPanel.saveBtnRef.setDisabled(true);
         mainPanel.nextBtnRef.setDisabled(false);
      }
   },

   /*
    * @return Object[]
    */
   getFormConfig : function()
   {
      var me = this;
      var F = this.LANG_TEXT.FIELDS;
      var RED_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
      var TT_TEXT = this.LANG_TEXT.TT_TEXT;
      return [{
         xtype : 'siteuicomptagclassifycombo',
         tagType : App.Site.Ui.Lib.Const.TAG_LABEL,
         allowBlank : false,
         name : 'category',
         listeners : {
            afterrender : function(combo){
               this.classifyComboRef = combo;
            },
            scope : this
         }
      }, {
         xtype : 'checkbox',
         fieldLabel : F.STATIC + RED_STAR,
         toolTipText : TT_TEXT.STATIC,
         name : 'static',
         listeners : (function(){
            var ret = me.getFormItemListener(function(comp){
               this.staticChkboxRef = comp;
            });
            Ext.apply(ret, {
               change : me.staticChkboxChangeHandler,
               scope : me
            });
            return ret;
         })()
      }, {
         fieldLabel : F.NAME + RED_STAR,
         toolTipText : TT_TEXT.NAME,
         name : 'id',
         validator : Ext.bind(this.tagNameValidator, this),
         validateOnChange : false,
         validateOnBlur : true
      }, this.getTagNsConfig(),
         this.getTagClassConfig(), {
            fieldLabel : F.DESCRIPTION,
            xtype : 'textarea',
            width : 600,
            height : 120,
            name : 'description'
         }];
   },
   getTagNsConfig : function()
   {
      var F = this.LANG_TEXT.FIELDS;
      var RED_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
      var TT_TEXT = this.LANG_TEXT.TT_TEXT;
      var V_TEXT = this.LANG_TEXT.V_TEXT;
      return {
         fieldLabel : F.NS + RED_STAR,
         toolTipText : TT_TEXT.NS,
         allowBlank : false,
         vtype : 'alphanum',
         vtypeText : V_TEXT.NS,
         name : 'namespace',
         listeners : this.getFormItemListener(function(field){
            this.nsFieldRef = field;
         })
      };
   },
   getTagClassConfig : function()
   {
      var F = this.LANG_TEXT.FIELDS;
      var RED_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
      var TT_TEXT = this.LANG_TEXT.TT_TEXT;
      var V_TEXT = this.LANG_TEXT.V_TEXT;
      return {
         fieldLabel : F.CLASS + RED_STAR,
         toolTipText : TT_TEXT.CLASS,
         validator : Ext.bind(this.tagClassValidator, this),
         validateOnChange : false,
         validateOnBlur : true,
         name : 'class',
         vtype : 'alphanum',
         vtypeText : V_TEXT.CLASS,
         listeners : this.getFormItemListener(function(field){
            this.clsFieldRef = field;
         })
      };
   },

   destroy : function()
   {
      this.mixins.langTextProvider.destroy.call(this);
      delete this.nsFieldRef;
      delete this.clsFieldRef;
      delete this.mainPanelRef;
      delete this.staticChkboxRef;
      delete this.classifyComboRef;
      this.callParent();
   }
});