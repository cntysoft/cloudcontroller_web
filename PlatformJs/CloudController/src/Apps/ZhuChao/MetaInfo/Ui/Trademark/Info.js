/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MetaInfo.Ui.Trademark.Info', {
    extend : 'Ext.form.Panel',
    requires : [
        'App.ZhuChao.MetaInfo.Comp.CategoryTree',
        'WebOs.Component.Uploader.SimpleUploader'
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
    runableLangKey : 'App.ZhuChao.MetaInfo',
    mode : 1,
    categoryTreeRef : null,
    gridRef : null,
    categoryGridContextMenuRef : null,
    logoRef : null,
    fileRefs : null,
    logoSrc : null,
    targetLoadId : -1,
    constructor : function (config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.TRADEMARK.INFO');
        this.applyConstraintConfig(config);
        if(config.mode == CloudController.Const.MODIFY_MODE){
            if(!Ext.isDefined(config.targetLoadId) || !Ext.isNumber(config.targetLoadId)){
                Ext.Error.raise({
                    cls : Ext.getClassName(this),
                    method : 'constructor',
                    msg : 'mode is modify, so you must set node id'
                });
            }
        }
        this.callParent([config]);
    },
    applyConstraintConfig : function (config)
    {
        Ext.apply(config, {
            border : true,
            title : this.LANG_TEXT.TITLE,
            bodyPadding : 10,
            autoScroll : true
        });
    },
    initComponent : function ()
    {
        Ext.apply(this, {
            bodyPadding : 10,
            items : this.getFormItemConfig(),
            buttons : [{
                    text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
                    listeners : {
                        click : this.saveHandler,
                        scope : this
                    }
                }, {
                    text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
                    listeners : {
                        click : function ()
                        {
                            this.close();
                        },
                        scope : this
                    }
                }]
        });
        this.addListener('afterrender', this.afterRenderHandler, this);
        this.callParent();
    },
    loadTrademarkInfo : function (id)
    {
        if(this.$_current_nid_$ !== id){
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
            this.appRef.getTrademark(id, this.afterLoadInfoHandler, this);
            this.$_current_nid_$ = id;
        }
    },
    afterLoadInfoHandler : function (response)
    {
        this.loadMask.hide();
        if(!response.status){
            Cntysoft.Kernel.Utils.processApiError(response);
        } else{
            var form = this.getForm();
            var data = response.data;
            var selectedCategories = data.selectedCategoris;
            delete data.selectedCategories;
            form.setValues(response.data);
            this.gridRef.store.loadData(selectedCategories);
            this.logoSrc = data.logo;
            this.imageRef.setSrc(FH.getZhuChaoImageUrl(data.logo));
            this.fileRefs = parseInt(data.fileRefs);
        }
    },
    afterRenderHandler : function ()
    {
        if(this.mode == CloudController.Const.MODIFY_MODE){
            this.loadTrademarkInfo(this.targetLoadId);
        }
    },
    saveHandler : function ()
    {
        var form = this.getForm();
        if(form.isValid() && this.logoSrc){
            var values = form.getValues();
            var categories = [];
            this.gridRef.store.each(function (item){
                categories.push(item.get('id'));
            });
            Ext.apply(values, {
                logo : this.logoSrc,
                fileRefs : this.fileRefs,
                categories : categories
            });
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
            if(this.mode == CloudController.Const.NEW_MODE){
                this.mainPanelRef.appRef.addTrademark(values, this.afterSaveHandler, this);
            } else if(this.mode == CloudController.Const.MODIFY_MODE){
                values.id = this.$_current_nid_$;
                this.mainPanelRef.appRef.updateTrademark(values, this.afterSaveHandler, this);
            }
        } else{
            if(!this.logoSrc){
                Cntysoft.showErrorWindow(this.LANG_TEXT.ERROR.TRADEMARK_LOGO_EMPTY);
            }
        }
    },
    afterSaveHandler : function (response)
    {
        this.loadMask.hide();
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
    getFormItemConfig : function ()
    {
        var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        var F = this.LANG_TEXT.FIELDS;
        var L = this.LANG_TEXT;
        return [{
                xtype : 'textfield',
                width : 600,
                fieldLabel : F.NAME + R_STAR,
                name : 'name',
                allowBlank : false
            }, {
                xtype : 'fieldcontainer',
                fieldLabel : F.LOGO + R_STAR,
                layout : {
                    type : 'hbox',
                    align : 'bottom'
                },
                items : [{
                        xtype : 'image',
                        width : 200,
                        height : 100,
                        style : 'border:1px solid #EDEDED',
                        listeners : {
                            afterrender : function (comp){
                                this.imageRef = comp;
                            },
                            scope : this
                        }
                    }, {
                        xtype : 'webossimpleuploader',
                        uploadPath : this.mainPanelRef.appRef.getUploadFilesPath(),
                        createSubDir : false,
                        fileTypeExts : ['gif', 'png', 'jpg', 'jpeg'],
                        margin : '0 0 0 5',
                        maskTarget : this,
                        enableFileRef : true,
                        buttonText : F.UPLOAD,
                        listeners : {
                            fileuploadsuccess : this.uploadSuccessHandler,
                            scope : this
                        },
                        margin : '0 0 0 5'
                    }]
            }, {
                xtype : 'fieldcontainer',
                fieldLabel : F.CATEGORY,
                width : 900,
                height : 300,
                layout : 'hbox',
                items : [{
                        xtype : 'zhuchaometainfocompcategorytree',
                        width : 400,
                        height : 300,
                        trademarkId : this.targetLoadId,
                        appRef : this.appRef,
                        listeners : {
                            afterrender : function (comp)
                            {
                                this.categoryTreeRef = comp;
                            },
                            checkchange : this.nodeCheckChangeHandler,
                            scope : this
                        }
                    }, {
                        xtype : 'grid',
                        margin : '0 0 0 5',
                        width : 400,
                        height : 300,
                        columns : [
                            {text : F.SELECTED_CATEGORY, dataIndex : 'name', flex : 1, resizable : false, sortable : false, menuDisabled : true}
                        ],
                        listeners : {
                            afterrender : function (comp)
                            {
                                this.gridRef = comp;
                            },
                            itemcontextmenu : this.itemContextMenuHandler,
                            scope : this
                        },
                        store : new Ext.data.Store({
                            fields : [
                                {name : 'id', type : 'integer', persist : false},
                                {name : 'name', type : 'string', persist : false},
                                {name : 'path', type : 'string', persist : false}
                            ]
                        })
                    }]
            }]
    },
    uploadSuccessHandler : function (file, uploadBtn)
    {
        var file = file.pop();
        this.fileRefs = parseInt(file.rid);
        this.logoSrc = file.filename;
        this.imageRef.setSrc(FH.getZhuChaoImageUrl(file.filename));
    },
    itemContextMenuHandler : function (grid, record, htmlItem, index, event)
    {
        var menu = this.getContextMenu();
        menu.record = record;
        var pos = event.getXY();
        event.stopEvent();
        menu.showAt(pos[0], pos[1]);
    },
    getContextMenu : function (record)
    {
        var L = this.LANG_TEXT.MENU;
        if(null == this.categoryGridContextMenuRef){
            this.categoryGridContextMenuRef = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                        text : L.DELETE,
                        listeners : {
                            click : function (item)
                            {
                                var record = item.parentMenu.record;
                                this.categoryTreeRef.expandPath(record.get('path'), {
                                    callback : function (){
                                        var node = this.categoryTreeRef.getStore().findRecord('id', record.get('id'));
                                        node.set('checked', false);
                                        this.gridRef.store.remove(record);
                                    },
                                    scope : this
                                });
                            },
                            scope : this
                        }
                    }]
            });
        }
        return this.categoryGridContextMenuRef;
    },
    nodeCheckChangeHandler : function (node, checked)
    {
        if(checked){//选中
            //首先添加本身
            this.gridRef.store.add({
                id : node.get('id'),
                name : node.get('text')
            });
            //循环添加父节点
            var parent = node.parentNode;
            while(parent) {
                var id = parent.get('id');
                if(0 == id) {
                    break;
                }
                var record = this.gridRef.store.getById(id);
                if(!record) {
                    this.gridRef.store.add({
                        id : id,
                        name : parent.get('text')
                    });
                }
                
                parent = parent.parentNode;
            }
        } else{//取消选中
            //这里写的很是复杂.需要改进
            //首先删除自己
            var detailRecord = this.gridRef.store.getById(node.get('id'));
            if(detailRecord){
                this.gridRef.store.remove(detailRecord);
            }
            //处理第二级
            var second = node.parentNode;
            var isOk = false;
            Ext.each(second.childNodes, function(item) {
                if(item.get('checked')) {
                    isOk = true;
                }
            });
            
            //这里只有在第三级的节点全部取消之后,才会去检查第一级的栏目是否需要取消
            if(!isOk) {
                var secondRecord = this.gridRef.store.getById(second.get('id'));
                if(secondRecord){
                    this.gridRef.store.remove(secondRecord);
                }
                            
                //处理第一级
                var first = second.parentNode;
                var firstRecord = this.gridRef.store.getById(first.get('id'));
                if(firstRecord) {
                    var all = false;
                    Ext.each(first.childNodes, function(item) {
                        if(item.childNodes) {
                            Ext.each(item.childNodes, function(node) {
                                if(node.get('checked')) {
                                    all = true;
                                }
                            });
                        }
                    });

                    if(!all) {
                        this.gridRef.store.remove(firstRecord);
                    }
                }
            }
        }
    },
    destroy : function ()
    {
        delete this.appRef;
        this.mixins.langTextProvider.destroy.call(this);
        if(null != this.categoryGridContextMenuRef){
            this.categoryGridContextMenuRef.destroy();
            delete this.categoryGridContextMenuRef;
        }
        delete this.gridRef;
        delete this.categoryTreeRef;
        delete this.fileRefs;
        delete this.logoSrc;
        this.callParent();
    }
});