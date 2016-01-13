/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 角色添加修改面板
 */
Ext.define('App.Sys.User.Ui.RoleMgr.InfoEditor', {
    extend : 'Ext.form.Panel',
    alias : 'widget.appsysuseruirolemgrinfoeditor',
    requires : [
        'Cntysoft.Utils.HtmlTpl',
        'Cntysoft.Utils.Common',
        'Cntysoft.Kernel.Utils',
        'Cntysoft.Stdlib.Object'
    ],
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },

    /**
     * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Sys.User',

    /**
     * 目标加载角色ID
     *
     * @param {Integer} targetId
     */
    targetId : null,

    /**
     * @property {String} panelType 面板的类型
     */
    panelType : 'InfoEditor',
    /**
     * 当前编辑器的模式
     */
    mode : 1, /* 1为全新 2为修改模式 */

    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.ROLE_MGR.INFO_EDITOR');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },

    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            title : this.LANG_TEXT.TITLE,
            border : true,
            bodyPadding : 10
        });
    },

    initComponent : function()
    {
        var BTN = this.LANG_TEXT.BTN;
        var C = WebOs.Kernel.Const;
        Ext.apply(this, {
            items : this.getFormConfig(),
            buttons : [{
                xtype : 'button',
                text : BTN.SAVE,
                listeners : {
                    click : this.saveHandler,
                    scope : this
                }
            }, {
                type : 'button',
                text : BTN.BACK,
                listeners : {
                    click : function(){
                        this.mainPanelRef.renderPanel('ListView');
                    },
                    scope : this
                }
            }]
        });
        if(C.MODIFY_MODE == this.mode){
            if(null == this.targetId){
                Cntysoft.raiseError(
                    Ext.getClassName(this),
                    'initComponent',
                    'the editor in EM_EDIT mode must specify target property'
                );
            }
            this.addListener('afterrender', function(){
                this.loadRole(this.targetId, true);
            }, this, {
                single : true
            });
        }
        this.callParent();
    },

    saveHandler : function()
    {
        var form = this.getForm();
        var C = WebOs.Kernel.Const;
        if(form.isValid()){
            var values = form.getValues();
            var app = this.mainPanelRef.appRef;
            Cntysoft.Stdlib.Object.trimFields(values);
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
            if(C.NEW_MODE == this.mode){
                app.addRole(values, this.afterSaveHandler, this);
            }else if(C.MODIFY_MODE == this.mode){
                app.updateRole(this.targetId, values, this.afterSaveHandler, this);
            }
        }
    },

    afterSaveHandler : function(response){
        this.loadMask.hide();
        if(!response.status){
            Cntysoft.Kernel.Utils.processApiError(response, this.GET_LANG_TEXT('ERROR_MAP'));
        } else{
            this.mainPanelRef.renderPanel('ListView');
        }
    },

    loadRole : function(id, force)
    {
        if(force || this.targetId !== id){
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
            this.mainPanelRef.appRef.getRole(id, function(response){
                this.loadMask.hide();
                if(!response.status){
                    Cntysoft.Kernel.Utils.processApiError(response);
                } else{
                    this.getForm().setValues(response.data);
                }
            }, this);
        }
    },

    getFormConfig : function()
    {
        var L = this.LANG_TEXT;
        return [{
            xtype : 'textfield',
            fieldLabel : L.ROLE_NAME + Cntysoft.Utils.HtmlTpl.RED_STAR,
            name : 'name',
            width : 300,
            allowBlank : false,
            blankText : L.B_TEXT.ROLE_NAME
        }, {
            xtype : 'textarea',
            fieldLabel : L.DESCRIPTION,
            name : 'description',
            width : 500,
            height : 100
        }];
    },

    destroy : function()
    {
        delete this.mainPanelRef;
        if(this.loadMask){
            this.loadMask.destroy();
            delete this.loadMask;
        }
        this.callParent();
    }
});