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
Ext.define('App.Site.Category.Ui.Structure.General.BasicSetting', {
    extend: 'Ext.form.Panel',
    requires: [
        'App.Site.Category.Comp.CategoryCombo',
        'Cntysoft.Kernel.Utils'
    ],
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
    //private
    COMMON_TEXT : null,
    constructor : function(config)
    {
        this.LANG_TEXT = this.GET_LANG_TEXT('STRUCTURE.GENERAL_TAB_PANEL.BASIC_SETTING');
        this.COMMON_TEXT = config.mainPanelRef.COMMON_TEXT;
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
        var C = this.COMMON_TEXT;
        var LABEL_TEXT = L.LABEL;
        var C_LABEL_TEXT = C.LABEL;
        var TOOLTIP_TEXT = L.TOOLTIP;
        var BLANK_TEXT = L.BLANK_TEXT;
        var mainPanel = this.mainPanelRef;
        return  [mainPanel.getIdNodeConfig(), {
            xtype : 'sitecategorycompcategorycombo',
            fieldLabel : C_LABEL_TEXT.PID + RED_STAR,
            toolTipText : C_LABEL_TEXT.PID,
            name : 'pid',
            anchor : '60%',
            allowTypes : [3],
            minWidth : 500,
            listeners : {
                afterrender : function(field)
                {
                    this.mainPanelRef.categoryTreeFieldRef = field;
                },
                scope : this
            }
        }, {
            xtype : 'textfield',
            fieldLabel : LABEL_TEXT.TEXT + RED_STAR,
            anchor : '40%',
            minWidth : 400,
            toolTipText : TOOLTIP_TEXT.TEXT,
            allowBlank : false,
            blankText : BLANK_TEXT.TEXT,
            name : 'text'
        }, {
            xtype : 'fieldcontainer',
            layout : 'hbox',
            anchor : '80%',
            fieldLabel : LABEL_TEXT.NODE_IDENTIFIER + RED_STAR,
            toolTipText : TOOLTIP_TEXT.NODE_IDENTIFIER,
            items : [{
                xtype : 'textfield',
                name : 'nodeIdentifier',
                flex : 1,
                allowBlank : false,
                blankText : BLANK_TEXT.NODE_IDENTIFIER,
                vtype : 'alphanum'
            }, {
                xtype : 'button',
                text : C_LABEL_TEXT.CHECK_NODE_IDENTIFIER,
                margin : '0 0 0 10',
                listeners : {
                    click : mainPanel.checkNodeIdentifierClickHandler,
                    scope : mainPanel
                }
            }, {
                xtype : 'label',
                margin : '0 0 0 10'
            }]
        }, {
            xtype : 'textarea',
            fieldLabel : LABEL_TEXT.DESCRIPTION,
            anchor : '80%',
            toolTipText : TOOLTIP_TEXT.DESCRIPTION,
            height : 80,
            name : 'description'
        }, {
            xtype : 'textarea',
            fieldLabel : LABEL_TEXT.META_KEYWORDS,
            anchor : '80%',
            toolTipText : TOOLTIP_TEXT.META_KEYWORDS,
            height : 80,
            name : 'metaKeywords'
        }, {
            xtype : 'textarea',
            fieldLabel : LABEL_TEXT.META_DESCRIPTION,
            anchor : '80%',
            toolTipText : TOOLTIP_TEXT.META_DESCRIPTION,
            height : 80,
            name : 'metaDescription'
        }];
    },
    destroy : function()
    {
        delete this.mainPanelRef;
        delete this.COMMON_TEXT;
        this.mixins.langTextProvider.destroy.call(this);
        //delete this.dirnameFieldRef;
        this.callParent();
    }
});