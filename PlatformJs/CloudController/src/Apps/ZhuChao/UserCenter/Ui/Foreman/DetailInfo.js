/*
 * Cntysoft Cloud Software Team
 * 
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   Expression $license is undefined on line 6, column 17 in Templates/ClientSide/javascript.js.
 */
Ext.define('App.ZhuChao.UserCenter.Ui.Foreman.DetailInfo', {
    extend : 'Ext.form.Panel',
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider',
        formTooltip : 'Cntysoft.Mixin.FormTooltip'
    },
    statics: {
        EXPERIENCE_KEY : 'ZhuChao.UserCenter.Foreman.Experience',
        TEAM_KEY : 'ZhuChao.UserCenter.Foreman.Team'
    },
    /*
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     */
    runableLangKey : 'App.ZhuChao.UserCenter',
    constructor : function (config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.FOREMAN.DETAIL_INFO');
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
            autoScroll : true,
            autoRender : true
        });
    },
    initComponent : function ()
    {
        Ext.apply(this, {
            items : this.getItemsConfig(),
            defaults : {
                labelWidth : 120,
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
        var F = this.LANG_TEXT.FIELDS;
        var T = this.LANG_TEXT.TOOLTIP_TEXT;
        return [{
                xtype : 'fieldcontainer',
                layout : 'hbox',
                fieldLabel : F.PCD,
                defaults : {
                    margin : '0 10 0 0'
                },
                items : [{
                        xtype : 'combo',
                        name : 'province',
                        queryMode : 'local',
                        displayField : 'name',
                        valueField : 'code',
                        store : Ext.create('Ext.data.Store', {
                            fields : ['name', 'code']
                        }),
                        editable : false,
                        emptyText : F.EMPTY_TEXT,
                        listeners : {
                            afterrender : function (combo){
                                this.provinceRef = combo;
                                this.mainPanelRef.appRef.getProvinces(function (response){
                                    combo.getStore().loadData(response.data);
                                    if(this.responseData){
                                        combo.setValue(this.responseData['province']);
                                    }
                                }, this);
                            },
                            change : function (combo, newValue){
                                this.mainPanelRef.appRef.getArea(newValue, function (response){
                                    this.cityRef.getStore().loadData(response.data);
                                    if(this.responseData && newValue == this.responseData['province']){
                                        this.cityRef.setValue(this.responseData['city']);
                                    }
                                }, this);
                            },
                            scope : this
                        }
                    }, {
                        xtype : 'combo',
                        name : 'city',
                        queryMode : 'local',
                        displayField : 'name',
                        valueField : 'code',
                        store : Ext.create('Ext.data.Store', {
                            fields : ['name', 'code']
                        }),
                        editable : false,
                        emptyText : F.EMPTY_TEXT,
                        listeners : {
                            afterrender : function (combo){
                                this.cityRef = combo;
                            },
                            change : function (combo, newValue){
                                this.mainPanelRef.appRef.getArea(newValue, function (response){
                                    this.districtRef.getStore().loadData(response.data);
                                    if(this.responseData && newValue == this.responseData['city']){
                                        this.districtRef.setValue(this.responseData['district']);
                                    }
                                }, this);
                            },
                            scope : this
                        }
                    }, {
                        xtype : 'combo',
                        name : 'district',
                        queryMode : 'local',
                        displayField : 'name',
                        valueField : 'code',
                        store : Ext.create('Ext.data.Store', {
                            fields : ['name', 'code']
                        }),
                        editable : false,
                        emptyText : F.EMPTY_TEXT,
                        listeners : {
                            afterrender : function (combo){
                                this.districtRef = combo;
                            },
                            scope : this
                        }
                    }]
            }, {
                xtype : 'textfield',
                fieldLabel : F.ADDRESS,
                width : 700,
                name : 'address'
            }, {
                xtype : 'radiogroup',
                fieldLabel : F.SEX,
                width : 700,
                items : [{
                        boxLabel : F.MAN,
                        inputValue : 2,
                        name : 'sex'
                    }, {
                        boxLabel : F.WOMAN,
                        inputValue : 1,
                        name : 'sex'
                    }]
            }, {
                xtype : 'textfield',
                fieldLabel : F.QQ,
                name : 'qq',
                maxLength : 16
            }, {
                xtype : 'fieldcontainer',
                layout : 'hbox',
                fieldLabel : F.SERVICE,
                defaults : {
                    margin : '0 10 0 0'
                },
                items : [{
                        xtype : 'combo',
                        name : 'serviceProvince',
                        queryMode : 'local',
                        displayField : 'name',
                        valueField : 'code',
                        store : Ext.create('Ext.data.Store', {
                            fields : ['name', 'code']
                        }),
                        editable : false,
                        emptyText : F.EMPTY_TEXT,
                        listeners : {
                            afterrender : function (combo){
                                this.serviceProvinceRef = combo;
                                this.mainPanelRef.appRef.getProvinces(function (response){
                                    combo.getStore().loadData(response.data);
                                    if(this.responseData){
                                        combo.setValue(this.responseData['serviceProvince']);
                                    }
                                }, this);
                            },
                            change : function (combo, newValue){
                                this.mainPanelRef.appRef.getArea(newValue, function (response){
                                    this.serviceCityRef.getStore().loadData(response.data);
                                    if(this.responseData && newValue == this.responseData['serviceProvince']){
                                        this.serviceCityRef.setValue(this.responseData['serviceCity']);
                                    }
                                }, this);
                            },
                            scope : this
                        }
                    }, {
                        xtype : 'combo',
                        name : 'serviceCity',
                        queryMode : 'local',
                        displayField : 'name',
                        valueField : 'code',
                        store : Ext.create('Ext.data.Store', {
                            fields : ['name', 'code']
                        }),
                        editable : false,
                        emptyText : F.EMPTY_TEXT,
                        listeners : {
                            afterrender : function (combo){
                                this.serviceCityRef = combo;
                            },
                            change : function (combo, newValue){
                                this.mainPanelRef.appRef.getArea(newValue, function (response){
                                    this.serviceDistrictRef.getStore().loadData(response.data);
                                    if(this.responseData && newValue == this.responseData['serviceCity']){
                                        this.serviceDistrictRef.setValue(this.responseData['serviceDistrict']);
                                    }
                                }, this);
                            },
                            scope : this
                        }
                    }, {
                        xtype : 'combo',
                        name : 'serviceDistrict',
                        queryMode : 'local',
                        displayField : 'name',
                        valueField : 'code',
                        store : Ext.create('Ext.data.Store', {
                            fields : ['name', 'code']
                        }),
                        editable : false,
                        emptyText : F.EMPTY_TEXT,
                        listeners : {
                            afterrender : function (combo){
                                this.serviceDistrictRef = combo;
                            },
                            scope : this
                        }
                    }]
            }, {
                xtype : 'combo',
                name : 'experience',
                fieldLabel : F.EXPERIENCE,
                queryMode : 'local',
                displayField : 'name',
                valueField : 'value',
                store : Ext.create('Ext.data.Store', {
                    fields : ['name', 'value']
                }),
                editable : false,
                listeners : {
                    afterrender : function (combo){
                        this.experienceRef = combo;
                        this.mainPanelRef.appRef.getSysKvDict(this.self.EXPERIENCE_KEY, function (response){
                            combo.getStore().loadData(response.data);
                            if(this.responseData){
                                combo.setValue(this.responseData['experience']);
                            }
                        }, this);
                    },
                    scope : this
                }
            }, {
                xtype : 'combo',
                name : 'team',
                fieldLabel : F.TEAM,
                queryMode : 'local',
                displayField : 'name',
                valueField : 'value',
                store : Ext.create('Ext.data.Store', {
                    fields : ['name', 'value']
                }),
                editable : false,
                listeners : {
                    afterrender : function (combo){
                        this.teamRef = combo;
                        this.mainPanelRef.appRef.getSysKvDict(this.self.TEAM_KEY, function (response){
                            combo.getStore().loadData(response.data);
                            if(this.responseData){
                                combo.setValue(this.responseData['team']);
                            }
                        }, this);
                    },
                    scope : this
                }
            }, {
                xtype : 'textarea',
                name : 'intro',
                fieldLabel : F.INTRO,
                width : 700,
                height : 200
            }];
    },
    getInfoValues : function ()
    {
        var values = {};
        if(!this.rendered && this.responseData){
            var list = ['province', 'city', 'district', 'address', 'qq', 'sex', 'team', 'intro', 'serviceProvince', 'serviceCity', 'serviceDistrict', 'experience'];
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
            var filter = ['province', 'city', 'district', 'serviceProvice', 'serviceCity', 'serviceDistrict'];
            var valueClone = Ext.clone(values);
            Ext.Object.each(valueClone, function (key, val){
                if(Ext.Array.contains(filter, key)){
                    delete valueClone[key];
                }
            }, this);

            this.getForm().setValues(valueClone);
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
        delete this.provinceRef;
        delete this.cityRef;
        delete this.districtRef;
        delete this.serviceProvinceRef;
        delete this.serviceCityRef;
        delete this.serviceDistrictRef;
        delete this.experienceRef;
        delete this.teamRef;
        this.mixins.langTextProvider.destroy.call(this);
        this.callParent();
    }
});

