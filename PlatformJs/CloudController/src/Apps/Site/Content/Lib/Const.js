/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Content.Lib.Const',{
   statics : {
      INFO_M_ALL : 0,
      /*
       * 信息的状态
       */
      INFO_S_DRAFT : 1,
      INFO_S_PEEDING : 2,
      INFO_S_VERIFY : 3,
      INFO_S_REJECTION : 4,
      INFO_S_ALL : 5,
      INFO_S_DELETE : 6,
      /*
       * 信息种类英文名
       */
      ARTICLE : 'Article',
      IMAGE : 'Image',
      FILE : 'File',
      VIDEO : 'Video',
      FRIENDLINK : 'FriendLink',
      A_DS : '$$',
      B_DS : '|',
      /*
       * 权限键值常量
       */
      PK_INFO_MANAGE : 'InfoManage',
      /*
       * 回收站管理
       */
      PK_TRASHCAN : 'Trashcan',
      /*
       * 数据字典管理
       */
      PK_DICT : 'DataDict',
      /*
       * 还原信息
       */
      PK_RESTORE : 'RestoreInfo',
      /*
       * 彻底删除信息
       */
      PK_DELETE_IFNO : 'DeleteInfo'
   }
});