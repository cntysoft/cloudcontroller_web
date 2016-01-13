/*
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.ShopFlow.Ui.OrderEditor', {
    extend : 'Ext.form.Panel',
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    /**
     * @inheritdoc
     */
    panelType : 'OrderEditor',
    /**
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.ZhuChao.ShopFlow',
    basicFormRef : null,
    priceFormRef : null,
    userFormRef : null,
    goodsGridRef : null,
    constructor : function (config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.ORDER_EDITOR');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },
    applyConstraintConfig : function (config)
    {
        Ext.apply(config, {
            border : true,
            title : this.LANG_TEXT.TITLE,
            autoScroll : true
        });
    },
    initComponent : function ()
    {
        var L = this.LANG_TEXT.BTNS;
        Ext.apply(this, {
            buttons : [{
                    text : L.CLOSE,
                    listeners : {
                        click : function (){
                            this.close();
                        },
                        scope : this
                    }
                }],
            items : [
                this.getOrderBasicConfig(),
                this.getOrderPriceConfig(),
                this.getOrderUserConfig(),
                this.getOrderGoodsConfig()
            ]
        });
        this.addListener('afterrender', this.afterRenderHandler, this);
        this.callParent();
    },
    afterRenderHandler : function ()
    {
        this.loadOrderInfo(this.targetLoadId);
    },
    loadOrderInfo : function (id)
    {
        if(this.$_current_nid_$ !== id){
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
            this.appRef.getOrderInfo(id, this.afterLoadInfoHandler, this);
            this.$_current_nid_$ = id;
        }
    },
    afterLoadInfoHandler : function (response)
    {
        this.loadMask.hide();
        if(!response.status){
            Cntysoft.Kernel.Utils.processApiError(response);
        } else{
            var data = response.data;
            //处理数据
            var basic = data['basic'];
            var status = basic['status'];
            delete basic['status'];
            basic['status'] = this.LANG_TEXT.ORDER_STATUS[status];
            var payType = basic['payType'];
            delete basic['payType'];
            basic['payType'] = this.LANG_TEXT.PAY_TYPE[payType];
            
            //进行赋值
            this.basicFormRef.getForm().setValues(basic);
            this.priceFormRef.getForm().setValues(data['price']);
            this.userFormRef.getForm().setValues(data['address']);
            var store = this.goodsGridRef.getStore();
            store.add(data['goods']);
        }
    },
    getOrderBasicConfig : function ()
    {
        var L = this.LANG_TEXT.BASIC_FORM;
        var F = L.FIELDS;
        return {
            xtype : 'form',
            title : L.TITLE,
            bodyPadding : 10,
            layout : {
                type : 'table',
                columns : 2
            },
            defaults : {
                xtype : 'displayfield',
                colspan : 1,
                width : 500,
                labelWidth : 80
            },
            items : [{
                    fieldLabel : F.NUMBER,
                    name : 'number'
                }, {
                    fieldLabel : F.STATUS,
                    name : 'status'
                }, {
                    fieldLabel : F.PRICE,
                    name : 'price'
                }, {
                    fieldLabel : F.COMMENT,
                    name : 'comment'
                }, {
                    fieldLabel : F.PAYTYPE,
                    name : 'payType'
                }, {
                    fieldLabel : F.ORDERTIME,
                    name : 'orderTime'
                }, {
                    fieldLabel : F.RECEIPT,
                    name : 'receipt'
                }],
            listeners : {
                afterrender : function (form)
                {
                    this.basicFormRef = form;
                },
                scope : this
            }
        };
    },
    getOrderPriceConfig : function ()
    {
        var L = this.LANG_TEXT.PRICE_FORM;
        var F = L.FIELDS;
        return {
            xtype : 'form',
            title : L.TITLE,
            bodyPadding : 10,
            layout : {
                type : 'table',
                columns : 2
            },
            defaults : {
                xtype : 'displayfield',
                colspan : 1,
                width : 500,
                labelWidth : 80
            },
            items : [{
                    fieldLabel : F.GOODS,
                    name : 'goodsPrice'
                }, {
                    fieldLabel : F.FEE,
                    name : 'fee'
                }, {
                    fieldLabel : F.DISCOUNT,
                    name : 'discount'
                }, {
                    fieldLabel : F.TOTAL,
                    name : 'total'
                }],
            listeners : {
                afterrender : function (form)
                {
                    this.priceFormRef = form;
                },
                scope : this
            }
        };
    },
    getOrderUserConfig : function ()
    {
        var L = this.LANG_TEXT.USER_FORM;
        var F = L.FIELDS;
        return {
            xtype : 'form',
            title : L.TITLE,
            bodyPadding : 10,
            layout : {
                type : 'table',
                columns : 2
            },
            defaults : {
                xtype : 'displayfield',
                colspan : 1,
                width : 500,
                labelWidth : 80
            },
            items : [{
                    fieldLabel : F.NAME,
                    name : 'name'
                }, {
                    fieldLabel : F.PHONE,
                    name : 'phone'
                }, {
                    fieldLabel : F.TEL,
                    name : 'tel'
                }, {
                    fieldLabel : F.ADDRESS,
                    name : 'address'
                }],
            listeners : {
                afterrender : function (grid)
                {
                    this.userFormRef = grid;
                },
                scope : this
            }
        };
    },
    getOrderGoodsConfig : function ()
    {
        var L = this.LANG_TEXT.GOODS_GRID;
        var COLS = L.COLS;
        return {
            xtype : 'grid',
            title : L.TITLE,
            columns : [
                {text : COLS.IMG, xtype : 'templatecolumn', tpl : '<img src="{img}">', width : 200, resizable : false, sortable : false, menuDisabled : true, align : 'center'},
                {text : COLS.TITLE, xtype : 'templatecolumn', tpl : '{title} <br><br>  {attr}', flex : 1, resizable : false, sortable : false, menuDisabled : true, align : 'left'},
                {text : COLS.MERCHANT, dataIndex : 'merchant', width : 200, resizable : false, sortable : false, menuDisabled : true, align : 'center'},
                {text : COLS.PRICE, dataIndex : 'price', width : 200, resizable : false, sortable : false, menuDisabled : true, align : 'center'},
                {text : COLS.COUNT, dataIndex : 'count', width : 200, resizable : false, sortable : false, menuDisabled : true, align : 'center'},
                {text : COLS.TOTAL, dataIndex : 'total', width : 200, resizable : false, sortable : false, menuDisabled : true, align : 'center'}],
            store : new Ext.data.Store({
                autoLoad : false,
                fields : [
                    {name : 'img', type : 'string', persist : false},
                    {name : 'title', type : 'string', persist : false},
                    {name : 'price', type : 'integer', persist : false},
                    {name : 'count', type : 'integer', persist : false},
                    {name : 'total', type : 'integer', persist : false},
                    {name : 'attr', type : 'string', persist : false}
                ]
            }),
            listeners : {
                afterrender : function (grid)
                {
                    this.goodsGridRef = grid;
                },
                scope : this
            }
        };
    },
    destroy : function ()
    {
        delete this.mainPanelRef;
        delete this.$_current_nid_$;
        delete this.targetLoadId;
        delete this.appRef;
        delete this.basicFormRef;
        delete this.priceFormRef;
        delete this.userFormRef;
        delete this.goodsGridRef;
        this.callParent();
    }
});