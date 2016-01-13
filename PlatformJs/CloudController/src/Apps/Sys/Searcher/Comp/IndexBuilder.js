/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.Searcher.Comp.IndexBuilder', {
   extend: 'WebOs.Component.Window',
   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   inheritableStatics: {
      OP_TYPE_BUILD: 1,
      OP_TYPE_DELETE: 2
   },
   /**
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey: 'App.Sys.Searcher',
   forceBuild: false,
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
      this.LANG_TEXT = this.GET_LANG_TEXT('COMP.INDEX_BUILDER');
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
            if (this.operateType == this.self.OP_TYPE_BUILD) {
               this.startBuildProcess();
            } else if (this.operateType == this.self.OP_TYPE_DELETE) {
               this.startDeleteProcess();
            }
         },
         scope: this
      });
      //默认为生成
      this.setOperateType(1);
      this.callParent();
   },
   setOperateType: function(operateType)
   {
      if (operateType == this.self.OP_TYPE_BUILD) {
         this.setTitle(this.LANG_TEXT.BUILD_TITLE);
      } else if (operateType == this.self.OP_TYPE_DELETE) {
         this.setTitle(this.LANG_TEXT.DELETE_TITLE);
      }
      this.operateType = operateType;
   },
   setCategoryName: function(name)
   {
      this.categoryName = name;
   },
   setForceBuild: function(force)
   {
      this.forceBuild = force;
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
   /**
    * 获取信息总数信息
    * 
    * @param {Number} categoryId
    * @param {Function} callback
    * @param {Object} scope
    */
   getInfoTotalNum: Ext.emptyFn,
   /**
    * 进行生成处理
    * 
    * @param {Number} categoryId
    * @param {Number} page
    * @param {Number} pageSize
    * @param {Boolean} forceBuild
    * @param {Function} callback
    * @param {Object} scope
    */
   processBuildCycle: Ext.emptyFn,
   /**
    * 进行删除索引处理
    * 
    * @param {Number} categoryId
    * @param {Number} page
    * @param {Number} pageSize
    * @param {Boolean} forceBuild
    * @param {Function} callback
    * @param {Object} scope
    */
   processDeleteCycle: Ext.emptyFn,
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
            this.buildInfosIndexByCategory();
         }
      }, this);
   },
   buildInfosIndexByCategory: function()
   {
      var start = (this.page - 1) * this.pageSize;
      this.updateCurrentPageInfo(this.page);
      if (start <= this.docTotal) {
         this.processBuildCycle(this.categoryId, this.page, this.pageSize, this.forceBuild, function(response) {
            if (!response.status) {
               Cntysoft.Kernel.Utils.processApiError(response);
            } else {
               this.page++;
               this.buildInfosIndexByCategory();
            }
         }, this);
      } else {
         if (this.hasListeners.buildcomplete) {
            this.fireEvent('buildcomplete', this.categoryId);
         }
         this.close();

      }
   },
   startDeleteProcess: function()
   {
      this.setLoading(this.LANG_TEXT.MSG.LOAD_CATEGORY_TOTAL);
      this.getInfoTotalNum(this.categoryId, function(response) {
         this.loadMask.hide();
         if (!response.status) {
            Cntysoft.Kernel.Utils.processApiError(response);
         } else {
            this.docTotal = response.data.total;
            this.totalFieldRef.setValue(this.docTotal);
            this.deleteInfosIndexByCategory();
         }
      }, this);
   },
   deleteInfosIndexByCategory: function()
   {
      var start = (this.page - 1) * this.pageSize;
      this.updateCurrentPageInfo(this.page);
      if (start <= this.docTotal) {
         this.processDeleteCycle(this.categoryId, this.page, this.pageSize, function(response) {
            if (!response.status) {
               Cntysoft.Kernel.Utils.processApiError(response);
            } else {
               this.page++;
               this.deleteInfosIndexByCategory();
            }
         }, this);
      } else {
         if (this.hasListeners.deletecomplete) {
            this.fireEvent('deletecomplete', this.categoryId);
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
      this.forceBuild = false;
      this.categoryId = -1;
      this.page = 1;
      this.operateType = this.self.OP_TYPE_BUILD;
   },
   destroy: function()
   {
      this.categoryNameFieldRef;
      this.totalFieldRef;
      this.currentFieldRef;
      delete this.appRef;
      this.callParent();
   }
});


