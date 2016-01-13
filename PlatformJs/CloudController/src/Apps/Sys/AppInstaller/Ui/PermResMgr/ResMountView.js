/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 站点资源挂在情况列表
 */
Ext.define('App.Sys.AppInstaller.Ui.PermResMgr.ResMountView', {
    extend: 'Ext.grid.Panel',
    alias : 'widget.appsysappinstalleeruipermresmgrresmounterview',
    requires : [
        'App.Sys.AppInstaller.Comp.ModuleCombo'
    ],
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
        L_TYPE_ALL : 0,
        L_TYPE_MOUNTED : 1,
        L_TYPE_UNMOUNTED : 2,
        A_TYPE : {
            MOUNT : 1,
            UNMOUNT : 2,
            REMOUNT : 3
        }
    },
    mainPanelRef : null,
    loadType : null,
    moduleType : null,
    /**
     * @property {Ext.form.field.ComboBoxView} loadTypeComboRef 加载类型下拉框
     */
    loadTypeComboRef : null,
    /**
     * @property {App.Sys.AppInstaller.Comp.ModuleCombo} moduleTypeComboRef 选择系统模块下来框
     */
    mountedMenuRef : null,
    /**
     * @property {Ext.menu.Menu} mountedMenuRef
     */
    mountedMenuRef : null,
    /**
     * @property {Ext.menu.Menu} unmountedMenuRef
     */
    unmountedMenuRef : null,

    constructor : function(config)
    {
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.PERM_RES_MGR.RES_MOUNT_VIEW');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },
    applyConstraintConfig : function(config)
    {
        Ext.apply(config,{
            title : this.LANG_TEXT.TITLE,
            hideHeaders : true
        });
    },
    initComponent : function()
    {
        Ext.apply(this,{
            tbar : this.getTopBarConfig(),
            columns : this.getColsConfig(),
            store : this.createStore()
        });
        this.addListener({
            afterrender : this.initStartDataPanelHandler,
            itemcontextmenu : this.gridItemRightClickHandler,
            scope : this
        });
        this.callParent();
    },

    /**
     * 根据当前的配置数据重新加载数据
     */
    reload : function()
    {
        this.loadResourceList(this.moduleType, this.loadType);
    },

    initStartDataPanelHandler : function()
    {
        var S = this.self;
        this.loadType = S.L_TYPE_ALL;
        this.moduleType = 'all';
        this.loadTypeComboRef.setValue(S.L_TYPE_ALL);
        this.moduleTypeComboRef.setValue(this.moduleType);
        this.loadResourceList(this.moduleType, this.loadType);
    },
    loadResourceList : function(moduleType, loadType)
    {

        this.store.load({
            params : {
                type : loadType,
                module : moduleType
            }
        });
    },

    gridItemRightClickHandler : function(grid, record, item, index, e)
    {
        var menu = this.createContextMenu(record);
        menu.record = record;
        var pos = e.getXY();
        menu.showAt(pos[0], pos[1]);
        e.stopEvent();
    },

    createContextMenu : function(record)
    {
        var M_L = this.LANG_TEXT.MENU;
        var status = record.get('status');
        if(0 === status){
            if(null === this.mountedMenuRef){
                var C = this.self.A_TYPE;
                this.mountedMenuRef = new Ext.menu.Menu({
                    ignoreParentClicks : true,
                    record : record,
                    items : [{
                        text : M_L.UNMOUNT,
                        code : C.UNMOUNT
                    }, {
                        text : M_L.REMOUNT,
                        code : C.REMOUNT
                    }],
                    listeners : {
                        click : this.menuItemClickHandler,
                        scope : this
                    }
                });
            }
            return this.mountedMenuRef;
        }
        else if(1 === status){
            //未挂载
            if(null == this.unmountedMenuRef){
                var C = this.self.A_TYPE;
                this.unmountedMenuRef = new Ext.menu.Menu({
                    ignoreParentClicks : true,
                    record : record,
                    items : [{
                        text : M_L.MOUNT_APP,
                        code : C.MOUNT
                    }],
                    listeners : {
                        click : this.menuItemClickHandler,

                        scope : this
                    }
                });
            }
            return this.unmountedMenuRef;
        }
    },

    /**
     * 挂载按钮的点击处理函数
     */
    menuItemClickHandler : function(menu, item)
    {
        if(item && this.hasListeners.mountrequest){
            this.fireEvent('mountrequest', item.code, menu.record);
        }
    },

    createStore : function()
    {
        return new Ext.data.Store({
            autoLoad : false,
            sortOnload : true,
            fields : [
                {name : 'module', type : 'string'},
                {name : 'key', type : 'string'},
                {name : 'text', type : 'string'},
                {name : 'status', type : 'integer'},
                {name : 'aclDataFile', type : 'string'},
                {name : 'hasAclFile', type : 'boolean'}
            ],
            proxy : {
                type : 'apigateway',
                callType : 'App',
                invokeMetaInfo : {
                    module : 'Sys',
                    name : 'AppInstaller',
                    method : 'PermResMounter/getMountedResList'
                }
            }
        });
    },

    loadTypeComboChangeHandler : function(combo, newValue, oldValue)
    {
        if(this.loadType !== newValue){
            this.loadResourceList(this.moduleType, newValue);
            this.loadType = newValue;
        }
    },

    moduleComboChangeHandler : function(combo, newValue, oldValue)
    {
        if(this.moduleType !== newValue){
            this.loadResourceList(newValue, this.loadType);
            this.moduleType = newValue;
        }
    },

    statusRenderer : function(value)
    {
        if(0 === value){
            return '<span style = "color:blue">' + this.LANG_TEXT.MOUNTED + '</span>';
        } else{
            return '<span style = "color:red">' + this.LANG_TEXT.UNMOUNTED + '</span>';
        }
    },

    getColsConfig : function()
    {
        var L = this.LANG_TEXT.COLS;
        return [{
            text : L.MODULE,
            dataIndex : 'module',
            width : 120,
            resizable : false,
            menuDisabled : true
        },
            {
                text : L.APP_NAME,
                dataIndex : 'text',
                flex : 1,
                resizable : false,
                sortable : false,
                menuDisabled : true
            },
            {
                text : L.STATUS,
                dataIndex : 'status',
                resizable : false,
                sortable : false,
                menuDisabled : true,
                renderer : Ext.bind(this.statusRenderer, this)
            }
        ];
    },

    getTopBarConfig : function()
    {
        var L = this.LANG_TEXT;
        return {
            xtype : 'container',
            layout : {
                type : 'hbox'
            },
            height : 33,
            items : [{
                xtype : 'tbtext',
                text : L.MODULE_SELECT,
                height : 30,
                style : 'line-height: 30px;'
            },{
                xtype : 'appsysappinstallercompmodulecombo',
                width : 120,
                listeners : {
                    change : this.moduleComboChangeHandler,
                    afterrender : function(combo)
                    {
                        this.moduleTypeComboRef = combo;
                    },
                    moduledataready : function(combo, data)
                    {
                        data.unshift({
                            key : 'all',
                            text : this.LANG_TEXT.L_MODULE_TITLE.ALL
                        });
                    },
                    scope : this
                }
            },{
                xtype : 'tbtext',
                text : L.TYPE,
                height : 30,
                style : 'line-height: 30px;'
            }, this.getTypeComboConfig()]
        };
    },
    getTypeComboConfig : function()
    {
        var S = this.self;
        var L = this.LANG_TEXT.TYPE_COMBO;
        return {
            xtype : 'combo',
            width : 120,
            editable : false,
            queryMode : 'local',
            displayField : 'name',
            valueField : 'value',
            emptyText : L.EMPTY_TEXT,
            store : new Ext.data.Store({
                fields : ['name', 'value'],
                data : [
                    {
                        name : L.ALL_APP,
                        value : S.L_TYPE_ALL
                    },
                    {
                        name : L.MOUNTED_APP,
                        value : S.L_TYPE_MOUNTED
                    },
                    {
                        name : L.UNMOUNTED_APP,
                        value : S.L_TYPE_UNMOUNTED
                    }
                ]
            }),
            listeners : {
                afterrender : function(combo){
                    this.loadTypeComboRef = combo;
                },
                change : this.loadTypeComboChangeHandler,
                scope : this
            }
        };
    },

    destroy : function()
    {
        if(null !== this.mountedMenuRef){
            this.mountedMenuRef.destroy();
        }
        if(null !== this.unmountedMenuRef){
            this.unmountedMenuRef.destroy();
        }
        delete this.mountedMenuRef;
        delete this.unmountedMenuRef;
        delete this.mainPanelRef;
        delete this.loadTypeComboRef;
        delete this.moduleTypeComboRef;
        this.callParent();
    }
});