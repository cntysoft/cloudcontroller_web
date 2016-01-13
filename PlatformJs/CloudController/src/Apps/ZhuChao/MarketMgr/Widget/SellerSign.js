/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MarketMgr.Widget.SellerSign', {
   extend : 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires : [
      'App.ZhuChao.MarketMgr.Ui.SellerSign.ListView',
      'App.ZhuChao.MarketMgr.Ui.SellerSign.Info'
   ],
   infopanel : null,
   mixins : {
      multiTabPanel : 'SenchaExt.Mixin.MultiTabPanel'
   },
   panelClsMap : {
      ListView : 'App.ZhuChao.MarketMgr.Ui.SellerSign.ListView'
   },
   initPanelType : 'ListView',
   initPmTextRef : function ()
   {
      this.pmText = this.GET_PM_TEXT('SELLERSIGN');
   },
   initLangTextRef : function ()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('ENTRY');
   },
   gridRef : null,
   applyConstraintConfig : function (config)
   {
      Ext.apply(config, {
         resizable : false,
         height : 700,
         width : 1200,
         maximizable : true,
         maximized : false,
         title : this.LANG_TEXT.SELLERSIGN.WIDGET_TITLE
      });
      this.callParent([config]);
   },
   initComponent : function ()
   {
      this.initPanelConfig = {
         listeners : {
            afterrender : function (grid){
               this.gridRef = grid;
            },
            itemdblclick : this.gridDbClickHandler,
            scope : this
         }
      },
      Ext.apply(this, {
         items : this.getTabPanelConfig()
      });
      this.callParent();
   },
   /**
    *  表单元素双击处理
    *  
    * @param {type} grid
    * @param {type} record
    * @param {type} item
    * @param {type} index
    * @param {type} e
    * @param {type} eOpts
    * @returns {App.ZhuChao.MarketMgr.Ui.SellerSign.Info}
    */
   gridDbClickHandler : function (grid, record, item, index, e, eOpts)
   {
      if(null == this.infopanel){
         this.infopanel = new App.ZhuChao.MarketMgr.Ui.SellerSign.Info({
            autoShow : true,
            width : 400,
            record : record,
            appRef : this.appRef,
            modal : true,
            gridRef : this.gridRef,
            height : 500,
            listeners : {
               close : function (){
                  delete this.infopanel;
               },
               scope : this
            }
         });
      }
      return this.infopanel;
   }
});