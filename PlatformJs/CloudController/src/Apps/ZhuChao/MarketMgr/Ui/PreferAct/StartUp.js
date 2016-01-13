/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.PreferAct.StartUp',{
   extend : 'Ext.panel.Panel',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.MarketMgr',
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('PREFERACT.STARTUP');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         title : this.LANG_TEXT.TITLE
      });
   },
   initComponent : function()
   {
      Ext.apply(this,{
         html : this.LANG_TEXT.TEXT
      });
      this.callParent();
   },
   destroy : function ()
   {
      this.callParent();
   }
});

