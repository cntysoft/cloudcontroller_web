/*
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.ShopFlow.Lang.zh_CN', {
    extend : 'Cntysoft.Kernel.AbstractLangHelper',
    data : {
        PM_TEXT : {
            DISPLAY_TEXT : '订单管理',
            ENTRY : {
                WIDGET_TITLE : '欢迎使用订单管理程序',
                TASK_BTN_TEXT : '订单管理'
            }
        },
        UI : {
            LIST_VIEW : {
                TITLE : '订单列表',
                EMPTY_TEXT : '没有订单哦～',
                SEARCH : '查询',
                FIELDS : {
                    NUMBER : '订单编号',
                    NAME : '用户名称',
                    TIME : '下单时间',
                    MERCHANT : '商家名称',
                    PRICE : '订单金额',
                    TYPE : '订单类型',
                    STATUS : '订单状态'
                },
                TBAR : {
                    NUMBER : '订单编号',
                    MERCHANT : '商家名称',
                    SEARCH : '搜索'
                },
                GRID_TITLE : {
                    ALL : '全部订单',
                    UNPAY : '待付款',
                    PAYED : '待发货',
                    TRANSPORT : '已发货',
                    FINISHED : '已完成',
                    CANCEL_REQUEST : '待取消',
                    CANCELED : '已取消'
                },
                ORDER_STATUS : {
                    0 : '<span style="color:magenta">待付款</span>',
                    1 : '<span style="color:deeppink">待发货</span>',
                    3 : '<span style="color:deepskyblue">待收货</span>',
                    4 : '<span style="color:green">已完成</span>',
                    5 : '<span style="color:blue">待取消</span>',
                    6 : '<span style="color:orange">已取消</span>'
                },
                ORDER_TYPE : {
                    0 : '正常订单',
                    1 : '<span style="color:green">主订单</span>',
                    2 : '<span style="color:orange">子订单</span>'
                },
                MENU : {
                    VIEW : '查看订单'
                }
            },
            ORDER_EDITOR : {
                TITLE : '订单信息查看器',
                BTNS : {
                    CLOSE : '关闭窗口'
                },
                ORDER_STATUS : {
                    0 : '<span style="color:magenta">待付款</span>',
                    1 : '<span style="color:deeppink">待发货</span>',
                    3 : '<span style="color:deepskyblue">待收货</span>',
                    4 : '<span style="color:green">已完成</span>',
                    5 : '<span style="color:blue">待取消</span>',
                    6 : '<span style="color:orange">已取消</span>'
                },
                PAY_TYPE : {
                    1 : '货到付款',
                    2 : '在线支付',
                    3 : '公司转账'
                },
                BASIC_FORM : {
                    TITLE : '订单基本信息',
                    FIELDS : {
                        NUMBER : '订单编号',
                        STATUS : '订单状态',
                        RECEIPT : '发票信息',
                        COMMENT : '备注信息',
                        PAYTYPE : '支付方式',
                        ORDERTIME : '下单时间',
                        PRICE : '订单金额'
                    }
                },
                PRICE_FORM : {
                    TITLE : '订单金额信息',
                    FIELDS : {
                        GOODS : '商品金额',
                        FEE : '运费金额',
                        DISCOUNT : '优惠金额',
                        TOTAL : '订单总价'
                    }
                },
                USER_FORM : {
                    TITLE : '订单收货信息',
                    FIELDS : {
                        NAME : '收货人',
                        PHONE : '手机号码',
                        TEL : '联系电话',
                        ADDRESS : '收货地址'
                    }
                },
                GOODS_GRID : {
                    TITLE : '订单商品列表',
                    COLS : {
                        IMG : '商品图片',
                        TITLE : '商品名称',
                        MERCHANT : '商家名称',
                        PRICE : '商品单价',
                        COUNT : '商品数量',
                        TOTAL : '小计'
                    }
                }
            }
        }
    }
});