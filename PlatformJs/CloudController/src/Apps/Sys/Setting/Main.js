/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.Setting.Main', {
   extend: 'WebOs.Kernel.ProcessModel.App',
   requires: [
      'App.Sys.Setting.Lang.zh_CN',
      //'App.Sys.User.Const',
      'App.Sys.Setting.Widget.Entry'
   ],
   /**
    * @inheritdoc
    */
   id: 'Sys.Setting',
   /**
    * @inheritdoc
    */
   widgetMap: {
      Entry: 'App.Sys.Setting.Widget.Entry'
   },
});