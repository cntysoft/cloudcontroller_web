/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   Expression $license is undefined on line 6, column 17 in Templates/ClientSide/javascript.js.
 */
Ext.define('App.ZhuChao.UserCenter.Ui.Decorator.ServiceSetting', {
    extend : 'Ext.form.Panel',
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider',
        formTooltip : 'Cntysoft.Mixin.FormTooltip'
    },
    statics : {
        STYLE_KEY : 'ZhuChao.UserCenter.Designer.Style',
        UNDERTAKE_KEY : 'ZhuChao.UserCenter.Decorate.UnderTake',
        PUBLIC_KEY : 'ZhuChao.UserCenter.Decorator.PublicExpertise',
        HOME_KEY : 'ZhuChao.UserCenter.Designer.Type',
        MAX_VALUE_LEN : 5,
        CITY_CODE_ZHENGZHOU : '410100'
    },
    /*
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     */
    runableLangKey : 'App.ZhuChao.UserCenter',
    constructor : function (config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.DECORATOR.SERVICE_SETTING');
        this.mixins.formTooltip.constructor.call(this);
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },
    applyConstraintConfig : function (config)
    {
        Ext.apply(config, {
            border : false,
            bodyPadding : 10,
            title : this.LANG_TEXT.TITLE,
            autoScroll : true
        });
    },
    initComponent : function ()
    {
        Ext.apply(this, {
            items : this.getItemsConfig(),
            defaults : {
                labelWidth : 200,
                minWidth : 500,
                listeners : this.getFormItemListener()
            },
            listeners : {
                afterrender : function (){
                    if(this.responseData){
                        this.applyInfoValue(this.responseData);
                    }
                },
                scope : this
            }
        });
        this.callParent();
    },
    getFormItemListener : function ()
    {
        return {
            afterrender : function (comp)
            {
                this.mixins.formTooltip.setupTooltipTarget.call(this, comp);
            },
            scope : this
        };
    },
    getItemsConfig : function ()
    {
        var F = this.LANG_TEXT.FIELDS, T = this.LANG_TEXT.TOOLTIP_TEXT;
        var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        return [{
                xtype : 'checkboxgroup',
                fieldLabel : F.SERVICE_AREA,
                width : 800,
                columns : 4,
                listeners : {
                    afterrender : function (checkbox){
                        this.mainPanelRef.appRef.getArea(this.self.CITY_CODE_ZHENGZHOU, function (response){
                            var data = response.data;
                            var area = [];
                            if(this.responseData){
                                area = this.responseData['serviceArea'] ? this.responseData['serviceArea'] : [];
                            }
                            var items = [];
                            //添加组件
                            Ext.each(data, function (item){
                                var checked = Ext.Array.contains(area, item['code']+'') ? true : false;
                                items.push({
                                    boxLabel : item['name'], name : 'serviceArea', inputValue : item['code'], checked : checked
                                });
                            }, this);
                            checkbox.add(items);
                            //为每个checkbox添加事件,保证
                            checkbox.items.each(function (item){
                                item.addListener({
                                    change : function (box, value){
                                        if(value){
                                            var values = checkbox.getValue();
                                            //判断长度是否超过5个
                                            if(this.self.MAX_VALUE_LEN < values['serviceArea'].length){
                                                Cntysoft.showAlertWindow(this.GET_LANG_TEXT('UI.MSG.OVER_LENGTH'), function (){
                                                    box.setValue(false);
                                                }, this);
                                            }
                                        }
                                    },
                                    scope : this
                                });
                            }, this);
                        }, this);
                    },
                    scope : this
                }
            }, {
                xtype : 'checkboxgroup',
                fieldLabel : F.HOME_EX,
                width : 800,
                columns : 4,
                listeners : {
                    afterrender : function (checkbox){
                        this.mainPanelRef.appRef.getSysKvDict(this.self.HOME_KEY, function (response){
                            var data = response.data;
                            var style = [];
                            if(this.responseData){
                                style = this.responseData['homeExpertise'] ? this.responseData['homeExpertise'] : [];
                            }
                            var items = [];
                            //添加组件
                            Ext.each(data, function (item){
                                var checked = Ext.Array.contains(style, item['value']+'') ? true : false;
                                items.push({
                                    boxLabel : item['name'], name : 'homeExpertise', inputValue : item['value'], checked : checked
                                });
                            }, this);
                            checkbox.add(items);
                            //为每个checkbox添加事件,保证
                            checkbox.items.each(function (item){
                                item.addListener({
                                    change : function (box, value){
                                        if(value){
                                            var values = checkbox.getValue();
                                            //判断长度是否超过5个
                                            if(this.self.MAX_VALUE_LEN < values['homeExpertise'].length){
                                                Cntysoft.showAlertWindow(this.GET_LANG_TEXT('UI.MSG.OVER_LENGTH'), function (){
                                                    box.setValue(false);
                                                }, this);
                                            }
                                        }
                                    },
                                    scope : this
                                });
                            }, this);
                        }, this);
                    },
                    scope : this
                }
            }, {
                xtype : 'checkboxgroup',
                fieldLabel : F.PUBLIC_EX,
                width : 800,
                columns : 4,
                listeners : {
                    afterrender : function (checkbox){
                        this.mainPanelRef.appRef.getSysKvDict(this.self.PUBLIC_KEY, function (response){
                            var data = response.data;
                            var style = [];
                            if(this.responseData){
                                style = this.responseData['publicExpertise'] ? this.responseData['publicExpertise'] : [];
                            }
                            var items = [];
                            //添加组件
                            Ext.each(data, function (item){
                                var checked = Ext.Array.contains(style, item['value']+'') ? true : false;
                                items.push({
                                    boxLabel : item['name'], name : 'publicExpertise', inputValue : item['value'], checked : checked
                                });
                            }, this);
                            checkbox.add(items);
                            //为每个checkbox添加事件,保证
                            checkbox.items.each(function (item){
                                item.addListener({
                                    change : function (box, value){
                                        if(value){
                                            var values = checkbox.getValue();
                                            //判断长度是否超过5个
                                            if(this.self.MAX_VALUE_LEN < values['publicExpertise'].length){
                                                Cntysoft.showAlertWindow(this.GET_LANG_TEXT('UI.MSG.OVER_LENGTH'), function (){
                                                    box.setValue(false);
                                                }, this);
                                            }
                                        }
                                    },
                                    scope : this
                                });
                            }, this);
                        }, this);
                    },
                    scope : this
                }
            }, {
                xtype : 'checkboxgroup',
                fieldLabel : F.UNDER_TAKE,
                width : 800,
                columns : 4,
                listeners : {
                    afterrender : function (checkbox){
                        this.mainPanelRef.appRef.getSysKvDict(this.self.UNDERTAKE_KEY, function (response){
                            var data = response.data;
                            var style = [];
                            if(this.responseData){
                                style = this.responseData['undertakeBusiness'] ? this.responseData['undertakeBusiness'] : [];
                            }
                            var items = [];
                            //添加组件
                            Ext.each(data, function (item){
                                var checked = Ext.Array.contains(style, item['value']+'') ? true : false;
                                items.push({
                                    boxLabel : item['name'], name : 'undertakeBusiness', inputValue : item['value'], checked : checked
                                });
                            }, this);
                            checkbox.add(items);
                            //为每个checkbox添加事件,保证
                            checkbox.items.each(function (item){
                                item.addListener({
                                    change : function (box, value){
                                        if(value){
                                            var values = checkbox.getValue();
                                            //判断长度是否超过5个
                                            if(this.self.MAX_VALUE_LEN < values['undertakeBusiness'].length){
                                                Cntysoft.showAlertWindow(this.GET_LANG_TEXT('UI.MSG.OVER_LENGTH'), function (){
                                                    box.setValue(false);
                                                }, this);
                                            }
                                        }
                                    },
                                    scope : this
                                });
                            }, this);
                        }, this);
                    },
                    scope : this
                }
            }, {
                xtype : 'checkboxgroup',
                fieldLabel : F.STYLE_EX,
                width : 800,
                columns : 4,
                listeners : {
                    afterrender : function (checkbox){
                        this.mainPanelRef.appRef.getSysKvDict(this.self.STYLE_KEY, function (response){
                            var data = response.data;
                            var style = [];
                            if(this.responseData){
                                style = this.responseData['styleExpertise'] ? this.responseData['styleExpertise'] : [];
                            }
                            var items = [];
                            //添加组件
                            Ext.each(data, function (item){
                                var checked = Ext.Array.contains(style, item['value']+'') ? true : false;
                                items.push({
                                    boxLabel : item['name'], name : 'styleExpertise', inputValue : item['value'], checked : checked
                                });
                            }, this);
                            checkbox.add(items);
                            //为每个checkbox添加事件,保证
                            checkbox.items.each(function (item){
                                item.addListener({
                                    change : function (box, value){
                                        if(value){
                                            var values = checkbox.getValue();
                                            //判断长度是否超过5个
                                            if(this.self.MAX_VALUE_LEN < values['styleExpertise'].length){
                                                Cntysoft.showAlertWindow(this.GET_LANG_TEXT('UI.MSG.OVER_LENGTH'), function (){
                                                    box.setValue(false);
                                                }, this);
                                            }
                                        }
                                    },
                                    scope : this
                                });
                            }, this);
                        }, this);
                    },
                    scope : this
                }
            }, {
                xtype : 'numberfield',
                fieldLabel : F.G_SERVICE,
                name : 'gservice',
                maxValue : 10,
                minValue : 0,
                value : 10,
                allowBlank : false,
                decimalPrecision : 1,
                toolTipText : T.GRADE
            }, {
                xtype : 'numberfield',
                fieldLabel : F.G_DESIGN,
                name : 'gdesign',
                maxValue : 10,
                minValue : 0,
                allowBlank : false,
                value : 10,
                decimalPrecision : 1,
                toolTipText : T.GRADE
            }, {
                xtype : 'numberfield',
                fieldLabel : F.G_CONSTRUCTION,
                name : 'gconstruction',
                maxValue : 10,
                minValue : 0,
                allowBlank : false,
                value : 10,
                decimalPrecision : 1,
                toolTipText : T.GRADE
            }, {
                xtype : 'numberfield',
                fieldLabel : F.G_TIME,
                name : 'gtime',
                maxValue : 10,
                minValue : 0,
                allowBlank : false,
                value : 10,
                decimalPrecision : 1,
                toolTipText : T.GRADE
            }];
    },
    getInfoValues : function ()
    {
        var values = {};
        if(!this.rendered && this.responseData){
            var list = ['serviceArea', 'homeExpertise', 'publicExpertise', 'undertakeBusiness', 'styleExpertise', 'gservice', 'gconstruction', 'gdesign', 'gtime'];
            var len = list.length;
            for(var i = 0; i < len; i++) {
                var name = list[i];
                values[name] = this.responseData[name];
            }
        } else{
            values = this.getForm().getValues();
        }

        return values;
    },
    applyInfoValue : function (values)
    {
        if(!this.rendered){
            this.responseData = values;
        } else{
            this.getForm().setValues(values);
        }
    },
    isInfoValid : function ()
    {
        return this.getForm().isValid();
    },
    destroy : function ()
    {
        delete this.appRef;
        delete this.responseData;
        this.mixins.langTextProvider.destroy.call(this);
        this.callParent();
    }
});

