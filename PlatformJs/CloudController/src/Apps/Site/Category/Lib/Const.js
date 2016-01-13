/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Category.Lib.Const', {
   statics : {

      PURVIEW_T_OPEN : 1,
      PURVIEW_T_SELF_OPEN : 2,
      PURVIEW_T_AUTH : 3,
      PURVIEW_T_ARCHIVE : 4,
      /*
       * 节点的详细权限
       */
      DP_DELETE_SELF : 128,
      DP_EDIT_SELF : 256,
      DP_MANAGE_CHILDREN : 512
   }
});