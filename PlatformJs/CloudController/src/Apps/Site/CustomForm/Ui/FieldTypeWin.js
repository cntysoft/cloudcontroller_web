/*
 * Cntysoft Cloud Software Team
 *
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.CustomForm.Ui.FieldTypeWin', {
    extend : 'Ext.window.Window',
    requires : [
        'Cntysoft.Utils.HtmlTpl',
        'SenchaExt.Tree.DisableNodePlugin'
    ],
    mixins : {
        langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
    },
    /*
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey: 'App.Site.CustomForm',
    /*
     * @property {Number} mode 窗口模式
     */
    mode : 1,
    /*
     * 在修改模式中与之匹配的内容模型元数据
     *
     * @property {Object} model
     */
    fieldModel : null,
    /*
     * 默认的初始化字段类型
     */
    defaultType : 'SingleLineText',
    /*
     * 当前选择类型
     *
     * @property {String} currentType
     */
    currentType : null,
    /*
     * 参数设置容器
     *
     * @property {Ext.container.Container} optDisplayer
     */
    optDisplayer : null,
    /*
     * 类型树面板
     *
     * @property {Ext.tree.Panel} typeTree
     */
    typeTree : null,
    /*
     * 没有设置器的字段类型
     *
     * @private
     * @property {Array} noSetterFieldTypes
     */
    noSetterFieldTypes : null,
    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.FIELD_TYPE_WIN');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },
    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            modal : true,
            width : 900,
            minHeight : 450,
            minWidth : 900,
            height : 450,
            maximizable : true,
            title : this.LANG_TEXT.TITLE,
            constrain : true,
            closeAction : 'hide',
            bodyPadding : 1,
            bodyStyle : {
                background : '#ffffff'
            }
        });
    },
    /*
     * @event  dataready
     * 数据准备好的事件，主要设置一些东西
     *
     * @param {Object} values
     */
    initComponent : function()
    {
        Ext.apply(this, {
            buttons : [{
                text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
                listeners : {
                    click : this.dataReadyHandler,
                    scope : this
                }
            }, {
                text : Cntysoft.GET_LANG_TEXT('UI.BTN.RESTORE'),
                listeners : {
                    click : function()
                    {
                        this.optDisplayer.items.getAt(0).restoreTypeOptValues();
                    },
                    scope : this
                }
            }, {
                text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
                listeners : {
                    click : function()
                    {
                        this.close();
                    },
                    scope : this
                }
            }],
            layout : {
                type : 'border'
            },
            items : [
                this.getTreePanelConfig(),
                this.getCenterConfig()
            ]
        });
        this.addListener('afterrender', function(){
            if(this.mode == WebOs.Kernel.Const.NEW_MODE){
                //加载默认的
                this.setTargetType(this.defaultType);
            } else if(this.mode == WebOs.Kernel.Const.MODIFY_MODE){
                var values = this.fieldModel.uiOption;
                values.defaultValue = this.fieldModel.defaultValue;
                this.setTargetType(this.fieldModel.fieldType, values);
            }
        }, this);

        this.callParent();
    },
    /*
     * 设置当前选中的类型
     *
     * @param {String} type 面板的类型
     * @param {Object} uiOption 类型的配置参数
     */
    setTargetType : function(type, uiOption)
    {
        //首先保证类存在
        type = type || this.defaultType;
        var cls = 'App.Site.CustomForm.Lib.FieldOptSetter.' + type;
        if(!Ext.ClassManager.get(cls)){
            this.optDisplayer.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD_SCRIPT'));
            Ext.require(cls, function(){
                this.optDisplayer.loadMask.hide();
                this.setTargetType(type, uiOption);
            }, this);
            return;
        }
        if(this.currentType !== type){
            this.optDisplayer.removeAll();
            this.optDisplayer.add(Ext.create(cls, {
                initUiOpt : uiOption,
                mode : this.mode
            }));
            this.currentType = type;
        }
        //this.typeTree.selectPath('/Root/' + type, 'type');
    },
    /*
     * 数据已经准备好处理事件
     */
    dataReadyHandler : function()
    {
        var target = this.optDisplayer.items.getAt(0);
        if(target.isSettingValid()){
            var values = target.getTypeOptValues();
            if(values){
                if(this.hasListeners.dataready){
                    this.fireEvent('dataready', values);
                }
                this.close();
            }
        }
    },
    getTreePanelConfig : function()
    {
        var L = this.LANG_TEXT.TREE_PANEL;
        return {
            xtype : 'treepanel',
            title : L.TITLE,
            region : 'west',
            width : 240,
            border : true,
            margin : '0 1 0 0',
            collapsible : true,
            store : this.getTypeStore(),
            rootVisible : false,
            plugins : [{
                ptype : 'nodedisabled'
            }],
            listeners : {
                beforeitemclick : function(treePanel, record)
                {
                    if(record.get('disabled')){
                        return false;
                    }
                    return true;
                },
                afterrender : function(tree)
                {
                    this.typeTree = tree;
                },
                itemclick : function(panel, record)
                {
                    //在这个里面选择的不可能带有参数
                    this.setTargetType(record.get('type'));
                },
                scope : this
            }
        };
    },
    /*
     * @return {Ext.data.TreeStore}
     */
    getTypeStore : function()
    {
        var children = [];
        var TYPE = this.GET_LANG_TEXT('FIELD_WIDGET_NAME_MAP');
        var protecteFields = this.getProtecteFieldType();
        var item;

        for(var type in TYPE) {
            if(Ext.Array.contains(this.noSetterFieldTypes, type)){
                continue;
            }
            item = {
                text : TYPE[type],
                type : type,
                leaf : true
            };
            if(this.mode == this.self.M_NEW){
                if(Ext.Array.contains(protecteFields, type)){
                    item.disabled = true;
                }
            } else if(this.mode == this.self.M_MODIFY){
                if(type !== this.fieldModel.fieldType){
                    item.disabled = true;
                }
            }
            children.push(item);
        }
        return Ext.data.TreeStore({
            fields : [
                {name : 'text', type : 'string', persist : false},
                {name : 'type', type : 'string', persist : false},
                {name : 'disabled', type : 'boolean', persist : false}
            ],
            root : {
                text : 'Field Type Tree',
                type : 'Root',
                children : children
            }
        });
    },
    /*
     * 出现在这个里面的类型都不能选择
     */
    getProtecteFieldType : function()
    {
        return [
            'Title'
        ];
    },
    getCenterConfig : function()
    {
        return {
            xtype : 'container',
            region : 'center',
            layout : 'fit',
            listeners : {
                afterrender : function(panel)
                {
                    this.optDisplayer = panel;
                },
                scope : this
            }
        };
    },
    destroy : function()
    {
        if(this.optDisplayer.loadMask){
            this.optDisplayer.loadMask.destroy();
            delete this.optDisplayer.loadMask;
        }
        delete this.noSetterFieldTypes;
        delete this.typeTree;
        this.mixins.langTextProvider.destroy.call(this);
        delete this.optDisplayer;
        delete this.fieldModel;
        this.callParent();
    }
});