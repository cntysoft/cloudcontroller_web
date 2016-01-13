/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 筑巢商品种类管理，种类树形面板类
 */
Ext.define('App.ZhuChao.MarketMgr.Comp.GiftTree', {
    extend : 'Ext.tree.Panel',
    alias : 'widget.zhuchaomarketmgrcompgifttree',
    requires : [
        'SenchaExt.Data.Proxy.ApiProxy',
        'SenchaExt.Tree.DisableNodePlugin',
        'SenchaExt.Data.TreeStore'
    ],
    mixins : {
        fcm : 'Cntysoft.Mixin.ForbidContextMenu',
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    runableLangKey : 'App.ZhuChao.MarketMgr',
    plugins : [{
            ptype : 'nodedisabled'
        }],
    inheritableStatics : {
        NODE_TYPE : {
            NODE_TYPE_GIFT_HEAD : 1,
            NODE_TYPE_GIFT_CATEGORY : 2
        },
        /**
         * 判断节点类型是否支持
         *
         * @param {int} type
         */
        isNodeTypeSupported : function (type){
            var exist = false;
            Ext.iterate(this.NODE_TYPE, function (k, v){
                if(v == type){
                    exist = true;
                }
            });
            return exist;
        }
    },
    invokeMetaInfo : {
        module : 'ZhuChao',
        name : 'MarketMgr',
        method : 'GiftMgr/getGiftTree'
    },
    constructor : function (config)
    {
        config = config || {};
        this.applyConstraintConfig(config);
        this.callParent([config]);
        this.mixins.fcm.forbidContextMenu.call(this);
    },
    initComponent : function ()
    {
        Ext.apply(this, {
            store : this.createTreeStore()
        });
        this.addListener({
            beforeitemexpand : function (obj){
                var proxy = this.getStore().getProxy();
                proxy.setInvokeParams({
                    id : obj.getId()
                });
            },
            scope : this
        });
        this.callParent();
    },
    applyConstraintConfig : function (config)
    {
        Ext.apply(config, {
            useArrows : true,
            frame : false,
            border : false,
            title : this.GET_LANG_TEXT('COMP.CATEGORY_TREE.PANEL_TITLE')
        });
    },
    /**
     * @returns {SenchaExt.Data.TreeStore}
     */
    createTreeStore : function ()
    {
        return new SenchaExt.Data.TreeStore({
            //listeners : {
            //   load : this.setupNodeRecordsHandler,
            //   scope : this
            //},
            root : {
                text : this.GET_LANG_TEXT('COMP.CATEGORY_TREE.ROOT_NODE'),
                id : 0,
                expanded : true
            },
            fields : [
                {name : 'text', type : 'string', persist : false},
                {name : 'nodeType', type : 'integer', persist : false},
                {name : 'id', type : 'string', persist : false}
            ],
            nodeParam : 'id',
            tree : this,
            proxy : {
                type : 'apigateway',
                callType : 'App',
                invokeMetaInfo : this.invokeMetaInfo,
                reader : {
                    type : 'json',
                    rootProperty : 'data'
                },
                invokeParamsReady : function (params)
                {
                    if(!Ext.isDefined(params.id)){
                        params.id = 0;
                    }
                    return params;
                }
            }
        });
    },
    reload : function ()
    {
        this.store.load({
            params : {
                id : 0
            }
        });
    }
});