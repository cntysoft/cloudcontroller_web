/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 这个文件主要是把需要的桌面相关的依赖文件都打包进来
 */
Ext.define("CloudController.PackageRequires",{
   requires : [
      //cntysoft-core
      "Cntysoft.Kernel.Const",
      "Cntysoft.Global",
      "Cntysoft.Kernel.LangManager",
      "Cntysoft.Lang.zh_CN",
      "Cntysoft.Kernel.SysEnv",
      "Cntysoft.Utils.Common",
      "Cntysoft.Utils.HtmlTpl",
      "Cntysoft.Framework.Net.Gateway",
      "Cntysoft.Mixin.LangTextProvider",
      "Cntysoft.Mixin.ForbidContextMenu",
      "Cntysoft.Mixin.FormTooltip",
      "Cntysoft.Mixin.CallSys",
      "Cntysoft.Mixin.CallApp",
      "Cntysoft.Utils.ColRenderer",
      //cntysoft-webos
      "WebOs.Kernel.Const",
      "WebOs.OsWidget.Desktop",
      "WebOs.Kernel.ProcessModel.Daemon",
      "WebOs.Mixin.RunableLangTextProvider",
      "WebOs.OsWidget.TreeNavWidget",
      "WebOs.Component.FsView.GridView",
      "WebOs.Component.Uploader.SimpleUploader",
      "WebOs.Component.CkEditor.Editor",
      "WebOs.Component.KvDict.View",
      //sencha-ext
      "SenchaExt.Data.Proxy.ApiProxy",
      "SenchaExt.Mixin.MultiTabPanel",
      "SenchaExt.Tree.DisableNodePlugin",
      "SenchaExt.Data.TreeStore",
      "SenchaExt.Data.Proxy.WebSocketProxy",
      //cntysoft-comp
      "Cntysoft.Component.TplSelect.Win",
      "Cntysoft.Component.ImagePreview.View",
      //cloudcontroller
      "CloudController.Comp.Uploader.SimpleUploader",
      "CloudController.Comp.FsView.GridView"
   ]
});