/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 单页节点选项面板
 */
Ext.define('App.Site.Category.Ui.Structure.SingleTabPanel', {
    extend: 'App.Site.Category.Ui.Structure.AbstractSettingPanel',
    requires : [
        'App.Site.Category.Comp.CategoryCombo',
        'Ext.layout.container.HBox',
        'Cntysoft.Utils.Common',
        'Cntysoft.Utils.HtmlTpl',
        'CloudController.Utils',
        'Cntysoft.Component.TplSelect.Win',
        'App.Site.Category.Ui.Structure.Single.FrontStyleSetting',
        'App.Site.Category.Ui.Structure.Single.BasicSetting'
    ],
    /*
     * 设置面板的类型名称，这个在APP中生成Panel的时候使用
     *
     * @property {String} settingPanelType
     */
    panelType : 'SinglePanel',
    /*
     * @property {Cntysoft.Component.TplSelectWindow} tplSelectWinRef
     */
    tplSelectWinRef : null,
    formPanelRef : null,
    frontStyleSetting : null,
    constructor : function(config)
    {
        this.mixins.formTooltip.constructor.call(this);
        this.LANG_TEXT = this.GET_LANG_TEXT('STRUCTURE.SINGLE_TAB_PANEL');
        this.callParent([config]);
        this.initPanelTitle();
    },

    saveHandler : function()
    {
        this.doSave(this.appRef.self.N_TYPE_SINGLE);
    },
    /*
     * @inheritdoc
     */
    getTypeText : function()
    {
        return this.GET_LANG_TEXT('STRUCTURE.SINGLE_TAB_PANEL.TITLE');
    },

    /*
     * 首页的时候需要特殊处理
     */
    gotoModifyMode : function()
    {
        if(this.currentLoadedNode.nodeType == 4){
           this.categoryTreeFieldRef.setDisabled(true);
        }else{
           this.categoryTreeFieldRef.setDisabled(false);
        }
        this.callParent();
    },

    /*
     * @inheritdoc
     */
    gotoNewMode : function()
    {
       this.categoryTreeFieldRef.setDisabled(false);
       var panels = [
          this.formPanelRef,
          this.frontStyleSetting
       ];
       Ext.Array.each(panels, function(panel){
          panel.resetPanelValue();
          panel.isValueSetted = false;
       }, this);
       this.callParent();
    },

    tplSelectHandler : function(textfield)
    {
        var win = this.getTplSelectWindow(textfield);
        win.center();
        win.show();
    },

    /*
     * @return {Cntysoft.Component.TplSelectWindow}
     */
    getTplSelectWindow : function(textfield)
    {
        this.tfObj = textfield;
        var basePath = CloudController.Utils.getTplPath();
        var len = basePath.length;
        if(null == this.tplSelectWinRef){
            this.tplSelectWinRef = new Cntysoft.Component.TplSelect.Win({
                startPaths : basePath,
                listeners : {
                    tplfileselected : function(file)
                    {
                        this.tfObj.setValue(file.substr(len+1));
                    },
                    scope : this
                }
            });
        }
        return this.tplSelectWinRef;
    },

    /*
     * 获取表单项默认的监听函数
     *
     * @return {Object}
     */
    getFormItemListener : function()
    {
        return {
            afterrender : function(comp)
            {
                this.mixins.formTooltip.setupTooltipTarget.call(this, comp);
            },
            scope : this
        };
    },

    /*
     * 获取表单对象
     *
     * @return {Object}
     */
    getFormConfig : function()
    {
       this.formPanelRef = new App.Site.Category.Ui.Structure.Single.BasicSetting({
          mainPanelRef : this
       });
        this.frontStyleSetting = new App.Site.Category.Ui.Structure.Single.FrontStyleSetting({
           mainPanelRef : this
        });
        return [this.formPanelRef, this.frontStyleSetting];
    },
    
    /*
     * @param {Object} response
     */
    loadNodeHandler : function (response)
    {
        if(!this.isDestroyed){
            var cTree;
            var data;
            this.$_loading_$ = false;
            this.loadMask.hide();
            if(response.status){
                data = response.data;
                this.nodeType = data.nodeType;
                cTree = this.categoryTreeFieldRef;
                cTree.setRawValue(data.parentNodeText);
                cTree.setExpandPath(data.treePath);
                this.setValues(data, true);
                //设置当前加载的对象
                this.currentLoadedNode = data;
                this.setActiveTab(this.formPanelRef);
                this.gotoModifyMode();
            } else{
                Cntysoft.Kernel.Utils.processApiError(response);
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
         this.formPanelRef,
         this.frontStyleSetting
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
     * 获取表单的默认值
     *
     * @return {Object}
     */
    getDefaultValues : function()
    {
        //一般的默认值都是一些选项
        return {
           openType : 1
        };
    },
   doSave : function(nodeType)
   {
      /*
       * 首先获取所有表单的值
       */
      var panels = [
         this.formPanelRef,
         this.frontStyleSetting
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
    destroy : function()
    {
        this.mixins.formTooltip.destroy.call(this);
        if(this.tplSelectWinRef){
            Ext.destroy(this.tplSelectWinRef);
        }
        delete this.tplSelectWinRef;
        delete this.formPanelRef;
        delete this.frontStyleSetting;
        delete this.mainPanelRef;
        this.el.destroy();
        this.callParent();
    }
});