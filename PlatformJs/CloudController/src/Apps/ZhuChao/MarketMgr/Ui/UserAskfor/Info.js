/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 该类生成弹出窗口，显示单个申请设计用户的详细信息
 * @param {type} param1
 * @param {type} param2
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.UserAskfor.Info', {
   extend : 'Ext.window.Window',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   panelType : 'Info',
   runableLangKey : 'App.ZhuChao.MarketMgr',
   formRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('USERASKFOR.INFO');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function (config)
   {
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE,
         bodyPadding : 40
      });
   },
   initComponent : function ()
   {
      this.appRef.askforUserRead(this.record.getId(), function (response){
         if(!response.status){
            Cntysoft.showErrorWindow(response.msg);
         } else{
            this.data = response.data;
            this.data.address = this.data.privince + this.data.city;
            if(3 == this.data.isDeal){
               this.data.isDeal = this.LANG_TEXT.BEFOREDEAL;
            } else if(1 == this.data.isDeal){
               this.data.isDeal = this.LANG_TEXT.AFTERDEAL;
            } else if(2 == this.data.isDeal){
               this.data.isDeal = this.LANG_TEXT.INDEAL;
            }
            this.formRef.getForm().setValues(this.data);
         }
      }, this);
      Ext.apply(this, {
         items : [{
               xtype : 'form',
               items : [{
                     fieldLabel : this.LANG_TEXT.NAME,
                     name : 'name',
                     readOnly : true,
                     xtype : 'textfield'
                  }, {
                     fieldLabel : this.LANG_TEXT.ADDRESS,
                     name : 'address',
                     readOnly : true,
                     fieldHeight : 50,
                     xtype : 'textfield'
                  }, {
                     fieldLabel : this.LANG_TEXT.AREA,
                     name : 'area',
                     readOnly : true,
                     fieldHeight : 50,
                     xtype : 'textfield'
                  }, {
                     fieldLabel : this.LANG_TEXT.PHONENUM,
                     name : 'phoneNum',
                     readOnly : true,
                     xtype : 'textfield'
                  }, {
                     fieldLabel : this.LANG_TEXT.ASKFORTIME,
                     name : 'signTime',
                     readOnly : true,
                     xtype : 'textfield'
                  }, {
                     fieldLabel : this.LANG_TEXT.ISDEAL,
                     name : 'isDeal',
                     readOnly : true,
                     xtype : 'textfield'
                  }],
               listeners : {
                  afterrender : function (form){
                     this.formRef = form;
                  },
                  scope : this
               }
            }],
         buttons : [{
               text : this.LANG_TEXT.GOTOBEFOREDEAL,
               isDeal : 3,
               listeners : {
                  click : this.windowButtonClickHandler,
                  scope : this
               }
            }, {
               text : this.LANG_TEXT.GOTOINDEAL,
               isDeal : 2,
               listeners : {
                  click : this.windowButtonClickHandler,
                  scope : this
               }
            }, {
               text : this.LANG_TEXT.GOTOAFTERDEAL,
               isDeal : 1,
               listeners : {
                  click : this.windowButtonClickHandler,
                  scope : this
               }
            }]
      });
      this.callParent();
   },
   /**
    * 该方法处理窗口下按钮的功能
    * 
    * @param {type} button
    * @returns {undefined}
    */
   windowButtonClickHandler : function (button)
   {
      var res = [];
      res['id'] = this.record.getId();
      res['isDeal'] = button.isDeal;
      this.appRef.askforUserContextMenuClick(res, function (response){
         if(!response.status){
            Cntysoft.showErrorWindow(response.msg);
         } else{
            this.gridRef.store.reload();
            if(3 == button.isDeal){
               this.data.isDeal = this.LANG_TEXT.BEFOREDEAL;
            } else if(1 == button.isDeal){
               this.data.isDeal = this.LANG_TEXT.AFTERDEAL;
            } else if(2 == button.isDeal){
               this.data.isDeal = this.LANG_TEXT.INDEAL;
            }
            this.formRef.getForm().setValues(this.data);
         }
      }, this);
   },
   /**
    * 消除资源
    * 
    * @returns {undefined}
    */
   destroy : function ()
   {
      delete this.appRef;
      this.mixins.langTextProvider.destroy.call(this);
      delete this.formRef;
      this.callParent();
   }
});