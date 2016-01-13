/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Category.Ui.Structure.LinkTabPanel', {
    extend: 'App.Site.Category.Ui.Structure.AbstractSettingPanel',
    requires: [
        'App.Site.Category.Comp.CategoryCombo',
        'Ext.layout.container.HBox',
        'Cntysoft.Utils.Common',
        'Cntysoft.Utils.HtmlTpl'
    ],
    /*
     * 设置面板的类型名称，这个在APP中生成Panel的时候使用
     *
     * @property {String} settingPanelType
     */
    panelType : 'LinkPanel',
    //private
    formPanelRef : null,
    constructor : function(config)
    {
        this.LANG_TEXT = this.GET_LANG_TEXT('STRUCTURE.LINK_TAB_PANEL');
        this.mixins.formTooltip.constructor.call(this);
        this.callParent([config]);
        this.initPanelTitle();
    },

    /*
     * 获取表单的默认值
     *
     * @return {Object}
     */
    getDefaultValues : function()
    {
        //一般的默认值都是一些选项
        return {
            openType : 1
        };
    },

    /*
     * 进行数据保存
     */
    saveHandler : function()
    {
        this.doSave(this.appRef.self.N_TYPE_LINK);
    },

    /*
     * @inheritdoc
     */
    getTypeText : function()
    {
        return this.GET_LANG_TEXT('STRUCTURE.LINK_TAB_PANEL.TITLE');
    },

    /*
     *  获取外部链接配置对象表单
     *
     *  @return {Object}
     */
    getFormConfig : function()
    {
        return {
            bodyPadding : 10,
            bodyStyle : 'background-color : #ffffff',
            autoScroll : true,
            xtype : 'form',
            title : this.LANG_TEXT.TITLE,
            items : this.getFormFieldsConfig(),
            defaults : {
                labelWidth : 200,
                listeners : this.getFormItemListener()
            },
            bbar : this.getBBarConfig(),
            listeners : {
                afterrender : function(formPanel)
                {
                    this.formPanelRef = formPanel;
                },
                scope : this
            }
        };
    },

    /*
     * 获取表单项默认的监听函数
     *
     * @return {Object}
     */
    getFormItemListener : function()
    {
        return {
            afterrender : function(comp)
            {
                this.mixins.formTooltip.setupTooltipTarget.call(this, comp);
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
        var C_TOOLTIP_TEXT = C.TOOLTIP
        var BLANK_TEXT = L.BLANK_TEXT;
        var config = [this.getIdNodeConfig(), {
            xtype : 'sitecategorycompcategorycombo',
            fieldLabel : C_LABEL_TEXT.PID + RED_STAR,
            toolTipText : C_TOOLTIP_TEXT.PID,
            anchor : '60%',
            minWidth : 500,
            allowTypes : [3],
            name : 'pid',
            height : 25,
            listeners : {
                afterrender : function(field)
                {
                    this.categoryTreeFieldRef = field;
                    this.mixins.formTooltip.setupTooltipTarget.call(this, field);
                },
                scope : this
            }
        }, {
            xtype : 'textfield',
            fieldLabel : LABEL_TEXT.TEXT + RED_STAR,
            anchor : '60%',
            name : 'text',
            height : 25,
            minWidth : 400,
            toolTipText : TOOLTIP_TEXT.TEXT,
            allowBlank : false,
            blankText : BLANK_TEXT.LINK_TEXT
        }, {
            xtype : 'fieldcontainer',
            layout : 'hbox',
            anchor : '80%',
            fieldLabel : LABEL_TEXT.NODE_IDENTIFIER + RED_STAR,
            items : [{
                xtype : 'textfield',
                toolTipText : C_TOOLTIP_TEXT.NODE_IDENTIFIER,
                name : 'nodeIdentifier',
                flex : 1,
                allowBlank : false,
                blankText : BLANK_TEXT.C_NODE_IDENTIFIER,
                vtype : 'alphanum'
            }, {
                xtype : 'button',
                text : C_LABEL_TEXT.CHECK_NODE_IDENTIFIER,
                margin : '0 0 0 10',
                listeners : {
                    click : this.checkNodeIdentifierClickHandler,
                    scope : this
                }
            }, {
                xtype : 'label',
                margin : '0 0 0 10'
            }]
        }, {
            xtype : 'textfield',
            fieldLabel : LABEL_TEXT.URL,
            anchor : '60%',
            height : 25,
            toolTipText : TOOLTIP_TEXT.URL,
            name : 'linkUrl',
            allowBlank : false,
            vtype : 'url',
            blankText : BLANK_TEXT.URL
        }, {
            xtype : 'fieldcontainer',
            fieldLabel : C_LABEL_TEXT.OPEN_TYPE,
            defaultType : 'radiofield',
            layout : {
                type : 'hbox'
            },
            items : [{
                boxLabel : C_LABEL_TEXT.OPEN_TYPE_ORG,
                name : 'openType',
                inputValue : 0,
                checked : true,
                margin : '0 5 0 0'
            }, {
                boxLabel : C_LABEL_TEXT.OPEN_TYPE_NEW,
                name : 'openType',
                inputValue : 1
            }]
        }, {
            xtype : 'fieldcontainer',
            anchor : '40%',
            fieldLabel : C_LABEL_TEXT.SHOW_ON_INDEX_MENU,
            defaultType : 'radiofield',
            toolTipText : C_TOOLTIP_TEXT.SHOW_ON_INDEX_MENU,
            layout : {
                type : 'hbox'
            },
            items : [{
                boxLabel : C_LABEL_TEXT.YES,
                name : 'showOnMenu',
                inputValue : 1,
                checked : true,
                margin : '0 5 0 0'
            }, {
                boxLabel : C_LABEL_TEXT.NO,
                name : 'showOnMenu',
                inputValue : 0
            }]
        }];
        if(this.mode == CloudController.Const.NEW_MODE){
            config = Ext.Array.insert(config, 0, this.getIdNodeConfig());
        }
        return config;
    },

    destroy : function()
    {

        this.mixins.formTooltip.destroy.call(this);
        delete this.mainPanelRef;
        delete this.formPanelRef;
        this.el.destroy();
        this.callParent();
    }
});