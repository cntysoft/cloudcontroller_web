/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 设置选项面板,这个负责加载所有面板的数据，进行集中处理
 */
Ext.define('App.Site.Category.Ui.Structure.Single.BasicSetting', {
    extend: 'Ext.form.Panel',
    mixins: {
        langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
    },
    /*
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Site.Category',
    /*
     * 是否设置值标志变量
     *
     * @param {Boolean} isValueSetted
     */
    isValueSetted : false,
    //private
    mainPanelRef : null,
    constructor : function(config)
    {
        this.LANG_TEXT = this.GET_LANG_TEXT('STRUCTURE.SINGLE_TAB_PANEL.BASIC_SETTING');
        this.mainPanelRef = config.mainPanelRef;
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },

    applyConstraintConfig : function(config)
    {
        Ext.apply(config,{
            title : this.LANG_TEXT.TITLE,
            bodyPadding : 10,
            autoScroll : true
        });
    },

    initComponent : function()
    {
        Ext.apply(this,{
            bbar : this.getBBarConfig(),
            defaults : {
                labelWidth : 200,
                listeners : this.getFormItemListener()
            },
            items : this.getFormFieldsConfig()
        });
        this.callParent();
    },
    /*
     * 接口函数，判断面板是否合法
     *
     * @return {Boolean}
     */
    isPanelValid : function()
    {
        return this.getForm().isValid();
    },
    getPanelValue : function()
    {
        return this.getForm().getValues();
    },
    applyPanelValue : function(values)
    {
        this.getForm().setValues(values);
    },
    resetPanelValue : function()
    {
        this.getForm().reset();
    },

    /*
     * 获取底部操作配置对象
     */
    getBBarConfig : function()
    {
        return this.mainPanelRef.getBBarConfig();
    },

    getFormItemListener : function()
    {
        return {
            afterrender : function(comp)
            {
                this.mainPanelRef.mixins.formTooltip.setupTooltipTarget.call(this.mainPanelRef, comp);
            },
            scope : this
        };
    },
    /*
     * 获取表单配置项
     *
     * @return {Array}
     */
    getFormFieldsConfig : function()
    {
        var RED_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        var L = this.LANG_TEXT;
        var C = this.GET_LANG_TEXT('STRUCTURE.COMMON');
        var LABEL_TEXT = L.LABEL;
        var C_LABEL_TEXT = C.LABEL;
        var TOOLTIP_TEXT = L.TOOLTIP;
        var C_TOOLTIP_TEXT = C.TOOLTIP;
        var BLANK_TEXT = L.BLANK_TEXT;
        var BTN_TEXT = Cntysoft.GET_LANG_TEXT('UI.BTN');
        return [this.mainPanelRef.getIdNodeConfig(),{
            xtype : 'sitecategorycompcategorycombo',
            fieldLabel : C_LABEL_TEXT.PID + RED_STAR,
            toolTipText : C_TOOLTIP_TEXT.PID,
            anchor : '60%',
            minWidth : 500,
            name : 'pid',
            height : 25,
            allowTypes : [3],
            listeners : {
                afterrender : function(field)
                {
                    this.mainPanelRef.categoryTreeFieldRef = field;
                },
                scope : this
            }
        },{
            xtype : 'textfield',
            fieldLabel : LABEL_TEXT.TEXT + RED_STAR,
            anchor : '40%',
            minWidth : 400,
            name : 'text',
            allowBlank : false,
            blankText : BLANK_TEXT.TEXT
        },{
            xtype : 'fieldcontainer',
            layout : {
                type : 'hbox'
            },
            anchor : '85%',
            fieldLabel : LABEL_TEXT.NODE_IDENTIFIER + RED_STAR,
            toolTipText : C_TOOLTIP_TEXT.NODE_IDENTIFIER,
            items : [{
                xtype : 'textfield',
                name : 'nodeIdentifier',
                flex : 1,
                //minWidth : 370,
                allowBlank : false,
                blankText : BLANK_TEXT.NODE_IDENTIFIER,
                vtype : 'alphanum'
            }, {
                xtype : 'button',
                text : C_LABEL_TEXT.CHECK_NODE_IDENTIFIER,
                margin : '0 0 0 10',
                listeners : {
                    click : this.mainPanelRef.checkNodeIdentifierClickHandler,
                    scope : this.mainPanelRef
                }
            }, {
                xtype : 'label',
                margin : '0 0 0 10'
            }]
        }, {
            xtype : 'fieldcontainer',
            fieldLabel : LABEL_TEXT.DEFAULT_TPL_FILE + RED_STAR,
            layout : {
                type : 'hbox'
            },
            toolTipText : TOOLTIP_TEXT.TPL,
            anchor : '70%',
            items : [{
                xtype : 'textfield',
                flex : 1,
                margin : '0 10 0 0',
                name : 'coverTemplateFile',
                allowBlank : false,
                blankText : BLANK_TEXT.DEFAULT_TPL_FILE
            }, {
                xtype : 'button',
                text : BTN_TEXT.SELECT,
                width : 80,
                listeners : {
                    click : function(btn)
                    {
                        this.mainPanelRef.tplSelectHandler(btn.previousSibling());
                    },
                    scope : this
                }
            }]
        },{
            xtype : 'textarea',
            anchor : '80%',
            fieldLabel : LABEL_TEXT.DESCRIPTION,
            height : 80,
            name : 'description',
            toolTipText : TOOLTIP_TEXT.DESCRIPTION
        }, {
            xtype : 'textarea',
            anchor : '80%',
            fieldLabel : C_LABEL_TEXT.META_KEYWORDS,
            height : 80,
            name : 'metaKeywords',
            toolTipText : C_TOOLTIP_TEXT.META_KEYWORDS
        }, {
            xtype : 'textarea',
            anchor : '80%',
            fieldLabel : C_LABEL_TEXT.META_DESCRIPTION,
            height : 80,
            name : 'metaDescription',
            toolTipText : C_TOOLTIP_TEXT.META_DESCRIPTION
        }];
    },
    destroy : function()
    {
        delete this.mainPanelRef;
        this.mixins.langTextProvider.destroy.call(this);
        this.callParent();
    }
});