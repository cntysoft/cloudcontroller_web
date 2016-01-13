/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.Setting.Widget.MetaInfo', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT('META_INFO');
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('META_INFO');
   },
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         layout: {
            type: 'table',
            columns: 3
         },
         bodyPadding : 10,
         width: 500,
         minWidth: 500,
         minHeight: 300,
         height: 300,
         resizable: false,
         bodyStyle: 'background:#ffffff',
         maximizable: false
      });
   },
   initComponent: function()
   {
      var BTN = this.LANG_TEXT.BTN;
      Ext.apply(this, {
         items : [{
               xtype : 'button',
               text : BTN.GENERATE_SITE_KEY_MAP,
               listeners : {
                  click : this.generateSiteKeyMapHandler,
                  scope : this
               }
         }]
      });
      this.callParent();
   },
   
   generateSiteKeyMapHandler : function()
   {
      this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.OP'));
      this.appRef.generateSiteKeyMap(function(response){
         this.loadMask.hide();
         if(!response.status){
            Cntysoft.Kernel.Utils.processApiError(response);
         }else{
            Cntysoft.showInfoMsgWindow(Cntysoft.GET_LANG_TEXT('MSG.OP_OK'));
         }
      }, this);
   },
   
   destroy: function()
   {
      this.callParent();
   }
});