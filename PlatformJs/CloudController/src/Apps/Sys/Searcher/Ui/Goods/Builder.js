/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 * @createtime 2015/08/07 4:48 PM
 */
/**
 * 商品信息索引生成类定义
 */
Ext.define('App.Sys.Searcher.Ui.Goods.Builder',{
   extend: 'App.Sys.Searcher.Comp.IndexBuilder',
   /**
    * 获取信息总数信息
    * 
    * @param {Number} categoryId
    * @param {Function} callback
    * @param {Object} scope
    */
   getInfoTotalNum : function(categoryId, callback, scope)
   {
      this.appRef.getCategoryGoodsNum(categoryId, callback, scope);
   },
   /**
    * 进行生成处理
    * 
    * @param {Number} categoryId
    * @param {Number} page
    * @param {Number} pageSize
    * @param {Boolean} forceBuild
    * @param {Function} callback
    * @param {Object} scope
    */
   processBuildCycle : function(categoryId, page, pageSize, forceBuild, callback, scope)
   {
      this.appRef.buildGoodsIndexByCategory(categoryId, page, pageSize, forceBuild, callback, scope);
   },
   /**
    * 进行删除索引处理
    * 
    * @param {Number} categoryId
    * @param {Number} page
    * @param {Number} pageSize
    * @param {Boolean} forceBuild
    * @param {Function} callback
    * @param {Object} scope
    */
   processDeleteCycle : function(categoryId, page, pageSize, forceBuild, callback, scope)
   {
      this.appRef.deleteGoodsIndexByCategory(categoryId, page, pageSize, forceBuild, callback, scope);
   }
});
