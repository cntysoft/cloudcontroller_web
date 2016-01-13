/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 内容模型编辑器字段中负责显示组图的图标类
 */
Ext.define('App.Site.CmMgr.Comp.IconView', {
   extend: 'Ext.view.View',
   alias: 'widget.sitecmmgrcompiconview',

   tpl : [
      '<tpl for=".">',
      '<div class="icon-wrap app-site-cmmgr-icon-wrap" style = "position:relative; margin:{itemMargin}px;">',
         '<img src="{icon}" style = "width:{iconWidth}px;height:{iconHeight}px;" title = "{description}"/>',
         '<span>{name}</span>',
         '<div style="display:{isDisplay};" class = "app-site-cmmgr-image-marker"></div>',
      '</div>',
      '</tpl>'
   ],

   constructor : function(config)
   {
      var config = config || {};
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         singleSelect : true,
         trackOver : true,
         overItemCls : 'app-site-cmmgr-image-over-item',
         itemSelector : 'div.icon-wrap',
         height : 120,
         iconWidth : 100,
         iconHeight : 100,
         itemMargin : 4,
         selectedItemCls : 'app-site-cmmgr-image-selected-item'
      });
   },

   /*
    * @inheritdoc
    */
   prepareData : function(data, recordIndex, record)
   {
      var associatedData;
      var attr;
      var hasCopied;
      if(record){
         associatedData = record.getAssociatedData();
         for(attr in associatedData) {
            if(associatedData.hasOwnProperty(attr)){
               if(!hasCopied){
                  data = Ext.Object.chain(data);
                  hasCopied = true;
               }

               data[attr] = associatedData[attr];
            }
         }
         Ext.apply(data,{
            iconWidth : this.iconWidth,
            iconHeight : this.iconHeight,
            itemMargin : this.itemMargin
         });
         if(data['isCover']){
            data['isDisplay'] = 'inline-block';
         } else{
            data['isDisplay'] = 'none';
         }
      }
      return data;
   }
});