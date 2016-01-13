/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 设置选项面板,这个负责加载所有面板的数据，进行集中处理
 */
Ext.define('App.Site.Category.Ui.Structure.GeneralTabPanel', {
   extend: 'App.Site.Category.Ui.Structure.AbstractSettingPanel',
   requires: [
      'App.Site.Category.Ui.Structure.General.BasicSetting',
      'App.Site.Category.Ui.Structure.General.CategoryOption',
      'App.Site.Category.Ui.Structure.General.TplSetting',
      'Cntysoft.Utils.HtmlTpl',
      'Cntysoft.Kernel.Utils',
      'App.Site.Category.Lib.Const'
   ],

   /*
    * 设置面板的类型名称，这个在APP中生成Panel的时候使用
    *
    * @property {String} settingPanelType
    */
   panelType : 'GeneralPanel',

   /*
    * @property {App.Site.Category.Ui.Structure.General.BasicSettingPanel} basicSettingPanelRef
    */
   basicSettingPanelRef : null,
   /*
    * @property {App.Site.Category.Ui.Structure.General.CategoryOption} categoryOptionRef
    */
   categoryOptionRef : null,
   /*
    * @property {App.Site.Category.Ui.Structure.General.TemplateSetting} templatePanel
    */
   templatePanelRef : null,
   /*
    * @property {App.Site.Category.Ui.Structure.CategoryExtraConfigPanel} extraConfigPanel
    */
   extraConfigPanelRef : null,

   /*
    * @property {Ext.form.Label} tipLabelRef
    */
   tipLabelRef : null,

   constructor : function(config)
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('STRUCTURE.GENERAL_TAB_PANEL');
      this.mixins.formTooltip.constructor.call(this);
      this.callParent([config]);
      this.initPanelTitle();
   },
   /*
    * @event nodeloaded
    * 通知栏打开完成
    *
    * @param {Object} node
    */
   /*
    * 初始化组件
    */
   initComponent : function()
   {
      this.addListener({
         afterrender : this.stateHandler,
         scope : this
      });
      this.callParent();
   },

   /*
    * @inheritdoc
    */
   getTypeText : function()
   {
      return this.GET_LANG_TEXT('STRUCTURE.GENERAL_TAB_PANEL.TITLE');
   },

   /*
    * 获取表单的默认值
    *
    * @return {Object}
    */
   getDefaultValues : function()
   {
      //一般的默认值都是一些选项
      return {
         openType : '1'
      };
   },

   /*
    * 这里的保存有些不是很好实现
    */
   doSave : function(nodeType)
   {
      /*
       * 首先获取所有表单的值
       */
      var panels = [
         this.basicSettingPanelRef,
         this.categoryOptionRef,
         this.templatePanelRef
      ];
      var len = panels.length;
      var panel;
      var valid = true;
      //先验证
      for(var i = 0; i < len; i++){
         panel = panels[i];
         if(!panel.isPanelValid()){
            this.setActiveTab(panel);
            valid = false;
         }
      }
      if(!valid){
         return;
      }
      var data = {};
      for(var i = 0; i < len; i++) {
         panel = panels[i];
         Ext.apply(data, panel.getPanelValue());
      }
      data.pid = this.categoryTreeFieldRef.getValue();
      data.nodeType = nodeType;
      this.setActiveTab(panels[0]);
      this.currentData = data;
      var SAVE_MSG = Cntysoft.GET_LANG_TEXT('MSG.SAVE');
      var S_CONST = CloudController.Const;
      if(this.mode == S_CONST.MODIFY_MODE){
         Cntysoft.showQuestionWindow(this.COMMON_TEXT.MSG.SAVE_ASK, function(btn){
            if(btn == 'yes'){
               this.setLoading(SAVE_MSG);
               this.appRef.saveNode(data, this.afterSaveNodeHandler, this);
            }
         }, this);
      } else if(this.mode == S_CONST.NEW_MODE){
         this.setLoading(SAVE_MSG);
         this.appRef.addNode(data, this.afterSaveNodeHandler, this);
      }
   },

   saveHandler : function()
   {
      this.doSave(this.appRef.self.N_TYPE_GENERAL);
   },

   /*
    * @param {Object} response
    */
   loadNodeHandler : function(response)
   {
      if(!this.isDestroyed){
         this.$_loading_$ = false;
         var cTree;
         var data;
         this.loadMask.hide();
         if(response.status){
            data = response.data;
            this.currentLoadedNode = data;
            cTree = this.categoryTreeFieldRef;
            cTree.currentNode = data;
            if(this.hasListeners.nodeloaded){
               this.fireEvent('nodeloaded', data);
            }
            this.setValues(data, true);
            cTree.setRawValue(data.parentNodeText);
            cTree.setExpandPath(data.treePath);
            this.setActiveTab(this.basicSettingPanelRef);
            this.gotoModifyMode();
         } else{
            Cntysoft.processApiError(response);
         }
      }
   },

   /*
    * 给所有的设置面板进行设置值
    */
   setValues : function(values, isForce)
   {
      //给各个表单赋值
      var panels = [
         this.basicSettingPanelRef,
         this.categoryOptionRef,
         this.templatePanelRef
      ];
      Ext.Array.each(panels, function(panel){
         if(isForce){
            panel.applyPanelValue(values);
            panel.isValueSetted = true;
         } else if(!panel.isValueSetted){
            panel.applyPanelValue(values);
            panel.isValueSetted = true;
         }
      }, this);
   },

   /*
    * 进入新添加模式
    */
   gotoNewMode : function()
   {
      var panels = [
         this.basicSettingPanelRef,
         this.categoryOptionRef,
         this.templatePanelRef
      ];
      var S_CONST = CloudController.Const;
      var target;
      this.categoryTreeFieldRef.expandPath = null;
      this.categoryTreeFieldRef.currentNode = null;
      this.setActiveTab(this.basicSettingPanelRef);
      Ext.each(panels, function(panel){
         panel.resetPanelValue();
         panel.isValueSetted = false;
      }, this);
      this.setValues(this.getDefaultValues());
      target = this.idFieldRef;
      if(S_CONST.MODIFY_MODE == this.mode || S_CONST.NEW_MODE == this.mode && !this.idFieldRef.isHidden()){
         this.idFieldRef.setDisabled(true);
         this.idFieldRef.hide();
      }
      this.resetTipLabel();
      this.setupCategoryField();
      this.currentLoadedNode = null;
      this.mode = S_CONST.NEW_MODE;
   },


   /*
    * 获取表单设置项
    *
    * @return {Array}
    */
   getFormConfig : function()
   {
      this.basicSettingPanelRef = new App.Site.Category.Ui.Structure.General.BasicSetting({
         mainPanelRef : this
      });
      this.categoryOptionRef = new App.Site.Category.Ui.Structure.General.CategoryOption({
         mainPanelRef : this
      });
      this.templatePanelRef = new App.Site.Category.Ui.Structure.General.TplSetting({
         mainPanelRef : this
      });
      return [
         this.basicSettingPanelRef,
         this.templatePanelRef,
         this.categoryOptionRef
      ];
   },

   /*
    * 资源清除
    */
   destroy : function()
   {
      delete this.mainPanelRef;
      delete this.basicSettingPanelRef;
      delete this.categoryOptionRef;
      delete this.templatePanelRef;
      delete this.tipLabelRef;
      this.el.destroy();
      this.callParent();
   }
});