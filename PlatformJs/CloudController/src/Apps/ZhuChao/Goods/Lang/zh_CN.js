/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.Goods.Lang.zh_CN', {
   extend: 'Cntysoft.Kernel.AbstractLangHelper',
   data: {
      PM_TEXT: {
         DISPLAY_TEXT: '欢迎使用商品管理程序',
         ENTRY: {
            WIDGET_TITLE: '欢迎使用商品管理程序',
            TASK_BTN_TEXT: '商品管理'
         }
      },
      COMP: {
         MERCHANT_SELECT_WIN: {
            TITLE: '商家选择窗口',
            FIELDS: {
               ID : 'ID',
               NAME: '店铺名称'
            },
            BTN : {
               SEARCH : '搜索'
            }
         },
         CATEGORY_TREE: {
            ROOT_NODE: '商品分类树'
         },
         G_CATEGORY_TREE: {
            ROOT_NODE: '商品分类树',
            PANEL_TITLE: '商品分类面板'
         },
         CATEGORY_COMBO: {
            SELECT_NODE: '请选择商品分类'
         },
         NORMAL_ATTR_GROUP_WIN: {
            TITLE: '普通属性添加窗口',
            FIELDS: {
               GROUP_NAME: '分组名称'
            }
         },
         NORMAL_ATTR_WINDOW: {
            TITLE: '普通属性添加/修改窗口',
            FIELDS: {
               NAME: '属性名称',
               REQUIRED: '是否必须'
            }
         },
         SEARCH_ATTR_MAP_GENERATOR: {
            TITLE: '正在生成指定分类下的搜索属性数据，请不要刷新页面，或者关闭本窗口，请稍后 ... ',
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
      UI: {
         GOODS_LISTVIEW: {
            TITLE: '商品列表',
            EMPTY_TEXT: '当前没有商品',
            FIELDS: {
               ID: '商品ID',
               TITLE: '商品名称',
               MERCHANT: '所属店铺',
               CATEGORY: '商品分类',
               NAME : '商品名称',
               SEARCH : '搜索',
               STATUS : '状态'
            },
            STATUS : {
                NORMAL : '<span style="color:green;">正常</span>',
                OFFSET : '<span style="color:red;">已下架</span>'
            },
            BTN: {
               ADD_GOODS: '添加商品'
            },
            MENU : {
                MODIFY : '修改商品',
                SETOFF : '下架商品',
                SETON : '上架商品',
                VIEW : '浏览商品'
            },
            MSG : {
                SETOFF : '您真的要将此商品下架吗？',
                SETON : '您确定要上架此商品？'
            }
         },
         GOODS_INFO: {
            TITLE: '商品信息添加/修改面板',
            FIELDS: {
               BASIC_FORM: {
                  GOODS_TITLE: '商品标题',
                  MERCHANT: '所属店铺',
                  SELECTED_MERCHANT: '选择店铺',
                  TRADEMARK: '所属品牌',
                  CATEGORY: '所属分类',
                  STATUS : '商品状态',
                  NORMAL : '正常',
                  SETOFF : '下架'
               },
               VALUE_FORM: {
                  ATTR_IMG: '规格图片',
                  IMG_NAME: '缩略图',
                  IMG_URL: '图片地址',
                  EMPTY_IMG: '暂无图片',
                  NORMAL_PRICE : '参考价格',
                  PRICE: '价格',
                  UPLOAD_BTN: '上传图片'
               },
               DETAIL_FORM: {
                  TITLE: '详细信息',
                  UPLOAD_DETAIL_BTN: '上传详细说明图片'
               }
            },
            NORMAL_ATTR_PANEL: {
               TITLE: '商品属性',
               BTN: {
                  ADD_GROUP: '添加属性分组',
                  ADD_ATTR: '添加属性',
                  DELETE_ATTR: '删除此项属性'
               }
            },
            STD_ATTR_FORM: {
               TITLE: '商品规格'
            },
            MENU: {
               VALUE_FORM: {
                  DELETE_IMAGE: '删除选中图片'
               },
               DETAIL_FORM: {
                  DELETE_IMAGE: '删除选中图片'
               }
            },
            MSG: {
               EMPTY_TRADEMARK: '请选择商品品牌',
               LOAD_ATTRS: '正在加载属性数据 ... ',
               EMPTY_ATTR: '请填写商品属性',
               CHANGE_ATTR_ASK: '当前已经有规格， 您确定要改变规格吗？<span style = "color:red">如果改变当前的规格数据会被清空！</span>',
               GROUP_ALREADY_EXIST: '属性分组 <span style ="color:blue">{0}</span> 已经存在'
            }
         }
      },
      ENTRY: {
         MENU: {
            GENERATE: '生成该分类搜索属性数据'
         }
      }
   }
});