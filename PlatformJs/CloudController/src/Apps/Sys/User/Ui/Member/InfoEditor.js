/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.User.Ui.Member.InfoEditor', {
    extend : 'Ext.form.Panel',
    alias : 'widget.appsysuseruimemberinfoeditor',
    requires : [
        'App.Sys.User.Comp.RoleGridField',
        'Cntysoft.Utils.Common'
    ],
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider',
        formTooltip : 'Cntysoft.Mixin.FormTooltip'
    },
    /**
     * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Sys.User',
    /**
     * @property {String} panelType 面板的类型
     */
    panelType : 'InfoEditor',
    /**
     * 编辑器的模式
     *
     * @property {Integer} mode
     */
    mode : 1,
    /**
     * 当为修改模式的时候，默认加载的管理员ID
     *
     * @property {Integer} targetId
     */
    targetId : null,

    /**
     * 当前加载的用户数据
     *
     * @private
     * @property {Object} currentLoadedUser
     */
    currentLoadedUser : null,
    //private
    roleGridFieldContainerRef : null,
    //private
    roleGridFieldRef : null,
    //private
    pwdDegreeLabelRef : null,
    constructor : function(config)
    {
        config = config || {};
        this.mixins.formTooltip.constructor.call(this);
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.MEMBER.INFO_EDITOR');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },
    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            title : this.LANG_TEXT.TITLE,
            border : true,
            bodyBorder : false,
            bodyPadding : 10,
            autoScroll : true,
            layout : {
                type : 'anchor',
                manageOverflow : 2,
                reserveScrollbar : true
            }
        });
    },

    initComponent : function()
    {
        var BT = Cntysoft.GET_LANG_TEXT('UI.BTN');
        Ext.apply(this, {
            items : this.getFormConfig(),
            buttons : [{
                text : BT.SAVE,
                listeners : {
                    click : this.saveHandler,
                    scope : this
                }
            }, {
                text : BT.CANCEL,
                listeners : {
                    click : function(){
                        this.mainPanelRef.renderPanel('ListView', {});
                    },
                    scope : this
                }
            }]
        });
        //检查编辑器模式
        var C = WebOs.Kernel.Const;
        if(C.MODIFY_MODE == this.mode){
            if(null == this.targetId){
                Cntysoft.raiseError(
                    Ext.getClassName(this),
                    'initComponent',
                    'Edit mode must specify targetId property'
                );
            }
            this.addListener('afterrender', function(){
                this.gotoModifyMode(true);
                this.loadUser(this.targetId);
            }, this);
        } else if(C.NEW_MODE == this.mode){
            this.addListener('afterrender', function(){
                this.applyDefaultValues();
            }, this);
        }
        this.callParent();
    },

    loadUser : function(id)
    {
        this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
        this.gotoModifyMode();
        this.mainPanelRef.appRef.getSysUserById(id, this.afterLoadUserHandler, this);
    },

    afterLoadUserHandler : function(response)
    {
        this.loadMask.hide();
        if(response.status){
            var data = response.data;
            this.currentLoadedUser = data;
            var basicValues = Cntysoft.Stdlib.Object.copyFields(data, [
                'name', 'frontName', 'isLock', 'isSuperUser', 'enableModifyPwd', 'enableMultiLogin'
            ]);
            this.getForm().setValues(basicValues);
            if(!data.isSuperUser){
                //设置角色数据
                this.roleGridFieldRef.loadRoles(data.roles);
            }
        } else{
            Cntysoft.Kernel.Utils.processApiError(response);
        }
    },

    gotoModifyMode : function(isForce)
    {
        if(isForce || WebOs.Kernel.Const.NEW_MODE == this.mode){
            this.down('textfield[name="name"]').setDisabled(true);
            this.remove(this.down('textfield[name="verifyPwd"]'), true);
            this.pwdDegreeLabelRef.update('<span style ="color:blue">' + this.LANG_TEXT.CHANGE_PWD_TEXT + '</span>');
            this.mode = WebOs.Kernel.Const.MODIFY_MODE;
        }
    },

    saveHandler : function()
    {
        var form = this.getForm();
        if(form.isValid()){
            var C = WebOs.Kernel.Const;
            var values = this.getValues();
            this.mainPanelRef.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
            if(C.NEW_MODE == this.mode){
                this.mainPanelRef.appRef.addSysUser(values, function(response){
                    this.mainPanelRef.loadMask.hide();
                    if(response.status){
                        Cntysoft.showInfoMsgWindow(Cntysoft.GET_LANG_TEXT('MSG.SAVE_OK'), function(){
                            this.mainPanelRef.renderPanel('ListView');
                        }, this);
                    } else{
                        Cntysoft.Kernel.Utils.processApiError(response);
                    }
                }, this);
            } else if(C.MODIFY_MODE == this.mode){
                this.mainPanelRef.appRef.updateSysUser(this.currentLoadedUser.id, values, function(response){
                    this.mainPanelRef.loadMask.hide();
                    if(response.status){
                        Cntysoft.showInfoMsgWindow(Cntysoft.GET_LANG_TEXT('MSG.SAVE_OK'), function(){
                            this.mainPanelRef.renderPanel('ListView');
                        }, this);
                    } else{
                        Cntysoft.Kernel.Utils.processApiError(response);
                    }
                }, this);
            }
        }
    },

    getValues : function()
    {
        var values = this.getForm().getValues();
        delete values.verifyPwd;
        var ret = {};
        var C = WebOs.Kernel.Const;
        var mode = this.mode;
        if(mode == C.MODIFY_MODE){
            var orgValues = this.currentLoadedUser;
        }
        Ext.apply(values, {
            roles : values.isSuperUser ? [] : this.roleGridFieldRef.getValues()
        });

        var value;
        Ext.applyIf(values, {
            isLock : 0,
            isSuperUser : 0,
            enableModifyPwd : 0,
            enableMultiLogin : 0
        });
        for(var key in values) {
            value = Ext.isString(values[key]) ? Ext.String.trim(values[key]) : values[key];
            if(C.MODIFY_MODE /*修改模式*/ == mode){
                //@TODO
                if('isSuperUser' == key || value !== orgValues[key]){
                    ret[key] = value;
                }
            } else if(C.NEW_MODE == mode){
                ret[key] = value;
            }

        }
        if(C.MODIFY_MODE == mode){
            var pwd = values.password;
            if('' !== pwd && pwd !== orgValues.password){
                ret.password = Cntysoft.Utils.Common.hashPwd(pwd);
            } else{
                delete ret.password;
            }
        } else if(C.NEW_MODE == mode){
            ret.password = Cntysoft.Utils.Common.hashPwd(values.password);
            //应用默认值
            Ext.applyIf(ret, this.getDefaultValues());
        }
        return ret;
    },

    /**
     * 设置表单的默认值
     */
    applyDefaultValues : function()
    {
        this.getForm().setValues(this.getDefaultValues());
    },

    getDefaultValues : function()
    {
        return {
            enableModifyPwd : 1,
            isSuperUser : 0,
            enableMultiLogin : 0,
            isLock : 0,
            roles : [],
            loginTimes : 0,
            loginErrorTimes : 0
        };
    },

    getFormConfig : function()
    {
        var L = this.LANG_TEXT;
        var B_TEXT = L.B_TEXT;
        var T_TEXT = L.T_TEXT;
        var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        return [{
            xtype : 'textfield',
            fieldLabel : L.ADMIN + R_STAR,
            width : 400,
            name : 'name',
            validator : Ext.bind(this.nameValidator, this),
            validateOnChange : false
        },  {
            xtype : 'fieldcontainer',
            layout : 'hbox',
            fieldLabel : L.PWD + R_STAR,
            width : 600,
            items : [{
                xtype : 'textfield',
                inputType : 'password',
                width : 295,
                validator : Ext.bind(this.pwdValidator, this),
                validateOnChange : false,
                name : 'password'
            }, {
                xtype : 'label',
                html : '',
                width : 200,
                margin : '3 0 0 5',
                listeners : {
                    afterrender : function(label){
                        this.pwdDegreeLabelRef = label;
                    },
                    scope : this
                }
            }]
        }, this.getVerifyPwdConfig(),{
            xtype : 'radiogroup',
            fieldLabel : L.ROLE,
            columns : 1,
            vertical : true,
            defaults : {
                listeners : {
                    afterrender : function(radio){
                        this.setupTooltipTarget(radio);
                    },
                    scope : this
                }
            },
            listeners : {
                change : function(rg, newValue, oldValue){
                    if(newValue.isSuperUser){
                        //超级管理员
                        this.roleGridFieldContainerRef.hide();
                    } else{
                        //普通管理员
                        this.roleGridFieldContainerRef.show();
                    }
                },
                scope : this
            },
            items : [
                {boxLabel : L.SUPER_ADMIN, name : 'isSuperUser', inputValue : 1, toolTipText : T_TEXT.SUPER_ADMIN},
                {boxLabel : L.NORMAL_ADMIN, name : 'isSuperUser', inputValue : 0, checked : true, toolTipText : T_TEXT.NORMAL_ADMIN}
            ]
        }, {
            xtype : 'fieldcontainer',
            fieldLabel : L.ROLE_LIST,
            items : {
                xtype : 'appsysusercomprolegridfield',
                listeners : {
                    afterrender : function(view){
                        this.roleGridFieldRef = view;
                    },
                    scope : this
                }
            },
            listeners : {
                afterrender : function(c){
                    this.roleGridFieldContainerRef = c;
                },
                scope : this
            }
        }, {
            xtype : 'fieldcontainer',
            layout : 'vbox',
            fieldLabel : L.STATUS,
            defaults : {
                xtype : 'checkbox'
            },
            items : [
                {boxLabel : L.MULTI_LOGIN, name : 'enableMultiLogin', inputValue : 1},
                {boxLabel : L.ALLOW_MODIFY_PWD, name : 'enableModifyPwd', inputValue : 1},
                {boxLabel : L.LOCKED, name : 'isLock', inputValue : 1}
            ]
        }];
    },

    getVerifyPwdConfig : function()
    {
        var L = this.LANG_TEXT;
        var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        return {
            xtype : 'textfield',
            inputType : 'password',
            fieldLabel : L.R_PWD + R_STAR,
            width : 400,
            validator : Ext.bind(this.reChkPwdValidator, this),
            validateOnChange : false,
            name : 'verifyPwd'
        };
    },

    reChkPwdValidator : function(value)
    {
        var pwd = this.down('textfield[name="password"]').getValue();
        if(pwd != value){
            return this.LANG_TEXT.ERROR.PWD_NOT_EQUAL;
        } else{
            return true;
        }
    },

    nameValidator : function(value)
    {
        if(WebOs.Kernel.Const.MODIFY_MODE == this.mode){
            return true;
        }
        if('' == Ext.String.trim(value)){
            return this.LANG_TEXT.B_TEXT.NAME;
        } else{
            this.checkUserExist(value);
            return true;
        }
    },

    //异步查询管理员是否存在
    checkUserExist : function(value)
    {
        this.mainPanelRef.appRef.sysUserExist(value, function(response){
            if(response.status){
                if(response.data.exist){
                    this.down('textfield[name="name"]').markInvalid(Ext.String.format(this.LANG_TEXT.ERROR.NAME_EXIST, value));
                }
            } else{
                Cntysoft.Kernel.Utils.processApiError(response);
            }
        }, this);
    },

    pwdValidator : function(value)
    {
        if(WebOs.Kernel.Const.MODIFY_MODE/**修改模式*/ == this.mode){
            if(value == ''){
                return true;
            }
        }
        if('' == value){
            return this.LANG_TEXT.B_TEXT.PWD;
        } else if(value.length < 6){
            return Cntysoft.GET_LANG_TEXT('MSG.PWD_TOO_SHORT');
        } else{
            //测试强度
            var account = this.down('textfield[name="name"]').getValue();
            var level = Cntysoft.Utils.Common.markPwdDegree(account, value);
            var MSG = Cntysoft.GET_LANG_TEXT('MSG');
            if(level < 30){
                this.pwdDegreeLabelRef.update('<span style = "color:red">' + MSG.PWD_LEVEL_1 + '</span>');
            } else if(level >= 30 && level < 70){
                this.pwdDegreeLabelRef.update('<span style = "color:#FBA800">' + MSG.PWD_LEVEL_2 + '</span>');
            } else{
                this.pwdDegreeLabelRef.update('<span style = "color:blue">' + MSG.PWD_LEVEL_3 + '</span>');
            }
            return true;
        }
    },

    destroy : function()
    {
        delete this.mainPanelRef;
        delete this.roleGridFieldContainerRef;
        delete this.roleGridFieldRef;
        delete this.pwdDegreeLabelRef;
        this.mixins.formTooltip.destroy.call(this);
        this.callParent();
    }
});