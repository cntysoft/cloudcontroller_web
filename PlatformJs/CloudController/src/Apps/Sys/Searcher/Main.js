/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.Searcher.Main', {
   extend : 'WebOs.Kernel.ProcessModel.App',
   requires: [
      'App.Sys.Searcher.Lang.zh_CN',
      //'App.Sys.User.Const',
      'App.Sys.Searcher.Widget.Entry',
      'App.Sys.Searcher.Widget.GoodsIndexBuilder',
      'App.Sys.Searcher.Widget.GInfosIndexBuilder'
   ],
   /**
    * @inheritdoc
    */
   id : 'Sys.Searcher',
   widgetMap : {
      Entry : 'App.Sys.Searcher.Widget.Entry',
      GoodsIndex : 'App.Sys.Searcher.Widget.GoodsIndexBuilder',
      GInfosIndex : 'App.Sys.Searcher.Widget.GInfosIndexBuilder'
   },
   
   buildGInfosIndexByIds : function(ids, force, callback, scope)
   {
      this.callApp('IndexBuilder/buildGInfosIndexByIds', {
         ids : ids,
         force : force
      }, callback, scope);
   },
   buildGInfosIndexByCategory : function(cid, page, pageSize, force, callback, scope)
   {
      this.callApp('IndexBuilder/buildGInfosIndexByCategory', {
         cid : cid,
         page : page,
         pageSize : pageSize,
         force : force
      }, callback, scope);
   },
   
   deleteGInfosIndexByIds : function(ids, callback, scope)
   {
      this.callApp('IndexBuilder/deleteGInfosIndexByIds', {
         ids : ids
      }, callback, scope);
   },
   
   deleteGInfosIndexByCategory : function(cid, page, pageSize, callback, scope)
   {
      this.callApp('IndexBuilder/deleteGInfosIndexByCategory', {
         cid : cid, 
         page : page, 
         pageSize : pageSize
      }, callback, scope);
   },
   
   getCategoryGInfosNum : function(cid, callback, scope)
   {
      this.callApp('IndexBuilder/getCategoryGInfosNum', {
         cid : cid
      }, callback, scope);
   },


   buildGoodsIndexByCategory : function(cid, page, pageSize, force, callback, scope)
   {
      this.callApp('IndexBuilder/buildGoodsIndexByCategory', {
         cid : cid,
         page : page,
         pageSize : pageSize,
         force : force
      }, callback, scope);
   },

   buildGoodsIndexByIds : function(ids, force, callback, scope)
   {
      this.callApp('IndexBuilder/buildGoodsIndexByIds', {
         ids : ids,
         force : force
      }, callback, scope);
   },
   
   deleteGoodsIndexByIds : function(ids, callback, scope)
   {
      this.callApp('IndexBuilder/deleteGoodsIndexByIds', {
         ids : ids
      }, callback, scope);
   },
   
   deleteGoodsIndexByCategory : function(cid, page, pageSize, callback, scope)
   {
      this.callApp('IndexBuilder/deleteGoodsIndexByCategory', {
         cid : cid, 
         page : page, 
         pageSize : pageSize
      }, callback, scope);
   },
   
   getCategoryGoodsNum : function(cid, callback, scope)
   {
      this.callApp('IndexBuilder/getGoodsNumForCategory', {
         cid : cid
      }, callback, scope);
   }
});