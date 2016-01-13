/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.DeliveryOrder.Lang.zh_CN', {
   extend : 'Cntysoft.Kernel.AbstractLangHelper',
   data : {
      PM_TEXT : {
         DISPLAY_TEXT: '提货单管理',
         ENTRY: {
            WIDGET_TITLE: '欢迎使用提货单管理程序',
            TASK_BTN_TEXT: '提货单管理'
         }
      },
      UI : {
         ENTRY : {
            MENU : {
               ADD_ACTIVITY : '添加活动',
               EDIT_ACTIVITY : '修改活动',
               ADD_DELIVERY_ORDER : '生成提货单'
            },
            WINDOW_TITLE : '添加活动记录',
            BTN : {
               SAVE : '保存',
               CLOSE : '关闭'
            },
            FIELDS : {
               NAME : '名称'
            },
            MSG : {
               SAVING : '正在为您保存数据...'
            }
         },
         LIST_VIEW : {
            TITLE : '提货单列表',
            FIELDS : {
               ID : 'ID',
               NO : '提货单编号',
               CODE : '验证码',
               PRICE : '面值',
               STATUS : '状态',
               ISSUER : '发放人',
               ISSUE_TIME : '发放时间',
               WIN_TITLE : '修改发放人',
               SEARCH : '搜索条件',
               NUMBER_START : '起始编号',
               NUMBER_END : '结束编号'
            },
            STATUS : {
               USED : '已使用',
               UN_USED : '未使用',
               ALL : '全部'
            },
            MENU : {
               ISSUER : '修改发放人'
            },
            MSG : {
               SAVING : '正在保存您的修改,请稍候...'
            },
            BTNS : {
               ADD : '添加',
               CLOSE : '关闭',
               SEARCH : '搜索'
            },
            EMPTY_TEXT : '没有任何提货单信息'
         }
      },
      COMP : {
         ACTIVITY_TREE : {
            TITLE : '活动面板',
            ROOT_TEXT : '活动树'
         }
      }
   }
});

