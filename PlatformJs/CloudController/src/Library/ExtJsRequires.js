/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 这个类只要为了打包将需要的ExtJs文件都包含进来
 */
Ext.define('CloudController.ExtJsRequires',{
    requires : [
        'Ext.panel.Panel',
        'Ext.grid.Panel',
        'Ext.data.Store',
        'Ext.menu.Menu',
        'Ext.tree.Panel',
        'Ext.EventManager',
        'Ext.String',
        'Ext.layout.container.Border',
        'Ext.layout.container.Table',
        'Ext.layout.container.Fit',
        'Ext.grid.column.Action',
        'Ext.menu.ColorPicker',
        'Ext.grid.column.RowNumberer',
        'Ext.Img',
        'Ext.grid.column.Template',
        'Ext.grid.column.Date',
        'Ext.grid.feature.Summary'
    ]
});