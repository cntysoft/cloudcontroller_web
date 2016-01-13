/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */

Ext.define('App.ZhuChao.Goods.Comp.SearchAttrMapGenerator', {
   extend: 'WebOs.Component.Window',
   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   /**
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey: 'App.ZhuChao.Goods',
   categoryId: -1,
   page: 1,
   pageSize: 20,
   categoryName: '',
   docTotal: 0,
   operateType: -1,
   categoryNameFieldRef: null,
   totalFieldRef: null,
   currentFieldRef: null,
   constructor: function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('COMP.SEARCH_ATTR_MAP_GENERATOR');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         closeAction: 'destroy',
         layout: 'fit',
         width: 800,
         height: 250,
         modal: true,
         resizable: false,
         maximizable: false
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         items: this.formConfig()
      });
      this.addListener({
         close: this.closeHandler,
         afterrender: this.afterRenderHandler,
         show: function()
         {
            this.startBuildProcess();
         },
         scope: this
      });
      this.callParent();
   },
   setCategoryName: function(name)
   {
      this.categoryName = name;
   },
   setCategoryId: function(categoryId)
   {
      this.categoryId = categoryId;
   },
   updateCurrentPageInfo: function(page)
   {
      var pageSize = this.pageSize;
      var start = (page - 1) * pageSize;
      var end = page * pageSize;
      if (end > this.docTotal) {
         end = this.docTotal;
      }
      this.currentFieldRef.setValue(start + ' - ' + end);
   },
   
   startBuildProcess: function()
   {
      this.setLoading(this.LANG_TEXT.MSG.LOAD_CATEGORY_TOTAL);
      this.getInfoTotalNum(this.categoryId, function(response) {
         this.loadMask.hide();
         if (!response.status) {
            Cntysoft.Kernel.Utils.processApiError(response);
         } else {
            this.docTotal = response.data.total;
            this.totalFieldRef.setValue(this.docTotal);
            this.buildSearchAttrMapByCategory();
         }
      }, this);
   },
   
   getInfoTotalNum : function(cid, callback, scope)
   {
      this.appRef.getGoodsTotalNumByCatgory(cid, callback, scope);
   },
   
   processBuildCycle : function(cid, page, pageSize, callback, scope)
   {
      this.appRef.generateSearchAttrMapByCategory(cid, page, pageSize, callback, scope);
   },
   
   buildSearchAttrMapByCategory: function()
   {
      var start = (this.page - 1) * this.pageSize;
      this.updateCurrentPageInfo(this.page);
      if (start <= this.docTotal) {
         this.processBuildCycle(this.categoryId, this.page, this.pageSize, function(response) {
            if (!response.status) {
               Cntysoft.Kernel.Utils.processApiError(response);
            } else {
               this.page++;
               this.buildSearchAttrMapByCategory();
            }
         }, this);
      } else {
         if (this.hasListeners.buildcomplete) {
            this.fireEvent('buildcomplete', this.categoryId);
         }
         this.close();

      }
   },
   afterRenderHandler: function()
   {
      this.categoryNameFieldRef.setValue(this.categoryName);
   },
   formConfig: function()
   {
      var FIELDS = this.LANG_TEXT.FIELDS;
      return {
         xtype: 'form',
         bodyPadding: 10,
         defaults: {
            labelWidth: 200
         },
         items: [{
               xtype: 'displayfield',
               fieldLabel: FIELDS.CATEGORY_NAME,
               listeners: {
                  afterrender: function(comp)
                  {
                     this.categoryNameFieldRef = comp;
                  },
                  scope: this
               }
            }, {
               xtype: 'displayfield',
               fieldLabel: FIELDS.TOTAL,
               listeners: {
                  afterrender: function(comp)
                  {
                     this.totalFieldRef = comp;
                  },
                  scope: this
               }
            }, {
               xtype: 'displayfield',
               fieldLabel: FIELDS.CURRENT,
               listeners: {
                  afterrender: function(comp)
                  {
                     this.currentFieldRef = comp;
                  },
                  scope: this
               }
            }]
      }
   },
   closeHandler: function()
   {
      this.categoryId = -1;
      this.page = 1;
   },
   destroy: function()
   {
      delete this.appRef;
      this.callParent();
   }
});