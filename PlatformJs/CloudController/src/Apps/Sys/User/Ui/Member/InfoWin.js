/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.User.Ui.Member.InfoWin', {
    extend : 'Ext.window.Window',
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
     * @property {Object} LANG_TEXT 语言对象
     */
    record : null,
    infoFormRef : null,
    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.MEMBER.INFO_WIN');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },
    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            title : this.LANG_TEXT.TITLE,
            width : 600,
            height : 350,
            layout : 'fit',
            resizable : false,
            closeAction : 'hide',
            bodyBorder : false,
            bodyPadding : 10,
            modal : true
        });
    },
    initComponent : function()
    {
        Ext.apply(this, {
            listeners : {
                afterrender : function()
                {
                    this.loadRecord(this.record);
                },
                scope : this
            },
            items : this.getFormConfig(),
            buttons : [{
                xtype : 'button',
                text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
                listeners : {
                    click : function()
                    {
                        this.close();
                    },
                    scope : this
                }
            }]
        });
        this.callParent();
    },
    getFormConfig : function()
    {
        var T = this.LANG_TEXT;
        return {
            xtype : 'form',
            bodyBorder : false,
            border : false,
            autoScroll : true,
            defaults : {
                xtype : 'textfield',
                readOnly : true,
                labelWidth : 150
            },
            listeners : {
                afterrender : function(form)
                {
                    this.infoFormRef = form;
                },
                scope : this
            },
            items : [{
                fieldLabel : T.A_ID,
                width : 200,
                name : 'id'
            }, {
                fieldLabel : T.A_NAME,
                name : 'name'
            },{
                fieldLabel : T.ROLE,
                name : 'role',
                width : 400
            }, {
                fieldLabel : T.ENABLE_MULTI_LOGIN,
                width : 190,
                name : 'enableMultiLogin'
            }, {
                fieldLabel : T.LAST_LOGIN_IP,
                width : 300,
                name : 'lastLoginIp'
            }, {
                fieldLabel : T.LAST_LOGIN_TIME,
                name : 'lastLoginTime'
            }, {
                fieldLabel : T.LAST_MODIFY_PWD_TIME,
                name : 'lastModifyPwdTime'
            }, {
                fieldLabel : T.LOGIN_TIMES,
                width : 250,
                name : 'loginTimes'
            }, {
                fieldLabel : T.STATUS,
                width : 250,
                name : 'isLock'
            }]
        };
    },
    loadRecord : function(record)
    {
        var L = Cntysoft.GET_LANG_TEXT('UI');
        var data = record.getData();
        if(data.enableMultiLogin){
            data.enableMultiLogin = L.BTN.YES;
        } else{
            data.enableMultiLogin = L.BTN.NO;
        }
        if(data.isLock){
            data.isLock = L.LOCKED;
        } else{
            data.isLock = L.NORMAL;
        }
        this.infoFormRef.getForm().setValues(data);
    },
    destroy : function()
    {
        delete this.infoFormRef;
        delete this.record;
        this.callParent();
    }
});