/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MarketMgr.Lang.zh_CN', {
   extend : 'Cntysoft.Kernel.AbstractLangHelper',
   data : {
      PM_TEXT : {
         DISPLAY_TEXT : '营销管理程序',
         ENTRY : {
            WIDGET_TITLE : '欢迎使用营销管理程序',
            TASK_BTN_TEXT : '营销管理'
         },
         SELLERSIGN : {
            WIDGET_TITLE : '欢迎使用商家入驻程序',
            TASK_BTN_TEXT : '商家入驻'
         },
         USERASKFOR : {
            WIDGET_TITLE : '欢迎使用申请设计用户管理程序',
            TASK_BTN_TEXT : '申请设计用户'
         },
         ADSMGR : {
            WIDGET_TITLE : '欢迎使用广告位管理程序',
            TASK_BTN_TEXT : '广告位管理'
         },
         GIFTMANAGER : {
            WIDGET_TITLE : '欢迎使用礼包管理程序',
            TASK_BTN_TEXT : '礼包管理'
         },
         PREFERACT : {
             WIDGET_TITLE : '欢迎使用优惠活动管理程序',
            TASK_BTN_TEXT : '优惠活动管理'
         }
      },
      ENTRY : {
         SELLERSIGN : {
            WIDGET_TITLE : '欢迎使用商家入驻程序',
            TASK_BTN_TEXT : '商家入驻'
         },
         USERASKFOR : {
            WIDGET_TITLE : '欢迎使用申请设计用户管理程序',
            TASK_BTN_TEXT : '申请设计用户'
         },
         ADSMGR : {
            WIDGET_TITLE : '欢迎使用广告位管理程序',
            TASK_BTN_TEXT : '广告位管理',
            INDELETEAD : '正在删除广告',
            DELETEADSUCCESS : '删除广告成功',
            INDELETEMODULE : '正在删除模块',
            DELETEMODULESUCCESS : '删除模块成功',
            ADDNEWMODULE : '增加新的模块'
         },
         PREFERACT : {
            WIDGET_TITLE : '欢迎使用优惠活动管理程序',
            TASK_BTN_TEXT : '优惠活动管理'
         }
      },
      WIDGET : {
         PREFERACT : {
            WIDGET_TITLE : '欢迎使用优惠活动管理程序',
            TASK_BTN_TEXT : '优惠活动管理',
            ADDPREFERACT : '添加活动',
            RECYCLE : '活动回收站'
         }
      },
      SELLERSIGN : {
         INFO : {
            TITLE : '商家详情',
            BEFOREDEAL : '未处理',
            AFTERDEAL : '已处理',
            INDEAL : '处理中',
            SELLERNAME : '商家名称',
            NAME : '商家姓名',
            ADDRESS : '商家地址',
            PHONENUM : '联系电话',
            SIGNTIME : '申请时间',
            INTRO : '商家简介',
            ISDEAL : '是否处理',
            GOTOBEFOREDEAL : '设为未处理',
            GOTOAFTERDEAL : '设为已处理',
            GOTOINDEAL : '设为处理中'
         },
         LISTVIEW : {
            TITLE : '申请商家列表',
            EMPTYMSG : '无数据',
            ID : '序号',
            NAME : '商家姓名',
            SELLERNAME : '商家名称',
            SIGNTIME : '申请时间',
            ISDEAL : '是否处理',
            PHONENUM : '联系电话',
            GOTOBEFOREDEAL : '设为未处理',
            GOTOAFTERDEAL : '设为已处理',
            GOTOINDEAL : '设为处理中',
            DELETE : '删除该记录',
            DEALCD : '处理程度',
            SEARCH : '选择搜索',
            BEFOREDEAL : '未处理',
            AFTERDEAL : '已处理',
            INDEAL : '处理中',
            SUOYOU : '全部',
            GESHIBEFOREDEAL : '<font color = "red">未处理</font>',
            GESHIAFTERDEAL : '<font color = "green">已处理</font>',
            GESHIINDEAL : '<font color = "yellow">处理中</font>'
         }
      },
      USERASKFOR : {
         INFO : {
            TITLE : '用户详情',
            BEFOREDEAL : '未处理',
            AFTERDEAL : '已处理',
            INDEAL : '处理中',
            NAME : '用户姓名',
            ADDRESS : '用户地址',
            PHONENUM : '联系电话',
            ASKFORTIME : '申请时间',
            AREA : '面积',
            ISDEAL : '是否处理',
            GOTOBEFOREDEAL : '设为未处理',
            GOTOAFTERDEAL : '设为已处理',
            GOTOINDEAL : '设为处理中'
         },
         LISTVIEW : {
            TITLE : '申请用户列表',
            EMPTYMSG : '无数据',
            ID : '序号',
            NAME : '用户姓名',
            AREA : '面积',
            SIGNTIME : '申请时间',
            ISDEAL : '是否处理',
            PHONENUM : '联系电话',
            GOTOBEFOREDEAL : '设为未处理',
            GOTOAFTERDEAL : '设为已处理',
            GOTOINDEAL : '设为处理中',
            DELETE : '删除该记录',
            DEALCD : '处理程度',
            SEARCH : '选择搜索',
            BEFOREDEAL : '未处理',
            AFTERDEAL : '已处理',
            INDEAL : '处理中',
            SUOYOU : '全部',
            GESHIBEFOREDEAL : '<font color = "red">未处理</font>',
            GESHIAFTERDEAL : '<font color = "green">已处理</font>',
            GESHIINDEAL : '<font color = "yellow">处理中</font>'
         }
      },
      ADSMGR : {
         ADSEDITOR : {
            TITLE : '广告编辑器',
            CANCEL : '重置',
            SUBMIT : '提交',
            MODIFYSUCCESS : '修改广告成功',
            ADDSUCCESS : '增加广告成功',
            MODULENAME : '模块名称',
            ADNAME : '广告名称',
            URL : '广告网址',
            LOCATION : '广告位置',
            STARTTIME : '开始时间',
            ENDTIME : '结束时间',
            IMAGE : '广告图片',
            UPDATE : '上传',
            GBCOLOR : '背景颜色'
         },
         ADSMODULEEDITOR : {
            TITLE : '模块编辑器',
            MODULENAME : '模块名称',
            SUBMIT : '提交',
            INMODIFY : '正在修改',
            INADD : '正在添加',
            MODIFYSUCCESS : '修改模块成功',
            ADDSUCCESS : '添加模块成功'
         },
         LISTVIEW : {
            TITLE : '广告列表',
            ID : '序号',
            NAME : '广告名称',
            LOCATION : '广告位置',
            CONTENTURL : '广告网址',
            STARTTIME : '广告开始时间',
            ENDTIME : '广告结束时间',
            MODIFYAD : '修改该广告',
            DELETEAD : '删除该广告',
            DELETEADSUCCESS : '删除广告成功'
         },
         MODULETREE : {
            TITLE : '广告位模块列表',
            ADD : '为该模块添加广告',
            MODIFY : '修改该模块名称',
            DELETE : '删除该模块',
            DELETEMODULESUCCESS : '删除模块成功'
         }
      },
      PREFERACT : {
         PREFERACTTREE : {
            TITLE : '活动列表',
            JOINMERCHANT : '关联商家',
            MODIFYPREFERACT : '修改活动名称',
            FREEZEPREFERACT : '冻结该活动',
            INFREEZE : '冻结中',
            FREEZESUCCESS : '操作成功',
            TREETITLE : '活动列表'
         },
         PREFERACTEDITOR : {
            TITLE : '活动编辑器',
            ADD : '添加',
            MODIFY : '修改',
            NAME : '活动名称',
            INTRO : '活动简介',
            STATUS : '活动状态',
            ACTIVE : '激活',
            FREEZE : '冻结',
            INADD : '添加中',
            ADDSUCCESS : '添加成功',
            ADDFAIL : '活动名称重复，添加失败',
            MODIFYFAIL : '活动名称重复，添加失败',
            INMODIFY : '修改中',
            MODIFYSUCCESS : '修改成功',
            INFOFAIL : '信息不全，请完善信息'
         },
         PREFERACTLIST : {
            TITLE : '活动回收站',
            EMPTY : '没有数据',
            ID : '活动ID',
            NAME : '活动名称',
            INTRO : '活动简介',
            STATUS : '活动状态',
            DELETE : '彻底删除该活动',
            ACTIVE : '激活该活动',
            INDELETE : '正在删除',
            DELETESUCCESS : '删除成功',
            INACTIVE : '正在激活',
            ACTIVESUCCESS : '激活成功'
         },
         JOINMERCHANT : {
            TITLE : '关联商家',
            EMPTY : '没有数据',
            SELECT : '选中',
            ID : '商家ID',
            NAME : '商家名称',
            JOIN : '关联选中商家',
            INJOIN : '关联中',
            JOINSUCCESS : '关联成功'
         },
         LISTVIEW : {
            TITLE : '参与活动商家',
            EMPTY : '没有数据',
            SELECT : '选中',
            ID : '商家ID',
            NAME : '商家名称',
            CANCEL : '取消关联',
            INCANCEL : '取消关联中',
            CANCELSUCCESS : '取消关联成功'            
         },
         STARTUP : {
            TITLE : '使用说明',
            TEXT : '<h1 style="text-align: center">欢迎使用优惠活动管理程序</h1>'
         }
      },
      WIDGET_NAMES : {
         GIFTMANAGER : '礼包管理'
      },
      COMP : {
         CATEGORY_TREE : {
            ROOT_NODE : '礼包列表',
            PANEL_TITLE : '礼包列表面板'
         }
      },
      UI : {
         ATTRS : {
            WELCOME_PANEL : {
               TITLE : '欢迎面板'
            },
            Gift_INFO : {
               TITLE : '礼包添加/修改面板',
               FIELDS : {
                  GIFT_ID : '礼包id',
                  GIFT_NAME : '礼包名',
                  GIFT_INTRO : '礼包简介',
                  GIFT_PRICE : '礼包价格',
                  GIFT_AREA : '面积',
                  GIFT_PIC : '封面',
                  GIFT_BANNER : '顶部banner',
                  GIFT_IMAGES : '图集'
               },
               MSG : {
                  SAVE_OK : '添加成功',
                  UPDATE_OK : '修改成功'
               },
               BTN : {
                  UPPIC : '上传封面',
                  UPBANNER : '上传banner'
               },
               IMAGE_GROUP : {
                  BTNS : {
                     UPLOAD : '上传样板间效果图'
                  },
                  MSG : {
                     TITLE : '提示信息',
                     DELETE : '您确定要删除 <span style="color:red">{0}</span> 吗?'
                  },
                  CONTEXT_MENU : {
                     CONFIG : '图片位置',
                     DELETE : '删除'
                  },
                  CONFIG_WINDOW : {
                     TITLE : '图片信息配置窗口',
                     FIELD_LABEL : '位置',
                     EMPTY : '请选择位置'
                  },
                  INVALID_TEXT : {
                     EMPTY : '效果图不能为空',
                     NO_DESCRIPTION : '必须为每一个图片添加描述'
                  }
               }
            },
            Gift_CATE : {
               TITLE : '分类添加/修改面板',
               FIELDS : {
                  CATE_ID : '分类id',
                  CATE_NAME : '分类名'
               },
               MSG : {
                  SAVE_OK : '添加成功',
                  UPDATE_OK : '修改成功'
               }
            },
            Gift_Goods : {
               TITLE : '商品添加/修改面板',
               FIELDS : {
                  GOODS_ID : '商品ID',
                  GOODS_NAME : '商品名',
                  GOODS_REALGOODSID : '真实商品id',
                  GOODS_TRADEMARK : '商品品牌',
                  GOODS_TRAINTRO : '品牌简介',
                  GOODS_PRICE : '商品价格',
                  GOODS_SPACE : '使用位置',
                  GOODS_IMAGE : '商品图片',
                  GOODS_TRAIMAGE : '品牌图片',
                  GOODS_DEFIMAGE : '商品封面',
                  GOODS_UP_IMAGE : '上传商品图片',
                  GOODS_UP_TRAIMAGE : '上传品牌图片',
                  GOODS_UP_DEFIMAGE : '上传商品封面'
               },
               MSG : {
                  SAVE_OK : '添加成功',
                  UPDATE_OK : '修改成功'
               },
               IMAGE_GROUP : {
                  BTNS : {
                     UPLOAD : '上传商品图片'
                  },
                  MSG : {
                     TITLE : '提示信息',
                     DELETE : '您确定要删除 <span style="color:red">{0}</span> 吗?'
                  },
                  CONTEXT_MENU : {
                     CONFIG : '配置商品信息',
                     DELETE : '删除'
                  },
                  CONFIG_WINDOW : {
                     TITLE : '商品详细信息配置窗口',
                     FIELD_LABEL : '描述',
                     FIELD_PRICE : '价格'
                  },
                  INVALID_TEXT : {
                     EMPTY : '商品图片不能为空',
                     NO_DESCRIPTION : '商品图片大于1必须为每一个图片添加描述'
                  }
               }
            },
            GiftGoods_LISTVIEW : {
               TITLE : '商品列表',
               PANEL_TITLE : '商品列表',
               EMPTY_TEXT : '当前没有商品',
               FIELDS : {
                  ID : '商品ID',
                  NAME : '商品名',
                  TRADEMARK : '商品品牌',
                  TRAINTRO : '品牌简介',
                  PRICE : '商品价格',
                  PACKNAME : '所属礼包',
                  TYPENAME : '所属分类'
               },
               MENU : {
                  GOODS_MODIFY : '修改商品',
                  GOODS_DELETE : '删除商品'
               },
               MSG : {
                  SAVE_OK : '添加成功',
                  UPDATE_OK : '修改成功',
                  GOODS_DELETE : '真的要删除商品<span style ="color: blue">{0}</span> 吗?'
               }
            }
         }
      },
      GIFTMANAGER : {
         MENU : {
            ROOT : '添加礼包',
            GIFT_MODIFY : '修改礼包',
            GIFT_CATE : '添加分类',
            GIFT_DELETE : '删除礼包',
            CATE_GOODS : '添加商品',
            CATE_DELETE : '删除分类',
            CATE_MODIFY : '修改分类'
         },
         MSG : {
            GIFT_DELETE : '真的要删除<span style ="color: blue">{0}</span> 吗?',
            CATE_DELETE : '真的要删除分类<span style ="color: blue">{0}</span> 吗?'
         }
      }
   }
});
