/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Content.Ui.Im.Startup', {
   extend : 'Ext.panel.Panel',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'Site.Content',
   panelType : 'Startup',
   /*
    * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.Content',

   panelType : 'InfoPanel',

   tpl :
      [
         '<div class = "app-site-content-ui-startup-wrapper">' ,
            '<div class = "app-site-content-ui-startup-title">{D_TITLE}</div>' ,
            '<ul>' ,
               '<li><span>{C_C_M} </span> {D_C_M}</li>' ,
               '<li><span>{C_DELETE} </span> {D_DELETE}</li>' ,
            '</ul>' ,
         '</div>'
      ],

   constructor : function(config)
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.IM.STARTUP');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         bodyPadding : 5,
         bodyStyle : 'background:#ffffff',
         closeAction : 'destroy',
         border : true,
         closable : true
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
      var U_TEXT = this.LANG_TEXT;
      this.setTitle(U_TEXT.TITLE);
      this.update(U_TEXT);
   },
   /*
    * 清除资源
    */
   destroy : function()
   {
      this.mixins.langTextProvider.destroy.call(this);
      //这个是为什么呢？没有主动释放
      this.el.destroy();
      delete this.mainPanelRef;
      this.callParent();
   }
});