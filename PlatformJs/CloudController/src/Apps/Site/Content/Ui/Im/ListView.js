/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 内容管理程序，普通信息列表管理列表类
 */
Ext.define('App.Site.Content.Ui.Im.ListView', {
    extend: 'Ext.tab.Panel',
    alias : 'widget.sitecontentuiimlistview',
    requires : [
        'Cntysoft.Utils.Common',
        'App.Site.Content.Ui.Im.VerifyEditWin',
        'App.Site.Content.Lib.Const'
    ],

    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },

    /*
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Site.Content',

    /*
     * 当前目标加载ID
     *
     * @property {Int} loadId
     */
    loadId : null,

    /*
     * Tab Panel Grid上下文菜单
     *
     * @property {Ext.menu.Menu} contextMenuRef
     */
    contextMenuRef : null,

    /*
     * @inheritdoc
     */
    panelType : 'ListView',

    /*
     * 批量删除按钮
     *
     * @property {Ext.menu.Menu} batchDeleteMenu
     */
    batchDeleteMenuRef : null,

    /*
     *  {@link App.Site.Content.Main 详情参考}
     * @property {App.Site.Content.Main} appRef
     */
    appRef : null,
    //private
    mainPanelRef : null,
    /*
     * 修改信息状态的窗口
     *
     * @property {Ext.window.Window} verifyEditWinRef
     */
    verifyEditWinRef : null,

    /*
     * 信息的类型
     */
    infoType : null,

    /*
     * 初始化组件
     */
    constructor : function(config)
    {
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.IM.INFO_LIST_VIEW');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },

    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            border : false,
            bodyBorder : false
        });
    },

    initComponent : function()
    {
        var CONST = App.Site.Content.Lib.Const;
        var GRID_TEXT = this.LANG_TEXT.GRID_TITLE;
        if(null == this.infoType){
            this.infoType = CONST.INFO_M_ALL;
        }
        var type = this.infoType;
        Ext.apply(this, {
            items : [
                this.createInfoGrid(GRID_TEXT.ALL, CONST.INFO_S_ALL, type),
                this.createInfoGrid(GRID_TEXT.DRAFT, CONST.INFO_S_DRAFT, type),
                this.createInfoGrid(GRID_TEXT.PEEDING, CONST.INFO_S_PEEDING, type),
                this.createInfoGrid(GRID_TEXT.VERIFY, CONST.INFO_S_VERIFY, type),
                this.createInfoGrid(GRID_TEXT.REJECTION, CONST.INFO_S_REJECTION, type)
            ]
        });
        this.addListener('tabchange', this.tabChangeHandler, this);
        this.addListener('afterrender', this.afterRenderHandler, this);
        this.callParent();
    },

    /*
     * 设置加载ID
     *
     * @param {int} id
     */
    setLoadIdAndType : function(id, type)
    {
        this.loadId = id;
        this.infoType = type;
        var store = this.getActiveTab().getStore();
        if(store.loadId != id || store.type != type){
            //将仓库当前页复位
            store.currentPage = 1;
            store.load({
                params : {
                    id : id,
                    type : type
                }
            });
            store.loadId = id;
            store.type = type;
        }
    },


    /*
     * 创建信息表格
     *
     * @param {int} status
     */
    createInfoGrid : function(title, status, type)
    {
        var CONST = App.Site.Content.Lib.Const;
        var store = this.createInfoStore(status, type);
        var COL_NAMES = this.LANG_TEXT.COLS;
        var grid = new Ext.grid.Panel({
            title : title,
            selModel : {
                allowDeselect : true,
                mode : 'MULTI'
            },
            columns : [
                {text : COL_NAMES.ID, dataIndex : 'id', width : 100, resizable : false, menuDisabled : true},
                {text : COL_NAMES.TITLE, dataIndex : 'title', flex : 1, resizable : false, sortable : false, menuDisabled : true},
                {text : COL_NAMES.EDITOR, dataIndex : 'editor', width : 120, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.editorRenderer, this)},
                {text : COL_NAMES.HITS, dataIndex : 'hits', width : 100, resizable : false, sortable : true, menuDisabled : true},
                {text : COL_NAMES.STATUS, dataIndex : 'status', width : 100, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.statusRenderer, this)}
                //this.getActionColumn()
            ],
            store : store,
            listeners : {
                itemdblclick : this.gridItemDbClickHandler,
                itemcontextmenu : this.gridItemContextClickHandler,
                scope : this
            },
            bbar : Ext.create('Ext.PagingToolbar', {
                store : store,
                displayInfo : true,
                emptyMsg : Cntysoft.GET_LANG_TEXT('MSG.EMPTY_TEXT')
            })
        });
        return grid;
    },

    setNeedReload : function()
    {
        this.items.each(function(form){
            form.getStore().needReload = true;
        });
        var store = this.getActiveTab().getStore();
        Cntysoft.Utils.Common.reloadGridPage(store);
        store.needReload = false;

    },

    /*
     * 获取数据仓库
     *
     * @param {int} status
     * @return {Ext.data.Store}
     */
    createInfoStore : function(status, type)
    {
        return new Ext.data.Store({
            pageSize : 15,
            verifyType : status,
            autoLoad : false,
            fields : [
                {name : 'id', type : 'integer', persist : false},
                {name : 'nid', type : 'integer', persist : false},
                {name : 'title', type : 'string', persist : false},
                {name : 'editor', type : 'string', persist : false},
                {name : 'modelKey', type : 'string', persist : false},
                {name : 'modelId', type : 'integer', persist : false},
                {name : 'hits', type : 'integer', persist : false},
                {name : 'priority', type : 'integer', persist : false},
                {name : 'status', type : 'integer', persist : false},
                {name : 'type', type : 'integer', persist : false}
            ],
            proxy : {
                type : 'apigateway',
                callType : 'App',
                pArgs : [{
                    key : 'status',
                    value : status
                }, {
                    key : 'type',
                    value : type
                }],
                invokeMetaInfo : {
                    module : 'Site',
                    name : 'Content',
                    method : 'InfoList/getInfoListByNodeAndStatus'
                },
                reader : {
                    type : 'json',
                    rootProperty : 'items',
                    totalProperty : 'total'
                }
            },
            listeners : {
                beforeload : function(store, operation){
                    if(!operation.getParams()){
                        operation.setParams({
                            id : this.loadId
                        });
                    }
                },
                scope : this
            }
        });
    },

    /*
     * 获取上下文菜单
     *
     * @param {Ext.menu.Menu}
     */
    getContextMenu : function(record)
    {
        var status = record.get('status');
        var CONST = App.Site.Content.Lib.Const;
        var disabled = (status == CONST.INFO_S_VERIFY) ? false : true;
        var MENU_TEXT = this.LANG_TEXT.MENU;
        var application = this.appRef;
        var nid = record.get('nid');
        var infoVerified = status == CONST.INFO_S_VERIFY;
        if(null == this.contextMenuRef){
            this.contextMenuRef = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                    text : MENU_TEXT.STATUS_CHANGE,
                    listeners : {
                        click : this.verifyEditHandler,
                        scope : this
                    }
                }, {
                    text : MENU_TEXT.MODIFY_INFO,
                    listeners : {
                        click : this.editMenuHandler,
                        scope : this
                    }
                }, {
                    text : MENU_TEXT.DELETE_INFO,
                    listeners : {
                        click : this.deleteInfoHandler,
                        scope : this
                    }
                }, {
                    text : MENU_TEXT.VIEW_INFO,
                    id : 'check',
                    disabled : disabled,
                    listeners : {
                        click : this.viewInfoFrontHandler,
                        scope : this
                    }
                }]
            });
        } else{
            //设置权限
            var items = this.contextMenuRef.items;
            var check = this.contextMenuRef.getComponent('check');
            if(check.disabled != disabled){
                this.contextMenuRef.remove(check);
                this.contextMenuRef.add([{
                    text : MENU_TEXT.VIEW_INFO,
                    id : 'check',
                    disabled : disabled,
                    listeners : {
                        click : this.viewInfoFrontHandler,
                        scope : this
                    }
                }]);
            }
        }
        return this.contextMenuRef;
    },

    /*
     * 获取批量操作的按钮
     *
     * @param {Array} records 选中的项
     * @return {Ext.menu.Menu}
     */
    getBatchActionMenu : function(records)
    {
        //权限相关的
        var CONST = App.Site.Content.Lib.Const;
        var app = this.appRef;
        var len = records.length;
        if(null == this.batchDeleteMenuRef){
            this.batchDeleteMenuRef = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                    text : this.LANG_TEXT.MENU.BATCH_DELETE,
                    listeners : {
                        click : this.batchDeleteInfoHandler,
                        scope : this
                    }
                }, {
                    text : this.LANG_TEXT.MENU.BATCH_CHANGE_INFO_STATUS,
                    listeners : {
                        click : this.batchChangeInfoStatusHandler,
                        scope : this
                    }
                }]
            });
        }
        return this.batchDeleteMenuRef;
    },

    /*
     * 批量删除信息
     */
    batchDeleteInfoHandler : function(item)
    {
        var records = item.parentMenu.records;
        var items = [];
        var len = records.length;
        for(var i = 0; i < len; i++) {
            items.push(records[i]);
        }
        this.doDeleteInfo(items);
    },

    /*
     * 批量修改信息状态
     */
    batchChangeInfoStatusHandler : function(item)
    {
        var record = item.parentMenu.records;
        var win = this.getVerifyEditWin(record);
        if(win.isHidden()){
            win.show();
        } else{
            win.toFront();
        }
    },

    /*
     * 获取权限更改窗口
     *
     * @return {Ext.window.Window}
     */
    getVerifyEditWin : function(record)
    {
        if(null == this.verifyEditWinRef){
            this.verifyEditWinRef = new App.Site.Content.Ui.Im.VerifyEditWin({
                appRef : this.appRef,
                listViewRef : this
            });
        }
        this.verifyEditWinRef.record = record;
        return this.verifyEditWinRef;
    },

    /*
     * 处理菜单点击
     */
    editMenuHandler : function(item)
    {
        this.gridItemDbClickHandler(item, item.parentMenu.record);
    },

    viewInfoFrontHandler : function(item)
    {
        var id = item.parentMenu.record.get('id');
        this.appRef.viewInfoFront(id);
    },

    deleteInfoHandler : function(item)
    {
        var record = item.parentMenu.record;
        this.doDeleteInfo([record]);
    },

    verifyEditHandler : function(item)
    {
        var record = item.parentMenu.record;
        var win = this.getVerifyEditWin(record);
        if(win.isHidden()){
            win.show();
        } else{
            win.toFront();
        }
    },

    /*
     * 与记录关联的grid
     */
    doDeleteInfo : function(items)
    {
        var len = items.length;
        var MSG = this.LANG_TEXT.MSG;
        var ids = [];
        var item;

        for(var i = 0; i < len; i++) {
            item = items[i];
            ids.push(item.get('id'));
        }
        Cntysoft.showQuestionWindow(Ext.String.format(MSG.DELETE_INFO_TPL, ids.join(',')), function(btn){
            if('yes' == btn){
                //创建提交格式
                var item;
                var data = {};
                var nid;
                for(var i = 0; i < len; i++) {
                    item = items[i];
                    nid = item.get('nid');
                    if(!data.hasOwnProperty(nid)){
                        data[nid] = [];
                    }
                    data[nid].push(item.get('id'));
                }
                this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.OP'));
                this.appRef.moveToTrashcan(data, function(response){
                    this.loadMask.hide();
                    if(!response.status){
                        Cntysoft.showErrorWindow(response.msg);
                    } else{
                        this.setNeedReload();
                        Cntysoft.showAlertWindow(Ext.String.format(MSG.OP_SUCCESS_TPL, ids.join(',')));
                    }
                }, this);
            }
        }, this);
    },

    /*
     * grid右键菜单 提供一些常用的功能
     *
     * @param {Ext.grid.Panal}
     */
    gridItemContextClickHandler : function(grid, record, htmlItem, index, event)
    {
        //判断是否有多于2条的信息被选中
        var sel = grid.getSelectionModel();
        var menu;
        var pos = event.getXY();
        if(sel.getCount() > 1){
            var sel = sel.getSelection();
            menu = this.getBatchActionMenu(sel);
            menu.records = sel;
            menu.grid = grid;
        } else{
            menu = this.getContextMenu(record);
            menu.record = record;
            menu.verifyType = grid.verifyType;
            menu.grid = grid;
        }

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
    tabChangeHandler : function(tabPanel, newTab, oldTab)
    {
        var store = newTab.getStore();
        var type = this.infoType;
        var CONST = App.Site.Content.Lib.Const;
        if(undefined == this.infoType){
            type = CONST.INFO_M_ALL;
        }
        if(store.needReload || store.loadId != this.loadId || store.infoType != this.infoType){
            if(store.needReload){
                Cntysoft.Utils.Common.reloadGridPage(store);
            } else{
                store.load({
                    params : {
                        id : this.loadId,
                        type : type
                    }
                });
                store.loadId = this.loadId;
                store.infoType = this.infoType;
            }

        }
    },

    /*
     * 将每个Store设置成不自动加载，只有将Store激活的时候在加载，减少请求的次数
     */
    afterRenderHandler : function(tabpanel)
    {
        var panel = tabpanel.getActiveTab();
        var store = panel.getStore();
        store.load();
        store.loadId = this.loadId;
        store.infoType = this.infoType;
        store.needReload = false;
    },

    /*
     * 处理列表双击
     */
    gridItemDbClickHandler : function(view, record)
    {
        this.mainPanelRef.getEditor(record.get('modelId'), {
            autoShow : true,
            mode : CloudController.Const.MODIFY_MODE, //加载内容 编辑模式
            targetLoadId : record.get('id'),
            nodeId : record.get('nid'),
            listeners : {
                saverequest : this.infoSaveRequestHandler,
                scope : this
            }
        });
    },

    /*
     * 编辑器保存请求处理器
     *
     * @param {Object} data
     * @param {Number} mode 编辑器的状态
     * @param {App.Site.CmMgr.Lib.Editor.AbstractEditor} editor
     */
    infoSaveRequestHandler : function(data, mode, editor)
    {
        editor.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
        this.mainPanelRef.appRef.saveInfo(data, function(response){
            editor.loadMask.hide();
            if(!response.status){
                Cntysoft.Kernel.Utils.processApiError(response);
            } else{
                this.afterSaveHandler(editor);
            }
        }, this);
    },

    afterSaveHandler : function(editor)
    {
        this.setNeedReload();
        Cntysoft.showInfoMsgWindow(Cntysoft.GET_LANG_TEXT('MSG.SAVE_OK'), function(){
            Ext.destroy(editor);
        }, this);
    },

    editorRenderer : function(editor)
    {
        return '<span style="color : #009933;">' + editor + '</span>';
    },

    /*
     * 将状态种类变成描述性的文字
     *
     * @param {String} value
     * @return {String}
     */
    statusRenderer : function(value)
    {
        var MAP = this.LANG_TEXT.MSG.STATUS_MAP;
        if(MAP[value]){
            return MAP[value];
        } else{
            return MAP[0];
        }
    },
    destroy : function()
    {
        if(this.contextMenuRef){
            delete this.contextMenuRef.grid;
            this.contextMenuRef.destroy();
            delete this.contextMenuRef;
        }
        if(this.batchDeleteMenuRef){
            delete this.batchDeleteMenuRef.grid;
            this.batchDeleteMenuRef.records = null;
            this.batchDeleteMenuRef.destroy();
            delete this.batchDeleteMenuRef;
        }
        if(!this.el.isDestroyed){
            this.el.destroy();
        }
        delete this.mainPanelRef;
        delete this.verifyEditWinRef;
        delete this.appRef;
        this.callParent();
    }
});