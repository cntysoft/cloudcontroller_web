/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.Goods.Ui.GoodsInfo', {
    extend : 'Ext.panel.Panel',
    requires : [
        'WebOs.Kernel.StdPath',
        'App.ZhuChao.Goods.Comp.MerchantSelectWin',
        'App.ZhuChao.Goods.Comp.CategoryCombo',
        'WebOs.Component.Uploader.Window',
        'Cntysoft.Component.ImagePreview.View',
        'App.ZhuChao.Goods.Comp.GoodsDetailImageView',
        'App.ZhuChao.Goods.Comp.NormalAttrGroupWin',
        'App.ZhuChao.Goods.Comp.NormalAttrWindow'
    ],
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    /**
     * @inheritdoc
     */
    panelType : 'Info',
    /**
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.ZhuChao.Goods',
    basicFormRef : null,
    normalAttrsPanelRef : null,
    stdAttrsFormRef : null,
    stdAttrsValueFormRef : null,
    detailFormRef : null,
    merchantSelecrWinRef : null,
    merchantFieldRef : null,
    trademarkFieldRef : null,
    categoryFieldRef : null,
    stdAttrsData : null,
    fileRefs : null,
    imagePreviewRef : null,
    stdAttrImageContextMenuRef : null,
    detailImageContextMenuRef : null,
    goodsDetailViewRef : null,
    normalAttrGroupMap : {},
    normalAttrPosMap : [],
    normalAttrGroupWinRef : null,
    normalAttrWinRef : null,
    statusFieldRef : null,
    mode : 1,
    uploadWinRef : null,
    constructor : function (config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.GOODS_INFO');
        this.applyConstraintConfig(config);
        if(config.mode == CloudController.Const.MODIFY_MODE){
            if(!Ext.isDefined(config.targetLoadId) || !Ext.isNumber(config.targetLoadId)){
                Ext.Error.raise({
                    cls : Ext.getClassName(this),
                    method : 'constructor',
                    msg : 'mode is modify, so you must set goods id'
                });
            }
        }
        this.imagePreviewRef = new Cntysoft.Component.ImagePreview.View({
            trackMouse : false
        });
        this.callParent([config]);
    },
    applyConstraintConfig : function (config)
    {
        Ext.apply(config, {
               title : this.LANG_TEXT.TITLE,
            autoScroll : true,
            layout : {
                type : 'vbox',
                align : 'stretch'
            }
        });
    },
    initComponent : function ()
    {
        Ext.apply(this, {
            buttons : [{
                    text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
                    listeners : {
                        click : this.saveHandler,
                        scope : this
                    }
                }, {
                    text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
                    listeners : {
                        click : function (){
                            this.close();
                        },
                        scope : this
                    }
                }],
            items : [
                this.getBasicInfoConfig(),
                this.getNormalAttrFormConfig(),
                this.getStdAttrFormConfig(),
                this.getStdAttrsValuesConfig(),
                this.getDetailFormConfig()
            ]
        });
        this.addListener('afterrender', this.afterRenderHandler, this);
        this.callParent();
    },
    gotoModifyMode : function (force)
    {
        if(force || this.mode != CloudController.Const.MODIFY_MODE){
            this.merchantFieldRef.disable();
            this.merchantFieldRef.nextSibling().disable();
            this.trademarkFieldRef.disable();
            this.categoryFieldRef.disable();
            this.mode = CloudController.Const.MODIFY_MODE;
        }
    },
    afterRenderHandler : function ()
    {
        this.fileRefs = [];
        if(this.mode == CloudController.Const.MODIFY_MODE){
            this.gotoModifyMode(true);
            this.loadGoodsInfo(this.targetLoadId);
        }
    },
    loadGoodsInfo : function (gid)
    {
        if(this.$_current_gid_$ !== gid){
            this.gotoModifyMode();
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
            this.appRef.getGoodsInfo(gid, this.afterLoadGoodsInfoHandler, this);
            this.$_current_gid_$ = gid;
        }
    },
    afterLoadGoodsInfoHandler : function (response)
    {
        this.loadMask.hide();
        if(!response.status){
            Cntysoft.Kernel.Utils.processApiError(response);
        } else{
            var data = response.data;
            this.basicFormRef.getForm().setValues({
                title : data.title
            });
            //设置店铺
            this.saveRequestHandler({
                id : data.merchantId,
                name : data.merchant
            });
            this.trademarkFieldRef.setValue(data.trademarkId);
            this.categoryFieldRef.setValue(data.categoryId);
            this.categoryFieldRef.setRawValue(data.category);
            this.statusFieldRef.setValue({
                status : data.status
            });
            //设置普通属性
            if(Ext.isDefined(data.normalAttrs)){
                this.mainPanelRef.appRef.getCategoryAttrs(data.categoryId, function (response){
                    this.loadMask.hide();
                    if(!response.status){
                        Cntysoft.Kernel.Utils.processApiError(response);
                    } else{
                        var attrs = response.data;
                        this.setupNormalAttrsForm(attrs.normalAttrs);
                        //设置值
                        var attrs = data.normalAttrs;
                        var values = {};
                        var customGroups = [];
                        var normalGroupNames = [];
                        this.normalAttrsPanelRef.items.each(function (form){
                            form.getForm().setValues(attrs[form.getTitle()]);
                            normalGroupNames.push(form.getTitle());
                        }, this);
                        Ext.Object.each(attrs, function (gname, attrs){
                            if(!Ext.Array.contains(normalGroupNames, gname)){
                                var items = [];
                                for(var key in attrs) {
                                    items.push({
                                        xtype : 'textfield',
                                        fieldLabel : key,
                                        name : key,
                                        width : 500,
                                        value : attrs[key]
                                    });
                                }
                                if(items.length > 0){
                                    this.normalAttrsPanelRef.add({
                                        xtype : 'form',
                                        title : gname,
                                        bodyPadding : 10,
                                        items : items
                                    });
                                }
                            }
                        }, this);
                    }
                }, this);
            }

            //设置标准属性
            if(Ext.isDefined(data.stdAttrs)){
                Ext.Array.forEach(data.stdAttrs, function (item, index){
                    var form = this.stdAttrsValueFormRef.add(this.generateStdAttrItemFormConfig(index, item.combination, item.combinationKey, data.stdAttrMap));
                    form.down('numberfield[name=normalPrice]').setValue(item.normalPrice);
                    form.down('numberfield[name=price]').setValue(item.price);
                    var imgGridStore = form.down('grid').store;
                    Ext.Array.forEach(item.images, function (image){
                        imgGridStore.add({
                            url : FH.getZhuChaoImageUrl(image[0]),
                            fileRefId : image[1]
                        });
                    }, this);
                }, this);

            }
            //设置详细信息
            if(Ext.isDefined(data.detailInfoImages)){
                Ext.Array.forEach(data.detailInfoImages, function (item){
                    this.goodsDetailViewRef.store.add({
                        url : FH.getZhuChaoImageUrl(item[0]),
                        fileRefId : item[1]
                    });
                }, this);
            }
            this.fileRefs = data.fileRefs;
        }
    },
    saveHandler : function ()
    {
        var values = {};
        var groupedAttrsValues = {};
        //普通属性
        if(!this.normalAttrsPanelRef.isHidden()){
            var groupForms = this.normalAttrsPanelRef.items;
            for(var i = 0; i < groupForms.getCount(); i++) {
                var formPanel = groupForms.getAt(i);
                var form = formPanel.getForm();
                if(!form.isValid()){
                    return;
                }
                var group = formPanel.getTitle();
                groupedAttrsValues[group] = form.getValues();
            }
            Ext.apply(values, {
                normalAttrs : groupedAttrsValues
            });
        }
        //规格属性
        //获取规格映射数据
        if(!this.stdAttrsFormRef.isHidden()){
            var stdAttrsFormValues = this.stdAttrsFormRef.getForm().getValues();
            var stdAttrsMap = {};
            Ext.Object.each(stdAttrsFormValues, function (key, values){
                var cur = {};
                if(!Ext.isArray(values)){
                    values = [values];
                }
                Ext.Array.forEach(values, function (item, index){
                    cur[item] = ++index;
                }, this);
                stdAttrsMap[key] = cur;
            }, this);
            Ext.apply(values, {
                stdAttrsMap : stdAttrsMap
            });
        }

        var stdAttrs = [];
        var stdAttrForms = this.stdAttrsValueFormRef.items;
        var len = stdAttrForms.getCount();
        var ossServer = FH.getImgOssServer() + '/';
        for(var i = 0; i < len; i++) {
            var attrValue = {};
            var form = stdAttrForms.getAt(i);
            var bform = form.getForm();
            if(!bform.isValid()){
                return;
            }
            Ext.apply(attrValue, bform.getValues());
            var stdAttrImages = [];
            form.down('grid').store.each(function (record){
                var url = record.get('url');
                if(Ext.String.startsWith(url, ossServer)){
                    url = url.replace(ossServer, '');
                }
                stdAttrImages.push([
                    url,
                    record.get('fileRefId')
                ]);
            }, this);
            Ext.apply(attrValue, {
                images : stdAttrImages,
                combination : form.combination,
                internalId : form.internalId,
                combinationKey : form.combinationKey
            });
            stdAttrs.push(attrValue);
        }
        Ext.apply(values, {
            stdAttrs : stdAttrs
        });
        //文件引用
        Ext.apply(values, {
            fileRefs : this.fileRefs
        });
        //详情介绍
        var detailImages = [];
        this.goodsDetailViewRef.store.each(function (record){
            var url = record.get('url');
            if(Ext.String.startsWith(url, ossServer)){
                url = url.replace(ossServer, '');
            }
            detailImages.push([
                url,
                record.get('fileRefId')
            ]);
        }, this);
        Ext.apply(values, {
            detailInfoImages : detailImages
        });

        if(CloudController.Const.NEW_MODE == this.mode){
            //基本面板
            var form = this.basicFormRef.getForm();
            if(!form.isValid()){
                return;
            }
            Ext.apply(values, form.getValues());
            values.merchantId = this.merchantFieldRef.selectedMerchantId;
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
            this.mainPanelRef.appRef.addGoodsInfo(values, this.afterSaveGoodsInfoHandler, this);
        } else if(CloudController.Const.MODIFY_MODE == this.mode){
            //修改模式
            //基本面板
            var form = this.basicFormRef.getForm();
            if(!form.isValid()){
                return;
            }
            Ext.apply(values, {
                gid : this.$_current_gid_$,
                title : form.getValues().title,
                status : form.getValues().status
            });
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
            this.mainPanelRef.appRef.updateGoodsInfo(values, this.afterSaveGoodsInfoHandler, this);
        }
    },
    afterSaveGoodsInfoHandler : function (response)
    {
        this.loadMask.hide()
        if(!response.status){
            Cntysoft.Kernel.Utils.processApiError(response);
        } else{
            this.mainPanelRef.gotoPrev();
            var panel = this.mainPanelRef.getCurrentActivePanel();
            if(panel.panelType == 'ListView'){
                panel.reload();
            }
            this.close();
        }
    },
    setupStdAttrsForm : function (attrs)
    {
        this.stdAttrsFormRef.removeAll();
        this.stdAttrsData = attrs;
        var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        var len = attrs.length;
        if(0 == len){
            this.stdAttrsFormRef.hide();
            return;
        }
        var attr;
        var items = [];
        for(var i = 0; i < len; i++) {
            attr = attrs[i];
            var allowBlank = !attr.required;
            var fieldLabel = attr.name;
            if(attr.required){
                fieldLabel += R_STAR;
            }
            if(Ext.isEmpty(attr.optValue)){
                continue;
            }
            var sels = attr.optValue.split(',');
            var data = [];
            var checkItems = [];
            if(attr.name == '颜色'){
                Ext.Array.forEach(sels, function (item){
                    var parts = item.split('|');
                    var display = '';
                    if(parts[1] == '0'){
                        display = '<span style="vertical-align:top;height : 17px;margin-top:-5px">' + parts[0] + '</span>';
                    } else{
                        display = '<span style ="margin-right:2px;display: inline-block;width : 17px; height : 17px;vertical-align:top;border:1px solid #EDEDED;background: ' + parts[1] + ';"></span>' + '<span style="vertical-align:top;height : 17px;margin-top:-5px">' + parts[0] + '</span>';
                    }
                    checkItems.push({
                        boxLabel : display,
                        inputValue : parts[0],
                        name : attr.name
                    });
                });
            } else{
                Ext.Array.forEach(sels, function (item){
                    checkItems.push({
                        boxLabel : item,
                        name : attr.name,
                        inputValue : item
                    });
                });
            }
            items.push({
                xtype : 'checkboxgroup',
                fieldLabel : fieldLabel,
                columns : 4,
                vertical : true,
                items : checkItems,
                listeners : {
                    change : this.stdAttrsCheckboxHandler,
                    scope : this
                }
            });
        }
        this.stdAttrsFormRef.add(items);
        this.stdAttrsFormRef.show();
    },
    setupNormalAttrsForm : function (attrs)
    {
        this.normalAttrsPanelRef.removeAll();
        var len = attrs.length;
        if(0 == len){
            this.normalAttrsPanelRef.hide();
            return;
        }
        var groupValues = {};
        Ext.Array.forEach(attrs, function (item){
            var groupName = item.group;
            if(!groupValues[groupName]){
                groupValues[groupName] = [item];
            } else{
                groupValues[groupName].push(item);
            }
        }, this);
        Ext.Object.each(groupValues, function (key, value){
            this.addNormalAttrGroup(key, value);
        }, this);

        this.normalAttrsPanelRef.show();
    },
    addNormalAttrGroup : function (groupName, attrs)
    {
        var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        var attr;
        var form = {
            title : groupName,
            xtype : 'form',
            bodyPadding : 10,
            margin : '5 0 0 0'
        };
        var items = [];
        Ext.Array.forEach(attrs, function (attr){
            this.normalAttrGroupMap[attr.name] = attr.group;
            var allowBlank = !attr.required;
            var fieldLabel = attr.name;
            if(attr.required){
                fieldLabel += R_STAR;
            }
            if(Ext.isEmpty(attr.optValue)){
                //普通的属性
                items.push({
                    xtype : 'textfield',
                    name : attr.name,
                    fieldLabel : fieldLabel,
                    allowBlank : allowBlank,
                    width : 800
                });
            } else{
                var sels = attr.optValue.split(',');
                var data = [];
                Ext.Array.forEach(sels, function (item){
                    data.push({
                        text : item,
                        value : item
                    });
                });
                items.push({
                    xtype : 'combobox',
                    name : attr.name,
                    width : 500,
                    emptyText : this.LANG_TEXT.MSG.EMPTY_ATTR,
                    store : new Ext.data.Store({
                        fields : [
                            {name : 'text', type : 'string', persist : false},
                            {name : 'value', type : 'string', persist : false}
                        ],
                        data : data
                    }),
                    allowBlank : allowBlank,
                    editable : false,
                    fieldLabel : fieldLabel,
                    queryMode : 'local',
                    displayField : 'text',
                    valueField : 'value'
                });
            }
        }, this);
        form.items = items;
        this.normalAttrsPanelRef.add(form);
    },
    stdAttrsCheckboxHandler : function (checkbox, newValue, oldValue)
    {
        if(this.stdAttrsValueFormRef.items.getCount() > 0){
            Cntysoft.showQuestionWindow(this.LANG_TEXT.MSG.CHANGE_ATTR_ASK, function (btn){
                if('yes' == btn){
                    this.generateStdAttrForms();
                } else{
                    checkbox.suspendEvents();
                    checkbox.setValue(oldValue);
                    checkbox.resumeEvents();
                }
            }, this);
        } else{
            this.generateStdAttrForms();
        }
    },
    stdAttrItemCloseHandler : function (form, panel)
    {
        var attrsValues = [], stdAttrsList = [], attrsNames = [];
        var attrsCount = this.stdAttrsFormRef.items.getCount();
        for(var i = 0; i < attrsCount; i++) {
            var current = this.stdAttrsFormRef.items.getAt(i);
            var val = current.getValue();
            if(!Ext.Object.isEmpty(val)){
               attrsValues.push([]);
               stdAttrsList.push(current);
               attrsNames.push(this.stdAttrsData[i].name);
            }
        }
        attrsCount = stdAttrsList.length;
        
        this.stdAttrsValueFormRef.items.each(function (panel){
            var combination = panel.combination, len = combination.length;
            for(var i = 0; i < len; i++) {
                attrsValues[i].push(combination[i]);
                attrsValues[i] = Ext.Array.unique(attrsValues[i]);
            }
        }, this);

        var stdAttrsMap = [];
        for(var i = 0; i < attrsCount; i++) {
            attrsValues[i] = Ext.Array.unique(attrsValues[i]);
            var current = stdAttrsList[i];
            current.suspendEvents();
            var values = {};
            values[attrsNames[i]] = attrsValues[i];
            current.setValue(values);
            current.resumeEvents();
            var val = current.getValue();
            if(!Ext.isArray(val[attrsNames[i]])){
                stdAttrsMap[i] = [val[attrsNames[i]]];
            } else{
                stdAttrsMap[i] = val[attrsNames[i]];
            }
        }

        this.stdAttrsValueFormRef.items.each(function (panel){
            var combination = panel.combination, key = [], len = combination.length, internalId = 0, mapLen = stdAttrsMap.length;
            for(var i = 0; i < len; i++) {
                key[i] = parseInt(stdAttrsMap[i].indexOf(combination[i])) + 1;
                var mapValue = 1;
                for(var j = i + 1; j < mapLen; j++) {
                    mapValue *= stdAttrsMap[j].length;
                }
                if(len === i + 1){
                    internalId += key[i];
                } else{
                    internalId += (key[i] - 1) * mapValue;
                }
            }
            panel.combinationKey = key;
            panel.internalId = internalId;
        }, this);
    },
    generateStdAttrForms : function ()
    {
        this.stdAttrsValueFormRef.suspendEvents();
        this.stdAttrsValueFormRef.removeAll();
        this.stdAttrsValueFormRef.resumeEvents();
        var values = this.stdAttrsFormRef.getForm().getValues();
        var normals = [];
        var items = [];
        this.normalAttrPosMap = [];
        for(var type in values) {
            if(!Ext.isArray(values[type])){
                items = [values[type]];
            } else{
                items = values[type];
            }
            var attrs = {};
            Ext.Array.forEach(items, function (item, index){
                attrs[item] = ++index;
            });
            this.normalAttrPosMap.push(attrs);
            normals.push(items);
        }
        var items = this.generateCombination.apply(this, normals);
        Ext.Array.forEach(items, function (item, index){
            if(!Ext.isArray(item)){
                item = [item];
            }
            this.stdAttrsValueFormRef.add(this.generateStdAttrItemFormConfig(index, item));
        }, this);

    },
    uploadSuccessHandler : function (file, uploadbtn)
    {
        var targetGrid = uploadbtn.ownerCt.previousSibling();
        var file = file.pop();
        this.fileRefs.push(parseInt(file.rid));
        targetGrid.store.add({
            url : FH.getZhuChaoImageUrl(file.filename),
            fileRefId : file.rid
        });
    },
    generateStdAttrItemFormConfig : function (index, combination, key, stdAttrsMap)
    {
        var F = this.LANG_TEXT.FIELDS.VALUE_FORM;
        var id = 'stdattr_' + Date.now();
        var internalId = ++index;
        if(!key){
            var key = [];
            Ext.Array.forEach(combination, function (attrName, index){
                key.push(this.normalAttrPosMap[index][attrName]);
            }, this);
        } else{
            if(stdAttrsMap){
                internalId = 0;
                var len = combination.length, mapLen = Ext.Object.getSize(stdAttrsMap), keys = key.split(',');
                for(var i = 0; i < len; i++) {
                    var mapValue = 1;
                    for(var j = i + 1; j < mapLen; j++) {
                        mapValue *= Ext.Object.getSize(stdAttrsMap[j]);
                    }
                    if(len == i + 1){
                        internalId = internalId + parseInt(keys[i]);
                    } else{
                        internalId = internalId + (parseInt(keys[i]) - 1) * mapValue;
                    }
                }
            }
        }

        return {
            xtype : 'form',
            title : combination.join('/'),
            closable : this.mode == CloudController.Const.NEW_MODE ? true : false,
            bodyPadding : 10,
            combination : combination,
            combinationKey : key,
            id : id,
            internalId : internalId,
            items : [{
                    xtype : 'numberfield',
                    fieldLabel : F.NORMAL_PRICE,
                    allowBlank : false,
                    minValue : 0,
                    name : 'normalPrice'
                }, {
                    xtype : 'numberfield',
                    fieldLabel : F.PRICE,
                    allowBlank : false,
                    minValue : 0,
                    name : 'price'
                }, {
                    xtype : 'fieldcontainer',
                    fieldLabel : F.ATTR_IMG,
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },
                    width : 400,
                    items : [{
                            xtype : 'grid',
                            height : 200,
                            columns : [
                                {text : F.IMG_NAME, dataIndex : 'logo', flex : 1, xtype : 'templatecolumn', resizable : false, sortable : false, menuDisabled : true, tpl : '<img src="{url}" style="width:260px;height:146px"/>'}
                            ],
                            emptyText : F.EMPTY_IMG,
                            store : new Ext.data.Store({
                                fields : [
                                    {name : 'url', type : 'string', persist : false},
                                    {name : 'fileRefId', type : 'integer', persist : false}
                                ],
                                listeners : {
                                    add : function (store){
                                        if(5 == store.count()){
                                            Ext.getCmp(id).down('webossimpleuploader').hide();
                                        }
                                    },
                                    remove : function (store){
                                        if(5 > store.count()){
                                            Ext.getCmp(id).down('webossimpleuploader').show();
                                        }
                                    },
                                    scope : this
                                }
                            }),
                            listeners : {
                                itemmouseenter : function (grid, record, item){
                                    var target = Ext.fly(item);
                                    var xy = target.getXY();
                                    xy[0] += target.getWidth() + 20;
                                    xy[1] -= 150;
                                    this.imagePreviewRef.loadImage(record.get('url'), xy[0], xy[1]);
                                },
                                itemmouseleave : function (grid, record, item)
                                {
                                    if(this.imagePreviewRef){
                                        this.imagePreviewRef.hide();
                                    }
                                },
                                itemcontextmenu : function (grid, record, htmlItem, index, event)
                                {
                                    var menu = this.getStdAttrImageContextMenu();
                                    menu.record = record;
                                    menu.store = grid.store;
                                    var pos = event.getXY();
                                    event.stopEvent();
                                    menu.showAt(pos[0], pos[1]);
                                },
                                scope : this
                            }
                        }, {
                            xtype : 'container',
                            items : {
                                attrContainerId : id,
                                xtype : 'webossimpleuploader',
                                uploadPath : this.mainPanelRef.appRef.getUploadFilesPath(),
                                createSubDir : false,
                                fileTypeExts : ['gif', 'png', 'jpg', 'jpeg'],
                                margin : '5 0 0 0',
                                maskTarget : this,
                                width : 80,
                                height : 30,
                                enableFileRef : true,
                                buttonText : F.UPLOAD_BTN,
                                listeners : {
                                    fileuploadsuccess : this.uploadSuccessHandler,
                                    scope : this
                                }
                            }
                        }]
                }]
        };
    },
    getStdAttrImageContextMenu : function ()
    {
        var L = this.LANG_TEXT.MENU.VALUE_FORM;
        if(null == this.stdAttrImageContextMenuRef){
            this.stdAttrImageContextMenuRef = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                        text : L.DELETE_IMAGE,
                        listeners : {
                            click : function (item)
                            {
                                item.parentMenu.store.remove(item.parentMenu.record);
                                Ext.Array.remove(this.fileRefs, item.parentMenu.record.get('fileRefId'));
                            },
                            scope : this
                        }
                    }]
            });
        }
        return this.stdAttrImageContextMenuRef;
    },
    getDetailImageContextMenu : function ()
    {

        var L = this.LANG_TEXT.MENU.DETAIL_FORM;
        if(null == this.detailImageContextMenuRef){
            this.detailImageContextMenuRef = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                        text : L.DELETE_IMAGE,
                        listeners : {
                            click : function (item)
                            {
                                item.parentMenu.store.remove(item.parentMenu.record);
                                Ext.Array.remove(this.fileRefs, item.parentMenu.record.get('fileRefId'));
                            },
                            scope : this
                        }
                    }]
            });
        }
        return this.detailImageContextMenuRef;
    },
    generateCombination : function (){
        if(0 == arguments.length){
            return [];
        } else if(1 == arguments.length){
            return arguments[0];
        } else{
            var array = [];
            for(var i = 0; i < arguments.length; i++) {
                array.push(arguments[i]);
            }
            var a = array.shift();
            var result = [];
            if(Ext.isEmpty(array)){
                return result;
            }
            Ext.Array.forEach(a, function (aitem){
                var b = this.generateCombination.apply(this, array);
                Ext.Array.forEach(b, function (bitem){
                    if(Ext.isArray(bitem)){
                        result.push(Ext.Array.merge([aitem], bitem));
                    } else{
                        result.push([aitem, bitem]);
                    }
                }, this);
            }, this);
            return result;
        }
    },
    getNormalAttrGroupWin : function (grid)
    {
        if(null == this.normalAttrGroupWinRef){
            this.normalAttrGroupWinRef = new App.ZhuChao.Goods.Comp.NormalAttrGroupWin({
                listeners : {
                    saverequest : this.attrGroupRequestHandler,
                    scope : this
                }
            });
        }
        this.normalAttrGroupWinRef.targetForm = grid;
        return this.normalAttrGroupWinRef;
    },
    getNormalAttrWin : function (form)
    {
        if(null == this.normalAttrWinRef){
            this.normalAttrWinRef = new App.ZhuChao.Goods.Comp.NormalAttrWindow({
                listeners : {
                    saverequest : this.addAttrRequestHandler,
                    scope : this
                }
            });
        }
        this.normalAttrWinRef.targetForm = form;
        return this.normalAttrWinRef;
    },
    addAttrRequestHandler : function (form, data, mode)
    {
        if(mode == CloudController.Const.NEW_MODE){
            var container = form.add({
                xtype : 'fieldcontainer',
                fieldLabel : data.name,
                layout : {
                    type : 'hbox'
                },
                items : [{
                        xtype : 'textfield',
                        width : 600,
                        name : data.name,
                        allowBlank : !data.required
                    }, {
                        xtype : 'button',
                        margin : '0 0 0 4',
                        text : this.LANG_TEXT.NORMAL_ATTR_PANEL.BTN.DELETE_ATTR,
                        listeners : {
                            click : function ()
                            {
                                form.remove(container);
                            },
                            scope : this
                        }
                    }]
            });
        }
    },
    attrGroupRequestHandler : function (form, data, mode)
    {
        if(mode == CloudController.Const.NEW_MODE){
            this.addCustomNormalAttrGroup(Ext.String.trim(data.groupName));
        } else if(mode == CloudController.Const.MODIFY_MODE){
            form.setTitle(Ext.String.trim(data.groupName));
        }
    },
    addCustomNormalAttrGroup : function (groupName)
    {
        var F = this.LANG_TEXT.NORMAL_ATTR_PANEL;
        groupName = Ext.String.trim(groupName);
        var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        var exist = false;
        this.normalAttrsPanelRef.items.each(function (item){
            if(item.getTitle() == groupName){
                exist = true;
            }
        }, this);
        if(exist){
            Cntysoft.showErrorWindow(Ext.String.format(this.LANG_TEXT.MSG.GROUP_ALREADY_EXIST, groupName));
            return;
        }
        var attr;
        var form = this.normalAttrsPanelRef.add({
            title : groupName,
            xtype : 'form',
            bodyPadding : 10,
            closable : true,
            margin : '5 0 0 0',
            tbar : [{
                    xtype : 'button',
                    text : F.BTN.ADD_ATTR,
                    listeners : {
                        click : function (){
                            var win = this.getNormalAttrWin(form);
                            win.center();
                            win.show();
                        },
                        scope : this
                    }
                }]
        });
    },
    selectedMerchantHandler : function ()
    {
        if(null == this.merchantSelecrWinRef){
            this.merchantSelecrWinRef = new App.ZhuChao.Goods.Comp.MerchantSelectWin({
                listeners : {
                    saverequest : this.saveRequestHandler,
                    scope : this
                }
            });
        }
        this.merchantSelecrWinRef.center();
        this.merchantSelecrWinRef.show();
    },
    saveRequestHandler : function (data)
    {
        this.merchantFieldRef.selectedMerchantId = data.id;
        this.merchantFieldRef.setValue(data.name);
    },
    merchantChangeHandler : function (textfield, newValue)
    {
        this.trademarkFieldRef.store.load({
            params : {
                merchantId : this.merchantFieldRef.selectedMerchantId
            }
        });
    },
    trademarkChangeHandler : function (trademark)
    {
        this.categoryFieldRef.reloadTree(trademark.getValue());

    },
    categorySelectedHandler : function (record)
    {
        this.setLoading(this.LANG_TEXT.MSG.LOAD_ATTRS);
        this.mainPanelRef.appRef.getCategoryAttrs(record.get('id'), function (response){
            this.loadMask.hide();
            if(!response.status){
                Cntysoft.Kernel.Utils.processApiError(response);
            } else{
                var attrs = response.data;
                this.setupNormalAttrsForm(attrs.normalAttrs);
                this.setupStdAttrsForm(attrs.stdAttrs);
            }
        }, this);
    },
    getBasicInfoConfig : function ()
    {
        var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        var F = this.LANG_TEXT.FIELDS.BASIC_FORM;
        var L = this.LANG_TEXT;
        var MSG = L.MSG;
        var me = this;
        return {
            xtype : 'form',
            height : 200,
            bodyPadding : 10,
            items : [{
                    xtype : 'textfield',
                    name : 'title',
                    fieldLabel : F.GOODS_TITLE + R_STAR,
                    width : 700,
                    allowBlank : false
                }, {
                    xtype : 'fieldcontainer',
                    layout : {
                        type : 'hbox'
                    },
                    items : [{
                            xtype : 'textfield',
                            fieldLabel : F.MERCHANT,
                            editable : false,
                            width : 500,
                            name : 'merchantId',
                            allowBlank : false,
                            listeners : {
                                afterrender : function (comp){
                                    this.merchantFieldRef = comp;
                                },
                                change : this.merchantChangeHandler,
                                scope : this
                            }
                        }, {
                            xtype : 'button',
                            text : F.SELECTED_MERCHANT,
                            margin : '0 0 0 5',
                            listeners : {
                                click : this.selectedMerchantHandler,
                                scope : this
                            }
                        }]
                }, {
                    xtype : 'combobox',
                    width : 500,
                    emptyText : MSG.EMPTY_TRADEMARK,
                    name : 'trademarkId',
                    allowBlank : false,
                    store : new Ext.data.Store({
                        fields : [
                            {name : 'name', type : 'string', persist : false},
                            {name : 'id', type : 'integer', persist : false}
                        ],
                        proxy : {
                            type : 'apigateway',
                            callType : 'App',
                            invokeMetaInfo : {
                                module : 'ZhuChao',
                                name : 'Goods',
                                method : 'Mgr/getMerchantTrademarks'
                            },
                            reader : {
                                type : 'json',
                                rootProperty : 'items',
                                totalProperty : 'total'
                            },
                            invokeParamsReady : function (params)
                            {
                                if(!Ext.isDefined(params.merchantId)){
                                    if(me.merchantFieldRef.selectedMerchantId){
                                        params.merchantId = me.merchantFieldRef.selectedMerchantId;
                                    } else{
                                        params.merchantId = -1;
                                    }
                                }
                                return params;
                            }
                        }
                    }),
                    editable : false,
                    fieldLabel : F.TRADEMARK,
                    queryMode : 'remote',
                    displayField : 'name',
                    valueField : 'id',
                    listeners : {
                        afterrender : function (comp){
                            this.trademarkFieldRef = comp;
                        },
                        change : this.trademarkChangeHandler,
                        scope : this
                    }
                }, {
                    xtype : 'zhuchaogoodscomptrademarkcategorycombo',
                    width : 500,
                    allowBlank : false,
                    fieldLabel : F.CATEGORY,
                    name : 'categoryId',
                    listeners : {
                        afterrender : function (comp)
                        {
                            this.categoryFieldRef = comp;
                        },
                        categoryselect : this.categorySelectedHandler,
                        scope : this
                    }
                }, {
                    xtype : 'radiogroup',
                    fieldLabel : F.STATUS,
                    width : 500,
                    items : [{
                            boxLabel : F.NORMAL,
                            inputValue : 1,
                            name : 'status',
                            checked : true
                        }, {
                            boxLabel : F.SETOFF,
                            inputValue : 2,
                            name : 'status'
                        }],
                    listeners : {
                        afterrender : function(group)
                        {
                            this.statusFieldRef = group;
                        },
                        scope : this
                    }
                }],
            listeners : {
                afterrender : function (comp)
                {
                    this.basicFormRef = comp;
                },
                scope : this
            }
        };
    },
    getNormalAttrFormConfig : function ()
    {
        var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        var F = this.LANG_TEXT.NORMAL_ATTR_PANEL;
        var L = this.LANG_TEXT;
        var conf = {
            xtype : 'panel',
            title : F.TITLE,
            hidden : true,
            listeners : {
                afterrender : function (comp)
                {
                    this.normalAttrsPanelRef = comp;
                },
                scope : this
            }
        };
        if(this.mode == CloudController.Const.NEW_MODE){
            conf.tbar = [{
                    xtype : 'button',
                    text : F.BTN.ADD_GROUP,
                    listeners : {
                        click : function (){
                            var win = this.getNormalAttrGroupWin();
                            win.center();
                            win.show();
                        },
                        scope : this
                    }
                }];
        }
        return conf;
    },
    getStdAttrFormConfig : function ()
    {
        var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        var F = this.LANG_TEXT.STD_ATTR_FORM;
        var L = this.LANG_TEXT;
        return {
            xtype : 'form',
            title : F.TITLE,
            bodyPadding : 10,
            hidden : true,
            listeners : {
                afterrender : function (comp)
                {
                    this.stdAttrsFormRef = comp;
                },
                scope : this
            }
        };
    },
    getStdAttrsValuesConfig : function ()
    {
        var F = this.LANG_TEXT.FIELDS.VALUE_FORM;
        return {
            xtype : 'container',
            margin : '0 0 5 0',
            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            listeners : {
                afterrender : function (comp)
                {
                    this.stdAttrsValueFormRef = comp;
                },
                remove : this.stdAttrItemCloseHandler,
                scope : this
            }
        }
    },
    getDetailFormConfig : function ()
    {
        var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        var F = this.LANG_TEXT.FIELDS.DETAIL_FORM;
        var L = this.LANG_TEXT;
        return {
            xtype : 'panel',
            title : F.TITLE,
            height : 400,
            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            items : [{
                    xtype : 'zhuchaogoodscompgoodsdetailimageview',
                    imageHeight : 260,
                    imageWidth : 146,
                    height : 300,
                    autoScroll : true,
                    store : new Ext.data.Store({
                        fields : [
                            {name : 'url', type : 'string', persist : false},
                            {name : 'fileRefId', type : 'integer', persist : false}
                        ]
                    }),
                    listeners : {
                        afterrender : function (view){
                            this.goodsDetailViewRef = view;
                        },
                        itemcontextmenu : function (grid, record, htmlItem, index, event)
                        {
                            var menu = this.getDetailImageContextMenu();
                            menu.record = record;
                            menu.store = grid.store;
                            var pos = event.getXY();
                            event.stopEvent();
                            menu.showAt(pos[0], pos[1]);
                        },
                        scope : this
                    }
                }, {
                    xtype : 'container',
                    items : {
                        xtype : 'button',
                        text : F.UPLOAD_DETAIL_BTN,
                        listeners : {
                            click : this.uploadClickHandler,
                            scope : this
                        }
                    }
                }],
            listeners : {
                afterrender : function (comp)
                {
                    this.detailFormRef = comp;
                },
                scope : this
            }
        };
    },
    /**
     * @TODO 大小限制相关
     */
    uploadClickHandler : function ()
    {
        WebOs.showLoadScriptMask();
        var uploaderConfig = {};
        Ext.require('WebOs.Component.Uploader.Window', function (){
            WebOs.hideLoadScriptMask();
            if(null == this.uploadWinRef){
                Ext.apply(uploaderConfig, {
                    initUploadPath : FH.getAppUploadFilesPath('ZhuChao', 'Goods'),
                    uploaderConfig : {
                        //启用附件追踪
                        enableFileRef : true,
                        fileTypeExts : ['gif', 'png', 'jpg', 'jpeg'],
                        createSubDir : true,
                        threads : 1
                    },
                    listeners : {
                        fileuploadsuccess : function (file, btn){
                            var file = file.pop();
                            this.fileRefs.push(parseInt(file.rid));
                            this.goodsDetailViewRef.store.add({
                                url : FH.getZhuChaoImageUrl(file.filename),
                                fileRefId : file.rid
                            });
                        },
                        fileuploaderror : function (response)
                        {
                            if(!response.status){
                                Cntysoft.Kernel.Utils.processApiError(response);
                            }
                        },
                        uploadcomplete : function ()
                        {
                            //是否马上关闭
                            this.uploadWinRef.close();
                        },
                        scope : this
                    }
                });
                this.uploadWinRef = new WebOs.Component.Uploader.Window(uploaderConfig);
            }
            this.uploadWinRef.center();
            this.uploadWinRef.show();
        }, this);
    },
    destroy : function ()
    {
        delete this.appRef;
        delete this.basicFormRef;
        delete this.normalAttrsPanelRef;
        delete this.stdAttrsFormRef;
        delete this.detailFormRef;
        delete this.merchantFieldRef;
        delete this.merchantFieldRef;
        delete this.trademarkFieldRef;
        delete this.categoryFieldRef;
        delete this.stdAttrsValueFormRef;
        delete this.stdAttrsData;
        delete this.normalAttrGroupMap;
        delete this.statusFieldRef;
        this.fileRefs = null;
        delete this.fileRefs;
        delete this.normalAttrPosMap;
        this.imagePreviewRef.destroy();
        delete this.imagePreviewRef;
        delete this.$_current_gid_$;
        if(this.uploadWinRef){
            this.uploadWinRef.destroy();
        }
        delete this.uploadWinRef;
        if(this.detailImageContextMenuRef){
            this.detailImageContextMenuRef.destroy();
            delete this.detailImageContextMenuRef;
        }
        if(this.stdAttrImageContextMenuRef){
            this.stdAttrImageContextMenuRef.destroy();
            delete this.stdAttrImageContextMenuRef;
        }
        delete this.goodsDetailViewRef;
        if(this.normalAttrGroupWinRef){
            this.normalAttrGroupWinRef.destroy();
            delete this.normalAttrGroupWinRef;
        }
        if(this.normalAttrWinRef){
            this.normalAttrWinRef.destroy();
            delete this.normalAttrWinRef;
        }
        this.callParent();
    }
});
