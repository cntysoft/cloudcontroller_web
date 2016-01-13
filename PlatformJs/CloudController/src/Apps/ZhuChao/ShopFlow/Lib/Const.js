/*
 * Cntysoft Cloud Software Team
 * 
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.ShopFlow.Lib.Const', {
    statics : {
        ORDER_S_ALL : 100, //所有订单
        ORDER_S_UNPAY : 0, //待付款
        ORDER_S_PAYED : 1, //待发货
        ORDER_S_PACKAGE : 2, //已打包
        ORDER_S_TRANSPORT : 3, //已发货
        ORDER_S_FINISHED : 4, //已完成
        ORDER_S_CANCEL_REQUESTED : 5, //取消中
        ORDER_S_CANCELED : 6 //已取消
    }
});