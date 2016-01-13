/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MarketMgr.Main', {
   extend : 'WebOs.Kernel.ProcessModel.App',
   requires : [
      'App.ZhuChao.MarketMgr.Lang.zh_CN',
      'App.ZhuChao.MarketMgr.Const',
      'App.ZhuChao.MarketMgr.Widget.Entry',
      'App.ZhuChao.MarketMgr.Widget.GiftManager'
   ],
   id : 'ZhuChao.MarketMgr',
   widgetMap : {
      Entry : 'App.ZhuChao.MarketMgr.Widget.Entry',
      SellerSign : 'App.ZhuChao.MarketMgr.Widget.SellerSign',
      UserAskfor : 'App.ZhuChao.MarketMgr.Widget.UserAskfor',
      AdsMgr : 'App.ZhuChao.MarketMgr.Widget.AdsMgr',
      GiftManager : 'App.ZhuChao.MarketMgr.Widget.GiftManager',
      PreferAct : 'App.ZhuChao.MarketMgr.Widget.PreferAct'
   },
   sellerSignContextMenuClick : function (value, callback, scope)
   {
      this.callApp('SellerSign/deal', value, callback, scope);
   },
   sellerSignRead : function (id, callback, scope)
   {
      this.callApp('SellerSign/read', {id : id}, callback, scope);
   },
   askforUserContextMenuClick : function (value, callback, scope)
   {
      this.callApp('UserAskfor/deal', value, callback, scope);
   },
   askforUserRead : function (id, callback, scope)
   {
      this.callApp('UserAskfor/read', {id : id}, callback, scope);
   },
   addAdsModule : function (value, callback, scope)
   {
      this.callApp('AdsMgr/addAdsModule', value, callback, scope);
   },
   modifyAdsModule : function (value, callback, scope)
   {
      this.callApp('AdsMgr/modifyAdsModule', value, callback, scope);
   },
   deleteAdsModule : function (id, callback, scope)
   {
      this.callApp('AdsMgr/deleteAdsModule', {id : id}, callback, scope);
   },
   addAds : function (value, callback, scope)
   {
      this.callApp('AdsMgr/addAds', value, callback, scope);
   },
   modifyAds : function (value, callback, scope)
   {
      this.callApp('AdsMgr/modifyAds', value, callback, scope);
   },
   deleteAds : function (id, callback, scope)
   {
      this.callApp('AdsMgr/deleteAds', {id : id}, callback, scope);
   },
   addGift : function (data, callback, scope)
   {
      this.callApp('GiftMgr/addGift', data, callback, scope);
   },
   getGiftInfo : function (nid, callback, scope)
   {
      this.callApp('GiftMgr/getGiftInfo', {
         giftid : nid
      }, callback, scope);
   },
   updateGift : function (data, callback, scope){
      this.callApp('GiftMgr/updateGift', data, callback, scope);
   },
   deleteGift : function (nid, callback, scope){
      this.callApp('GiftMgr/deleteGift', {
         giftid : nid
      }, callback, scope);
   },
   addCategory : function (data, callback, scope)
   {
      this.callApp('GiftMgr/addCategory', data, callback, scope);
   },
   getCategory : function (nid, callback, scope)
   {
      this.callApp('GiftMgr/getCategory', {
         id : nid
      }, callback, scope);
   },
   updateCategory : function (data, callback, scope){
      this.callApp('GiftMgr/updateCategory', data, callback, scope);
   },
   deleteCategory : function (nid, callback, scope){
      this.callApp('GiftMgr/deleteCategory', {
         id : nid
      }, callback, scope);
   },
   addGiftGoods : function (data, callback, scope)
   {
      this.callApp('GiftMgr/addGiftGoods', data, callback, scope);
   },
   getGiftGoods : function (gid, callback, scope)
   {
      this.callApp('GiftMgr/getGiftGoods', {id : gid}, callback, scope);
   },
   updateGiftGoods : function (data, callback, scope){
      this.callApp('GiftMgr/updateGiftGoods', data, callback, scope);
   },
   deleteGiftGoods : function (gid, callback, scope){
      this.callApp('GiftMgr/deleteGiftGoods', {
         id : gid
      }, callback, scope);
   },
   getGiftGoodsList : function (id, callback, scope)
   {
      this.callApp('GiftMgr/getGiftGoodsList', {
         id : id
      }, callback, scope);
   },
   addPreferAct : function(values,callback,scope)
   {
      this.callApp('PreferAct/addPreferAct',values,callback,scope);
   },
   modifyPreferAct : function(values,callback,scope)
   {
      this.callApp('PreferAct/modifyPreferAct',values,callback,scope);
   },
   freezePreferAct : function(values,callback,scope)
   {
      this.callApp('PreferAct/freezePreferAct',values,callback,scope);
   },
   deletePreferAct : function(values,callback,scope)
   {
      this.callApp('PreferAct/deletePreferAct',values,callback,scope);
   },
   activePreferAct : function(values,callback,scope)
   {
      this.callApp('PreferAct/activePreferAct',values,callback,scope);
   },
   joinprefermerchant : function(values,callback,scope)
   {
      this.callApp('PreferAct/joinprefermerchant',values,callback,scope);
   },
   deleteJoinprefermerchant : function(values,callback,scope)
   {
      this.callApp('PreferAct/deleteJoinprefermerchant',values,callback,scope);
   }
});