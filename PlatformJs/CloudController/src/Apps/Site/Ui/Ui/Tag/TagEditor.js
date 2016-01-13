/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Ui.Ui.Tag.TagEditor', {
   extend: 'Ext.panel.Panel',
   requires : [
      'App.Site.Ui.Lib.Const',
      'App.Site.Ui.Ui.Tag.LabelMeta',
      'App.Site.Ui.Ui.Tag.Attribute',
      'App.Site.Ui.Ui.Tag.DsMeta',
      'Cntysoft.Kernel.Utils',
      'Ext.layout.container.HBox',
      'Ext.layout.container.Card'
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
   statics : {
      /*
       * 获取支持的标签的类型
       *
       * @return {Array}
       */
      getSupportTagTypes : function()
      {
         var C = App.Site.Ui.Lib.Const;
         return [
            C.TAG_DS,
            C.TAG_LABEL
         ];
      }
   },

   /*
    * @property {String} panelType 面板的类型
    */
   panelType : 'TagEditor',
   /*
    * 支持的标签类型
    *
    * @property {String} tagType
    */
   tagType : null,
   /*
    * 标签的分类
    *
    * @property {String} classify
    */
   classify : null,
   /*
    * @property {String} qsTagName
    */
   qsTagName : null,
   /*
    * @property {Ext.button.Button} prevBtnRef
    */
   prevBtnRef : null,
   /*
    * @property {Ext.button.Button} nextBtnRef
    */
   nextBtnRef : null,
   /*
    * @property {Ext.button.Button} saveBtnRef
    */
   saveBtnRef : null,
   /*
    * @property {Ext.button.Button} cancelBtnRef
    */
   cancelBtnRef : null,
   //private
   metaInfoPanelRef : null,
   //private
   attributePanelRef : null,
   /*
    * 未修改过的数据
    *
    * @property {Object} orgValues
    */
   orgValues : null,

   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('TAG.TAG_EDITOR');
      this.applyConstraintConfig(config);
      //这样的检查有用吗？
      if(!Ext.isDefined(config.tagType)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'constructor',
            'tag type must specify'
         );
      } else{
         if(!Ext.Array.contains(this.self.getSupportTagTypes(), config.tagType)){
            Cntysoft.raiseError(
               Ext.getClassName(this),
               'constructor',
               'tag type ' + config.tagType + ' is not support'
            );
         }
      }
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE,
         layout : 'card',
         style : 'background:#ffffff'
      });
   },

   initComponent : function()
   {
      var items = [];
      var metaConfigFn = 'get' + this.tagType + 'MetaConfig';
      items.push(this[metaConfigFn]());
      items.push(this.getAttributePanelConfig());
      Ext.apply(this, {
         items : items,
         bbar : this.getBBarConfig()
      });
      if(CloudController.Const.NEW_MODE == this.mode){
         this.addListener('afterrender', function(){
            //主动设置的方式
            this.items.getAt(0).setClassify(this.classify);
         }, this, {
            single : true
         });
      } else if(CloudController.Const.MODIFY_MODE == this.mode){
         this.addListener('afterrender', function(){
            this.loadTag(this.tagType, this.classify, this.qsTagName, true);
         }, this, {
            single : true
         });
      }
      this.callParent();
   },

   /*
    * 加载指定的节点
    *
    * @param {String} tagType
    * @param {String} classify
    * @param {String} name
    * @param {String} force
    */
   loadTag : function(tagType, classify, name, force)
   {
      if(force || this.tagType != tagType || this.classify != classify || this.tagName != name){
         this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
         this.mainPanelRef.appRef.loadTag(tagType, classify, name, function(response){
            this.loadMask.hide();
            if(response.status){
               this.orgValues = response.data;
               this.items.each(function(panel){
                  panel.setValues(response.data);
               });
            } else{
               Cntysoft.processApiError(response);
            }
         }, this);
         this.setTitle(name);
         Ext.apply(this, {
            tagType : tagType,
            classify : classify,
            qsTagName : name
         });
         this.gotoModifyMode();
      }
   },

   /*
    * 进入修改模式
    */
   gotoModifyMode : function()
   {
      if(this.mode != CloudController.Const.MODIFY_MODE){
         this.mode = CloudController.Const.MODIFY_MODE;
      }
   },

   gotoNewMode : function(config)
   {
      if(this.mode != CloudController.Const.NEW_MODE){
         //主要的是清除相关的面板的内容
         this.items.each(function(panel){
            panel.reset();
         });
         //设置相关的值
         if(config && config.tagType){
            this.changTagType(config.tagType);
         }
         if(config && config.classify){
            this.items.getAt(0).setClassify(config.classify);
         }
         Ext.apply(this, config);
         this.mode = CloudController.Const.NEW_MODE;
      }
   },

   /*
    * 转换标签类型
    *
    * @param {String} tagType
    */
   changTagType : function(tagType)
   {
      if(tagType !== this.tagType){
         this.remove(this.items.getAt(0));
         var metaConfigFn = 'get' + tagType + 'MetaConfig';
         this.add(0, this[metaConfigFn]());
         this.layout.setActiveItem(this.items.getAt(0));
         this.tagType = tagType;
      }
   },

   getNextBtnRef : function()
   {
      if(!this.nextBtnRef){
         this.nextBtnRef = new Ext.button.Button({
            text : this.LANG_TEXT.NEXT_STEP,
            listeners : {
               click : this.nextStepHandler,
               scope : this
            }
         });
      }
      return this.nextBtnRef;
   },

   getPrevBtnRef : function()
   {
      if(!this.prevBtnRef){
         this.prevBtnRef = new Ext.button.Button({
            text : this.LANG_TEXT.PRE_STEP,
            listeners : {
               click : this.prevStepHandler,
               scope : this
            }
         });
      }
      return this.prevBtnRef;
   },

   getSaveBtnRef : function()
   {
      if(!this.saveBtnRef){
         this.saveBtnRef = new Ext.button.Button({
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
            listeners : {
               click : this.saveHandler,
               scope : this
            }
         });
      }
      return this.saveBtnRef;
   },

   getCancelBtnRef : function()
   {
      if(!this.cancelBtnRef){
         this.cancelBtnRef = new Ext.button.Button({
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
            listeners : {
               click : this.cancelHandler,
               scope : this
            }
         });
      }
      return this.cancelBtnRef;
   },

   saveHandler : function()
   {
      //首先判断是否合法
      if(this.metaInfoPanelRef.isValid()){
         var values = this.metaInfoPanelRef.getValues();
         if(!values['static']){
            //收集标签参数
            values.attributes = this.attributePanelRef.getValues();
         }
         this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
         this.classify = values.category;
         if(this.mode == CloudController.Const.NEW_MODE){
            this.mainPanelRef.appRef.createTag(this.tagType, values, this.afterTagSaveHandler, this);
         }else if(this.mode == WebOs.Const.MODIFY_MODE){
            this.mainPanelRef.appRef.updateTagMeta(
               this.tagType,
               this.orgValues.category,
               this.orgValues.id,
               values,
               this.afterTagSaveHandler,
               this
            );
         }
      }
   },
   afterTagSaveHandler : function(response)
   {
      this.loadMask.hide();
      if(response.status){
         var msg;
         if(this.mode == CloudController.Const.NEW_MODE/*新创建*/){
            msg = this.LANG_TEXT.MSG.CREATE_OK;
         }else{
            msg = this.LANG_TEXT.MSG.SAVE_OK;
         }
         Cntysoft.showInfoMsgWindow(msg, function(){
            this.mainPanelRef.renderPanel('List', {
               classify :  this.classify,
               tagType : this.tagType
            });
         }, this);
      } else{
         Cntysoft.processApiError(response, this.LANG_TEXT.LABEL_META.ERROR_MAP);
      }
   },

   cancelHandler : function()
   {
      Cntysoft.showQuestionWindow(this.LANG_TEXT.CANCEL_ASK, function(bid){
         if('yes' == bid){
            this.mainPanelRef.renderPanel('List', {
               classify : this.classify,
               tagType : this.tagType
            });
         }
      }, this);
   },

   nextStepHandler : function()
   {
      var layout = this.getLayout();
      if(layout.getActiveItem().isValid()){
         layout.next();
         var current = layout.getActiveItem();
         var curIndex = this.items.indexOf(current) + 1;
         if(curIndex == this.items.getCount()){
            this.getNextBtnRef().setDisabled(true);
            this.getSaveBtnRef().setDisabled(false);
            this.getPrevBtnRef().setDisabled(false);
         } else if(curIndex < this.items.getCount()){
            this.getPrevBtnRef().setDisabled(false);
         }
      }
   },
   prevStepHandler : function()
   {
      var layout = this.getLayout();
      if(layout.getActiveItem().isValid()){
         layout.prev();
         var current = layout.getActiveItem();
         var curIndex = this.items.indexOf(current) + 1;
         if(curIndex == 1){
            this.getPrevBtnRef().setDisabled(true);
            this.getNextBtnRef().setDisabled(false);
            this.getSaveBtnRef().setDisabled(true);
         } else{
            this.getNextBtnRef().setDisabled(false);
            this.getSaveBtnRef().setDisabled(true);
         }
      }
   },

   getBBarConfig : function()
   {
      return {
         xtype : 'container',
         dock : 'bottom',
         layout : {
            type : 'hbox',
            align : 'middle',
            pack : 'end'
         },
         style : 'background:#ffffff',
         padding : '2 0 0 0',
         defaults : {
            xtype : 'button',
            width : 80,
            margin : '0 0 0 5'
         },
         items : [
            this.getPrevBtnRef(),
            this.getNextBtnRef(),
            this.getSaveBtnRef(),
            this.getCancelBtnRef()
         ],
         listeners : {
            afterrender : function()
            {
               this.getPrevBtnRef().setDisabled(true);
               this.getSaveBtnRef().setDisabled(true);
            },
            scope : this
         }
      };
   },

   getDsMetaConfig : function()
   {
      return {
         xtype : 'siteuiuitagdsmeta',
         mainPanelRef : this,
         listeners : {
            afterrender : function(panel)
            {
               this.metaInfoPanelRef = panel;
            },
            scope : this
         }
      };
   },
   getLabelMetaConfig : function()
   {
      return {
         xtype : 'siteuiuitaglabelmeta',
         mainPanelRef : this,
         listeners : {
            afterrender : function(panel)
            {
               this.metaInfoPanelRef = panel;
            },
            scope : this
         }
      };
   },

   getAttributePanelConfig : function()
   {
      return {
         xtype : 'siteuiuitagattribute',
         mainPanel : this,
         listeners : {
            afterrender : function(panel)
            {
               this.attributePanelRef = panel;
            },
            scope : this
         }
      };
   },

   destroy : function()
   {
      delete this.mainPanelRef;
      delete this.attributePanelRef;
      delete this.metaInfoPanelRef;
      delete this.prevBtnRef;
      delete this.nextBtnRef;
      delete this.saveBtnRef;
      delete this.cancelBtnRef;
      if(this.loadMask){
         this.loadMask.destroy();
         delete this.loadMask;
      }
      this.callParent();
   }
});