/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.Goods.Comp.GoodsDetailImageView', {
   extend: 'Ext.view.View',
   alias: 'widget.zhuchaogoodscompgoodsdetailimageview',
   tpl : [
      '<tpl for=".">',
      '<div class="image-wrap app-zhuchao-goods-image-wrap" style = "position:relative; margin:{itemMargin}px;">',
      '<img src="{url}" style = "width:{imageWidth}px;height:{imageHeight}px;"/>',
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
         overItemCls : 'app-zhuchao-goods-image-over-item',
         itemSelector : 'div.image-wrap',
         iconWidth : 100,
         iconHeight : 100,
         itemMargin : 4,
         selectedItemCls : 'app-zhuchao-goods-image-selected-item'
      });
   },

   /**
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
            imageWidth : this.imageWidth,
            imageHeight : this.imageHeight,
            itemMargin : this.itemMargin
         });
      }
      return data;
   }
});