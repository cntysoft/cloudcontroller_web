/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 普通信息索引生成器类定义
 */
Ext.define('App.Sys.Searcher.Ui.GInfos.Builder',{
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
      this.appRef.getCategoryGInfosNum(categoryId, callback, scope);
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
      this.appRef.buildGInfosIndexByCategory(categoryId, page, pageSize, forceBuild, callback, scope);
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
      this.appRef.deleteGInfosIndexByCategory(categoryId, page, pageSize, forceBuild, callback, scope);
   }
});