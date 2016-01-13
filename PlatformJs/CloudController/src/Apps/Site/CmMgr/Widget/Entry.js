/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.CmMgr.Widget.Entry', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires: [
      'Ext.layout.container.Border',
      'App.Site.CmMgr.Ui.QueryPanel',
      'App.Site.CmMgr.Ui.ModelListView',
      'App.Site.CmMgr.Ui.MetaInfo',
      'App.Site.CmMgr.Ui.FieldListView',
      'App.Site.CmMgr.Ui.FieldEditor'
   ],

   mixins: {
      multiTabPanel: 'SenchaExt.Mixin.MultiTabPanel'
   },

   panelClsMap: {
      ModelList : 'App.Site.CmMgr.Ui.ModelListView',
      FieldList : 'App.Site.CmMgr.Ui.FieldListView',
      MetaInfo : 'App.Site.CmMgr.Ui.MetaInfo',
      FieldEditor : 'App.Site.CmMgr.Ui.FieldEditor'
   },
   /*
    * {@link WebOs.Mixin.MultiTabPanel#initPanelType initPanelType}
    * @property {String} initPanelType
    */
   initPanelType : 'ModelList',

   initPmTextRef : function()
   {
      this.pmText = this.GET_PM_TEXT('ENTRY');
   },

   initLangTextRef : function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('ENTRY');
   },

   /*
    * @inheritdoc
    */
   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         width : 1100,
         minWidth : 1100,
         height : 500,
         minHeight : 500,
         maximizable : true,
         layout : 'border'
      });
   },

   initComponent : function()
   {
      Ext.apply(this, {
         items : [
            this.getQueryPanelConfig(),
            this.getTabPanelConfig()
         ]
      });
      this.callParent();
   },

   panelExistHandler : function(panel, config)
   {
      var C = CloudController.Const;
      if(panel.panelType == 'MetaInfo'){
         if(!config || config.mode == C.NEW_MODE){
            panel.gotoNewMode();
         } else{
            panel.loadModel(config.initLoadId);
         }
      } else if(panel.panelType == 'FieldList'){
         panel.loadFields(config.targetModel.id, config.targetModel.name, config.targetModel.key);
      }
   },

   getQueryPanelConfig : function()
   {
      return {
         xtype : 'sitecmmgruiquerypanel',
         region : 'west',
         width : 250,
         collapsible : true,
         margin : '0 1 0 0',
         mainWidgetRef : this
      };
   }
});