/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Setting.Main', {
   extend : 'WebOs.Kernel.ProcessModel.App',
   requires : [
      'App.Site.Setting.Lang.zh_CN',
      'App.Site.Setting.Widget.Entry',
      'App.Site.Setting.Widget.SiteInfo'
   ],
   /*
    * @inheritdoc
    */
   id : 'Site.Setting',
   /*
    * @inheritdoc
    */
   widgetMap : {
      Entry : 'App.Site.Setting.Widget.Entry',
      SiteInfo : 'App.Site.Setting.Widget.SiteInfo'
   },

   getSiteConfig : function(callback, scope)
   {
      this.getConfigByGroup('Site', callback, scope);
   },

   saveSiteConfig : function(data, callback, scope)
   {
      this.saveConfigByGroup('Site', data, callback, scope);
   },
   /*
    * @param {String} group
    * @param {Function} callback
    * @param {Object} scope
    */
   getConfigByGroup : function(group, callback, scope)
   {
      this.callApp('getConfigByGroup', {
         group : group
      }, callback, scope);
   },
   /*
    * @param {String} group
    * @param {Object} data
    * @param {Function} callback
    * @param {Object} scope
    */
   saveConfigByGroup : function(group, data, callback, scope)
   {
      this.callApp('saveConfigByGroup', {
         group : group,
         data : data
      }, callback, scope);
   }
});