/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Setting.Lang.zh_CN', {
   extend : 'Cntysoft.Kernel.AbstractLangHelper',
   data : {
      PM_TEXT : {
         DISPLAY_TEXT : '站点设置',
         ENTRY : {
            WIDGET_TITLE : '欢迎使用站点设置程序',
            TASK_BTN_TEXT : '站点设置'
         },
         SITE_INFO : {
            WIDGET_TITLE : '站点基本信息设置面板',
            TASK_BTN_TEXT : '站点基本信息设置'
         }
      },
      WIDGET_NAMES : {
         SITE_INFO : '站点基本信息'
      },
      SITE_CONFIG : {
         UI : {
            TITLE : '站点信息配置',
            LABEL : {
               SITE_NAME : '网站名称',
               SITE_TITLE : '网站标题',
               BEIAN : '网站备案',
               COPY_RIGHT : '版权信息',
               SITE_KEYWORD : '网站关键字',
               SITE_DESCRIPTION : '网站描述'
            }
         },
         MSG : {
            TOOLTIP : {
               SITE_NAME : '请填写网站的名称，名称将在系统栏目处显示',
               SITE_TITLE : '请填写网站标题，这个将在浏览器窗口标题栏上进行显示',
               BEIAN : '请填写网站备案信息，这个信息一般在网站底部进行显示',
               COPY_RIGHT : '请输入网站的版权信息，这个信息一般出现在网站底部',
               SITE_KEYWORD : '针对搜索引擎设置的关键词, 这个信息运用于首页和没有单独设置关键字的节点',
               SITE_DESCRIPTION : '针对搜索引擎设置的网页描述， 这个信息运用于首页和没有单独设置页面描述的节点'
            }
         }
      }
   }
});