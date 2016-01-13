/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.CustomForm.Widget.Entry', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires: [
      'Ext.layout.container.Border',
      'App.Site.CustomForm.Ui.QueryPanel',
      'App.Site.CustomForm.Ui.FormListView',
      'App.Site.CustomForm.Ui.MetaInfo',
      'App.Site.CustomForm.Ui.FieldListView',
      'App.Site.CustomForm.Ui.FieldEditor'
   ],

   mixins: {
      multiTabPanel: 'SenchaExt.Mixin.MultiTabPanel'
   },

   panelClsMap: {
      FormList : 'App.Site.CustomForm.Ui.FormListView',
      FieldList : 'App.Site.CustomForm.Ui.FieldListView',
      MetaInfo : 'App.Site.CustomForm.Ui.MetaInfo',
      FieldEditor : 'App.Site.CustomForm.Ui.FieldEditor',
      InfoList : 'App.Site.CustomForm.Ui.InfoListView'
   },
   /*
    * {@link WebOs.Mixin.MultiTabPanel#initPanelType initPanelType}
    * @property {String} initPanelType
    */
   initPanelType : 'FormList',

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
      var C = WebOs.Kernel.Const;
      if(panel.panelType == 'MetaInfo'){
         if(!config || config.mode == C.NEW_MODE){
            panel.gotoNewMode();
         } else{
            panel.loadForm(config.initLoadId);
         }
      } else if(panel.panelType == 'FieldList'){
         panel.loadFields(config.targetForm.id, config.targetForm.name, config.targetForm.key);
      }
   },

   getQueryPanelConfig : function()
   {
      return {
         xtype : 'sitecustomformuiquerypanel',
         region : 'west',
         width : 250,
         collapsible : true,
         margin : '0 1 0 0',
         mainWidgetRef : this
      };
   }
});