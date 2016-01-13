/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.Goods.Ui.GoodsListView', {
    extend : 'Ext.grid.Panel',
    requires : [
        'WebOs.Kernel.StdPath',
        'Cntysoft.Component.ImagePreview.View'
    ],
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    statics : {
        STATUS : {
            NORMAL : 1,
            OFFSET : 2
        },
        CODE : {
            MODIFY : 1,
            SETOFF : 2,
            SETON : 3,
            VIEW : 4
        }
    },
    /**
     * @inheritdoc
     */
    panelType : 'ListView',
    /**
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.ZhuChao.Goods',
//   imagePreviewRef: null,
    contextMenuRef : null,
    loadedCid : -1,
    constructor : function (config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.GOODS_LISTVIEW');
        this.applyConstraintConfig(config);
//      this.imagePreviewRef = new Cntysoft.Component.ImagePreview.View({
//         trackMouse: false
//      });
        this.callParent([config]);
    },
    applyConstraintConfig : function (config)
    {
        Ext.apply(config, {
            border : true,
            title : this.LANG_TEXT.TITLE,
            emptyText : this.LANG_TEXT.EMPTY_TEXT
        });
    },
    initComponent : function ()
    {
        var F = this.LANG_TEXT.FIELDS;
        var store = this.createDataStore();
        Ext.apply(this, {
            bbar : Ext.create('Ext.PagingToolbar', {
                store : store,
                displayInfo : true,
                emptyMsg : this.emptyText
            }),
            tbar : this.getTBarConfig(),
            store : store,
            columns : [
                {text : F.ID, dataIndex : 'id', width : 120, resizable : false, sortable : false, menuDisabled : true},
                {text : F.TITLE, dataIndex : 'title', flex : 1, resizable : false, sortable : false, menuDisabled : true},
                {text : F.MERCHANT, dataIndex : 'merchant', width : 180, resizable : false, sortable : false, menuDisabled : true},
                {text : F.CATEGORY, dataIndex : 'category', width : 220, resizable : false, sortable : false, menuDisabled : true},
                {text : F.STATUS, dataIndex : 'status', width : 100, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.statusRender, this)}
            ]
        });
        this.addListener({
            itemdblclick : function (panel, record)
            {
                this.renderModifyPanel(record);
            },
//         //itemcontextmenu : this.itemContextMenuHandler,
//         itemmouseenter: function(grid, record, item, index, event) {
//            if (Ext.isEmpty(record.get('img'))) {
//               return;
//            }
//            this.imagePreviewRef.setTarget(item);
//            var target = Ext.fly(item);
//            var xy = event.getXY();
//            xy[0] += 60;
//            var image = FH.getZhuChaoImageUrl(record.get('img'));
//            if (!image) {
//               image = record.get('img');
//            }
//            this.imagePreviewRef.loadImage(image, xy[0], xy[1]);
//         },
//         itemmouseleave: function(grid, record, item)
//         {
//            if (this.imagePreviewRef) {
//               this.imagePreviewRef.hide();
//            }
//         },
            itemcontextmenu : this.itemContextClickHandler,
            afterrender : function ()
            {
                this.loadCategoryGoods(0);
            },
            scope : this
        });
        this.callParent();
    },
    renderModifyPanel : function (record)
    {
        this.mainPanelRef.renderNewTabPanel('Info', {
            mode : CloudController.Const.MODIFY_MODE,
            targetLoadId : record.get('id'),
            appRef : this.mainPanelRef.appRef
        });
    },
    reload : function ()
    {
        Cntysoft.Utils.Common.reloadGridPage(this.store);
    },
    loadCategoryGoods : function (cid)
    {
        if(cid != this.loadedCid){
            this.loadedCid = cid;
            var store = this.getStore();
            //将仓库当前页复位
            store.currentPage = 1;
            store.load({
                params : {
                    cid : cid
                }
            });
            store.loadedCid = cid;
        }
    },
    createDataStore : function ()
    {
        return new Ext.data.Store({
            fields : [
                {name : 'id', type : 'integer', persist : false},
                {name : 'img', type : 'string', persist : false},
                {name : 'title', type : 'string', persist : false},
                {name : 'category', type : 'string', persist : false},
                {name : 'merchant', type : 'string', persist : false},
                {name : 'status', type : 'integer', persist : false}
            ],
            proxy : {
                type : 'apigateway',
                callType : 'App',
                invokeMetaInfo : {
                    module : 'ZhuChao',
                    name : 'Goods',
                    method : 'Mgr/getGoodsList'
                },
                reader : {
                    type : 'json',
                    rootProperty : 'items',
                    totalProperty : 'total'
                }
            },
            listeners : {
                beforeload : function (store, operation){
                    if(!operation.getParams()){
                        operation.setParams({
                            cid : this.loadedCid,
                            name : this.nameRef.getValue()
                        });
                    }
                },
                scope : this
            }
        });
    },
    getTBarConfig : function ()
    {
        var L = this.LANG_TEXT.BTN, F = this.LANG_TEXT.FIELDS;
        return [{
                text : L.ADD_GOODS,
                listeners : {
                    click : function ()
                    {
                        this.mainPanelRef.renderNewTabPanel('Info', {
                            appRef : this.mainPanelRef.appRef,
                            mode : 1
                        });
                    },
                    scope : this
                }
            }, {
                xtype : 'tbfill'
            }, {
                xtype : 'textfield',
                name : 'name',
                fieldLabel : F.NAME,
                listeners : {
                    afterrender : function (name){
                        this.nameRef = name;
                    },
                    scope : this
                }
            }, {
                xtype : 'button',
                text : F.SEARCH,
                listeners : {
                    afterrender : function (btn){
                        this.btnRef = btn;
                    },
                    click : function (){
                        this.reloadGridPageFirst(this.getStore());
                    },
                    scope : this
                }
            }];
    },
    statusRender : function (status)
    {
        var L = this.LANG_TEXT.STATUS;
        return this.self.STATUS.NORMAL == status ? L.NORMAL : L.OFFSET;
    },
    reloadGridPageFirst : function (store, params)
    {
        store.addListener('load', function (store, records){
            store.currentPage = 1;
            if(params){
                store.load({
                    params : params
                });
            }else{
               store.load();
            }
        }, this, {
            single : true
        });
        if(params){
            store.load({
                params : params
            });
        } else{
            store.load();
        }
    },
    itemContextClickHandler : function (grid, record, item, index, event)
    {
        var menu = this.getContextMenu(record);
        menu.record = record;
        var pos = event.getXY();
        event.stopEvent();
        menu.showAt(pos[0], pos[1]);
    },
    getContextMenu : function (record)
    {
        var L = this.LANG_TEXT.MENU;
        var status = record.get('status');
        var C = this.self.CODE;
        var S = this.self.STATUS;
        var items = [{
                text : L.MODIFY,
                code : C.MODIFY
            }, {
                text : L.VIEW,
                code : C.VIEW
            }, {
                text : S.NORMAL == status ? L.SETOFF : L.SETON,
                code : S.NORMAL == status ? C.SETOFF : C.SETON
            }];
        if(null == this.contextMenuRef){
            this.contextMenuRef = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : items
            });
        } else{
            this.contextMenuRef.removeAll();
            this.contextMenuRef.add(items);
        }

        this.contextMenuRef.addListener({
            click : this.contextMenuItemClickHandler,
            scope : this
        });
        this.contextMenuRef.record = record;
        return this.contextMenuRef;
    },
    contextMenuItemClickHandler : function ( menu, item, e, eOpts)
    {
        var record = menu.record;
        var code = item.code;
        var C = this.self.CODE;
        
        switch(code) {
            case C.MODIFY:
                this.renderModifyPanel(record);
                break;
            case C.SETOFF:
                this.setGoodsOff(record);
                break;
            case C.SETON:
                this.setGoodsOn(record);
                break;
            case C.VIEW:
                var url = window.location.protocol + '//' + window.location.host + '/product/' + record.get('id') + '.html';
                window.open(url);
                break;
        }
    },
    setGoodsOff : function(record)
    {
        var id = record.get('id');
        Cntysoft.showQuestionWindow(this.LANG_TEXT.MSG.SETOFF, function(btn) {
            if('yes' == btn) {
                this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
                this.mainPanelRef.appRef.setGoodsOff(id, function(response) {
                    this.loadMask.hide();
                    if(response.status) {
                        Cntysoft.showAlertWindow(Cntysoft.GET_LANG_TEXT('MSG.SAVE_OK'), function() {
                            this.reloadGridPageFirst(this.getStore());
                        } ,this);
                    }else{
                        Cntysoft.Kernel.Utils.processApiError(response);
                    }
                }, this);
            }
        }, this);
    },
    setGoodsOn : function(record)
    {
        var id = record.get('id');
        Cntysoft.showQuestionWindow(this.LANG_TEXT.MSG.SETON, function(btn) {
            if('yes' == btn) {
                this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
                this.mainPanelRef.appRef.setGoodsOn(id, function(response) {
                    this.loadMask.hide();
                    if(response.status) {
                        Cntysoft.showAlertWindow(Cntysoft.GET_LANG_TEXT('MSG.SAVE_OK'), function() {
                            this.reloadGridPageFirst(this.getStore());
                        } ,this);
                    }else{
                        Cntysoft.Kernel.Utils.processApiError(response);
                    }
                }, this);
            }
        }, this);
    },
    destroy : function ()
    {
//      if (this.imagePreviewRef) {
//         this.imagePreviewRef.destroy();
//         delete this.imagePreviewRef;
//      }
        if(this.contextMenuRef){
            this.contextMenuRef.destroy();
            delete this.contextMenuRef;
        }
        this.callParent();
    }
});