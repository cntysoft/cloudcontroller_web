/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 内容模型信息修改编辑器, 分为常规信息和额外配置
 */
Ext.define('App.Site.CustomForm.Ui.MetaInfo', {
    extend: 'Ext.tab.Panel',
    requires : [
        'Cntysoft.Utils.HtmlTpl',
        'CloudController.Utils'
    ],
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider',
        formTooltip : 'Cntysoft.Mixin.FormTooltip'
    },

    /*
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Site.CustomForm',
    /*
     * 编辑器模型模式为全新添加模式
     *
     * @property {Number} mode
     */
    mode : WebOs.Kernel.Const.NEW_MODE,
    /*
     * @inheritdoc
     */
    panelType : 'MetaInfo',
    /*
     * @property {Ext.form.Panel} basicFormRef
     */
    basicFormRef : null,

    /*
     * 当前加载的模型ID
     *
     * @property {Number} currentLoadedId
     */
    currentLoadedId : null,
    /*
     * 初始化的时候加载的模型id
     *
     * @property {Number} initLoadId
     */
    initLoadId : null,

    /*
     * 修改模式存储的原始数据
     *
     * @property {Object} orgData
     */
    orgData : null,
    /*
     * 模型识别KEY字段引用
     *
     * @private
     * @property {Ext.form.field.Text} formKeyFieldRef
     */
    formKeyFieldRef : null,

    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.META_INFO');
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
            items : [
                this.getBasicInfoPanelConfig()
            ],
            buttons : [{
                text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
                listeners : {
                    click : this.saveHandler,
                    scope : this
                }
            }, {
                text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
                listeners : {
                    click : function()
                    {
                        this.mainPanelRef.renderPanel('FormList');
                    },
                    scope : this
                }
            }]
        });
        if(null !== this.initLoadId){
            this.addListener('afterrender', function(){
                this.loadForm(this.initLoadId);
            }, this, {
                single : true
            });
        }
        this.callParent();
    },

    /*
     * 根据模型ID加载指定的内容模型数据
     *
     * @param {Number} id
     */
    loadForm : function(id)
    {
        var C = WebOs.Kernel.Const;
        if(id !== this.currentLoadedId){
            if(this.mode !== C.MODIFY_MODE){
                this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
                this.appRef.getFormInfo(id, function(response){
                    this.loadMask.hide();
                    if(!response.status){
                        Cntysoft.processApiError(response);
                    } else{
                        this.currentLoadedId = id;
                        var data = response.data;
                        this.orgData = data;
                        data.enabled = data.enabled === true ? 1 : 0;
                        this.basicFormRef.getForm().setValues(data);

                        this.gotoModifyMode();
                    }
                }, this);
            }
        }
    },

    /*
     * 进入修改模式
     */
    gotoModifyMode : function()
    {
        var C = WebOs.Kernel.Const;
        if(this.mode !== C.MODIFY_MODE){
            this.down('textfield[name="key"]').setDisabled(true);
            this.mode = C.MODIFY_MODE;
        }
    },

    /*
     * 进入全新模式
     */
    gotoNewMode : function()
    {
        var C = WebOs.Kernel.Const;
        if(this.mode !== C.NEW_MODE){
            var basicForm = this.basicFormRef.getForm();
            basicForm.reset();
            this.down('textfield[name="key"]').setDisabled(false);
            this.mode = C.NEW_MODE;
        }
    },

    saveHandler : function()
    {
        var basicForm = this.basicFormRef.getForm();
        var values;
        if(basicForm.isValid()){
            values = basicForm.getValues();
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
            var method;
            if(this.mode == WebOs.Kernel.Const.NEW_MODE){
                method = 'addFormMeta';
            } else{
                method = 'updateFormMeta';
                values.key = this.orgData.key;
            }
            this.appRef[method](values, function(response){
                this.loadMask.hide();
                if(!response.status){
                    Cntysoft.processApiError(response, this.GET_LANG_TEXT('ERROR_MAP'));
                } else{
                    Cntysoft.showInfoMsgWindow(Cntysoft.GET_LANG_TEXT('MSG.SAVE_OK'), function(){
                        this.mainPanelRef.renderPanel('FormList');
                    }, this);
                }
            }, this);
        }
    },

    getBasicInfoPanelConfig : function()
    {
        var L = this.LANG_TEXT.BASIC_PANEL;
        return {
            xtype : 'form',
            bodyPadding : 10,
            title : L.TITLE,
            autoScroll : true,
            defaults : {
                xtype : 'textfield',
                width : 350,
                labelWidth : 150,
                listeners : {
                    afterrender : function(formItem)
                    {
                        this.mixins.formTooltip.setupTooltipTarget.call(this, formItem);
                    },
                    scope : this
                }
            },
            listeners : {
                afterrender : function(panel)
                {
                    this.basicFormRef = panel;
                },
                scope : this
            },
            items : this.getFieldsConfig()
        };
    },

    /*
     * 获取表单项配置对象
     *
     * @return Object[]
     */
    getFieldsConfig : function()
    {
        var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        var F = this.LANG_TEXT.BASIC_PANEL.FIELDS;
        var T_TEXT = this.LANG_TEXT.BASIC_PANEL.T_TEXT;
        return [{
            fieldLabel : F.MODEL_NAME + R_STAR,
            name : 'name',
            allowBlank : false
        }, {
            fieldLabel : F.MODEL_KEY + R_STAR,
            name : 'key',
            toolTipText : T_TEXT.MODEL_KEY,
            //validator : Ext.bind(this.modelKeyValidator, this),
            //validateOnBlur : true,
            //validateOnChange : false,
            //validateBlank : true,
            vtype : 'alphanum',
            listeners : {
                afterrender : function(formItem)
                {
                    this.formKeyFieldRef = formItem;
                    this.mixins.formTooltip.setupTooltipTarget.call(this, formItem);
                },
                scope : this
            }
        }, {
            fieldLabel : F.ITEM_NAME + R_STAR,
            width : 250,
            name : 'itemName',
            toolTipText : T_TEXT.ITEM_NAME,
            allowBlank : false
        }, {
            fieldLabel : F.ITEM_UNIT + R_STAR,
            width : 250,
            name : 'itemUnit',
            toolTipText : T_TEXT.ITEM_UNIT,
            allowBlank : false
        }, {
            xtype : 'textarea',
            fieldLabel : F.DESCRIPTION,
            width : 555,
            height : 80,
            name : 'description'
        }, {
            xtype : 'textfield',
            fieldLabel : F.EDITOR + R_STAR,
            name : 'editor',
            toolTipText : T_TEXT.EDITOR,
            value : 'StdEditor',
            editable : false,
            allowBlank : false
        }, {
            xtype : 'textfield',
            fieldLabel : F.DATA_DAVER + R_STAR,
            name : 'dataSaver',
            toolTipText : T_TEXT.DATA_DAVER,
            value : 'StdSaver',
            allowBlank : false,
            editable : false
        }, {
            xtype : 'radiogroup',
            fieldLabel : F.ENABLED,
            columns : 2,
            width : 250,
            disabled : true,
            vertical : true,
            items : [
                {boxLabel : Cntysoft.GET_LANG_TEXT('UI.BTN.YES'), name : 'enabled', inputValue : 1, checked : true},
                {boxLabel : Cntysoft.GET_LANG_TEXT('UI.BTN.NO'), name : 'enabled', inputValue : 0}
            ]
        }];
    },

    destroy : function()
    {
        this.mixins.langTextProvider.destroy.call(this);
        this.mixins.formTooltip.destroy.call(this);
        delete this.appRef;
        delete this.mainPanelRef;
        delete this.basicFormRef;
        delete this.formKeyFieldRef;

        if(this.loadMask){
            this.loadMask.destroy();
            delete this.loadMask;
        }
        this.el.destroy();
        this.callParent();
    }
});