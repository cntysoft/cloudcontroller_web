/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.Merchant.Lang.zh_CN', {
   extend : 'Cntysoft.Kernel.AbstractLangHelper',
   data : {
      PM_TEXT : {
         DISPLAY_TEXT : '商家管理程序',
         ENTRY : {
            WIDGET_TITLE : '欢迎使用商家管理程序',
            TASK_BTN_TEXT : '商家管理'
         }
      },
      COMP : {
         CATEGORY_TREE : {
            ROOT_NODE : '商品品牌'
         }
      },
      UI : {
         MERCHANT_LISTVIEW : {
            TITLE : '签约商户列表',
            BTN : {
               ADD_MERCHANT : '添加商户信息',
               SAVE : '保存',
               CLOSE : '关闭',
               SEARCH : '搜索'
            },
            FIELDS : {
               ID : 'ID',
               NAME : '商家名称',
               ADDRESS : '店铺地址',
               PHONE : '联系电话',
               MANAGER : '店铺管理员',
               LEGAL_PERSON : '店铺法人',
               AUTHORIZER : '授权人',
               SORTNUM : '权重'
            },
            MENU : {
               CHANGESORT : '修改权重',
               MODIFY : '修改选中的店铺',
               DELETE : '删除选中店铺'
            },
            SORT_WIN : {
               TITLE : '修改权重',
               SORTNUM : '权重'
            },
            MSG : {
               SORT_CHANGE : '正在修改权重',
               DELETE_ASK : '您确定要删除商家 <span style ="color: blue">{0}</span> ?'
            }
         },
         MERCHANT_INFO : {
            TITLE : '商户信息添加/修改',
            EMPTY_TEXT : '暂时没有商户信息',
            CITY : {
               NORTH : '北城',
               SOUTH : '南城'
            },
            MENU : {
               DELETE : '删除选中分类'
            },
            FLOOR : {
               0 : "-1层",
               1 : "1层",
               2 : "2层",
               3 : "3层",
               4 : "4层",
               5 : "5层",
               6 : "6层"
            },
            FLOOR_EMPTY_TEXT : '请选择楼层',
            REGION_EMPTY_TEXT : '请选择区域',
            REGION : {
               1 : "东南区",
               2 : "东北区",
               3 : "西南区",
               4 : "西北区",
               5 : "正东门",
               6 : "正西门",
               7 : "正南门",
               8 : "正北门"
            },
            FIELDS : {
               NAME : "店铺名称",
               CITY : "城区",
               KEY : '店铺key',
               SORT : '权重',
               ONLY : '检查唯一',
               FLOOR : "楼层",
               REGION : "区域",
               SERIAL : "编号",
               PHONE : "店铺电话",
               MANAGER : "负责人",
               LEGAL_PERSON : '店铺法人',
               AUTHORIZER : '授权人',
               CATEGORY : '商品品类',
               LOGO : '店铺logo',
               SELECTED_TRADEMARK : '已经选择的商品品牌'
            },
            MSG : {
               EXIST : '当前key已经存在！',
               NOT_EXIST : '当前key可以使用！'
            }
         }
      },
      ENTRY : {
      }
   }
});