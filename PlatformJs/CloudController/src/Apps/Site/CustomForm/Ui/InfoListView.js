/*
 * Cntysoft Cloud Software Team
 *
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 指定表单的字段管理
 */
Ext.define('App.Site.CustomForm.Ui.InfoListView', {
    extend: 'Ext.grid.Panel',
    requires: [
        'App.Site.CustomForm.Ui.FormPreview',
        'Cntysoft.Utils.ColRenderer'
    ],
    mixins: {
        langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
    },

    statics : {
        A_MAP : {
            DELETE : 1,
            LOOK : 2
        },
        TYPE_MAP : {
           0 : 'integer',
           1 : 'integer',
           2 : 'string',
           3 : 'string',
           4 : 'integer',
           5 : 'string',
           6 : 'string',
           7 : 'integer',
           8 : 'boolean',
           9 : 'integer'
        }
    },

    /*
     * @inheritdoc
     */
    panelType: 'InfoList',
    /*
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey: 'App.Site.CustomForm',
    /*
     * 当前加载的表单数据
     *
     * @property {Object} currentLoadedForm
     */
    currentLoadedForm : {},
    //private
    contextMenuRef : null,
    
    //private
    previewWinRef : null,
    //private
    appRef : null,
    fields : [],
    /*
     * 当前加载的表单数据
     *
     * @property {Object} targetForm
     */
    targetForm : null,
    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.INFO_LIST_VIEW');
        this.appRef = config.mainPanelRef.appRef;
        this.fields = config.targetForm.fields;
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },

    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            border : true,
            title : this.getPanelTitle(config.targetForm.name)
        });
    },

    initComponent : function()
    {
       var store = this.createStore();
        Ext.apply(this, {
            columns : this.getColsConfig(),
            store : store,
            bbar : Ext.create('Ext.PagingToolbar', {
                store : store,
                displayInfo : true,
                emptyMsg : Cntysoft.GET_LANG_TEXT('MSG.EMPTY_TEXT')
            })
        });
        this.addListener('afterrender', function(){
            this.loadInfos(this.targetForm.id, this.targetForm.name, this.targetForm.formKey);
        }, this, {
            single : true
        });
        this.addListener({
            itemdblclick : this.formPreviewHandler,
            itemcontextmenu : this.itemContextMenuHandler,
            scope : this
        });
        this.callParent();
    },

    /*
     * 加载指定的表单的字段信息
     *
     * @param {Number} id
     * @param {String} formName
     * @param {String} formKey
     */
    loadInfos : function(id, formName, formKey)
    {
//        if(id !== this.currentLoadedForm.id){
            this.store.load({
                params : {
                    key : formKey
                }
            });
            this.setTitle(this.getPanelTitle(formName));
            this.currentLoadedForm.id = id;
            this.currentLoadedForm.name = formName;
            this.currentLoadedForm.key = formKey;
//        }
    },

    createStore : function()
    {
        var len = this.fields.length, fields = [], field = {persist:false}, TYPE_MAP = this.self.TYPE_MAP;
        for(var i = 0; i < len; i++){
           field.name = this.fields[i].name;
           field.type = TYPE_MAP[this.fields[i].type];
           fields.push(field);
        }
        return new Ext.data.Store({
            fields : fields,
            proxy : {
                type : 'apigateway',
                pArgs : [{
                  key : 'key',
                  value : this.targetForm.formKey
                }],
                callType : 'App',
                invokeMetaInfo : {
                    module : 'Site',
                    name : 'CustomForm',
                    method : 'Form/getInfoListByKey'
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
                    text : L.LOOK,
                    code : A_MAP.LOOK
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
     * 表单预览处理器
     */
    formPreviewHandler : function(panel, record)
    {
        this.renderPreviewWindow(this.currentLoadedForm.id, record.get('id'));
    },
    renderPreviewWindow : function(fid, infoId)
    {
        if(!this.previewWinRef){
            this.previewWinRef = new App.Site.CustomForm.Ui.FormPreview({
                initLoadedForm : fid,
                mainPanelRef : this.mainPanelRef,
                infoId : infoId
            });
        }else{
            this.previewWinRef.reloadForm(fid, infoId);
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
            case A_MAP.LOOK:
                this.formPreviewHandler(this, menu.record);
                break;
            case A_MAP.DELETE:
                this.deleteHandler(menu.record);
                break;
        }
    },

    /*
     * 删除指定的字段
     */
    deleteHandler : function(record)
    {
        Cntysoft.showQuestionWindow(Ext.String.format(this.LANG_TEXT.DELETE_ASK, record.get('alias')), function(bid){
            if('yes' == bid){
                this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.DELETE'));
                this.appRef.deleteInfo(this.currentLoadedForm.id, record.get('id'), function(response){
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
    /*
     * 根据表单名称获取面板的标题
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
    getColsConfig : function ()
   {
      var stdRenderer = Cntysoft.Utils.ColRenderer;
      var COLS = this.LANG_TEXT.COLS;
      var len = this.fields.length > 4 ? 5 : this.fields.length, cols = [];
      cols[0] = {flex : 1, resizable : false, sortable : false, menuDisabled : true, align : 'center', text : COLS.ID, dataIndex : 'id'};
      for(var i = 0; i < len; i++) {
         if('Selection' == this.fields[i].fieldType){
            continue;
         }
         var col = {flex : 1, resizable : false, sortable : false, menuDisabled : true, align : 'center'};
         col.text = this.fields[i].alias;
         col.dataIndex = this.fields[i].name;
         
         if(8 == this.fields[i].type){
            col.renderer = stdRenderer.boolRenderer;
         }
         
         if('Date' == this.fields[i].fieldType){
            col.renderer = stdRenderer.timestampRenderer;
         }
         cols.push(col);
      }
      return cols;
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
        delete this.targetForm;
        delete this.mainPanelRef;
        delete this.currentLoadedForm.id;
        this.el.destroy();
        this.callParent();
    }
});