/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 指定模型的字段管理
 */
Ext.define('App.Site.CmMgr.Ui.FieldListView', {
    extend: 'Ext.grid.Panel',
    requires: [
        'App.Site.CmMgr.Ui.ModelPreview',
        'Cntysoft.Utils.ColRenderer'
    ],
    mixins: {
        langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
    },

    statics : {
        A_MAP : {
            DELETE : 1,
            MODIFY : 2
        }
    },

    /*
     * @inheritdoc
     */
    panelType: 'FieldList',
    /*
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey: 'App.Site.CmMgr',
    /*
     * 当前加载的内容模型数据
     *
     * @property {Object} currentLoadedModel
     */
    currentLoadedModel : {},
    //private
    contextMenuRef : null,

    //private
    previewWinRef : null,
    //private
    appRef : null,
    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.FIELD_LIST_VIEW');
        this.appRef = config.mainPanelRef.appRef;
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },

    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            border : true,
            title : this.getPanelTitle(config.targetModel.name)
        });
    },

    initComponent : function()
    {
        Ext.apply(this, {
            columns : this.getColsConfig(),
            store : this.createStore(),
            bbar : [{
                text : this.LANG_TEXT.ADD_FIELD,
                listeners : {
                    click : function()
                    {
                        //获取当前字段名称的集合
                        var fields = [];
                        this.store.each(function(record){
                            fields.push(record.get('name'));
                        });
                        this.mainPanelRef.renderPanel('FieldEditor', {
                            targetModel : Ext.clone(this.targetModel),
                            initFields : fields,
                            appRef :  this.mainPanelRef.appRef
                        });
                    },
                    scope : this
                }
            }, {
                text : this.LANG_TEXT.MODEL_PREVIEW,
                listeners : {
                    click : this.modelPreviewHandler,
                    scope : this
                }
            }],
            viewConfig : {
                plugins : {
                    ptype : 'gridviewdragdrop',
                    dragText : this.LANG_TEXT.DRAG_TEXT
                }
                //listeners : {
                //   drop : this.sortDropHandler,
                //   scope : this
                //}
            }
        });
        this.addListener('afterrender', function(){
            this.loadFields(this.targetModel.id, this.targetModel.name, this.targetModel.key);
        }, this, {
            single : true
        });
        this.addListener({
            itemdblclick : this.itemDblClickHandler,
            itemcontextmenu : this.itemContextMenuHandler,
            scope : this
        });
        this.callParent();
    },

    /*
     * 加载指定的内容模型的字段信息
     *
     * @param {Number} id
     * @param {String} modelName
     * @param {String} modelKey
     */
    loadFields : function(id, modelName, modelKey)
    {
        if(id !== this.currentLoadedModel.id){
            this.store.load({
                params : {
                    id : id
                }
            });
            this.setTitle(this.getPanelTitle(modelName));
            this.currentLoadedModel.id = id;
            this.currentLoadedModel.name = modelName;
            this.currentLoadedModel.key = modelKey;
        }
    },

    createStore : function()
    {
        return new Ext.data.Store({
            fields : [
                {name : 'id', type : 'integer', persist : false},
                {name : 'name', type : 'string', persist : false},
                {name : 'alias', type : 'string', persist : false},
                {name : 'system', type : 'boolean', persist : false},
                {name : 'fieldType', type : 'string', persist : false},
                {name : 'virtual', type : 'boolean', persist : false},
                {name : 'require', type : 'boolean', persist : false},
                {name : 'description', type : 'string', persist : false},
                {name : 'isDisplay', type : 'boolean', persist : false},
                {name : 'priority', type : 'integer', persist : false}
            ],
            proxy : {
                type : 'apigateway',
                callType : 'App',
                invokeMetaInfo : {
                    module : 'Site',
                    name : 'CmMgr',
                    method : 'Mgr/getModelFields'
                },
                listeners : {
                    dataready : this.refreshModelEditorEnvVarHandler,
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
        if(record.get('system') == true){
            canDelete = false;
        }
        if(null == this.contextMenuRef){
            var L = this.LANG_TEXT.MENU;
            var A_MAP = this.self.A_MAP;
            this.contextMenuRef = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                    text : L.MODIFY,
                    code : A_MAP.MODIFY
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
            var items = this.contextMenuRef.items;
            items.getAt(1).setDisabled(!canDelete);
        }
        return this.contextMenuRef;
    },

    /*
     * 模型预览处理器
     */
    modelPreviewHandler : function()
    {
        this.renderPreviewWindow(this.currentLoadedModel.id);
    },
    renderPreviewWindow : function(mid)
    {
        if(!this.previewWinRef){
            this.previewWinRef = new App.Site.CmMgr.Ui.ModelPreview({
                initLoadedModel : mid,
                mainPanelRef : this.mainPanelRef
            });
        }else{
            if(this.$_need_reload_model_items_$){
                this.previewWinRef.reloadModel(mid);
                this.$_need_reload_model_items_$ = false;
            }
        }
        this.previewWinRef.center();
        this.previewWinRef.show();
    },

    itemContextMenuHandler : function(grid, record, htmlItem, index, event)
    {
        var menu = this.getContextMenu(record);
        menu.record = record;
        var pos = event.getXY();
        event.stopEvent();
        menu.showAt(pos[0], pos[1]);
    },

    menuItemClickHandler : function(menu, item)
    {
        var code = item.code;
        var A_MAP = this.self.A_MAP;
        switch (code) {
            case A_MAP.MODIFY:
                this.itemDblClickHandler(this, menu.record);
                break;
            case A_MAP.DELETE:
                this.deleteHandler(menu.record);
                break;
        }
    },

    /*
     * 编辑字段信息
     */
    itemDblClickHandler : function(panel, record)
    {
        //获取当前字段名称的集合
        var fields = [];
        this.store.each(function(r){
            fields.push(r.get('name'));
        });
        this.mainPanelRef.renderPanel('FieldEditor', {
            initLoadedField : record.get('id'),
            targetModel : Ext.clone(this.currentLoadedModel),
            initFields : fields,
            appRef : this.appRef
        });
    },

    /*
     * 删除指定的字段
     */
    deleteHandler : function(record)
    {
        Cntysoft.showQuestionWindow(Ext.String.format(this.LANG_TEXT.DELETE_ASK, record.get('alias')), function(bid){
            if('yes' == bid){
                this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.DELETE'));
                this.appRef.deleteField(record.get('id'), function(response){
                    this.loadMask.hide();
                    if(!response.status){
                        Cntysoft.Kernel.Utils.processApiError(response);
                    } else{
                        //环境变量的更新
                        this.store.reload();
                    }
                }, this);
            }
        }, this);
    },

    refreshModelEditorEnvVarHandler : function(data)
    {
        this.mainPanelRef.appRef.setEnvVar('ModelFields'+this.currentLoadedModel.id, data);
    },
    /*
     * 根据模型名称获取面板的标题
     *
     * @param {String} modelName
     * @return {String}
     */
    getPanelTitle : function(modelName)
    {
        return '[ ' + modelName + ' ] ' + this.LANG_TEXT.TITLE;
    },

    /*
     * 获取列对象集合
     */
    getColsConfig : function()
    {
        var stdRenderer = Cntysoft.Utils.ColRenderer;
        var COLS = this.LANG_TEXT.COLS;
        return [
            {text : COLS.KEY, dataIndex : 'name', width : 150, resizable : false, sortable : false, menuDisabled : true},
            {text : COLS.NAME, dataIndex : 'alias', width : 150, resizable : false, sortable : false, menuDisabled : true},
            {text : COLS.FEILD_TYPE, dataIndex : 'fieldType', flex : 1, resizable : false, sortable : false, menuDisabled : true,renderer: Ext.bind(this.fieldTypeRenderer, this)},
            {text : COLS.LEVEL, dataIndex : 'system', width : 100, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.levelRenderer, this)},
            {text : COLS.REQUIRE, dataIndex : 'require', width : 80, resizable : false, sortable : false, menuDisabled : true, align : 'center', renderer : stdRenderer.boolRenderer},
            {text : COLS.DISPLAY, dataIndex : 'isDisplay', width : 80, resizable : false, sortable : false, menuDisabled : true, align : 'center', renderer : stdRenderer.boolRenderer},
            {text : COLS.VIRTUAL, dataIndex : 'virtual', width : 80, resizable : false, sortable : false, menuDisabled : true, renderer : stdRenderer.boolRenderer}
        ];
    },

    levelRenderer : function(value)
    {
        if(value){
            return '<span style = "color:red">' + this.LANG_TEXT.T_SYSTEM + '</span>';
        } else{
            return this.LANG_TEXT.T_USER;
        }
    },
    /*
     * 字段类型
     */
    fieldTypeRenderer : function(value)
    {
        var L = this.GET_LANG_TEXT('FIELD_WIDGET_NAME_MAP');
        if(L.hasOwnProperty(value)){
            return L[value];
        }
        return value;
    },

    destroy : function()
    {
        delete this.appRef;
        if(this.contextMenuRef){
            this.contextMenuRef.destroy();
            delete this.contextMenuRef;
        }
        if(this.loadMask){
            this.loadMask.destroy();
            delete this.loadMask;
        }
        if(this.previewWinRef){
            this.previewWinRef.destroy();
            delete this.previewWinRef;
        }
        delete this.FIELD_WIDGET_NAME_MAP;
        delete this.targetModel;
        delete this.mainPanelRef;
        delete this.currentLoadedModel.id;
        this.el.destroy();
        this.callParent();
    }
});