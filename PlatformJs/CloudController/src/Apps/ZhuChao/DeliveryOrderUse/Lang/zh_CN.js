/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.DeliveryOrderUse.Lang.zh_CN', {
   extend : 'Cntysoft.Kernel.AbstractLangHelper',
   data : {
      PM_TEXT : {
         DISPLAY_TEXT : '提货券消费',
         ENTRY : {
            WIDGET_TITLE : '欢迎使用提货券消费程序',
            TASK_BTN_TEXT : '提货券消费'
         }
      },
      UI : {
         ENTRY : {
            T_TEXT : {
               GRID : '本处用来添加提货券，不需要的提货券右键删除'
            },
            STATUS : {
               USED : '已使用',
               UN_USED : '未使用'
            },
            MENU : {
               DELETE : '删除所选提货券'
            },
            ERROR_TYPE : {
               'App/ZhuChao/DeliveryOrderUse/Mgr' : {
                  10001 : '<span style="color:red;font-weight:bold;">此提货券不存在，是假券！</span>'
               }
            },
            REGEX_TEXT : {
               NO : '请输入正确的提货券编码',
               CODE : '请输入正确的提货券密码值'
            },
            BTNS : {
               ADD_ORDER : '保存订单',
               CLOSE_ORDER : '取消订单',
               ADD_NEW : '添加新的提货券',
               ADD : '添加',
               CLOSE : '关闭'
            },
            FIELDS : {
               EMPTY : '暂未添加提货券',
               COLLECTION : '提货券列表',
               NO : '提货券编码',
               CODE : '提货券验证码',
               PRICE : '面额',
               STATUS : '提货券状态',
               MERCHANT : '选择商家',
               TOTAL_PRICE : '订单金额(单位:元)',
               GOODS_INFO : '订单详情',
               REAL_PRICE : '实际用券金额(单位:元)',
               PAR_PRICE : '提货券面额(单位:元)',
               DELETE_PRICE : '实际优惠(单位:元)',
               WIN_TITLE : '请输入提货券',
               LAST_USED_MERCHANT : '最近下单商家',
               NAME : '商家名称',
               MERCHANT_ID : '商家id',
               ATTACH : '相关附件',
               LEGAL_PERSON : '店铺法人',
               AUTHORIZER : '授权人',
               ADDRESS : '店铺地址'
            },
            MSG : {
               ADDING : '正在增加订单...',
               ADD_SUCCESS : '已完成下单操作！&nbsp;&nbsp;&nbsp;<br>总金额：{0}元<br>提货券面额：{1}元<br>实际用券：{2}元<br>实际优惠：{3}元',
               READY : '确定不需要进行其他操作了吗？',
               RESET : '你确定要取消下单？<span style="color:red;">（此操作不可恢复！）</span>',
               CHECKING : '正在为您检查当前提货券...',
               USED : '此提货券已经使用，请更换新的提货券',
               INVALID : '当前订单已经失效，请更换新的提货券',
               ADDED : '此提货券已经添加过了！',
               MERCHANT_ERROR : '请选择正确的商家！',
               PRICE_ERROR : '请填写正确的订单金额',
               ADD : '是否添加提货券?',
               SUCCESS : '提货券添加成功!'
            }
         }
      },
      COMP : {
         IMAGE_GROUP : {
            BTNS : {
               UPLOAD : '上传图片'
            },
            MSG : {
               TITLE : '提示信息',
               DELETE : '您确定要删除 <span style="color:red">{0}</span> 吗?'
            },
            CONTEXT_MENU : {
               CANCEL : '取消设为封面',
               SET : '设为封面',
               CONFIG : '配置详细信息',
               DELETE : '从图集中删除'
            },
            CONFIG_WINDOW : {
               TITLE : '图片简介修改窗口',
               FIELD_LABEL : '图片简介',
               SPACE : '空间'
            },
            INVALID_TEXT : {
               EMPTY : '图集信息不能为空',
               NO_COVER : '必须选择一个图片作为封面',
               NO_DESCRIPTION : '必须为每一个图片添加描述'
            }
         }
      }
   }
});

