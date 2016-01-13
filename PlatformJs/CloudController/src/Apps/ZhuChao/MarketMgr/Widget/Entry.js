/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MarketMgr.Widget.Entry', {
   extend : 'WebOs.OsWidget.TreeNavWidget',
   initPmTextRef : function ()
   {
      this.pmText = this.GET_PM_TEXT('ENTRY');
   },
   applyConstraintConfig : function (config)
   {
      this.callParent(config);
      Ext.apply(config, {
         width : 600,
         height : 320,
         maximizable : false
      });
   },
   getNavTreeData : function ()
   {
      var U_NAMES = this.GET_LANG_TEXT('WIDGET_NAMES');
      var LANG_TEXT = this.GET_LANG_TEXT('ENTRY');
      return {
         id : 'root',
         name : this.pmText.DISPLAY_TEXT,
         children : [{
               text : LANG_TEXT.SELLERSIGN.TASK_BTN_TEXT,
               id : 'SellerSign',
               leaf : true
            }, {
               text : LANG_TEXT.USERASKFOR.TASK_BTN_TEXT,
               id : 'UserAskfor',
               leaf : true
            }, {
               text : LANG_TEXT.ADSMGR.TASK_BTN_TEXT,
               id : 'AdsMgr',
               leaf : true
            }, {
               text : U_NAMES.GIFTMANAGER,
               id : 'GiftManager',
               leaf : true
            },{
               text : LANG_TEXT.PREFERACT.TASK_BTN_TEXT,
               id : 'PreferAct',
               leaf : true
            }]
      };
   }
});