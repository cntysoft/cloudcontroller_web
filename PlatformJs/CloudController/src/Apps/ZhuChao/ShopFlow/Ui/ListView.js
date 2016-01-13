/*
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.ShopFlow.Ui.ListView', {
    extend : 'Ext.tab.Panel',
    requires : [
        'WebOs.Kernel.StdPath',
        'App.ZhuChao.ShopFlow.Lib.Const'
    ],
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    /**
     * @inheritdoc
     */
    panelType : 'ListView',
    /**
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.ZhuChao.ShopFlow',
    //private
    appRef : null,
    /**
     * @property {Ext.menu.Menu} contextMenuRef
     */
    contextMenuRef : null,
    searchButtonRef : null,
    searchNumberRef : null,
    orderStatus : null,
    tabPanelRef : null,
    constructor : function (config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.LIST_VIEW');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },
    applyConstraintConfig : function (config)
    {
        Ext.apply(config, {
            border : true,
            emptyText : this.LANG_TEXT.EMPTY_TEXT,
            title : this.LANG_TEXT.TITLE
        });
    },
    initComponent : function ()
    {
        var CONST = App.ZhuChao.ShopFlow.Lib.Const;
        var GRID_TEXT = this.LANG_TEXT.GRID_TITLE;
        if(null == this.orderStatus){
            this.orderStatus = CONST.ORDER_S_ALL;
        }
        Ext.apply(this, {
            items : [
                this.createOrderGrid(GRID_TEXT.ALL, CONST.ORDER_S_ALL),
                this.createOrderGrid(GRID_TEXT.UNPAY, CONST.ORDER_S_UNPAY),
                this.createOrderGrid(GRID_TEXT.PAYED, CONST.ORDER_S_PAYED),
                this.createOrderGrid(GRID_TEXT.TRANSPORT, CONST.ORDER_S_TRANSPORT),
                this.createOrderGrid(GRID_TEXT.FINISHED, CONST.ORDER_S_FINISHED),
                this.createOrderGrid(GRID_TEXT.CANCEL_REQUEST, CONST.ORDER_S_CANCEL_REQUESTED),
                this.createOrderGrid(GRID_TEXT.CANCELED, CONST.ORDER_S_CANCELED)
            ]
        });
        this.addListener('tabchange', this.tabChangeHandler, this);
        this.addListener('afterrender', this.tabpanelAfterRenderHandler, this);
        this.callParent();
    },
    /*
     * 创建信息表格
     *
     * @param {int} status
     */
    createOrderGrid : function (title, status)
    {
        var store = this.createOrderStore(status);
        var COL_NAMES = this.LANG_TEXT.FIELDS;
        var grid = new Ext.grid.Panel({
            title : title,
            columns : [
                {text : COL_NAMES.NUMBER, dataIndex : 'number', flex : 1, resizable : false, sortable : false, menuDisabled : true, align : 'center'},
                {text : COL_NAMES.NAME, dataIndex : 'userName', width : 250, resizable : false, sortable : false, menuDisabled : true, align : 'center'},
                {text : COL_NAMES.TIME, dataIndex : 'orderTime', width : 250, resizable : false, sortable : true, menuDisabled : true, align : 'center'},
                {text : COL_NAMES.MERCHANT, dataIndex : 'merchant', width : 250, resizable : false, sortable : false, menuDisabled : true, align : 'center'},
                {text : COL_NAMES.PRICE, dataIndex : 'price', width : 250, resizable : false, sortable : false, menuDisabled : true, align : 'center'},
                {text : COL_NAMES.TYPE, dataIndex : 'type', width : 250, resizable : false, sortable : false, menuDisabled : true, align : 'center', renderer : Ext.bind(this.typeRenderer, this)},
                {text : COL_NAMES.STATUS, dataIndex : 'status', width : 250, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.statusRenderer, this), align : 'center'}
            ],
            store : store,
            listeners : {
                itemdblclick : this.gridItemDbClickHandler,
                itemcontextmenu : this.gridItemContextClickHandler,
                scope : this
            },
            tbar : this.getTBarConfig(),
            emptyText : this.LANG_TEXT.EMPTY_TEXT,
            bbar : Ext.create('Ext.PagingToolbar', {
                store : store,
                displayInfo : true,
                emptyMsg : Cntysoft.GET_LANG_TEXT('MSG.EMPTY_TEXT')
            })
        });
        return grid;
    },
    /*
     * 获取数据仓库
     *
     * @param {int} status
     * @return {Ext.data.Store}
     */
    createOrderStore : function (status)
    {
        return new Ext.data.Store({
            pageSize : 25,
            autoLoad : false,
            orderStatus : status,
            fields : [
                {name : 'id', type : 'integer', persist : false},
                {name : 'number', type : 'string', persist : false},
                {name : 'userName', type : 'string', persist : false},
                {name : 'orderTime', type : 'string', persist : false},
                {name : 'merchant', type : 'string', persist : false},
                {name : 'price', type : 'integer', persist : false},
                {name : 'status', type : 'integer', persist : false},
                {name : 'type', type : 'integer', persist : false}
            ],
            proxy : {
                type : 'apigateway',
                callType : 'App',
                pArgs : [{
                        key : 'status',
                        value : status
                    }],
                invokeMetaInfo : {
                    module : 'ZhuChao',
                    name : 'ShopFlow',
                    method : 'OrderMgr/getOrderList'
                },
                reader : {
                    type : 'json',
                    rootProperty : 'items',
                    totalProperty : 'total'
                }
            }
        });
    },
    typeRenderer : function (value)
    {
        var TYPES = this.LANG_TEXT.ORDER_TYPE;
        return TYPES[value];
    },
    statusRenderer : function (value)
    {
        var STATUS = this.LANG_TEXT.ORDER_STATUS;
        return STATUS[value];
    },
    renderOrderEditorPanel : function (record)
    {
        this.mainPanelRef.renderNewTabPanel('OrderEditor', {
            targetLoadId : record.get('id'),
            appRef : this.mainPanelRef.appRef
        });
    },
    /**
     * 获取上下文菜单对象
     */
    getContextMenu : function (record)
    {
        var L = this.LANG_TEXT.MENU;
        var C = this.self.CODE;
        if(null == this.contextMenuRef){
            this.contextMenuRef = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                        text : L.VIEW,
                        listeners : {
                            click : function (item)
                            {
                                var record = item.parentMenu.record;
                                this.renderOrderEditorPanel(record);
                            },
                            scope : this
                        }
                    }]
            });
        }
        this.contextMenuRef.record = record;
        return this.contextMenuRef;
    },
    getTBarConfig : function ()
    {
        var L = this.LANG_TEXT.TBAR;
        return [{
                xtype : 'form',
                layout : 'hbox',
                defaults : {
                    style : 'margin-right : 10px'
                },
                items : [{
                        xtype : 'textfield',
                        fieldLabel : L.NUMBER,
                        name : 'number',
                        listeners : {
                            afterrender : function (field){
                                this.searchNumberRef = field;
                            },
                            scope : this
                        }
                    }, {
                        xtype : 'combo',
                        name : 'merchant',
                        fieldLabel : L.MERCHANT,
                        fields : ['text', 'id'],
                        store : this.createComboStore(),
                        displayField : 'text',
                        valueField : 'id',
                        minChars : 1,
                        listeners : {
                            focus : function (combo)
                            {
                                combo.expand();
                            },
                            scope : this
                        }
                    }, {
                        xtype : 'button',
                        text : L.SEARCH,
                        listeners : {
                            click : function (btn)
                            {
                                var form = btn.up('form');
                                this.reloadGridPageFirst(this.tabPanelRef.getActiveTab().getStore(), form.getValues());
                            },
                            scope : this
                        }
                    }]
            }];
    },
    createComboStore : function ()
    {
        return new Ext.data.Store({
            autoLoad : false,
            fields : [
                {name : 'id', type : 'integer', persist : false},
                {name : 'text', type : 'string', persist : false}
            ],
            proxy : {
                type : 'apigateway',
                callType : 'App',
                invokeMetaInfo : {
                    module : 'ZhuChao',
                    name : 'ShopFlow',
                    method : 'OrderMgr/getMerchantList'
                },
                reader : {
                    type : 'json',
                    rootProperty : 'items',
                    totalProperty : 'total'
                }
            }
        });
    },
    reloadGridPageFirst : function (store, params)
    {
        store.addListener('load', function (store, records){
            store.currentPage = 1;
            if(params){
                store.load({
                    params : params
                });
            }else {
                store.load();
            }
        }, this, {
            single : true
        });
        if(params){
            store.load({
                params : params
            });
        } else{
            store.load();
        }
    },
    gridItemContextClickHandler : function (grid, record, htmlItem, index, event)
    {
        var menu = this.getContextMenu();
        menu.record = record;
        var pos = event.getXY();
        event.stopEvent();
        menu.showAt(pos[0], pos[1]);
    },
    /*
     * 切换时候可能进行相关加载数据
     *
     * @param {Ext.tab.Panel} tabPanel
     * @param {Ext.tab.Tab} newTab
     * @param {Ext.tab.Tab} oldTab
     */
    tabChangeHandler : function (tabPanel, newTab, oldTab)
    {
        var store = newTab.getStore();
        var status = this.orderStatus;
        var CONST = App.ZhuChao.ShopFlow.Lib.Const;
        if(undefined == this.orderStatus){
            status = CONST.INFO_M_ALL;
        }
        if(store.needReload || store.orderStatus != this.orderStatus){
            status = store.orderStatus;
            if(store.needReload){
                Cntysoft.Utils.Common.reloadGridPage(store);
            } else{
                store.load({
                    params : {
                        status : status
                    }
                });
                this.orderStatus = store.orderStatus;
            }

        }
    },
    /*
     * 将每个Store设置成不自动加载，只有将Store激活的时候在加载，减少请求的次数
     */
    tabpanelAfterRenderHandler : function (tabpanel)
    {
        this.tabPanelRef = tabpanel;
        var panel = tabpanel.getActiveTab();
        var store = panel.getStore();
        store.load();
        store.orderStatus = this.orderStatus;
        store.needReload = false;
    },
    /*
     * 处理列表双击
     */
    gridItemDbClickHandler : function (view, record)
    {
        this.renderOrderEditorPanel(record);
    },
    destroy : function ()
    {
        delete this.mainPanelRef;
        if(this.contextMenuRef){
            this.contextMenuRef.destroy();
        }
        delete this.contextMenuRef;
        delete this.searchNumberRef;
        delete this.searchButtonRef;
        delete this.tabPanelRef;
        this.callParent();
    }
});