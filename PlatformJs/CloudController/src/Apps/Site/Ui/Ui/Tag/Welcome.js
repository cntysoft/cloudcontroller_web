/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */

Ext.define('App.Site.Ui.Ui.Tag.Welcome', {
   extend : 'Ext.panel.Panel',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.Ui',
   //private
   mainPanelRef : null,
   panelType : 'Welcome',
   tpl : [
      '<div class = "app-site-ui-ui-tag-welcome-wrapper">',
         '<div class = "app-site-ui-ui-tag-welcome-title">{TITLE}</div>',
         '<ul>',
            '<li><span>{C_DATASOURCE}</span>{D_DATASOURCE}</li>',
         '</ul>',
      '</div>'
   ],
   constructor : function(config)
   {
      config = config || {};
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         bodyPadding : 5,
         bodyStyle : 'background:#ffffff',
         closable : true,
         border : true
      });
   },
   initComponent : function()
   {
      this.addListener({
         afterrender : this.afterRenderHandler,
         scope : this
      });
      this.callParent();
   },
   afterRenderHandler : function()
   {
      var U_TEXT = this.GET_LANG_TEXT('TAG.WELCOME');
      this.setTitle(U_TEXT.TITLE);
      this.update(U_TEXT);
   },
   destroy : function()
   {
      delete  this.mainPanelRef;
      Ext.destroy(this.el);
      this.callParent();
   }
});