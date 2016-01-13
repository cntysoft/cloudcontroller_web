/*
 * Cntysoft Cloud Software Team
 *
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 筑巢用户中心入口文件
 */
Ext.define('App.ZhuChao.UserCenter.Main', {
   extend: 'WebOs.Kernel.ProcessModel.App',
   requires: [
      'App.ZhuChao.UserCenter.Lang.zh_CN'
   ],
   /*
    * @inheritdoc
    */
   id: 'ZhuChao.UserCenter',
   /*
    * @inheritdoc
    */
   widgetMap : {
      Entry : 'App.ZhuChao.UserCenter.Widget.Entry',
      Decorator : 'App.ZhuChao.UserCenter.Widget.Decorator',
      Project : 'App.ZhuChao.UserCenter.Widget.Project',
      DesignScheme : 'App.ZhuChao.UserCenter.Widget.DesignScheme',
      Normal : 'App.ZhuChao.UserCenter.Widget.Normal',
      Foreman : 'App.ZhuChao.UserCenter.Widget.Foreman',
      Designer : 'App.ZhuChao.UserCenter.Widget.Designer'
   },
   constructor : function(config)
   {
      config = config || {};
      this.callParent([config]);
   },
    
   //用户管理相关功能
   add : function(values, callback, scope)
   {
      this.callApp('UserManager/add', values, callback, scope);
   },
   
   update : function(values, callback, scope)
   {
      this.callApp('UserManager/update', values, callback, scope);
   },
   
   loadUser : function(id, callback, scope)
   {
      this.callApp('UserManager/read', {
         id : id
      }, callback, scope);
   },
   statusChange : function(values, callback, scope)
   {
      this.callApp('UserManager/statusChange', values, callback, scope);
   },
   getProvinces : function(callback, scope)
   {
      this.callApp('UserManager/getProvinces', {}, callback, scope);
   },
   getArea : function(value, callback, scope)
   {
      this.callApp('UserManager/getArea', {
         code : value
      }, callback, scope);
   },
   getUserListProjectByType : function(values, callback, scope)
   {
      this.callApp('Project/getUserListByType', values, callback, scope);
   },
   
   getUserListDSByType : function(values, callback, scope)
   {
      this.callApp('DesignScheme/getUserListByType', values, callback, scope);
   },
   
   getMemberListDSType : function(values, callback, scope)
   {
      this.callApp('DesignScheme/getMemberListByUser', values, callback, scope);
   },

   //装修公司成员管理相关功能
   addDecoratorMember : function(values, callback, scope)
   {
      this.callApp('DecoratorMember/addMember', values, callback, scope);
   },
   
   loadDecoratorMember : function(values, callback, scope)
   {
      this.callApp('DecoratorMember/readMember', values, callback, scope);
   },
   
   deleteDecoratorMember : function(values, callback, scope)
   {
      this.callApp('DecoratorMember/deleteMember', values, callback, scope);
   },
   
   updateDecoratorMember : function(values, callback, scope)
   {
      this.callApp('DecoratorMember/updateMember', values, callback, scope);
   },
   
   //项目管理相关方法
   addProject : function(values, callback, scope)
   {
      this.callApp('Project/addProject', values, callback, scope);
   },
   
   loadProject : function(values, callback, scope)
   {
      this.callApp('Project/readProject', values, callback, scope);
   },
   
   updateProject : function(values, callback, scope)
   {
      this.callApp('Project/updateProject', values, callback, scope);
   },
   
   deleteProject : function(values, callback, scope)
   {
      this.callApp('Project/deleteProject', values, callback, scope);
   },
   
   //设计方案相关方法
   getQueryFields : function(callback, scope)
   {
      this.callApp('DesignScheme/getQueryFields', {}, callback, scope);
   },
   
   addDesignScheme : function(values, callback, scope)
   {
      this.callApp('DesignScheme/addDesignScheme', values, callback, scope);
   },
   
   loadDesignScheme : function(values, callback, scope)
   {
      this.callApp('DesignScheme/readDesignScheme', values, callback, scope);
   },
   
   updateDesignScheme : function(values, callback, scope)
   {
      this.callApp('DesignScheme/updateDesignScheme', values, callback, scope);
   },
   
   deleteDesignScheme : function(values, callback, scope)
   {
      this.callApp('DesignScheme/deleteDesignScheme', values, callback, scope);
   },
   getDsListByUid : function(values, callback, scope)
   {
      this.callApp('DesignScheme/getDsListByUidAll', values, callback, scope);
  },
   getSysKvDict : function(key, callback, scope)
   {
       this.callApp('UserManager/getKvDictByIdentifier', {identifier : key}, callback, scope);
   }
});
