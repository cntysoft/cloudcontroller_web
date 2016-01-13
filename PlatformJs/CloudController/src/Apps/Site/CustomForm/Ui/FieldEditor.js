/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 字段内容编辑器
 *
 *  支持的类型有
 *
 * -  integer
 * -  date
 * -  datetime
 * -  decimal
 * -  float
 * -  double
 * -  char
 * -  text
 * -  varchar
 *
 */
Ext.define('App.Site.CustomForm.Ui.FieldEditor', {
    extend: 'Ext.form.Panel',
    requires: [
        'Cntysoft.Utils.HtmlTpl',
        'App.Site.CustomForm.Ui.FieldTypeWin'
    ],
    mixins: {
        langTextProvider: 'WebOs.Mixin.RunableLangTextProvider',
        formTooltip: 'Cntysoft.Mixin.FormTooltip'
    },

    /*
     * @property {String} panelType
     */
    panelType : 'FieldEditor',

    /*
     * 首次加载的字段信息
     *
     * @property {Boolean} initLoadedField
     */
    initLoadedField : null,

    /*
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Site.CustomForm',

    /*
     * 编辑器表单模式为全新添加模式
     *
     * @property {Number} mode
     */
    mode : WebOs.Kernel.Const.NEW_MODE,

    /*
     * 字段默认参数
     *
     * @property {Object} defaultFieldOpt
     */
    defaultFieldOpt : null,
    /*
     * 目标表单相关数据
     *
     *@property {Object} targetForm
     */
    targetForm : null,
    /*
     * 当前加载的表单数据
     *
     * @property {Object} currentLoadedField
     */
    currentLoadedField : null,

    /*
     * 当前字段选择的类型参数
     *
     * @property {Object} fieldUiOpt
     */
    fieldUiOpt : {},
    /*
     * @property {App.Site.CustomForm.Ui.FieldTypeWin} fieldTypeWinRef
     */
    fieldTypeWinRef : null,

    /*
     * 表单已经存在的字段识别KEY的列表
     *
     * @property {Array} initFields
     */
    initFields : null,

    //private
    appRef : null,
    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.FIELD_EDITOR');
        this.mixins.formTooltip.constructor.call(this);
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },

    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            border : false,
            title : this.LANG_TEXT.TITLE
        });
    },

    initComponent : function()
    {
        Ext.apply(this, {
            bodyPadding : 10,
            defaults : {
                labelWidth : 200,
                listeners : {
                    afterrender : function(formItem)
                    {
                        this.mixins.formTooltip.setupTooltipTarget.call(this, formItem);
                    },
                    scope : this
                }
            },
            items : this.fieldsConfig(),
            buttons : [{
                text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
                listeners : {
                    click : this.saveFieldHandler,
                    scope : this
                }
            }, {
                text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
                listeners : {
                    click : function()
                    {
                        this.mainPanelRef.renderPanel('FieldList', {
                            targetForm : this.targetForm
                        });
                    },
                    scope : this
                }
            }]
        });
        if(this.initLoadedField){
            //编辑表单
            this.addListener('afterrender', this.loadFieldHandler, this);
        }
        this.callParent();
    },

    gotoModifyMode : function()
    {
        var C = WebOs.Kernel.Const;
        if(this.mode != C.MODIFY_MODE){
            var TYPE = this.GET_LANG_TEXT('FIELD_WIDGET_NAME_MAP');
            if(!TYPE.hasOwnProperty(this.currentLoadedField.fieldType)){
                this.down('button').setDisabled(true);
            }
            if(this.currentLoadedField.name === 'nodeId'){
                this.down('fieldcontainer[name="displayFieldContainer"]').setDisabled(true);
            }
            this.down('textfield[name="name"]').setDisabled(true);
            //this.down('fieldcontainer[name="virtualContainer"]').setDisabled(true);
            this.down('button[name="typeSetterBtn"]').setDisabled(Ext.Array.contains(this.getNoStterFieldTypes(), this.currentLoadedField.fieldType));
            this.mode = C.MODIFY_MODE;
        }

    },

    /*
     * 获取没有设置面板的字段类型
     *
     * @return {Array}
     */
    getNoStterFieldTypes : function()
    {
        return [
            'Category',
            'Status',
            'Keywords'
        ];
    },

    loadFieldHandler : function(self)
    {
        this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
        this.appRef.getField(this.initLoadedField, function(response){
            this.loadMask.hide();
            if(!response.status){
                Cntysoft.processApiError(response);
            } else{
                var data = response.data;
                this.fieldUiOpt = data.uiOption;
                this.currentLoadedField = Ext.clone(data);

                if(Ext.isBoolean(data.require)) {
                    data.require = (data.require === true) ? 1 : 0;
                }
                if(Ext.isBoolean(data.virtual)) {
                    data.virtual = (data.virtual === true) ? 1 : 0;
                }
                if(Ext.isBoolean(data.display)) {
                    data.display = (data.display == true) ? 1 : 0;
                }
                
                this.getForm().setValues(data);
                this.gotoModifyMode();
            }
        }, this);
    },

    /*
     * 保存指定的字段
     */
    saveFieldHandler : function()
    {
        var form = this.getForm();
        if(form.isValid()){
            var values = this.getValues();
            var uiOpt = this.fieldUiOpt || {};
            //加入具有类型相关数据加入进来，所有写setter的时候不能将这两个字段用于其他意思
            if(uiOpt.type){
                values.type = uiOpt.type;
            }
            if(uiOpt.length){
                values.length = uiOpt.length;
            }
            values.defaultValue = uiOpt.defaultValue;
            delete uiOpt.defaultValue;
            delete uiOpt.fieldType;
            //提取默认值
            values.uiOption = this.fieldUiOpt || {};
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
            if(this.mode == WebOs.Kernel.Const.NEW_MODE){
                this.appRef.addField(this.targetForm.formKey, values, function(response){
                    this.loadMask.hide();
                    if(!response.status){
                        Cntysoft.Kernel.Utils.processApiError(response);
                    } else{
                        this.mainPanelRef.renderPanel('FieldList', {
                            targetForm : this.targetForm
                        });
                    }
                }, this);
            } else{
                this.appRef.updateField(this.currentLoadedField.id, values, function(response){
                    this.loadMask.hide();
                    if(!response.status){
                        Cntysoft.Kernel.Utils.processApiError(response);
                    } else{
                        this.mainPanelRef.renderPanel('FieldList', {
                            targetForm : this.targetForm
                        });
                    }
                }, this);
            }
        }
    },

    openFieldTypeWindowHandler : function()
    {
        var mode;
        if(!this.fieldTypeWinRef){
            //获取相关的值
            this.fieldTypeWinRef = new App.Site.CustomForm.Ui.FieldTypeWin({
                mode : this.mode,
                fieldModel : this.currentLoadedField,
                noSetterFieldTypes : this.getNoStterFieldTypes(),
                listeners : {
                    dataready : this.typeDataReadyHandler,
                    scope : this
                }
            });
        } else{
            var values = this.fieldUiOpt;
            if(this.currentLoadedField){
                values.defaultValue = this.currentLoadedField.defaultValue;
            }
            this.fieldTypeWinRef.setTargetType(this.down('textfield[name="fieldType"]').getValue(), values);
        }
        this.fieldTypeWinRef.center();
        this.fieldTypeWinRef.show();
    },

    typeDataReadyHandler : function(values)
    {
        this.down('textfield[name="fieldType"]').setValue(values.fieldType);
        this.fieldUiOpt = values;
    },

    fieldsConfig : function()
    {
        var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        var FIELDS = this.LANG_TEXT.FIELDS;
        var T_TEXT = this.LANG_TEXT.T_TEXT;
        return [{
            xtype : 'textfield',
            fieldLabel : FIELDS.NAME + R_STAR,
            vtype : 'alphanum',
            allowBlank : false,
            toolTipText : T_TEXT.NAME,
            name : 'name',
            validateBlank : true
        }, {
            xtype : 'textfield',
            fieldLabel : FIELDS.ALIAS + R_STAR,
            name : 'alias',
            allowBlank : false,
            toolTipText : T_TEXT.ALIAS
        }, {
            xtype : 'textarea',
            fieldLabel : FIELDS.DESCRIPTION,
            width : 600,
            height : 100,
            name : 'description',
            toolTipText : T_TEXT.DESCRIPTION
        }, {
            xtype : 'radiogroup',
            fieldLabel : FIELDS.VIRTUAL,
            columns : 2,
            width : 300,
            vertical : true,
            name : 'virtualContainer',
            disabled : true,
            items : [
                {boxLabel : Cntysoft.GET_LANG_TEXT('UI.BTN.YES'), name : 'virtual', inputValue : 1},
                {boxLabel : Cntysoft.GET_LANG_TEXT('UI.BTN.NO'), name : 'virtual', inputValue : 0, checked : true}
            ],
            toolTipText : T_TEXT.VIRTUAL
        }, {
            xtype : 'radiogroup',
            fieldLabel : FIELDS.REQUIRE,
            columns : 2,
            width : 300,
            vertical : true,
            items : [
                {boxLabel : Cntysoft.GET_LANG_TEXT('UI.BTN.YES'), name : 'require', inputValue : 1, checked : true},
                {boxLabel : Cntysoft.GET_LANG_TEXT('UI.BTN.NO'), name : 'require', inputValue : 0}
            ]
        }, {
            xtype : 'radiogroup',
            fieldLabel : FIELDS.DISPLAY,
            columns : 2,
            width : 300,
            name : 'displayFieldContainer',
            vertical : true,
            items : [
                {boxLabel : Cntysoft.GET_LANG_TEXT('UI.BTN.YES'), name : 'display', inputValue : 1, checked : true},
                {boxLabel : Cntysoft.GET_LANG_TEXT('UI.BTN.NO'), name : 'display', inputValue : 0}
            ]
        }, {
            xtype : 'fieldcontainer',
            width : 500,
            fieldLabel : FIELDS.TYPE + R_STAR,
            toolTipText : T_TEXT.TYPE,
            layout : {
                type : 'hbox'
            },
            items : [{
                xtype : 'textfield',
                width : 200,
                readOnly : true,
                name : 'fieldType',
                allowBlank : false
            }, {
                xtype : 'button',
                text : FIELDS.TYPE_S_BTN,
                margin : '0 0 0 5',
                name : 'typeSetterBtn',
                listeners : {
                   click : this.openFieldTypeWindowHandler,
                   scope : this
                }
            }]
        }];
    },
    destroy : function()
    {
        delete this.mainPanelRef;
        delete this.appRef;
        this.callParent();
    }
});