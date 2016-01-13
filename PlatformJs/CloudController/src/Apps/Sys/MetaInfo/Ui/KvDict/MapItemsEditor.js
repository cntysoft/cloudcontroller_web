/*
 * Cntysoft OpenEngine
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 映射种类编辑器
 */
Ext.define('App.Sys.MetaInfo.Ui.KvDict.MapItemsEditor', {
    extend : 'Ext.grid.Panel',
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    requires : [
        'Cntysoft.Utils.HtmlTpl'
    ],
    /**
     * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
     * 
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Sys.MetaInfo',
    /**
     * @property {String} panelType 面板的类型
     */
    panelType : 'MapItemsEditor',
    /**
     * @private
     * @property {String} dictKey 当前的加载的字典类型
     */
    dictKey : null,
    /**
     * @private
     * @property {Ext.window.Window} newRecordWindow
     */
    newRecordWindow : null,
    /**
     * @property {Ext.menu.Menu} itemCCmenu
     */
    itemCCmenu : null,
    /**
     * @property {Ext.menu.Menu} batchCCmenu
     */
    batchCCmenu : null,
    /**
     * @private
     * @property {Object} orgRecords 加载的原始数据
     */
    orgRecords : null,
    constructor : function (config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('KVDICT_MANAGER.MAP_ITEMS_EDITOR');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },
    applyConstraintConfig : function (config)
    {
        Ext.apply(config, {
            emptyText : this.LANG_TEXT.EMPTY_TEXT,
            selModel : {
                mode : 'MULTI',
                allowDeselect : true
            },
            title : this.LANG_TEXT.TITLE
        });
    },
    initComponent : function ()
    {
        if(Ext.isEmpty(this.dictKey)){
            Cntysoft.raiseError(
            Ext.getClassName(this),
            'initComponent',
            'dictKey canot be empty'
            );
        }
        var BTN = this.LANG_TEXT.BTN;
        Ext.apply(this, {
            columns : this.getColsConfig(),
            store : this.createGridStore(),
            plugins : [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit : 2
                })
            ],
            buttons : [{
                    text : BTN.ADD_NEW,
                    listeners : {
                        click : function ()
                        {
                            this.renderNewRecordWindow();
                        },
                        scope : this
                    }
                }, {
                    text : BTN.RESTORE,
                    listeners : {
                        click : function ()
                        {
                            this.store.removeAll();
                            this.store.loadData(this.orgRecords);
                        },
                        scope : this
                    }
                }, {
                    text : BTN.SAVE,
                    listeners : {
                        click : function ()
                        {
                            var items = [];
                            var me = this;
                            var data;
                            this.store.each(function (record){
                                data = {
                                    value : record.get('value'),
                                    enable : record.get('enable'),
                                    isDefault : record.get('isDefault')
                                };
                                items.push(data);
                            }, this);
                            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
                            this.mainPanelRef.appRef.alterKvMapItems(this.dictKey, items, function (response){
                                me.loadMask.hide();
                                if(!response.status){
                                    Cntysoft.Kernel.Utils.processApiError(response);
                                } else{
                                    me.orgRecords = items;
                                }
                            }, this);
                        },
                        scope : this
                    }
                }]
        });
        this.addListener({
            itemcontextmenu : this.contextMenuClickHandler,
            afterrender : function ()
            {
                this.loadDictItems(this.dictKey, true);
            },
            scope : this
        });
        this.callParent();
    },
    loadDictItems : function (key, force)
    {
        if(force || key !== this.dictKey){
            this.dictKey = key;
            this.store.load({
                params : {
                    identifier : key
                }
            });
        }
    },
    /**
     * @return {Ext.data.Store}
     */
    createGridStore : function ()
    {
        return new Ext.data.Store({
            autoLoad : false,
            fields : [
                {name : 'isDefault', type : 'boolean'},
                {name : 'enable', type : 'boolean'},
                {name : 'value', type : 'string'}
            ],
            proxy : {
                type : 'apigateway',
                callType : 'App',
                invokeMetaInfo : {
                    module : 'Sys',
                    name : 'MetaInfo',
                    method : 'KvDict/getItemContent'
                },
                reader : {
                    type : 'json',
                    rootProperty: 'items',
                    totalProperty : 'total'
                }
            },
            listeners : {
                load : function (store, records)
                {
                    var len = records.length;
                    this.orgRecords = [];
                    for(var i = 0; i < len; i++) {
                        this.orgRecords.push(records[i].raw);
                    }
                },
                update : this.dictItemUpdateHandler,
                scope : this
            }
        });
    },
    /**
     * 删除指定的数据集合
     * 
     * @param {Array} records
     */
    deleteDictItems : function (records)
    {
        var len = records.length;
        for(var i = 0; i < len; i++) {
            this.store.remove(records[i]);
        }
        var hasDefaultSet = false;
        var first;
        records = this.store.getRange();
        for(var i = 0; i < len; i++) {
            if(0 == i){
                first = records[i];
            }
            if(records[i] && records[i].get('isDefault')){
                hasDefaultSet = true;
            }
        }
        if(!hasDefaultSet && first){
            first.set('isDefault', true);
        }
    },
    /**
     * 获取批量操作的菜单
     * 
     * @return {Ext.menu.Menu}
     */
    getBatchMenu : function ()
    {
        if(null == this.batchCCmenu){
            this.batchCCmenu = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                        text : this.LANG_TEXT.MENU.DELETE_SEL
                    }],
                listeners : {
                    click : function (menu, item){
                        Cntysoft.showQuestionWindow(this.LANG_TEXT.DELETE_ASK, function (bid){
                            if('yes' == bid){
                                if(item){
                                    this.deleteDictItems(menu.records);
                                }
                            }
                        }, this);
                    },
                    scope : this
                }
            });
        }
        return this.batchCCmenu;
    },
    /**
     * 获取单项操作的菜单
     * 
     * @return {Ext.menu.Menu}
     */
    getContextMenu : function ()
    {
        if(null == this.itemCCmenu){
            this.itemCCmenu = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                        text : this.LANG_TEXT.MENU.DELETE
                    }],
                listeners : {
                    click : function (menu, item){
                        Cntysoft.showQuestionWindow(this.LANG_TEXT.DELETE_ASK, function (bid){
                            if('yes' == bid){
                                if(item){
                                    this.deleteDictItems([menu.record]);
                                }
                            }
                        }, this);
                    },
                    scope : this
                }
            });
        }
        return this.itemCCmenu;
    },
    dictItemUpdateHandler : function (store, record)
    {
        if(record.get('isDefault')){
            store.each(function (item){
                if(record != item){
                    item.set('isDefault', false);
                }
            }, this);
        }
    },
    contextMenuClickHandler : function (grid, record, htmlItem, index, event)
    {
        //判断是否有多于2条的信息被选中
        var sel = grid.getSelectionModel();
        var menu;
        var pos = event.getXY();
        if(sel.getCount() > 1){
            menu = this.getBatchMenu();
            menu.records = sel.getSelection();
        } else{
            menu = this.getContextMenu();
            menu.record = record;
        }
        event.stopEvent();
        menu.showAt(pos[0], pos[1]);
    },
    addNewRecordHandler : function ()
    {
        var form = this.newRecordWindow.down('form').getForm();
        if(form.isValid()){
            var values = form.getValues();
            Ext.applyIf(values, {
                isDefault : false,
                enable : false
            });
            if(values.isDefault){
                this.store.each(function (record){
                    record.set('isDefault', false);
                });
            }
            this.store.add(values);
            this.newRecordWindow.close();
        }
    },
    /**
     * @return {Ext.window.Window}
     */
    renderNewRecordWindow : function ()
    {
        if(!this.newRecordWindow){
            var L = this.LANG_TEXT.RECORD_WIN;
            this.newRecordWindow = new Ext.window.Window({
                title : L.TITLE,
                modal : true,
                width : 500,
                height : 300,
                closeAction : 'hide',
                layout : 'fit',
                resizable : false,
                items : this.getNewRecordFormConfig(),
                buttons : [{
                        text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
                        listeners : {
                            click : this.addNewRecordHandler,
                            scope : this
                        }
                    }, {
                        text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
                        listeners : {
                            click : function ()
                            {
                                this.newRecordWindow.close();
                            },
                            scope : this
                        }
                    }],
                listeners : {
                    close : function (panel)
                    {
                        panel.down('form').getForm().reset();
                    },
                    scope : this.newRecordWindow
                }
            });
        }
        this.newRecordWindow.center();
        this.newRecordWindow.show();
        this.newRecordWindow.toFront();
    },
    getNewRecordFormConfig : function ()
    {
        var FS = this.LANG_TEXT.RECORD_WIN.FIELDS;
        return {
            xtype : 'form',
            bodyPadding : 10,
            items : [{
                    xtype : 'checkbox',
                    fieldLabel : FS.IS_DEFAULT,
                    name : 'isDefault',
                    inputValue : true
                }, {
                    xtype : 'checkbox',
                    fieldLabel : FS.ENABLE,
                    name : 'enable',
                    inputValue : true,
                    checked : true
                }, {
                    xtype : 'textarea',
                    fieldLabel : FS.VALUE,
                    width : 450,
                    height : 100,
                    allowBlank : false,
                    name : 'value'
                }]
        };
    },
    getColsConfig : function ()
    {
        var COL_NAMES = this.LANG_TEXT.COL_NAMES;
        return [
            {text : COL_NAMES.IS_DEFAULT, dataIndex : 'isDefault', resizable : false, sortable : false, menuDisabled : true,
                editor : new Ext.form.field.ComboBox({
                    triggerAction : 'all',
                    displayField : 'text',
                    valueField : 'value',
                    editable : false,
                    store : new Ext.data.Store({
                        fields : [
                            {name : 'text', type : 'string', persist : false},
                            {name : 'value', type : 'boolean', persist : false}
                        ],
                        data : [
                            {text : Cntysoft.GET_LANG_TEXT('UI.BTN.YES'), value : true},
                            {text : Cntysoft.GET_LANG_TEXT('UI.BTN.NO'), value : false}
                        ]
                    })
                }), renderer : function (value){
                    return value ? Cntysoft.GET_LANG_TEXT('UI.BTN.YES') : Cntysoft.GET_LANG_TEXT('UI.BTN.NO');
                }},
            {text : COL_NAMES.ENABLE, xtype : 'checkcolumn', dataIndex : 'enable', resizable : false, sortable : false, menuDisabled : true},
            {text : COL_NAMES.VALUE, dataIndex : 'value', flex : 1, resizable : false, sortable : true, menuDisabled : true, editor : {
                    xtype : 'textarea',
                    height : 60,
                    allowBlank : false
                }}
        ];
    },
    destroy : function ()
    {
        this.mixins.langTextProvider.destroy.call(this);
        if(this.newRecordWindow){
            this.newRecordWindow.destroy();
            delete this.newRecordWindow;
        }
        if(this.batchCCmenu){
            this.batchCCmenu.destroy();
            delete this.batchCCmenu;
        }
        if(this.itemCCmenu){
            this.itemCCmenu.destroy();
            delete this.batchCCmenu;
        }
        delete this.orgRecords;
        delete this.mainPanelRef;
        this.callParent();
    }
});
