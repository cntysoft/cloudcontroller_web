/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Content.Ui.Trashcan.ListView', {
    extend : 'Ext.grid.Panel',
    alias : 'widget.sitecontentuitrashcanlistview',
    requires : [
        'Cntysoft.Utils.Common',
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
     * @inheritdoc
     * @property {String} panelType
     */
    panelType : 'ListView',
    /*
     * @property {Ext.menu.Menu} contextMenuRef
     */
    contextMenuRef : null,
    constructor : function(config)
    {
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.TRASHCAN.LIST_VIEW');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },
    /*
     * @template
     * @property {Object} config
     */
    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            border : false,
            emptyText : Cntysoft.GET_LANG_TEXT('MSG.EMPTY_TEXT'),
            selModel : {
                allowDeselect : true,
                mode : 'MULTI'
            },
            pageSize : 15
        });
    },
    initComponent : function()
    {

        var BTN_TEXT = this.LANG_TEXT.BTN;
        var COLS = this.LANG_TEXT.COLS;
        var store = this.createStore();
        Ext.apply(this, {
            tbar : [{
                text : BTN_TEXT.DELETE_SELECT,
                listeners : {
                    click : this.deleteSelectionHandler,
                    scope : this
                }
            }, {
                text : BTN_TEXT.RESTORE_SELECT,
                listeners : {
                    click : this.restoreSelectionHandler,
                    scope : this
                }
            }, {
                text : BTN_TEXT.CLEAR_TRASHCAN,
                listeners : {
                    click : this.clearTrashcanHandler,
                    scope : this
                }
            }, {
                text : BTN_TEXT.RESTORE_ALL,
                listeners : {
                    click : this.restoreAllHandler,
                    scope : this
                }
            }],
            columns : [
                {text : COLS.ID, dataIndex : 'id', width : 50, resizable : false, menuDisabled : true},
                {text : COLS.TITLE, dataIndex : 'title', flex : 1, resizable : false, sortable : false, menuDisabled : true},
                {text : COLS.EDITOR, dataIndex : 'editor', width : 150, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.editorRender, this)},
                {text : COLS.HITS, dataIndex : 'hits', width : 80, resizable : false, sortable : true, menuDisabled : true},
                {text : COLS.STATUS, dataIndex : 'status', width : 150, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.statusRender, this)}
            ],
            
            store : store,
            bbar : Ext.create('Ext.PagingToolbar', {
                store : store,
                displayInfo : true,
                emptyMsg : this.emptyText
            })
        });
        this.addListener({
            afterrender : this.afterRenderHandler,
            itemcontextMenu : this.gridItemContextClickHandler,
            scope : this
        });
        this.callParent();
    },
    afterRenderHandler : function()
    {
        var store = this.getStore();
        store.load({
            params : {
                id : this.loadId
            }
        });
    },
    setLoadId : function(id)
    {
        if(this.loadId != id){
            this.getStore().load({
                params : {
                    id : id
                }
            });
            this.loadId = id;
        }
    },
    editorRender : function(editor)
    {
        return '<span style="color : #009933;">' + editor + '</span>';
    },
    statusRender : function()
    {
        return '<span style="color : #CC0099;">' + this.LANG_TEXT.MSG.DELETE + '</span>';
    },
    /*
     * 创建回收站数据仓库
     *
     * @return {Ext.data.Store}
     */
    createStore : function()
    {
        return new Ext.data.Store({
            pageSize : this.pageSize,
            fields : [
                {name : 'id', type : 'integer', persist : false},
                {name : 'title', type : 'string', persist : false},
                {name : 'nid', type : 'integer', persist : false},
                {name : 'editor', type : 'string', persist : false},
                {name : 'inputer', type : 'string', persist : false},
                {name : 'modelKey', type : 'string', persist : false},
                {name : 'hits', type : 'integer', persist : false},
                {name : 'priority', type : 'integer', persist : false},
                {name : 'status', type : 'integer', persist : false}
            ],
            proxy : {
                type : 'apigateway',
                callType : 'App',
                invokeMetaInfo : {
                    module : 'Site',
                    name : 'Content',
                    method : 'InfoList/getTrashcanListByNode'
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
     * @return {Ext.menu.Menu}
     */
    getContextMenu : function()
    {
        if(null == this.contextMenuRef){
            var MENU_TEXT = this.LANG_TEXT.MENU;
            this.contextMenuRef = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                    text : MENU_TEXT.DELETE_SELECT,
                    listeners : {
                        click : this.deleteSelectionHandler,
                        scope : this
                    }
                }, {
                    text : MENU_TEXT.RESTORE,
                    listeners : {
                        click : this.restoreSelectionHandler,
                        scope : this
                    }
                }]
            });
        }
        return this.contextMenuRef;
    },
    /*
     * 表格项点击事件处理函数
     */
    gridItemContextClickHandler : function(grid, record, htmlItem, index, event)
    {
        var pos = event.getXY();
        var menu;
        menu = this.getContextMenu(record);
        menu.record = record;
        event.stopEvent();
        menu.showAt(pos[0], pos[1]);
    },
    /*
     * 删除所选信息处理器函数
     */
    deleteSelectionHandler : function()
    {
        var sel = this.getSelectionModel();
        var records;
        var data = {};
        var len;
        var ids = [];
        var nid;
        var record;
        if(sel.getCount() > 0){
            var MSG = this.LANG_TEXT.MSG;
            records = sel.getSelection();
            len = records.length;
            for(var i = 0; i < len; i++) {
                record = records[i];
                nid = record.get('nid');
                if(!data.hasOwnProperty(nid)){
                    data[nid] = [];
                }
                ids.push(record.get('id'));
                data[nid].push(record.get('id'));
            }
            Cntysoft.showQuestionWindow(Ext.String.format(MSG.DELETE_TPL, ids.join(', ')), function(btn){
                if(btn == 'yes'){
                    this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.OP'));
                    this.appRef.deleteInfo(data, this.afterOperateCallback, this);
                }
            }, this);
        }
    },
    /*
     * 还原选择信息处理器
     */
    restoreSelectionHandler : function()
    {
        var sel = this.getSelectionModel();
        var records;
        var data = {};
        var len;
        var ids = [];
        var nid;
        var record;
        if(sel.getCount() > 0){
            var MSG = this.LANG_TEXT.MSG;
            records = sel.getSelection();
            len = records.length;
            for(var i = 0; i < len; i++) {
                record = records[i];
                nid = record.get('nid');
                if(!data.hasOwnProperty(nid)){
                    data[nid] = [];
                }
                ids.push(record.get('id'));
                data[nid].push(record.get('id'));
            }
            Cntysoft.showQuestionWindow(Ext.String.format(MSG.RESTORE_TPL, ids.join(',')), function(btn){
                if(btn == 'yes'){
                    this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.OP'));
                    this.appRef.moveOutTrashcan(data, this.afterOperateCallback, this);
                }
            }, this);
        }
    },
    afterOperateCallback : function(response)
    {
        this.loadMask.hide();
        if(response.status){
            Cntysoft.showAlertWindow(Cntysoft.GET_LANG_TEXT('MSG.SAVE_OK'), function(){
                Cntysoft.Utils.Common.reloadGridPage(this.getStore());
            }, this);
        } else{
            Cntysoft.Kernel.Utils.processApiError(response, Cntysoft.GET_LANG_TEXT('ERROR_MAP'));
        }
    },
    clearTrashcanHandler : function()
    {
        var MSG = this.LANG_TEXT.MSG;
        var store = this.getStore();
        if(!store.count()){
            Cntysoft.showErrorWindow(MSG.EMPTY_STORE);
        } else{
            Cntysoft.showQuestionWindow(MSG.DELETE_ALL, function(btn){
                if(btn == 'yes'){
                    this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.OP'));
                    this.appRef.clearTrashcan(this.afterOperateCallback, this);
                }
            }, this);
        }
    },
    restoreAllHandler : function()
    {
        var MSG = this.LANG_TEXT.MSG;
        var store = this.getStore();
        if(!store.count()){
            Cntysoft.showErrorWindow(MSG.EMPTY_STORE);
        } else{
            Cntysoft.showQuestionWindow(MSG.RESTORE_ALL, function(btn){
                if(btn == 'yes'){
                    this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.OP'));
                    this.application.moveAllOutTrashcan(this.afterOperateCallback, this);
                }
            }, this);
        }
    },
    /*
     * 资源清除
     */
    destroy : function()
    {
        delete this.LANG_TEXT;
        delete this.appRef;
        if(this.contextMenuRef){
            delete this.contextMenuRef.record;
            this.contextMenuRef.destroy();
            delete this.contextMenuRef;
        }
        delete this.mainPanelRef;
    }
});