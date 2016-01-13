/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 节点管理开始页面,暂时就放点介绍性的文字
 */
Ext.define('App.Site.Category.Ui.Structure.Startup', {
   extend: 'Ext.panel.Panel',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.Site.Category',
   panelType : 'Startup',
   tpl :
   [
      '<div class = "app-site-category-ui-startup-wrapper">',
         '<div class = "app-site-category-ui-startup-title">{D_TITLE}</div>',
         '<ul>' +
            '<li><span>{C_GENERAL} </span> {D_GENERAL}</li>',
            '<li><span>{C_SINGLE} </span> {D_SINGLE}</li>',
            '<li><span>{C_LINK} </span> {D_LINK}</li>',
         '</ul>',
      '</div>'
   ],
   constructor : function(config)
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('STRUCTURE.STARTUP');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   initComponent : function()
   {
      this.addListener({
         afterrender : this.afterRenderHandler,
         scope : this
      });
      this.callParent();
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         bodyPadding : 5,
         closable : true,
         border : false,
         closeAction : 'destroy'
      });
   },

   afterRenderHandler : function()
   {
      var U_TEXT = this.LANG_TEXT;
      this.setTitle(U_TEXT.TITLE);
      this.update(U_TEXT);
   },

   destroy : function()
   {
      this.mixins.langTextProvider.destroy.call(this);
      //这个是为什么呢？没有主动释放
      this.el.destroy();
      delete this.mainPanelRef;
      this.callParent();
   }
});