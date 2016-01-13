/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.Merchant.Main', {
   extend : 'WebOs.Kernel.ProcessModel.App',
   requires : [
      'App.ZhuChao.Merchant.Lang.zh_CN'
   ],
   /**
    * @inheritdoc
    */
   id : 'ZhuChao.Merchant',
   /**
    * @inheritdoc
    */
   widgetMap : {
      Entry : 'App.ZhuChao.Merchant.Widget.Entry'
   },
   addMerchantInfo : function (data, callback, scope)
   {
      this.callApp('Mgr/addMerchantInfo', data, callback, scope);
   },
   getMerchantInfo : function (id, callback, scope)
   {
      this.callApp('Mgr/getMerchantInfo', {
         id : id
      }, callback, scope);
   },
   updateMerchantInfo : function (data, callback, scope)
   {
      this.callApp('Mgr/updateMerchantInfo', data, callback, scope);
   },
   deleteMerchantInfo : function (id, callback, scope)
   {
      this.callApp('Mgr/deleteMerchantInfo', {
         id : id
      }, callback, scope);
   },
   ensureKeyExit : function (key, callback, scope)
   {
      this.callApp('Mgr/ensureKeyExit', {
         key : key
      }, callback, scope);
   },
   sortChange : function (data, callback, scope)
   {
      this.callApp('Mgr/changeMerchantSortNum', data, callback, scope);
   }
});