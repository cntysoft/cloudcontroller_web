/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.SoftwareRepo.Widget.Entry', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT('ENTRY');
   },
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         width: 1000,
         minWidth: 1000,
         height: 500,
         minHeight : 500,
         maximizable: true
      });
   }
});