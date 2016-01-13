/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 列表显示面板
 */
Ext.define('App.Site.CmMgr.Ui.ModelListView', {
    extend: 'Ext.grid.Panel',
    requires : [
        'WebOs.Kernel.StdPath'
    ],
    mixins: {
        langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
    },
    /*
     * @inheritdoc
     */
    panelType : 'ModelList',
    /*
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Site.CmMgr',

    statics : {
        A_MAP : {
            FIELD_MANAGE : 1,
            DELETE : 2
        }
    },
    //private
    appRef : null,
    /*
     * @property {Ext.menu.Menu} contextMenu
     */
    contextMenu : null,
    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.MODEL_LIST_VIEW');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },

    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            border : true,
            title : this.LANG_TEXT.TITLE,
            emptyText : this.LANG_TEXT.EMPTY_TEXT
        });
    },

    initComponent : function()
    {
        var COLS = this.LANG_TEXT.COLS;
        Ext.apply(this, {
            store : this.createDataStore(),
            columns : [
                {text : COLS.ICON, align : 'center', dataIndex : 'modelKey', width : 100, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.modelIconRenderer, this)},
                {text : COLS.KEY, dataIndex : 'key', resizable : false, width : 120,sortable : false, menuDisabled : true},
                {text : COLS.NAME, dataIndex : 'name', resizable : false, sortable : false, menuDisabled : true},
                {text : COLS.ITEM, dataIndex : 'itemName', width : 100, resizable : false, sortable : false, menuDisabled : true},
                {text : COLS.STATUS, dataIndex : 'status', width : 100, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.statusRenderer, this)},
                {text : COLS.DESCRIPTION, dataIndex : 'description', flex : 1, resizable : false, sortable : false, menuDisabled : true}
            ]
        });
        this.addListener({
            itemdblclick : function(panel, record)
            {
                this.mainPanelRef.renderPanel('MetaInfo', {
                    initLoadId : record.get('id'),
                    mainPanelRef : this.mainPanelRef,
                    appRef : this.mainPanelRef.appRef
                });
            },
            itemcontextmenu : this.itemContextMenuHandler,
            scope : this
        });
        this.callParent();
    },

    createDataStore : function()
    {
        return new Ext.data.Store({
            autoLoad : true,
            fields : [
                {name : 'id', type : 'integer', persist : false},
                {name : 'key', type : 'string', persist : false},
                {name : 'name', type : 'string', persist : false},
                {name : 'description', type : 'string', persist : false},
                {name : 'itemName', type : 'string', persist : false},
                {name : 'status', type : 'integer', persist : false},
                {name : 'buildin', type : 'boolean', persist : false}

            ],
            proxy : {
                type : 'apigateway',
                callType : 'App',
                invokeMetaInfo : {
                    module : 'Site',
                    name : 'CmMgr',
                    method : 'Mgr/getAllModels'
                },
                listeners : {
                    dataready : function(data)
                    {
                        var list = [];
                        var len = data.length;
                        var map = {};
                        var item;
                        for(var i = 0; i < len; i++){
                            item = data[i];
                            list.push(item.modelKey);
                            map[item.id] = item.editor;
                        }
                        this.mainPanelRef.$_model_key_list_$ = list;
                        //更新环境变量
                        this.mainPanelRef.appRef.setEnvVar('EditorModelMap', map);
                    },
                    scope : this
                }
            }
        });
    },

    /*
     * 获取上下文菜单对象
     */
    getContextMenu : function(record)
    {
        //相关权限判断
        var canDelete = true;
        if(record.get('buildIn') == true){
            canDelete = false;
        }
        if(null == this.contextMenu){
            var L = this.LANG_TEXT.MENU;
            var A_MAP = this.self.A_MAP;
            this.contextMenu = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                    text : L.FIELD,
                    code : A_MAP.FIELD_MANAGE
                }, {
                    text : L.DELETE,
                    disabled : !canDelete,
                    code : A_MAP.DELETE
                }],
                listeners : {
                    click : this.menuItemClickHandler,
                    scope : this
                }
            });
        } else{
            var items =  this.contextMenu.items;
            items.getAt(1).setDisabled(!canDelete);
        }
        return this.contextMenu;
    },

    menuItemClickHandler : function(menu, item)
    {
        if(item){
            var record = menu.record;
            var code = item.code;
            var A_MAP = this.self.A_MAP;
            switch (code) {
                case A_MAP.FIELD_MANAGE:
                    this.mainPanelRef.renderPanel('FieldList',{
                        targetModel : {
                            id : record.get('id'),
                            name : record.get('name'),
                            modelKey : record.get('key')
                        }
                    });
                    break;
                case A_MAP.DELETE:
                    this.deleteHandler(record);
                    break;
            }
        }
    },
    itemContextMenuHandler : function(grid, record, htmlItem, index, event)
    {
        var menu = this.getContextMenu(record);
        menu.record = record;
        var pos = event.getXY();
        event.stopEvent();
        menu.showAt(pos[0], pos[1]);
    },

    /*
     * 删除一个指定的内容模型
     */
    deleteHandler : function(record)
    {
        Cntysoft.showQuestionWindow(Ext.String.format(this.LANG_TEXT.DELETE_MODEL_ASK, record.get('name')), function(bid){
            if('yes' == bid){
                this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.DELETE'));
                this.mainPanelRef.appRef.deleteModel(record.get('key'), function(response){
                    this.loadMask.hide();
                    if(!response.status){
                        Cntysoft.processApiError(response);
                    }else{
                        //this.mainPanelRef.down('contentmodelmgrmodeltreepanel').store.reload();
                        this.store.reload();
                    }
                }, this);
            }
        }, this);
    },

    statusRenderer : function(value)
    {
        var STATUS = this.LANG_TEXT.STATUS;
        if(0 == value){
            return STATUS.YES;
        } else{
            return STATUS.NO;
        }
    },
    modelIconRenderer : function(value, data)
    {
        var appRef = this.mainPanelRef.appRef;
        var basePath = WebOs.Kernel.StdPath.getAppImagePath(appRef.module, appRef.name);
        return '<img src = "' + basePath + '/' + data.record.get('key') + '.png?dc_' + (new Date()).getTime() + '"/>';
    },
    destroy : function()
    {
        if(this.loadMask){
            this.loadMask.destroy();
            delete this.loadMask;
        }
        this.el.destroy();
        this.mixins.langTextProvider.destroy.call(this);
        delete this.mainPanelRef;
        if(this.contextMenu) {
            this.contextMenu.destroy();
        }
        delete this.contextMenu;
        this.callParent();
    }
});