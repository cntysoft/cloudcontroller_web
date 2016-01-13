/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Ui.Widget.Tag', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires : [
      'SenchaExt.Tab.Panel',
      'Ext.layout.container.Border',
      'App.Site.Ui.Ui.Tag.ClassifyTree',
      'App.Site.Ui.Ui.Tag.Welcome',
      'App.Site.Ui.Ui.Tag.ListView',
      'App.Site.Ui.Ui.Tag.TagEditor',
      'App.Site.Ui.Ui.Tag.FsView'
   ],
   mixins: {
      multiTabPanel : 'SenchaExt.Mixin.MultiTabPanel',
      formTooltip : 'Cntysoft.Mixin.FormTooltip'
   },

   panelClsMap : {
      Welcome : 'App.Site.Ui.Ui.Tag.Welcome',
      List : 'App.Site.Ui.Ui.Tag.ListView',
      TagEditor : 'App.Site.Ui.Ui.Tag.TagEditor',
      //TagWizard : 'App.Cms.UiManager.Ui.Tag.AddTagPanel',
      TagFsView : 'App.Site.Ui.Ui.Tag.FsView'
   },
   /*
    * {@link WebOs.Mixin.MultiTabPanel#initPanelType initPanelType}
    * @property {String} initPanelType
    */
   initPanelType : 'Welcome',
   /*
    *  @property {App.Site.Ui.Ui.Tag.ClassifyTree} classifyTreePanelRef
    */
   classifyTreePanelRef : null,
   //private
   classifyPanelRef : null,
   initPmTextRef : function()
   {
      this.pmText = this.GET_PM_TEXT('TAG');
   },

   initLangTextRef : function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('TAG');
   },
   constructor : function()
   {
      this.mixins.formTooltip.constructor.call(this);
      this.callParent(arguments);
   },

   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         width : 1200,
         minWidth : 1200,
         minHeight : 500,
         height : 500,
         maximizable : true,
         resizable : false,
         bodyStyle : {
            background : '#ffffff'
         },
         layout : {
            type : 'border'
         }
      });
   },

   initComponent : function()
   {
      Ext.apply(this, {
         items : [this.getQueryConfig(),this.getTabPanelConfig()]
      });
      //this.addListener('beforeclose', this.beforeCloseHandler, this);
      this.callParent();
   },

   itemClickHandler : function(treePanel, record)
   {
      var C = App.Site.Ui.Lib.Const;
      if(C.N_T_CLASSIFY == record.get('nodeType')){
         this.renderPanel('List', {
            classify : record.get('id'),
            tagType : record.parentNode.get('id'),
            mainPanelRef : this
         });
      }
   },

   /*
    * 树菜单点击事件
    *
    * @param {Ext.data.Model} record
    * @param {Integer} code
    */
   treeNodeActionHandler : function(record, code)
   {
      var MSG = this.LANG_TEXT.CLASSIFY_TREE.MSG;
      var A_MAP = App.Site.Ui.Ui.Tag.ClassifyTree.A_MAP;
      switch (code) {
         case A_MAP.CREATE_CLASSIFY:
            this.getClassifyPanelConfig({
               rootType : record.get('id'),
               classify : ''
            });
            break;
         case A_MAP.CREATE_TAG:
            this.renderPanel('TagEditor', {
               tagType : record.parentNode.get('id'),
               classify : record.get('id'),
               mode : CloudController.Const.NEW_MODE/* 1 为全新模式*/
            });
            break;
         case A_MAP.RENAME_CLASSIFY:
            this.getClassifyPanelConfig({
               rootType : record.get('parentId'),
               classify : record.get('id')
            });
            break;
         case A_MAP.DELETE_CLASSIFY:
            Cntysoft.showQuestionWindow(MSG.DELETE_CLASSIFY, function(btn){
               if('yes' == btn){
                  var data = [];
                  data['classify'] = record.get('id');
                  data['rootType'] = record.get('parentId');
                  this.setLoading(MSG.DELETING);
                  this.appRef.deleteClassify(data, function(response){
                     this.loadMask.hide();
                     if(!response.status){
                        Cntysoft.processApiError(response);
                     }else{
                        Cntysoft.showAlertWindow(MSG.DELETE_SUCCES, function(){
                           this.renderPanel('Welcome');
                           this.classifyTreePanelRef.getStore().reload();
                        }, this);
                     }
                  }, this);
               }
            }, this);
            break;
      }
   },

   classifyPanelSetValues : function(config)
   {
      this.classifyPanelRef.down('form').getForm().setValues({
         rootType : config.rootType,
         newClassify : config.classify
      });
   },

   /*
    * 创建新分类和修改分类名的操作面板
    */
   getClassifyPanelConfig : function(config)
   {
      var CLASSIFY = this.LANG_TEXT.CLASSIFY_PANEL;
      this.classifyConfig = config;
      if(this.classifyPanelRef){
         this.classifyPanelSetValues(config);
         this.classifyPanelRef.show();
      }else{
         return new Ext.window.Window({
            title : CLASSIFY.TITLE,
            width : 400,
            height : 150,
            closeAction : 'hide',
            autoShow : true,
            modal : true,
            items : [{
               xtype : 'form',
               width : 380,
               height : 100,
               padding : '20 10 0',

               defaults : {
                  allowBlank : false,
                  listeners : {
                     afterrender : function(formItem)
                     {
                        this.mixins.formTooltip.setupTooltipTarget.call(this, formItem);
                     },
                     scope : this
                  }
               },
               items : [{
                  xtype : 'textfield',
                  fieldLabel : CLASSIFY.FIELD_LABEL.CLASSIFY,
                  name : 'newClassify',
                  labelWidth : 100,
                  toolTipText : CLASSIFY.TOOLTIPTEXT.CLASSIFY
               }, {
                  xtype : 'hiddenfield',
                  name : 'rootType'
               }]
            }],
            buttons : [{
               text : CLASSIFY.BTN.SAVE,
               listeners : {
                  click : this.classifyChangeHandler,
                  scope : this
               }
            }, {
               text : CLASSIFY.BTN.RESET,
               listeners : {
                  click : function(){
                     this.classifyPanelRef.close();
                  },
                  scope : this
               }
            }],
            listeners : {
               afterrender : function(obj){
                  this.classifyPanelRef = obj;
                  this.classifyPanelSetValues(this.classifyConfig);
               },
               beforeclose : function(obj){
                  var values = obj.down('form').getValues();
                  if(!Ext.Object.equals(this.classifyConfig, values)){
                     Cntysoft.showQuestionWindow(CLASSIFY.MSG.BEFORE_CLOSE, function(btn){
                        if('yes' == btn){
                           this.classifyPanelRef.hide();
                        }
                     }, this);
                     return false;
                  }
               },
               scope : this
            }
         });
      }
   },

   panelExistHandler : function(panel, config)
   {
      var panelType = panel.panelType;
      if(panelType == 'List'){
         panel.loadTag(config.classify, config.tagType);
      } else if(panelType == 'TagWizard'){
         if(config.mode == CloudController.Const.NEW_MODE){
            //清空表单
            panel.gotoNewMode(config);
            panel.changTagType(config.tagType);
         }
      }
   },

   classifyChangeHandler : function()
   {
      var MSG = this.LANG_TEXT.CLASSIFY_TREE.MSG;
      var form = this.classifyPanelRef.down('form');
      if(!form.isValid()){
         return false;
      }
      var values = form.getValues();
      values['classify'] = '';
      if('' !== this.classifyConfig.classify){
         values['classify'] = this.classifyConfig.classify;
      }
      if(!Ext.isEmpty(values['newClassify'])) {
         values['newClassify'] = Ext.String.trim(values['newClassify']);
      }
      if(!Ext.Object.equals(this.classifyConfig, values)){
         this.classifyPanelRef.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
         this.appRef.classifyChange(values, function(response){
            this.classifyPanelRef.loadMask.hide();
            if(!response.status){
               Cntysoft.processApiError(response);
            } else{
               Cntysoft.showAlertWindow(MSG.CHANGE_SUCCESS, function(){
                  this.classifyPanelRef.hide();
                  this.classifyTreePanelRef.getStore().reload();
               }, this);
            }
         }, this);
         return false;
      } else{
         Cntysoft.showAlertWindow(MSG.NO_CHANGE);
         return false;
      }
   },

   getQueryConfig : function()
   {
      return {
         region : 'west',
         xtype : 'siteuiuitagclassifytree',
         width : 250,
         collapsible : true,
         margin : '0 1 0 0',
         mainWidgetRef : this,
         listeners : {
            afterrender : function(panel)
            {
               this.classifyTreePanelRef = panel;
            },
            itemclick : this.itemClickHandler,
            treenodeaction : this.treeNodeActionHandler,
            scope : this
         }
      };
   }
});