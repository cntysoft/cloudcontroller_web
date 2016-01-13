/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 筑巢商品分类管理，查询属性窗口类
 */
Ext.define('App.ZhuChao.CategoryMgr.Comp.QueryAttrsWindow', {
   extend: 'WebOs.Component.Window',
   mixins: {
      fcm: 'Cntysoft.Mixin.ForbidContextMenu',
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey: 'App.ZhuChao.CategoryMgr',
   mode: 1,
   categoryId: -1,
   attrNameComboRef: null,
   optValueMap: null,
   optValueAddBtnRef: null,
   attrValueWinRef: null,
   formRef: null,
   constructor: function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('COMP.QUERY_ATTRS_WINDOW');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         layout: {
            type: 'fit'
         },
         bodyPadding: 10,
         resizable: false,
         width: 800,
         height: 200,
         modal: true,
         closeAction: 'hide',
         title: this.LANG_TEXT.TITLE
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         buttons: [{
               text: Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
               listeners: {
                  click: this.saveHandler,
                  scope: this
               }
            }, {
               text: Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
               listeners: {
                  click: function()
                  {
                     this.close();
                  },
                  scope: this
               }
            }],
         items: {
            xtype: 'form',
            items: [
               this.getCategoryAttrNameConfig(),
               this.getOptValueConfig()
            ],
            listeners: {
               afterrender: function(comp) {
                  this.formRef = comp;
               },
               scope: this
            }
         }
      });
      this.addListener({
         show: function() {
            if (this.categoryId != -1) {
               this.loadQueryAttrNames();
            }
         },
         close: this.closeHandler,
         scope: this
      });
      this.callParent();
   },
   setTargetCategory: function(categoryId)
   {
      this.categoryId = categoryId;
   },
   loadQueryAttrNames: function()
   {
      this.appRef.getCategoryAttrNames(this.categoryId, function(response) {
         if (!response.status) {
            Cntysoft.Kernel.Utils.processApiError(response);
         } else {
            response.data.unshift({
               name : '价格'
            });
            this.attrNameComboRef.store.loadData(response.data);
         }
      }, this);

   },
   loadQueryAttrValues: function(values)
   {
      if (!this.rendered) {
         this.addListener('afterrender', function() {
            this.loadQueryAttrValues(values);
         }, this);
         return;
      }
      this.formRef.getForm().setValues(values);
      this.gotoModifyMode();
   },
   gotoNewMode: function()
   {
      if (this.mode != CloudController.Const.NEW_MODE) {
         this.attrNameComboRef.setDisabled(false);
         this.mode = CloudController.Const.NEW_MODE;
      }
   },
   gotoModifyMode: function()
   {
      if (this.mode != CloudController.Const.MODIFY_MODE) {
         this.attrNameComboRef.setDisabled(true);
         this.mode = CloudController.Const.MODIFY_MODE;
      }
   },
   saveHandler: function()
   {
      var form = this.formRef.getForm();
      if (form.isValid()) {
         if (this.hasListeners.saverequest) {
            this.attrNameComboRef.setDisabled(false);
            this.fireEvent('saverequest', form.getValues(), this.mode);
         }
      }

      this.close();
   },
   closeHandler: function()
   {
      this.attrNameComboRef.store.removeAll();
      this.formRef.getForm().reset();
      this.gotoNewMode();
   },
   addAttrValueHandler: function()
   {
      var win = this.getAttrValueWin();
      win.center();
      win.show();
   },
   getCategoryAttrNameConfig: function()
   {
      var FIELDS = this.LANG_TEXT.FIELDS;
      return {
         xtype: 'combo',
         name: 'name',
         editable: false,
         fieldLabel: FIELDS.ATTR_NAME,
         store: new Ext.data.Store({
            fields: [
               {name: 'name', type: 'string', persist: false}
            ]
         }),
         queryMode: 'local',
         displayField: 'name',
         valueField: 'name',
         allowBlank: false,
         listeners: {
            afterrender: function(comp)
            {
               this.attrNameComboRef = comp;
            },
            scope: this
         }
      }
   },
   getOptValueConfig: function()
   {
      var FIELDS = this.LANG_TEXT.FIELDS;
      return {
         xtype: 'textfield',
         width: 600,
         fieldLabel: FIELDS.ATTR_VALUES,
         name: 'optValues',
         allowBlank: false
      };
   },
   destroy: function()
   {
      delete this.attrNameComboRef;
      delete this.optValueAddBtnRef;
      delete this.formRef;
      this.callParent();
   }
});
