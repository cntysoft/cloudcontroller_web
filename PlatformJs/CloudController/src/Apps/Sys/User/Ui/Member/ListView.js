/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.User.Ui.Member.ListView', {
    extend : 'Ext.grid.Panel',
    alias : 'widget.appsysuseruimemberlistview',
    requires : [
        'Cntysoft.Utils.ColRenderer',
        'App.Sys.User.Ui.Member.InfoWin'
    ],
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    statics : {
        A_CODES : {
            DELETE : 1,
            MODIFY : 2,
            SHOW_DETAIL_INFO : 3,
            LOCK_USER : 4,
            UNLOCK_USER : 5
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
     * @param {Object} currentQueryCond 当前查询条件
     */
    currentQueryCond : null,
    //private
    contextMenuRef : null,
    infoWinRef : null,
    constructor : function(config)
    {
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.MEMBER.LIST_VIEW');
        this.sysEnv = WebOs.ME.getSysEnv();
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
        var COLS = this.LANG_TEXT.COLS;
        var store = this.createDataStore();
        Ext.apply(this, {
            columns : [
                {text : COLS.ID, dataIndex : 'id', width : 80, resizable : false, menuDisabled : true},
                {text : COLS.ADMIN_NAME, dataIndex : 'name', flex : 1, resizable : false, sortable : false, menuDisabled : true},
                {text : COLS.ROLE, dataIndex : 'role', width : 150, resizable : false, sortable : false, menuDisabled : true},
                {text : COLS.MULTI_LOGIN, dataIndex : 'enableMultiLogin', width : 100, resizable : false, sortable : false, menuDisabled : true, renderer : this.multiLoginRenderer},
                {text : COLS.LAST_LOGIN_IP, dataIndex : 'lastLoginIp', width : 120, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.noRecordRenderer, this)},
                {text : COLS.LAST_LOGIN_TIME, dataIndex : 'lastLoginTime', width : 140, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.timeRenderer, this)},
                {text : COLS.LAST_MODIFY_PSW_TIME, dataIndex : 'lastModifyPwdTime', width : 140, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.timeRenderer, this)},
                {text : COLS.LOGIN_TIMES, dataIndex : 'loginTimes', width : 100, resizable : false, sortable : false, menuDisabled : true},
                {text : COLS.STATUS, dataIndex : 'isLock', width : 100, resizable : false, sortable : false, menuDisabled : true, renderer : this.statusRenderer}
            ],
            store : store,
            bbar : Ext.create('Ext.PagingToolbar', {
                store : store,
                displayInfo : true,
                emptyMsg : Cntysoft.GET_LANG_TEXT('MSG.EMPTY_TEXT'),
                height : 50
            })
        });
        this.addListener({
            afterrender : this.viewAfterrenderHandler,
            itemcontextmenu : this.itemRightClickHandler,
            itemdblclick : this.itemDbClickHandler,
            beforeitemdblclick : this.beforeItemDbClickHandler,
            scope : this
        });
        this.callParent();
    },

    /**
     * 主要用来探测当前用户是否能够修改信息
     *
     * @return boolean
     */
    beforeItemDbClickHandler : function(grid, record)
    {
        var user = CloudController.getSysEnv().get(CloudController.Const.ENV_CUR_USER);
        return record.get('name') == user.name ? false : true;

    },

    itemDbClickHandler : function(view, record)
    {
        this.mainPanelRef.renderPanel('InfoEditor', {
            mode : WebOs.Kernel.Const.MODIFY_MODE, /*修改模式*/
            targetId : record.get('id')
        });
    },

    createDataStore : function()
    {
        return new Ext.data.Store({
            autoLoad : false,
            fields : [
                {name : 'id', type : 'integer', persist : false},
                {name : 'name', type : 'string', persist : false},
                {name : 'enableMultiLogin', type : 'boolean', persist : false},
                {name : 'loginTimes', type : 'integer', persist : false},
                {name : 'lastLoginIp', type : 'string', persist : false},
                {name : 'role', type : 'string', persist : false},
                {name : 'lastModifyPwdTime', type : 'integer', persist : false},
                {name : 'lastLoginTime', type : 'integer', persist : false},
                {name : 'isLock', type : 'boolean', persist : false},
                {name : 'loginErrorTimes', type : 'integer', persist : false}
            ],
            proxy : {
                type : 'apigateway',
                callType : 'App',
                invokeMetaInfo : {
                    module : 'Sys',
                    name : 'User',
                    method : 'Member/getUserList'
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
                            queryCond : this.currentQueryCond
                        });
                    }
                },
                scope : this
            }
        });
    },

    /**
     * 查询的条件键值对
     *
     * @property {Object} cond
     */
    loadUsers : function(cond)
    {
        if(!Ext.Object.equals(this.currentQueryCond, cond)){
            var store = this.getStore();
            store.load({
                params : {
                    queryCond : cond
                }
            });
            this.currentQueryCond = cond;
        }
    },

    /**
     * 重新加载用户
     */
    reloadUsers : function()
    {
        var store = this.getStore();
        Cntysoft.Utils.Common.reloadGridPage(store, {
            queryCond : this.currentQueryCond
        });
    },

    isCurrentUser : function(id)
    {
        var C = WebOs.Const;
        var cId = this.sysEnv.get(C.ENV_CUR_USER).id;
        return id == cId ? true : false;
    },

    getContextMenu : function(record)
    {
        var C = this.self.A_CODES;
        var disabled = false;
        if(null == this.contextMenuRef){
            var items = [{
                text : this.LANG_TEXT.SHOW_DETAIL_INFO,
                code : C.SHOW_DETAIL_INFO
            }, {
                text : this.LANG_TEXT.DELETE,
                code : C.DELETE
            }];

            //首先判断是否是创始人
            if(1/*ID为1代表是创始人*/ == record.get('id')){
                disabled = true;
            } else if(this.isCurrentUser(record.get('id'))){
                disabled = true;
            }
            if(record.get('isLock')){
                items.unshift({
                    text : this.LANG_TEXT.UNLOCK_USER,
                    code : C.UNLOCK_USER,
                    disabled : disabled
                });
            } else{
                items.unshift({
                    text : this.LANG_TEXT.LOCK_USER,
                    code : C.LOCK_USER,
                    disabled : disabled
                });
            }
            //本人不能修改自己的信息，因为可能操作之后自己没办法登录了
            items.unshift({
                text : this.LANG_TEXT.MODIFY,
                code : C.MODIFY,
                disabled : disabled
            });
            this.contextMenuRef = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : items,
                listeners : {
                    click : this.menuItemClickHandler,
                    scope : this
                }
            });
        } else{
            var m = this.contextMenuRef;
            //首先判断是否是创始人
            if(1/*ID为1代表是创始人*/ == record.get('id')){
                disabled = true;
            } else if(this.isCurrentUser(record.get('id'))){
                disabled = true;
            }
            m.remove(m.items.getAt(1));
            if(record.get('isLock')){
                m.add(1, {
                    text : this.LANG_TEXT.UNLOCK_USER,
                    code : C.UNLOCK_USER,
                    disabled : disabled
                });
            } else{
                m.add(1, {
                    text : this.LANG_TEXT.LOCK_USER,
                    code : C.LOCK_USER,
                    disabled : disabled
                });
            }
        }
        //设置删除
        this.contextMenuRef.items.getAt(0).setDisabled(disabled);
        this.contextMenuRef.items.getAt(3).setDisabled(disabled);
        this.contextMenuRef.record = record;
        return this.contextMenuRef;
    },

    showInfoWin : function(record)
    {
        if(null == this.infoWinRef){
            this.infoWinRef = new App.Sys.User.Ui.Member.InfoWin({
                record : record
            });
        } else{
            this.infoWinRef.loadRecord(record);
        }
        this.infoWinRef.show();
    },

    /**
     * 更改用户的状态
     */
    changUserStatus : function(record, status)
    {
        this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
        this.mainPanelRef.appRef.changSysUserStatus(record.get('id'), status, function(response){
            this.loadMask.hide();
            if(response.status){
                record.set('isLock', status);
            } else{
                Cntysoft.Kernel.Utils.processApiError(response);
            }
        }, this);
    },

    menuItemClickHandler : function(menu, item)
    {
        if(item){
            var C = this.self.A_CODES;
            var code = item.code;
            switch (code) {
                case C.DELETE:
                    //删除指定的管理员
                    this.deleteUserHandler(menu.record);
                    break;
                case C.MODIFY:
                    this.mainPanelRef.renderPanel('InfoEditor', {
                        mode : WebOs.Kernel.Const.MODIFY_MODE,
                        targetId : menu.record.get('id')
                    });
                    break;
                case C.SHOW_DETAIL_INFO:
                    this.showInfoWin(menu.record);
                    break;
                case C.UNLOCK_USER:
                    this.changUserStatus(menu.record, false);
                    break;
                case C.LOCK_USER:
                    this.changUserStatus(menu.record, true);
                    break;
            }
        }
    },

    /**
     * 删除指定ID的管理员
     *
     * @param {Object} user
     */
    deleteUserHandler : function(user)
    {
        Cntysoft.showQuestionWindow(Ext.String.format(this.LANG_TEXT.DELETE_USER_ASK, user.get('name')), function(bid){
            if('yes' == bid){
                this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.OP'));
                this.mainPanelRef.appRef.deleteSysUser(user.get('id'), function(response){
                    this.loadMask.hide();
                    if(response.status){
                        Cntysoft.showInfoMsgWindow(Cntysoft.GET_LANG_TEXT('MSG.OP_OK'));
                        this.reloadUsers();
                    } else{
                        Cntysoft.Kernel.Utils.processApiError(response);
                    }
                }, this);
            }
        }, this);
    },

    itemRightClickHandler : function(grid, record, htmlItem, index, event)
    {
        var menu = this.getContextMenu(record);
        var pos = event.getXY();
        event.stopEvent();
        menu.showAt(pos[0], pos[1]);
    },

    viewAfterrenderHandler : function()
    {
        this.loadUsers({});
    },

    timeRenderer : function(value)
    {
        if(value){
            return Cntysoft.Utils.ColRenderer.timestampRenderer(value);
        }else{
            return '<span style = "color : blue">' + this.LANG_TEXT.NO_RECORD + '</span>';
        }
    },
    noRecordRenderer : function(value)
    {
        if(value){
            return value;
        } else{
            return '<span style = "color : blue">' + this.LANG_TEXT.NO_RECORD + '</span>';
        }
    },
    statusRenderer : function(value)
    {
        var U_TEXT = Cntysoft.GET_LANG_TEXT('UI');
        return !value ? '<span style = "color:blue">' + U_TEXT.NORMAL + '</span>' : '<span style = "color:red">' + U_TEXT.LOCKED + '</span>';
    },
    multiLoginRenderer : function(value)
    {
        var B_TEXT = Cntysoft.GET_LANG_TEXT('UI.BTN');
        return value ? '<span style = "color:red">' + B_TEXT.YES + '</span>' : B_TEXT.NO;
    },

    destroy : function()
    {
        if(this.contextMenuRef){
            this.contextMenuRef.destroy();
            delete this.contextMenuRef;
        }
        if(this.infoWinRef){
            this.infoWinRef.destroy();
            delete this.infoWinRef;
        }
        this.callParent();
    }

});