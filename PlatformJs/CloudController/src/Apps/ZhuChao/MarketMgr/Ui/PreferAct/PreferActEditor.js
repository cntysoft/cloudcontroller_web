/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 该类用来添加活动
 * 
 * @param {type} param1
 * @param {type} param2
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.PreferAct.PreferActEditor', {
   extend : 'Ext.form.Panel',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.MarketMgr',
   formRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('PREFERACT.PREFERACTEDITOR');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function (config)
   {
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE,
         layout : 'anchor'
      });
   },
   initComponent : function ()
   {
      if(null == this.record){
         var button = this.LANG_TEXT.ADD;
      } else {
         var button = this.LANG_TEXT.MODIFY;
      }
      Ext.apply(this, {
         items : this.formItemsConfig(),
         buttons : [{
               text : button,
               listeners : {
                  click : this.formButtonClickHandler,
                  scope : this
               }
            }],
         listeners : {
            afterrender : function (form){
               this.formRef = form;
               if(null != this.record){
                  var items = new Object();
                  items.name = this.record.getData().text;
                  items.intro = this.record.getData().intro;
                  items.status = this.record.getData().status;
                  form.getForm().setValues(items);
               }
            },
            scope : this
         }
      });
      this.callParent();
   },
   formItemsConfig : function ()
   {
      var items = [{
            xtype : 'textfield',
            fieldLabel : this.LANG_TEXT.NAME,
            name : 'name',
            width : 400,
            margin : '30 0 0 30',
            allowBlank : false
         }, {
            xtype : 'textarea',
            fieldLabel : this.LANG_TEXT.INTRO,
            width : 800,
            height : 300,
            name : 'intro',
            margin : '10 0 0 30',
            allowBlank : true
         }, {
            xtype : 'fieldcontainer',
            fieldLabel : this.LANG_TEXT.STATUS,
            margin : '10 0 0 30',
            defaultType : 'radiofield',
            defaults : {
               flex : 1
            },
            layout : 'hbox',
            width : 400,
            items : [
               {
                  boxLabel : this.LANG_TEXT.ACTIVE,
                  name : 'status',
                  checked : true,
                  inputValue : '1'
               }, {
                  boxLabel : this.LANG_TEXT.FREEZE,
                  name : 'status',
                  inputValue : '0'
               }
            ]
         }];
      return items;
   },
   formButtonClickHandler : function ()
   {
      var form = this.formRef.getForm();
      if(form.isValid()){
         var values = form.getValues();
         if(null == this.record){
            this.setLoading(this.LANG_TEXT.INADD);
            this.mainPanelRef.appRef.addPreferAct(values, function (response){
               this.loadMask.hide();
               if(!response.status){
                  if(response.errorCode == 23000){
                     Cntysoft.showErrorWindow(this.LANG_TEXT.ADDFAIL);
                  } else{
                     Cntysoft.showErrorWindow(response.msg);
                  }
               } else{
                  this.mainPanelRef.renderPanel('StartUp', {
                     tbar : this.mainPanelRef.tbarConfig()
                  });
                  this.mainPanelRef.treeRef.store.reload();
                  Cntysoft.showAlertWindow(this.LANG_TEXT.ADDSUCCESS);
               }
            }, this);
         } else{
            values.id = this.record.getId();
            this.setLoading(this.LANG_TEXT.INMODIFY);
            this.mainPanelRef.appRef.modifyPreferAct(values, function (response){
               this.loadMask.hide();
               if(!response.status){
                  if(response.errorCode == 23000){
                     Cntysoft.showErrorWindow(this.LANG_TEXT.MODIFYFAIL);
                  } else{
                     Cntysoft.showErrorWindow(response.msg);
                  }
               } else{
                  this.mainPanelRef.renderPanel('StartUp', {
                     tbar : this.mainPanelRef.tbarConfig()
                  });
                  this.mainPanelRef.treeRef.store.reload();
                  Cntysoft.showAlertWindow(this.LANG_TEXT.MODIFYSUCCESS);
               }
            }, this);
         }
      } else{
         Cntysoft.showErrorWindow(this.LANG_TEXT.INFOFAIL);
      }
   },
   destroy : function ()
   {
      delete this.formRef;
      this.callParent();
   }
});

