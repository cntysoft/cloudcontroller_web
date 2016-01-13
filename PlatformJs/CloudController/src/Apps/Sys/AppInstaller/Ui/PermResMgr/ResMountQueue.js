/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 资源挂载队列
 */
Ext.define('App.Sys.AppInstaller.Ui.PermResMgr.ResMountQueue', {
    extend: 'Ext.grid.Panel',
    alias : 'widget.appsysappinstalleruipermresmgrresmountqueue',
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    /**
     * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Sys.AppInstaller',

    statics : {
        OP_CODE : {
            READY : 0,
            OPERATING : 1,
            FAILURE : 2,
            SUCCESS : 3
        },
        A_CODE : {
            DELETE : 1,
            SHOW_ERROR : 2
        }
    },

    selModel : {
        mode : 'MULTI'
    },
    contextMenuRef : null,
    queue : [],
    processCount : null,
    needClearQueue : false,
    constructor : function(config)
    {
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.PERM_RES_MGR.RES_MOUNT_QUEUE');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },
    applyConstraintConfig : function(config)
    {
        Ext.apply(config,{
            title : this.LANG_TEXT.TITLE,
            emptyText : this.LANG_TEXT.EMPTY_TEXT
        });
    },
    /**
     * @event beforerequest
     * @param {array} records 操作队列记录
     */
    /**
     * @event processitem
     * @param {Object} record 当前操作的grid的record对象
     */
    /**
     * @event queuefinished
     * @param {array} records 操作队列记录
     */
    /**
     * @event iteminsert
     * @param {Ext.data.Store} store
     * @param {objct} record 新加入的对象
     */
    /**
     * 当队列中的项进行变化的时候派发
     *
     * @event itemschange
     * @param {Ext.data.Store} store
     */
    /**
     * @event clear
     *  @param {Ext.data.Store} store
     */
    initComponent : function()
    {
        var COLS = this.LANG_TEXT.COLS;
        Ext.apply(this, {
            columns : [
                {text : COLS.MODULE, dataIndex : 'module', width : 90, resizable : false, menuDisabled : true},
                {text : COLS.TEXT, dataIndex : 'text', flex : 1, resizable : false, sortable : false, menuDisabled : true},
                {text : COLS.TYPE, dataIndex : 'type', resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.opTypeRenderer, this)},
                {text : COLS.STATUS, width : 90, dataIndex : 'queueStatus', resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.queueStatusRenderer, this)}
            ],
            store : this.createStore()
        });
        this.addListener({
            itemcontextmenu : this.gridItemRightClickHandler,
            scope : this
        });
        this.callParent();
    },

    insertRecord : function(record)
    {
        var store = this.getStore();
        if(this.needClearQueue){
            this.clearQueue();
            this.needClearQueue = false;
        }
        record.set('queueStatus', this.self.OP_CODE.READY);
        store.loadData([record], true);
        if(this.hasListeners.iteminsert){
            this.fireEvent('iteminsert', store, record);
        }
    },

    clearQueue : function()
    {
        this.getStore().removeAll();
    },

    createStore : function()
    {
        return new Ext.data.Store({
            autoLoad : true,
            fields : [
                {name : 'module', type : 'string'},
                {name : 'key', type : 'string'},
                {name : 'text', type : 'string'},
                {name : 'status', type : 'integer'},
                {name : 'type', type : 'integer'},
                {name : 'queueStatus', type : 'integer'},
                {name : 'errorMsg', type : 'string'},
                {name : 'errorCode', type : 'integer'}
            ],
            listeners : {
                datachanged : function(store){
                    if(this.hasListeners.itemschange){
                        this.fireEvent('itemschange', store);
                    }
                },
                clear : function(store){
                    if(this.hasListeners.clear){
                        this.fireEvent('clear', store);
                    }
                },
                scope : this
            }
        });
    },

    getContextMenu : function()
    {
        var sel = this.getSelectionModel();
        var A_CODE = this.self.A_CODE;
        if(null === this.contextMenuRef){
            this.contextMenuRef = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                    text : this.LANG_TEXT.MENU.DELETE,
                    code : A_CODE.DELETE
                }],
                listeners : {
                    click : this.menuItemClickHandler,
                    scope : this
                }
            });
        }
        //增加一个查看错误信息的菜单, 至少有一个
        var records = sel.getSelection();
        var len = records.length;
        var errorRecords = [];
        var menu = this.contextMenuRef;
        var OP = this.self.OP_CODE;
        for(var i = 0; i < len; i++){
            if(records[i].get('queueStatus') == OP.FAILURE){
                errorRecords.push(records[i]);
            }
        }
        if(errorRecords.length > 0){
            if(menu.items.getCount() == 1){
                menu.add({
                    text : this.LANG_TEXT.MENU.SHOW_ERROR,
                    code : A_CODE.SHOW_ERROR
                });
            }
        }else{
            if(menu.items.getCount() == 2){
                menu.remove(menu.items.getAt(1));
            }
        }
        menu.records = sel.getSelection();
        menu.errorRecords = errorRecords;
        return menu;
    },

    /**
     * 获取显示错误信息的窗口
     *
     * @param {Array} errorRecords
     * @return {Ext.window.Window}
     */
    getErrorInfoWindow : function(errorRecords)
    {
        var len = errorRecords.length;
        var record;
        var html = '';
        for(var i = 0; i < len; i++){
            record = errorRecords[i];
            html += record.get('text')+'  ' + this.opTypeRenderer(record.get('type')) + ' ' + this.queueStatusRenderer(record.get('queueStatus')) + ' >> ';
            html += '<span style = "color:red">' + ' ' +record.get('errorMsg')+'</span>' + '</br>';
        }
        var win =  new Ext.window.Window({
            title : this.LANG_TEXT.SHOW_ERROR_WIN_TITLE,
            modal : true,
            autoShow : true,
            resizable : false,
            width : 600,
            height : 230,
            closeAction : 'destroy',
            autoScroll:true,
            bodyPadding : 5,
            html : html,
            buttons : [{
                text : Cntysoft.GET_LANG_TEXT('UI.BTN.OK'),
                listeners : {
                    click : function()
                    {
                        win.close();
                    }
                }
            }]
        });
    },

    request : function()
    {
        this.queue = this.getStore().getRange();
        var len = this.queue.length;
        this.processCount = 0;
        this.totalCount = len;
        if(len > 0){
            if(this.hasListeners.beforerequest){
                this.fireEvent('beforerequest', Ext.clone(this.queue));
            }
            this.doRequest();
        }
    },

    doRequest : function()
    {
        var T = App.Sys.AppInstaller.Ui.PermResMgr.ResMountView.A_TYPE;
        var current = this.queue.shift();
        var opType;
        current.set('queueStatus', this.self.OP_CODE.OPERATING);
        opType = current.get('type');
        if(this.hasListeners.processitem){
            this.fireEvent('processitem', current);
        }
        switch (opType) {
            case T.MOUNT :
                this.appRef.mountPermResource(
                    current.get('module'),
                    current.get('key'), function(response){
                    this.responseHandler(response, current);
                }, this);
                break;
            case T.UNMOUNT :
                this.appRef.unmountPermResource(
                    current.get('module'),
                    current.get('key'),function(response){
                    this.responseHandler(response, current);
                }, this);
                break;
            case T.REMOUNT :
                this.appRef.remountPermResource(
                    current.get('module'),
                    current.get('key'), function(response){
                    this.responseHandler(response, current);
                }, this);
                break;
        }
    },

    /**
     * @param {integer} code
     * @return {string}
     */
    getOpMgs : function(code)
    {
        var MSG = this.LANG_TEXT.OP_MSG;
        return MSG[code];
    },

    responseHandler : function(response, record)
    {
        this.processCount++;
        var status = response.status;
        var C = this.self.OP_CODE;
        if(!status){
            record.set('errorMsg', response.msg);
            record.set('queueStatus', C.FAILURE);
            record.set('errorCode', response.errorCode);
        } else{
            record.set('queueStatus', C.SUCCESS);
        }
        //这种方式 可以保证状态不丢失吗？
        if(this.processCount === this.totalCount){
            this.needClearQueue = true;
            if(this.hasListeners.queuefinished){
                this.fireEvent('queuefinished', this.store.getRange());
            }
        } else{
            this.doRequest();
        }
    },

    menuItemClickHandler : function(menu, item)
    {
        var code = item.code;
        var A_CODE= this.self.A_CODE;
        switch(code){
            case A_CODE.DELETE :
                this.getStore().remove(menu.records);
                break;
            case A_CODE.SHOW_ERROR :
                this.getErrorInfoWindow(menu.errorRecords);
                break;
        }
    },

    gridItemRightClickHandler : function(grid, record, item, index, e)
    {
        var menu = this.getContextMenu(record);
        var pos = e.getXY();
        menu.showAt(pos[0], pos[1]);
        e.stopEvent();
    },

    opTypeRenderer : function(value)
    {
        var T = App.Sys.AppInstaller.Ui.PermResMgr.ResMountView.A_TYPE;
        var L = this.LANG_TEXT;
        if(value === T.REMOUNT){
            return '<span style = "color:blue">' + L.REMOUNT + '</span>';
        } else if(value === T.UNMOUNT){
            return '<span style = "color:red">' + L.UNMOUNT + '</span>';
        } else if(value === T.MOUNT){
            return '<span style = "color:green">' + L.MOUNT + '</span>';
        }
    },
    queueStatusRenderer : function(value)
    {
        var msg =  this.getOpMgs(value);
        if(value == 2){
            return '<span style = "color:red">'+msg+'</span>';
        }else if(value == 3){
            return '<span style = "color:blue">' + msg + '</span>';
        }else{
            return msg;
        }
    },

    destroy : function()
    {
        delete this.appRef;
        delete this.queue;
        delete this.mainPanelRef;
        if(this.contextMenuRef){
            delete this.contextMenuRef.records;
            delete this.contextMenuRef.errorRecords;
            this.contextMenuRef.destroy();
            delete this.contextMenuRef;
        }
        this.callParent();
    }

});