/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 角色列表面板
 */
Ext.define('App.Sys.User.Ui.RoleMgr.ListView', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.appsysuseruirolemgrlistview',
    requires: [
        'Cntysoft.Utils.Common'
    ],
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    statics : {
        A_CODES : {
            M_MANAGER : 0,
            MODIFY : 1,
            DELETE : 2
        }
    },
    /**
     * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Sys.User',

    /**
     * @property {String} panelType 面板的类型
     */
    panelType : 'ListView',

    /**
     * @property {Ext.menu.Menu} contextMenuRef 操作上下文菜单
     */
    contextMenuRef : null,
    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.ROLE_MGR.LIST_VIEW');
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

    initComponent : function()
    {
        var store = this.createListStore();
        var COLS = this.LANG_TEXT.COLS;
        Ext.apply(this, {
            columns : [
                {text : COLS.ID, dataIndex : 'id', width : 80, resizable : false, menuDisabled : true},
                {text : COLS.ROLE_NAME, dataIndex : 'name', width : 200, resizable : false, sortable : false, menuDisabled : true},
                {text : COLS.MEMBER_NUM, dataIndex : 'memberCount', width : 120, resizable : false, sortable : false, menuDisabled : true},
                {text : COLS.DESCRIPTION, dataIndex : 'description', flex : 1, resizable : false, sortable : false, menuDisabled : true}
            ],
            store : store,
            bbar : Ext.create('Ext.PagingToolbar', {
                store : store,
                displayInfo : true,
                emptyMsg : Cntysoft.GET_LANG_TEXT('MSG.EMPTY_TEXT')
            })
        });
        this.addListener({
            itemdblclick : this.itemDbClickHandler,
            itemcontextmenu : this.itemContextMenuHandler,
            scope : this
        });
        this.callParent();
    },

    reloadList : function()
    {
        Cntysoft.Utils.Common.reloadGridPage(this.getStore());
    },

    /**
     * @return {Ext.menu.Menu}
     */
    getContextMenu : function(record)
    {
        if(null == this.contextMenuRef){
            var M_TEXT = this.LANG_TEXT.A_TEXT;
            var C = this.self.A_CODES;
            this.contextMenuRef = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                    text : M_TEXT.M_MANAGER,
                    code : C.M_MANAGER
                }, {
                    text : M_TEXT.MODIFY,
                    code : C.MODIFY
                }, {
                    text : M_TEXT.DELETE,
                    code : C.DELETE
                }],
                listeners : {
                    click : this.menuItemClickHandler,
                    scope : this
                }
            });
        }
        var items = this.contextMenuRef.items;
        if(App.Sys.User.Const.SUPER_MANAGER_ROLE_ID == record.get('id')){
            items.getAt(1).setDisabled(true);
            items.getAt(2).setDisabled(true);
        }else{
            items.getAt(1).setDisabled(false);
            items.getAt(2).setDisabled(false);
        }
        return this.contextMenuRef;
    },

    itemDbClickHandler : function(grid, record)
    {
        var C = App.Sys.User.Const;
        if(C.SUPER_MANAGER_ROLE_ID == record.get('id')){
            return;
        }
        this.mainPanelRef.renderPanel('InfoEditor', {
            mode : WebOs.Kernel.Const.MODIFY_MODE,
            targetId : record.get('id')
        });
    },

    menuItemClickHandler : function(menu, item)
    {
        if(item){
            var C = this.self.A_CODES;
            var code = item.code;
            var record = menu.record;
            switch (code) {
                case C.M_MANAGER :
                    this.mainPanelRef.renderPanel('Member', {
                        role : record
                    });
                    break;
                case C.MODIFY :
                    this.mainPanelRef.renderPanel('InfoEditor', {
                        targetId : record.get('id'),
                        mode : WebOs.Kernel.Const.MODIFY_MODE
                    });
                    break;
                case C.DELETE :
                    this.deleteHandler(record);
                    break;
            }
        }
    },

    deleteHandler : function(record)
    {
        Cntysoft.showQuestionWindow(Ext.String.format(this.LANG_TEXT.DELETE_ASK, record.get('name')), function(btn){
            if('yes' == btn){
                this.mainPanelRef.appRef.deleteRole(record.get('id'), function(response){
                    if(!response.status){
                        Cntysoft.Kernel.Utils.processApiError(response, this.GET_LANG_TEXT('ERROR_TYPE'));
                    } else{
                        this.reloadList();
                    }
                }, this);
            }
        }, this);
    },

    /**
     * 上下文菜单处理器
     */
    itemContextMenuHandler : function(grid, record, htmlItem, index, event)
    {
        var menu = this.getContextMenu(record);
        var pos = event.getXY();
        menu.record = record;
        event.stopEvent();
        menu.showAt(pos[0], pos[1]);
    },

    createListStore : function()
    {
        return new Ext.data.Store({
            autoLoad : true,
            fields : [
                {name : 'id', type : 'integer', persist : false},
                {name : 'name', type : 'string', persist : false},
                {name : 'priority', type : 'integer', persist : false},
                {name : 'memberCount', type : 'integer', persist : false},
                {name : 'description', type : 'string', persist : false}
            ],
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
            }
        });
    },

    destroy : function()
    {
        if(this.contextMenuRef){
            this.contextMenuRef.destroy();
        }
        delete this.mainPanelRef;
        delete this.contextMenuRef;
        this.callParent();
    }
});