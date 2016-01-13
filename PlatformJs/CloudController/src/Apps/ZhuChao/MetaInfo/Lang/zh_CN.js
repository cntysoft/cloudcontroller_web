/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MetaInfo.Lang.zh_CN', {
   extend: 'Cntysoft.Kernel.AbstractLangHelper',
   data: {
      PM_TEXT: {
         DISPLAY_TEXT: '元信息管理',
         ENTRY: {
            WIDGET_TITLE: '欢迎使用元信息管理程序',
            TASK_BTN_TEXT: '元信息管理'
         },
         TRADEMARK : {
            WIDGET_TITLE: '欢迎使用品牌管理程序',
            TASK_BTN_TEXT: '品牌管理'
         }
      },
      WIDGET_NAMES: {
         TRADEMARK : '品牌管理'
      },
      COMP : {
         CATEGORY_TREE : {
            ROOT_NODE : '商品分类'
         }
      },
      UI : {
         TRADEMARK : {
            LIST_VIEW : {
               TITLE : '品牌列表',
               FIELDS : {
                  LOGO : '品牌Logo',
                  NAME : '品牌名称',
                  CATEGORY : '所含商品品类'
               },
               BTN : {
                  ADD_MERCHANT : '添加品牌信息'
               },
               MENU : {
                  MODIFY : '修改选中品牌',
                  DELETE : '删除选中品牌'
               },
               MSG : {
                  DELETE_ASK : '您确定要删除品牌 <span style ="color: blue">{0}</span> ?'
               }
            },
            INFO : {
               TITLE : '品牌添加/修改面板',
               FIELDS : {
                  NAME : '品牌名称',
                  LOGO : '品牌Logo',
                  UPLOAD : '上传图片',
                  CATEGORY : '商品分类',
                  SELECTED_CATEGORY : '已选分类'
               },
               MENU : {
                  DELETE : '删除选中分类'
               },
               ERROR : {
                  TRADEMARK_LOGO_EMPTY : '品牌logo不能为空'
               }
            }
         }
      },
      TRADEMARK : {

      }
   }
});