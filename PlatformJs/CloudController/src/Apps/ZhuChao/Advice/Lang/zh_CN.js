/*
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 筑巢反馈意见APP语言包
 */
Ext.define('App.ZhuChao.Advice.Lang.zh_CN', {
   extend : 'Cntysoft.Kernel.AbstractLangHelper',
   data : {
      PM_TEXT: {
         DISPLAY_TEXT: '反馈信息管理程序',
         ENTRY: {
            WIDGET_TITLE: '欢迎使用反馈信息管理程序',
            TASK_BTN_TEXT: '反馈信息'
         }
      },
      UI : {
         LIST_VIEW : {
            TITLE : '反馈信息列表',
            FIELDS : {
               ID : 'ID',
               TITLE : '标题',
               TIME : '反馈时间',
               STATUS : '状态'
            },
            MENU : {
               MODIFY : '修改选中的店铺',
               DELETE : '删除选中店铺'
            },
            MSG : {
               DELETE_ASK : '您确定要删除反馈信息 <span style ="color: blue">{0}</span> ?'
            },
            STATUS : {
               NEW : '<span style="color: #B10C27">未处理</span>',
               DOWN : '<span style="color: #008800">已解决</span>'
            }
         },
         EDITOR : {
            TITLE : '反馈信息编辑器',
            BTNS : {
               MAKE_DOWN : '确认解决'
            },
            LABELS : {
               TITLE : '信息标题',
               CONTENT : '信息内容',
               MERCHANT_NAME : '商家名称',
               NAME : '商家联系人',
               PHONE : '商家联系电话',
               STATUS : '信息状态'
            },
            STATUS : {
               NEW : '未处理',
               DOWN : '已解决'
            }
         }
      }
   }
});
