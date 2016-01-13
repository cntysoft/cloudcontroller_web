/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.Searcher.Lang.zh_CN', {
   extend: 'Cntysoft.Kernel.AbstractLangHelper',
   data: {
      PM_TEXT: {
         DISPLAY_TEXT: '搜索引擎管理',
         ENTRY: {
            WIDGET_TITLE: '欢迎使用搜索引擎管理程序',
            TASK_BTN_TEXT: '搜索引擎管理'
         },
         GOODS_INDEX_BUILDER: {
            WIDGET_TITLE: '欢迎使用商品索引生成管理程序',
            TASK_BTN_TEXT: '商品索引生成'
         },
         GINFO_INDEX_BUILDER: {
            WIDGET_TITLE: '欢迎使用文章索引生成管理程序',
            TASK_BTN_TEXT: '文章索引生成'
         }
      },
      WIDGET_NAMES: {
         INDEX_BUILD: '索引生成',
         GOODS_INDEX: '商品索引生成',
         GINFOS_INDEX: '信息索引生成'
      },
      COMP: {
         GOODS_CATEGORY_TREE: {
            ROOT_NODE: '商品分类',
            PANEL_TITLE: '商品分类面板'
         },
         GINFOS_CATEGORY_TREE: {
            ROOT_NODE: '网站栏目',
            PANEL_TITLE: '网站栏目面板'
         },
         INDEX_BUILDER: {
            BUILD_TITLE: '正在生成指定分类的商品索引数据，请不要刷新页面，或者关闭本窗口，请稍后 ... ',
            DELETE_TITLE: '正在删除指定分类的商品索引数据，请不要刷新页面，或者关闭本窗口，请稍后 ... ',
            FIELDS: {
               CATEGORY_NAME: '分类名称',
               TOTAL: '所有文档数',
               CURRENT: '当前操作文档范围'
            },
            MSG: {
               LOAD_CATEGORY_TOTAL: '正在加载本分类文档总数数据 ... '
            }
         }
      },
      GOODS_INDEX_BUILDER: {
         MENU: {
            BUILD: '生成本分类商品索引数据',
            FORCE_BUILD: '强制生成本分类商品索引数据',
            DELETE: '删除本分类商品索引数据'
         }
      },
      GINFO_INDEX_BUILDER: {
         MENU: {
            BUILD: '生成本栏目信息索引数据',
            FORCE_BUILD: '强制生成本栏目信息索引数据',
            DELETE: '删除本栏目信息索引数据'
         }
      },
      UI: {
         GOODS: {
            LIST_VIEW: {
               TITLE: '商品索引列表面板',
               EMPTY_GOODS: '暂时没有商品',
               FIELDS: {
                  ID: '商品ID',
                  TITLE: '商品名称',
                  MERCHANT: '店铺名称',
                  CHECKED: '选中',
                  GENERATED: '状态'
               },
               BTN: {
                  CHECKED_ALL: '全部选中',
                  UNCHECKED: '取消选中',
                  START_BUILD: '开始生成选中',
                  FORCE_BUILD: '强制生成选中',
                  DELETE_INDEX: '删除选中索引数据'
               },
               MSG: {
                  DELETING: '正在删除商品索引文件，不要刷新页面和关闭窗口, 请稍等 ... ',
                  BUILDING: '正在生成商品索引文件，不要刷新页面和关闭窗口, 请稍等 ... ',
                  GENERATED: '已生成',
                  UNGENERATED: '未生成'
               }
            },
            BUILDER: {
               BUILD_TITLE: '正在生成指定分类的商品索引数据，请不要刷新页面，或者关闭本窗口，请稍后 ... ',
               DELETE_TITLE: '正在删除指定分类的商品索引数据，请不要刷新页面，或者关闭本窗口，请稍后 ... ',
               FIELDS: {
                  CATEGORY_NAME: '分类名称',
                  TOTAL: '所有文档数',
                  CURRENT: '当前操作文档范围'
               },
               MSG: {
                  LOAD_CATEGORY_TOTAL: '正在加载本分类文档总数数据 ... '
               }
            }
         },
         GINFOS: {
            LIST_VIEW: {
               TITLE: '信息列表面板',
               EMPTY_INFOS: '暂时没有信息',
               FIELDS: {
                  ID: '信息ID',
                  TITLE: '信息标题',
                  CHECKED: '选中',
                  GENERATED: '状态'
               },
               BTN: {
                  CHECKED_ALL: '全部选中',
                  UNCHECKED: '取消选中',
                  START_BUILD: '开始生成选中',
                  FORCE_BUILD: '强制生成选中',
                  DELETE_INDEX: '删除选中索引数据'
               },
               MSG: {
                  DELETING: '正在删除信息索引文件，不要刷新页面和关闭窗口, 请稍等 ... ',
                  BUILDING: '正在生成信息索引文件，不要刷新页面和关闭窗口, 请稍等 ... ',
                  GENERATED: '已生成',
                  UNGENERATED: '未生成'
               }
            }
         }
      }
   }
});