/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Ui.Ui.Tag.FsView', {
   extend: 'WebOs.Component.FsView.GridView',
   alias : 'widget.siteuiuitagfsview',
   mixins : {
      runableLangTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },

   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.Ui',

   /*
    * @property {String} panelType 面板的类型
    */
   panelType : 'FsView',

   /*
    * @property {String} tagType 标签类型
    */
   tagType : null,
   /*
    * @property {String} classify 标签的分类
    */
   classify : null,
   /*
    * @property {String} qsTagName 标签的名称
    */
   qsTagName : null,
   /*
    * @property {Object} TAG_FS_LANG_TEXT
    */
   TAG_FS_LANG_TEXT : null,
   isCreateFsTree : false,
   statics : {
      VE_MAP : {
         js : [true, true, 'WebOs.Component.Editor.Code'],
         php : [true, true, 'WebOs.Component.Editor.Code'],
         html : [true, true, 'App.Site.Ui.Comp.CodeEditor'],
         phtml : [true, true, 'App.Site.Ui.Comp.CodeEditor'],
         css : [true, true, 'WebOs.Component.Editor.Code'],
         txt : [true, true, 'WebOs.Component.Editor.Text']
      }
   },

   constructor : function(config)
   {
      config = config || {};
      //重名覆盖了， 但是这样写又可以
      this.TAG_FS_LANG_TEXT = this.mixins.runableLangTextProvider.GET_LANG_TEXT.call(this, 'TAG.TAG_FS_VIEW');
      this.applyConstraintConfig(config);
      var siteSeting = CloudController.getSysEnv().get(CloudController.Const.ENV_SITE_SETTING);
      var tagLibPath = CloudController.Kernel.StdPath.getTagBasePath()+'/P'+siteSeting.tplProject;

      this.startPaths = [
         tagLibPath + '/' + config.tagType + '/' + config.classify + '/' + config.qsTagName
      ];
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         title : this.TAG_FS_LANG_TEXT.TITLE
      });
   },

   initComponent : function()
   {
      this.addListener({
         beforeclose : this.beforeCloseHandler,
         render : this.renderHandler,
         scope : this
      });
      this.callParent();
   },

   /*
    * @inheritdoc
    */
   getVeMapItem : function(fileType)
   {
      return this.statics().VE_MAP[fileType];
   },
   renderHandler : function()
   {
      this.fsStore.sort([{
         property : 'type', direction: 'ASC'
      }]);
   },
   prepareFileHandler : function(store, records)
   {
      var len = records.length;
      var record;
      for(var i =0; i < len; i++){
         record = records[i];
         if(record.get('name') == App.Site.Ui.Lib.Const.TAG_DEF_FILENAME){
            store.remove(record);
         }
      }
      this.callParent(arguments);
   },
   beforeCloseHandler : function()
   {
      if(!this.$_force_quit_$ && this.editors.getCount() > 0){
         Cntysoft.showQuestionWindow(this.GET_LANG_TEXT('MSG.CLOSE_ASK'), function(bid){
            if('yes' == bid){
               this.$_force_quit_$ = true;
               this.mainPanelRef.tabPanelRef.remove(this, true);
            }
         }, this);
         return false;
      }
      return true;
   },
   /*
    * 文件底部工具栏
    *
    * @return {Array}
    */
   getBBarItems : function()
   {
      var BASE_L_BTN = this.LANG_TEXT.BTN;
      return [{
         text : BASE_L_BTN.SELECT_ALL,
         listeners : {
            click : this.selectAllHandler,
            scope : this
         }
      }, {
         text : BASE_L_BTN.UN_SELECT_ALL,
         listeners : {
            click : this.deselectAllHandler,
            scope : this
         }
      }, {
         text : BASE_L_BTN.DELETE_SELECTED,
         listeners : {
            click : this.deleteSelectionHandler,
            scope : this
         }
      }, {
         text : BASE_L_BTN.PASTE,
         listeners : {
            click : function(){
               this.paste(this.path);
            },
            scope : this
         }
      }, {
         text : BASE_L_BTN.NEW_FOLDER,
         listeners : {
            click : this.createNewDirHandler,
            scope : this
         }
      }, {
         text : BASE_L_BTN.NEW_FILE,
         listeners : {
            click : this.createNewFileHandler,
            scope : this
         }
      }, {
         text : BASE_L_BTN.UPLOAD_FILE,
         listeners : {
            click : this.uploadFilesHandler,
            scope : this
         }
      }, {
         text : this.ABSTRACT_LANG_TEXT.BTN.GOTO_PARENT,
         listeners : {
            click : function()
            {
               this.cd2ParentDir();
            },
            scope : this
         }
      }];
   },
   deleteFile : function(filename)
   {
      var arr = filename.split('/');
      if('Definition.php' == arr.pop()){
         Cntysoft.showAlertWindow(this.TAG_FS_LANG_TEXT.MSG.CANNOT_DELETE_FILE);
         return false;
      }
      var fs = this.getFsObject();
      var L_TEXT = this.ABSTRACT_LANG_TEXT;
      this.setLoading(L_TEXT.MSG.DELETE_FILE_OP);
      fs.deleteFile(filename, function(response){
         this.loadMask.hide();
         if(response.status){
            this.reloadView();
         } else{
            Cntysoft.processApiError(response);
            this.reloadView();
         }
      }, this);
   },
   /*
    * 批量删除指定文件
    */
   deleteFiles : function(files, callback, scope)
   {
      var fs = this.getFsObject();
      var L_TEXT = this.ABSTRACT_LANG_TEXT;
      callback = Ext.isFunction(callback) ? callback : Ext.emptyFn;
      scope = scope ? scope : this;
      if(files.length > 0){
         var len = files.length;
         for(var i = 0;i < len; i += 1){
            var arr = files[i].split('/');
            if('Definition.php' == arr.pop()){
               Cntysoft.showAlertWindow(this.TAG_FS_LANG_TEXT.MSG.CANNOT_DELETE_FILES);
               return false;
            }
         }
         this.setLoading(L_TEXT.MSG.DELETE_FILE_OP);
         fs.deleteFiles(files, function(response){
            this.loadMask.hide();
            if(response.status){
               callback.call(scope);
               this.reloadView();
            } else{
               Cntysoft.processApiError(response);
               this.reloadView();
            }
         }, this);
      } else{
         //直接调用回调函数
         callback.call(this);
      }
   },
   destroy : function()
   {
      delete this.mainPanelRef;
      delete this.TAG_FS_LANG_TEXT;
      this.callParent();
   }
});