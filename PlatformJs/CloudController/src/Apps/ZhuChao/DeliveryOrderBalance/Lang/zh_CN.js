/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.DeliveryOrderBalance.Lang.zh_CN', {
   extend : 'Cntysoft.Kernel.AbstractLangHelper',
   data : {
      PM_TEXT : {
         DISPLAY_TEXT : '提货单结算',
         ENTRY : {
            WIDGET_TITLE : '欢迎使用提货单结算程序',
            TASK_BTN_TEXT : '提货单结算'
         }
      },
      UI : {
         ENTRY : {
            FIELDS : {
               EMPTY_TEXT : '该商家没有任何订单',
               MERCHANT : '商家名称',
               START_TIME : '开始时间',
               END_TIME : '结束时间',
               STATUS : '订单状态',
               TOTAL_PRICE : '订单金额(单位:元)',
               TOTAL_PRICE_SUM : '订单金额',
               REAL_PRICE : '实际用券金额(单位:元)',
               REAL_PRICE_SUM : '实际用券金额',
               TIME : '下单时间',
               MECHANT : '商家名称',
               PAR_PRICE : '提货券面额(单位:元)',
               PAR_PRICE_SUM : '提货券面额',
               DO_PRICE : '实际兑券金额(单位:元)',
               DO_PRICE_SUM : '实际兑券金额',
               SEARCH : '搜索条件：',
               ID : 'ID',
               NO : '提货券编号',
               PRICE : '提货券面额',
               ISSUER : '发放人',
               ISSUE_TIME : '发放时间',
               MERCHANT_NAME : '兑换商户',
               TIME_ORDER : '兑换时间',
               TOTAL : '订单金额',
               DISCOUNT : '兑券金额',
               ORDER_STATUS : '订单状态',
               TITLE : '订单详情',
               PRINT : '去打印'
            },
            STATUS : {
               BALANCE : '已结算',
               UN_BALANCE : '未结算',
               ALL : '全部'
            },
            MENU : {
               BALANCE : '改为已结算'
            },
            MSG : {
               BALANCE : '确定要修改当前选择订单为已结算状态?',
               BALANCE_SUCCESS : '订单已结算成功！'
            },
            BTN : {
               SEARCH : '搜索',
               DOWNLOAD : '导出excel'
            }
         }
      }
   }
});

