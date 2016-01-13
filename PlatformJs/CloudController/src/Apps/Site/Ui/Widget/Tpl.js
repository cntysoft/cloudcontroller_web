/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Ui.Widget.Tpl', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires : [
      'App.Site.Ui.Comp.TplGridView'
   ],
   //private
   fsViewRef : null,

   initPmTextRef : function()
   {
      this.pmText = this.GET_PM_TEXT('TPL');
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
         resizable : false
      });
   },

   initComponent : function()
   {
      Ext.apply(this, {
         items : [this.getTplFsViewConfig()]
      });
      this.addListener({
         beforeclose : this.beforeCloseHandler,
         scope : this
      });
      this.callParent();
   },

   beforeCloseHandler : function()
   {
      if(!this.$_force_quit_$ && this.fsViewRef.editors.getCount() > 0){
         Cntysoft.showQuestionWindow(this.GET_LANG_TEXT('MSG.CLOSE_ASK'), function(bid){
            if('yes' == bid){
               this.$_force_quit_$ = true;
               this.close();
            }
         }, this);
         return false;
      }
      return true;
   },

   /*
    * 获取模板文件管理器
    *
    * @return {Object}
    */
   getTplFsViewConfig : function()
   {
      return {
         xtype : 'siteuicomptplgridview',
         startPaths : [
            '/Statics/Templates'
         ],
         isCreateBBar : true,
         listeners : {
            afterrender : function(view){
               this.fsViewRef = view;
            },
            scope : this
         },
         mainPanelRef : this
      };
   },
   destroy : function()
   {
      delete this.fsViewRef;
      this.callParent();
   }
});