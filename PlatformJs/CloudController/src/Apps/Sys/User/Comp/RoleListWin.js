/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 角色选择窗口, 在这里列表中不能出现超级管理员
 */
Ext.define('App.Sys.User.Comp.RoleListWin', {
    extend : 'Ext.window.Window',
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    /**
     * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Sys.User',
    sourceGridRef : null,
    selModel : {
        mode : 'MULTI'
    },
    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('COMP.ROLE_LIST_WIN');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },
    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            width : 400,
            height : 320,
            layout : 'fit',
            resizable : false,
            closeAction : 'hide',
            bodyBorder : false,
            modal : true,
            title : this.LANG_TEXT.TITLE
        });
    },
    /**
     * @event roleselected
     * @param {Ext.data.Model[]} roles
     */
    initComponent : function()
    {
        var BTN = Cntysoft.GET_LANG_TEXT('UI.BTN');
        Ext.apply(this, {
            buttons : [{
                text : BTN.OK,
                listeners : {
                    click : this.saveHandler,
                    scope : this
                }
            }, {
                text : BTN.CANCEL,
                listeners : {
                    click : function(){
                        this.close();
                    },
                    scope : this
                }
            }],
            items : this.getGridConfig()
        });
        this.addListener({
            beforeshow : function(){
                if(this.sourceGridRef){
                    this.center();
                    this.sourceGridRef.getSelectionModel().deselectAll();
                }

            },
            scope : this
        });
        this.callParent();
    },
    getGridConfig : function()
    {
        var COLS = this.LANG_TEXT.COLS;
        return {
            xtype : 'grid',
            emptyText : this.LANG_TEXT.EMPTY_TEXT,
            selModel : this.selModel,
            border : false,
            columns : [
                {text : COLS.ID, dataIndex : 'id', width : 100, resizable : false, sortable : false, menuDisabled : true},
                {text : COLS.NAME, dataIndex : 'name', flex : 1, resizable : false, sortable : false, menuDisabled : true}
            ],
            listeners : {
                afterrender : function(grid){
                    this.sourceGridRef = grid;
                    this.relayEvents(grid, ['beforeselect']);
                },
                scope : this
            },
            store : this.createDataStore()
        };
    },
    beforeSelectHandler : function(sm, record)
    {
        var sels = sm.getSelection();
        var superId = App.Sys.User.Const.SUPER_MANAGER_ROLE_ID;
        var ret = true;
        Ext.each(sels, function(item){
            if(superId == item.get('id')){
                ret = false;
            }
        });
        var targetStore = this.roleGridRef.getStore();
        if(-1 != targetStore.indexOf(record)){
            ret = false;
        }
        return ret;
    },
    saveHandler : function()
    {
        var sm = this.sourceGridRef.getSelectionModel();
        var records = sm.getSelection();
        if(records.length > 0){
            if(this.hasListeners.roleselected){
                this.fireEvent('roleselected', records);
            }
        }
        this.close();
    },
    createDataStore : function()
    {
        return Ext.data.Store({
            fields : [
                {name : 'id', type : 'integer', persist : false},
                {name : 'name', type : 'string', persist : false}
            ],
            autoLoad : true,
            proxy : {
                type : 'apigateway',
                callType : 'App',
                invokeMetaInfo : {
                    module : 'Sys',
                    name : 'User',
                    method : 'RoleMgr/getRoleList'
                },
                reader : {
                    type : 'json',
                    rootProperty : 'items',
                    totalProperty : 'total'
                }
            },
            listeners : {
                load : this.loadHandler,
                scope : this
            }
        });
    },
    /**
     * 数据加载处理函数
     */
    loadHandler : function(win, records)
    {
        var len = records.length;
        for(var i = 0; i < len; i++){
            if(records[i].get('id') == 1){
                //超级管理员
                this.sourceGridRef.store.remove(records[i]);
            }
        }
    },
    destroy : function()
    {
        delete this.sourceGridRef;
        this.callParent();
    }
});