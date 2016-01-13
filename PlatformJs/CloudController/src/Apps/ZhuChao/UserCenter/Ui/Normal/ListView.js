/*
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.UserCenter.Ui.Normal.ListView', {
    extend : 'Ext.grid.Panel',
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    /*
     * @inheritdoc
     */
    panelType : 'ListView',
    /*
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     */
    runableLangKey : 'App.ZhuChao.UserCenter',
    contextMenuRef : null,
    constructor : function (config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.NORMAL.LIST_VIEW');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },
    applyConstraintConfig : function (config)
    {
        Ext.apply(config, {
            border : true,
            title : this.LANG_TEXT.TITLE,
            emptyText : this.LANG_TEXT.EMPTY_TEXT
        });
    },
    initComponent : function ()
    {
        var F = this.LANG_TEXT.FIELDS;
        var store = this.createDataStore();
        Ext.apply(this, {
            bbar : Ext.create('Ext.PagingToolbar', {
                store : store,
                displayInfo : true,
                emptyMsg : this.emptyText
            }),
            store : store,
            columns : [
                {text : F.ID, dataIndex : 'id', width : 50, resizable : false, sortable : false, menuDisabled : true, autoScroll : true},
                {text : F.NAME, dataIndex : 'name', width : 300 , resizable : false, sortable : false, menuDisabled : true},
                {text : F.PHONE, dataIndex : 'phone', flex : 2, resizable : false, sortable : false, menuDisabled : true},
                {text : F.NICK_NAME, dataIndex : 'nickname', flex : 3, resizable : false, sortable : false, menuDisabled : true},
                {text : F.QQ, dataIndex : 'qq', flex : 2, resizable : false, sortable : false, menuDisabled : true},
                {text : F.STATUS, dataIndex : 'status', width : 100, resizable : false, sortable : false, menuDisabled : true, renderer : this.statusRenderer}
            ],
            tbar : [{
                    text : this.LANG_TEXT.BTN.ADD_NORMAL,
                    listeners : {
                        click : function (){
                            this.mainPanelRef.renderNewTabPanel('Info', {
                                mode : 1,
                                appRef : this.mainPanelRef.appRef,
                                listRef : this,
                                detailId : null
                            });
                        },
                        scope : this
                    }
                }]
        });
        this.addListener({
            itemdblclick : function (panel, record)
            {
                this.renderModifyPanel(record);
            },
            itemcontextmenu : this.itemContextMenuHandler,
            scope : this
        });
        this.callParent();
    },
    statusRenderer : function (value)
    {
        var F = this.LANG_TEXT.STATUS_WIN;
        if(1 == value){
            return F.NORMAL;
        } else if(2 == value){
            return F.LOCK;
        } else if(3 == value){
            return F.DELETE;
        }
    },
    renderModifyPanel : function (record)
    {
        this.mainPanelRef.renderNewTabPanel('Info', {
            mode : 2,
            targetLoadId : record.get('id'),
            detailId : record.get('detailId'),
            appRef : this.mainPanelRef.appRef,
            listRef : this
        });
    },
    reload : function ()
    {
        Cntysoft.Utils.Common.reloadGridPage(this.store);
    },
    createDataStore : function ()
    {
        return new Ext.data.Store({
            autoLoad : true,
            fields : [
                {name : 'id', type : 'integer', persist : false},
                {name : 'name', type : 'string', persist : false},
                {name : 'nickname', type : 'string', persist : false},
                {name : 'phone', type : 'string', persist : false},
                {name : 'qq', type : 'string', persist : false},
                {name : 'status', type : 'integer', persist : false}
            ],
            proxy : {
                type : 'apigateway',
                callType : 'App',
                pArgs : [{
                        key : 'type',
                        value : this.mainPanelRef.userType
                    }],
                invokeMetaInfo : {
                    module : 'ZhuChao',
                    name : 'UserCenter',
                    method : 'UserList/getUserListByType'
                },
                reader : {
                    type : 'json',
                    rootProperty : 'items',
                    totalProperty : 'total'
                }
            }
        });
    },
    /*
     * 获取上下文菜单对象
     */
    getContextMenu : function (record)
    {
        var L = this.LANG_TEXT.MENU;
        if(null == this.contextMenuRef){
            this.contextMenuRef = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                        text : L.MODIFY,
                        listeners : {
                            click : function (item)
                            {
                                this.renderModifyPanel(item.parentMenu.record);
                            },
                            scope : this
                        }
                    }, {
                        text : L.STATUS,
                        listeners : {
                            click : function (item)
                            {
                                var record = item.parentMenu.record;
                                this.getStatusWin(record.get('id'), record.get('status'));
                            },
                            scope : this
                        }
                    }]
            });
        }
        return this.contextMenuRef;
    },
    itemContextMenuHandler : function (grid, record, htmlItem, index, event)
    {
        var menu = this.getContextMenu();
        menu.record = record;
        var pos = event.getXY();
        event.stopEvent();
        menu.showAt(pos[0], pos[1]);
    },
    getStatusWin : function (id, status)
    {
        var STATUS = this.LANG_TEXT.STATUS_WIN;
        var MSG = this.LANG_TEXT.MSG;
        var BTN = this.LANG_TEXT.BTN;
        return Ext.create('Ext.window.Window', {
            title : STATUS.TITLE,
            autoShow : true,
            width : 500,
            height : 150,
            bodyPadding : 10,
            items : {
                xtype : 'form',
                items : [{
                        xtype : 'radiogroup',
                        items : [
                            {boxLabel : STATUS.NORMAL, name : 'status', inputValue : '1', checked : true},
                            {boxLabel : STATUS.LOCK, name : 'status', inputValue : '2'},
                            {boxLabel : STATUS.DELETE, name : 'status', inputValue : '3'}
                        ]
                    }, {
                        xtype : 'hiddenfield',
                        name : 'id',
                        value : id
                    }],
                listeners : {
                    afterrender : function (ref){
                        this.formRef = ref;
                        this.formRef.getForm().setValues({id : id, status : status});
                    },
                    scope : this
                }
            },
            buttons : [{
                    text : BTN.SAVE,
                    listeners : {
                        click : function (){
                            this.setLoading(MSG.STATUS_CHANGE);
                            var values = this.formRef.getForm().getValues();
                            this.mainPanelRef.appRef.statusChange(values, function (response){
                                this.loadMask.hide();
                                if(!response.status){
                                    Cntysoft.Kernel.Utils.processApiError(response);
                                } else{
                                    this.statusWinRef.close();
                                    this.reload();
                                }
                            }, this);
                        },
                        scope : this
                    }
                }, {
                    text : BTN.CLOSE,
                    listeners : {
                        click : function (){
                            this.statusWinRef.close();
                        },
                        scope : this
                    }
                }],
            listeners : {
                afterrender : function (statusWin){
                    this.statusWinRef = statusWin;
                },
                scope : this
            }
        });
    },
    destroy : function ()
    {
        delete this.appRef;
        delete this.formRef;
        this.mixins.langTextProvider.destroy.call(this);
        if(null != this.statusWinRef){
            this.statusWinRef.destroy();
            delete this.statusWinRef;
        }
        if(null != this.contextMenuRef){
            this.contextMenuRef.destroy();
            delete this.contextMenuRef;
        }
        this.callParent();
    }
});