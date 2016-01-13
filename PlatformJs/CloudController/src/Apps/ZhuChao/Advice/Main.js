/*
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 筑巢模块反馈意见入口类
 */
Ext.define('App.ZhuChao.Advice.Main', {
   extend : 'WebOs.Kernel.ProcessModel.App',
   requires : [
      'App.ZhuChao.Advice.Lang.zh_CN',
      'App.ZhuChao.Advice.Widget.Entry'
   ],
   /**
    * @inheritdoc
    */
   id: 'ZhuChao.Advice',
   /**
    * @inheritdoc
    */
   widgetMap : {
      Entry : 'App.ZhuChao.Advice.Widget.Entry'
   },

   makedownAdviceInfo : function(id, callback, scope)
   {
      this.callApp('Info/makedownAdviceInfo', {
         id : id
      }, callback, scope);
   },
   getAdviceInfo : function(id, callback, scope)
   {
      this.callApp('Info/getAdviceInfo', {
         id : id
      }, callback, scope);
   }

});
