/*
 * Cntysoft Cloud Software Team
 *
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 用户中心相关的常量
 */
Ext.define('App.ZhuChao.UserCenter.Lang.zh_CN', {
   extend : 'Cntysoft.Kernel.AbstractLangHelper',
   data : {
      PM_TEXT : {
         DISPLAY_TEXT : '会员管理',
         ENTRY : {
            WIDGET_TITLE : '欢迎使用会员管理程序',
            TASK_BTN_TEXT : '会员管理'
         },
         NORMAL: {
            WIDGET_TITLE: '欢迎使用用户管理程序',
            TASK_BTN_TEXT: '用户管理'
         },
         FOREMAN: {
            WIDGET_TITLE: '欢迎使用工长管理程序',
            TASK_BTN_TEXT: '用户管理'
         },
         DESIGNER: {
            WIDGET_TITLE: '欢迎使用设计师管理程序',
            TASK_BTN_TEXT: '用户管理'
         },
         DECORATOR : {
            WIDGET_TITLE : '欢迎使用装修公司管理程序',
            TASK_BTN_TEXT : '装修公司管理'
         },
         PROJECT : {
            WIDGET_TITLE : '欢迎使用项目管理程序',
            TASK_BTN_TEXT : '项目管理'
         },
         DESIGN_SCHEME : {
            WIDGET_TITLE : '欢迎使用设计方案管理程序',
            TASK_BTN_TEXT : '设计方案管理'
         }
      },
      WIDGET_NAMES: {
         NORMAL : '用户管理',
         DECORATOR : '装修公司管理',
         FOREMAN : '工长管理',
         DESIGNER : '设计师管理',
         PROJECT : '项目管理',
         DESIGN_SCHEME : '设计方案管理'
      },
      UI : {
         DECORATOR : {
            LIST_VIEW : {
               TITLE : '装修公司管理',
               EMPTY_TEXT : '没有任何装修公司',
               FIELDS : {
                  LOGO : '公司logo',
                  NICK_NAME : '公司名称',
                  IS_AUTHED : '是否认证',
                  STATUS : '用户状态',
                  ADDRESS : '详细地址',
                  SERVICE_AREA : '服务区域',
                  AUTH_NOT : '未认证',
                  AUTHED : '已认证'
               },
               STATUS_WIN : {
                  TITLE : '修改状态',
                  NORMAL : '正常',
                  LOCK : '锁定',
                  DELETE : '删除'
               },
               BTN : {
                  ADD_DECORATOR : '添加装修公司',
                  SAVE : '保存',
                  CLOSE : '关闭'
               },
               MENU : {
                  MODIFY : '修改',
                  STATUS : '审核状态'
               },
               MSG : {
                  STATUS_CHANGE : '正在修改用户状态...'
               }
            },
            INFO : {
               TITLE : '装修公司添加/修改面板',
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
               },
               MSG : {
                  LOAD_USER : '正在为您加载数据...',
                  SAVING : '正在为您保存数据...'
               }
            },
            BASE_INFO : {
               TITLE : '登陆信息',
               FIELDS : {
                  LOGO : '公司logo',
                  UPLOAD : '上传',
                  NICK_NAME : '公司名称',
                  NAME : '用户名',
                  PHONE : '手机号',
                  EMAIL : '邮箱',
                  PASSWORD : '密码',
                  REGISTER_TIME : '注册时间',
                  LAST_LOGIN_TIME : '上次登陆时间',
                  LAST_LOGIN_IP : '上次登陆ip',
                  STATUS : '状态',
                  STATUS_NORMAL : '正常',
                  STATUS_LOCK : '锁定',
                  STATUS_DELETE : '删除'
               },
               TOOLTIP_TEXT : {
                  NAME : '用来登陆的用户名',
                  PHONE : '可以用来登陆的用户手机号',
                  PASSWORD : '不修改请留空'
               }
            },
            BASIC_SETTING : {
               TITLE : '基本信息',
               FIELDS : {
                  PCD : '省市区',
                  EMPTY_TEXT : '请选择',
                  ADDRESS : '详细地址',
                  IS_AUTHED : '是否认证',
                  AUTH_NOT : '未认证',
                  AUTHED : '已认证',
                  BOND : '保证金',
                  TELEPHONE : '电话号码',
                  INTRO : '公司简介',
                  INTRODUCTION : '公司详细介绍',
                  LINK_US : '联系我们'
               },
               TOOLTIP_TEXT : {
                  TELEPHONE : '用来展示的电话号码，多个用英文逗号分割'
               }
            },
            SERVICE_SETTING : {
               TITLE : '服务信息',
               FIELDS : {
                  SERVICE_AREA : '服务区域',
                  HOME_EX : '家装专长',
                  PUBLIC_EX : '公装专长',
                  STYLE_EX : '风格专长',
                  UNDER_TAKE : '承接价位',
                  G_SERVICE : '售后服务评分',
                  G_DESIGN : '设计水平评分',
                  G_CONSTRUCTION : '施工质量评分',
                  G_TIME : '工期准时度评分'
               },
               TOOLTIP_TEXT : {
                  GRADE : '请填写0-10之间的数字，小数点后最多一位',
                  SERVICE_AREA : '请填入服务行政区域的名称，以英文逗号分割'
               }
            },
            CERTIFICATE_SETTING : {
               TITLE : '资质信息',
               FIELDS : {
                  BUSINESS : '营业执照',
                  QUALIFICATION : '资质证书',
                  HONOR : '荣誉证书',
                  OTHER : '其他'
               },
               MENU : {
                  DELETE : '删除图片'
               }
            },
            MEMBER_SETTING : {
               TITLE : '成员管理',
               FIELDS : {
                  NAME : '姓名',
                  DECORATOR : '装修公司',
                  AVATAR : '头像',
                  JOB : '工作职位',
                  CONCEPT : '设计理念',
                  TYPE : '所属分组',
                  INTRO : '个人介绍'
               },
               BTN : {
                  ADD_MEMBER : '增加成员',
                  SAVE : '保存',
                  CLOSE : '关闭'
               },
               TOOLTIP_TEXT : {
                  TYPE : '公司内部的成员分组'
               },
               EMPTY_TEXT : '该装修公司暂时没有成员',
               MENU : {
                  MODIFY : '修改',
                  DELETE : '删除'
               },
               MSG : {
                  LOAD_MEMBER : '正在为你加载数据...',
                  SAVING : '正在为你保存数据...',
                  DELETE : '你确定要删除这个公司成员？此操作不可恢复！'
               },
               MEMBER_EDITOR : {
                  TITLE : '成员编辑器'
               }
            }
         },
         PROJECT : {
            LIST_VIEW : {
               TITLE : '项目管理',
               EMPTY_TEXT : '没有任何装修项目记录',
               FIELDS : {
                  NAME : '项目名称',
                  CITY : '所在城市',
                  TYPE : '承包类型',
                  STYLE : '装修风格',
                  PRICE : '承包价格(单位:万元)',
                  STAGE : '所在阶段',
                  AREA : '项目面积',
                  START_TIME : '开始时间',
                  END_TIME : '结束时间',
                  TYPE_ALL : '全包',
                  TYPE_HALF : '半包',
                  TYPE_LITTLE : '清包',
                  STAGE_START : '准备开工',
                  STAGE_WATER : '水电阶段',
                  STAGE_MUD : '泥木阶段',
                  STAGE_PAINT : '油漆阶段',
                  STAGE_END : '竣工阶段'
               },
               BTN : {
                  ADD_PROJECT : '添加项目'
               },
               MENU : {
                  MODIFY : '修改',
                  DELETE : '删除'
               },
               MSG : {
                  DELETE : '你确定要删除这个项目？此操作不可恢复！',
                  DELETING : '正在删除所选的设计方案...'
               }
            },
            BASE_INFO : {
               TITLE : '基本信息',
               FIELDS : {
                  NAME : '项目名称',
                  COVER_IMAGE : '项目封面',
                  CITY : '所在城市',
                  TYPE : '承包类型',
                  STYLE : '装修风格',
                  PRICE : '承包价格(单位:万元)',
                  STAGE : '所在阶段',
                  AREA : '项目面积(单位:m²)',
                  START_TIME : '开始时间',
                  END_TIME : '结束时间',
                  SHOP_LIST : '购物清单',
                  PCD : '省市区',
                  ADDRESS : '详细地址',
                  EMPTY_TEXT : '请选择',
                  USER : '承包人',
                  USER_NORMAL : '普通用户',
                  USER_FOREMAN : '工长',
                  USER_DECORATOR : '装修公司',
                  USER_DESIGNER : '设计师',
                  TYPE_ALL : '全包',
                  TYPE_HALF : '半包',
                  TYPE_LITTLE : '清包',
                  STAGE_START : '准备开工',
                  STAGE_WATER : '水电阶段',
                  STAGE_MUD : '泥木阶段',
                  STAGE_PAINT : '油漆阶段',
                  STAGE_END : '竣工阶段'
               },
               MSG : {
                  SAVING : '正在为您保存数据...'
               }
            },
            INFO : {
               TITLE : '项目编辑器',
               FIELDS : {
                  NAME : '项目名称',
                  CITY : '所在城市',
                  TYPE : '承包类型',
                  STYLE : '装修风格',
                  PRICE : '承包价格(单位:万元)',
                  STAGE : '所在阶段',
                  AREA : '项目面积(单位:m²)',
                  START_TIME : '开始时间',
                  END_TIME : '结束时间',
                  SHOP_LIST : '购物清单',
                  PCD : '省市区',
                  ADDRESS : '详细地址',
                  EMPTY_TEXT : '请选择',
                  USER : '承包人',
                  USER_NORMAL : '普通用户',
                  USER_FOREMAN : '工长',
                  USER_DECORATOR : '装修公司',
                  USER_DESIGNER : '设计师',
                  TYPE_ALL : '全包',
                  TYPE_HALF : '半包',
                  TYPE_LITTLE : '清包',
                  STAGE_START : '准备开工',
                  STAGE_WATER : '水电阶段',
                  STAGE_MUD : '泥木阶段',
                  STAGE_PAINT : '油漆阶段',
                  STAGE_END : '竣工阶段',
                  SCHEME : '设计方案'
                },
               MSG : {
                  LOAD_PROJECT : '正在为您加载项目...',
                  SAVING : '正在为您保存数据...'
               }
            },
            STAGE_IMAGES : {
               TITLE : '项目图片',
               FIELDS : {
                  PREPARE : '准备阶段',
                  WATER_ELECTRICITY : '水电阶段',
                  MUD_WOOD : '泥木阶段',
                  PAINT : '油漆阶段',
                  FINISH : '竣工阶段'
               }
            },
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
         },
         DESIGN_SCHEME : {
            TITLE : '设计方案编辑器',
            LIST_VIEW : {
               TITLE : '设计方案管理',
               EMPTY_TEXT : '没有任何设计方案记录',
               FIELDS : {
                  NAME : '设计方案名称',
                  COVER : '设计方案封面',
                  INTRO : '设计理念',
                  INPUT_TIME : '添加时间',
                  HOUSE_TYPE : '户型',
                  STYLE : '风格',
                  AREA : '面积',
                  COLOR : '颜色'
               },
               BTN : {
                  ADD_DESIGN_SCHEME : '添加设计方案'
               },
               MENU : {
                  MODIFY : '修改',
                  DELETE : '删除'
               },
               MSG : {
                  DELETE : '你确定要删除这个项目？此操作不可恢复！',
                  DELETING : '正在删除所选的设计方案...'
               }
            },
            INFO : {
               TITLE : '设计方案编辑器',
               FIELDS : {
                  NAME : '设计方案名称',
                  COVER : '设计方案封面',
                  INTRO : '设计理念',
                  INPUT_TIME : '添加时间',
                  HOUSE_TYPE : '户型',
                  STYLE : '风格',
                  AREA : '面积',
                  COLOR : '颜色',
                  ORIGINAL_PIC : '原始结构图',
                  PLANAR_PIC : '平面结构图',
                  UPLOAD : '上传图片',
                  EMPTY_TEXT : '请选择',
                  USER : '承包人',
                  USER_NORMAL : '普通用户',
                  USER_FOREMAN : '工长',
                  USER_DECORATOR : '装修公司',
                  USER_DESIGNER : '设计师',
                  EFFECT_IMAGE : '效果图'
               },
               MSG : {
                  SAVING : '正在为您保存数据...'
               }
            },
            IMAGE_GROUP : {
               BTNS : {
                  UPLOAD : '上传图片',
                  SELECT : '从已上传图片中选择',
                  INTERNET : '添加网络图片'
               },
               MSG : {
                  LOADING : '正在为您保存图片，网络下载图片需要时间较长，请耐心等待......',
                  TITLE : '提示信息',
                  DELETE : '您确定要删除 <span style="color:red">{0}</span> 吗?',
                  ERROR : '图片的网址不正确',
                  SAVE_REMOTE_IMAGE : '系统正在保存 : <span style = "color:blue"> {0} </span>'
               },
               CONTEXT_MENU : {
                  CANCEL : '取消设为封面',
                  SET : '设为封面',
                  CONFIG : '配置详细信息',
                  DELETE : '从图集中删除'
               },
               CONFIG_WINDOW : {
                  TITLE : '图片简介修改窗口',
                  FIELD_LABEL : '图片简介'
               },
               INVALID_TEXT : {
                  EMPTY : '图集信息不能为空',
                  NO_COVER : '必须选择一个图片作为封面',
                  NO_DESCRIPTION : '必须为每一个图片添加描述'
               }
            }
         },
         NORMAL : {
           LIST_VIEW : {
              TITLE : '普通管理',
              EMPTY_TEXT : '没有普通用户',
              FIELDS : {
                 NICK_NAME : '用户昵称',
                 NAME : '登录名称',
                 PHONE : '手机号码',
                 QQ : 'QQ号码',
                 STATUS : '用户状态',
                 ID : 'ID'
              },
              STATUS_WIN : {
                 TITLE : '修改状态',
                 NORMAL : '<span style="color:green;">正常</span>',
                 LOCK : '<span style="color:blue">锁定</span>',
                 DELETE : '<span style="color:red;">删除</span>'
              },
              BTN : {
                 ADD_NORMAL : '添加普通用户',
                 SAVE : '保存',
                 CLOSE : '关闭'
              },
              MENU : {
                 MODIFY : '修改',
                 STATUS : '审核状态'
              },
              MSG : {
                 STATUS_CHANGE : '正在修改用户状态...'
              }
           },
           INFO : {
               TITLE : '普通用户添加/修改面板',
               MSG : {
                  LOAD_USER : '正在为您加载数据...',
                  SAVING : '正在为您保存数据...'
               }
            },
            BASIC_SETTING : {
               TITLE : '基本信息',
               FIELDS : {
                  AVATAR : '用户头像',
                  UPLOAD : '上传',
                  NICK_NAME : '用户昵称',
                  NAME : '用户名',
                  PHONE : '手机号',
                  EMAIL : '邮箱',
                  PASSWORD : '密码',
                  REGISTER_TIME : '注册时间',
                  LAST_LOGIN_TIME : '上次登陆时间',
                  LAST_LOGIN_IP : '上次登陆ip',
                  STATUS : '状态',
                  STATUS_NORMAL : '正常',
                  STATUS_LOCK : '锁定',
                  STATUS_DELETE : '删除'
               },
               TOOLTIP_TEXT : {
                  NAME : '用来登陆的用户名',
                  PHONE : '可以用来登陆的用户手机号',
                  PASSWORD : '不修改请留空'
               }
            },
            DETAIL_INFO : {
               TITLE : '详细信息',
               FIELDS : {
                  PCD : '住址',
                  EMPTY_TEXT : '请选择',
                  ADDRESS : '详细地址',
                  QQ : 'QQ号码',
                  SEX : '性别',
                  MAN : '男',
                  WOMAN : '女'
               }
            }
         },
         DESIGNER : {
           LIST_VIEW : {
              TITLE : '普通管理',
              EMPTY_TEXT : '没有设计师户',
              FIELDS : {
                 NICK_NAME : '用户昵称',
                 NAME : '登录名称',
                 PHONE : '手机号码',
                 QQ : 'QQ号码',
                 STATUS : '用户状态',
                 ID : 'ID'
              },
              STATUS_WIN : {
                 TITLE : '修改状态',
                 NORMAL : '<span style="color:green;">正常</span>',
                 LOCK : '<span style="color:blue">锁定</span>',
                 DELETE : '<span style="color:red;">删除</span>'
              },
              BTN : {
                 ADD_NORMAL : '添加设计师用户',
                 SAVE : '保存',
                 CLOSE : '关闭'
              },
              MENU : {
                 MODIFY : '修改',
                 STATUS : '审核状态'
              },
              MSG : {
                 STATUS_CHANGE : '正在修改用户状态...'
              }
           },
           INFO : {
               TITLE : '设计师用户添加/修改面板',
               MSG : {
                  LOAD_USER : '正在为您加载数据...',
                  SAVING : '正在为您保存数据...'
               }
            },
            BASIC_SETTING : {
               TITLE : '基本信息',
               FIELDS : {
                  AVATAR : '用户头像',
                  UPLOAD : '上传',
                  NICK_NAME : '用户昵称',
                  NAME : '用户名',
                  PHONE : '手机号',
                  EMAIL : '邮箱',
                  PASSWORD : '密码',
                  REGISTER_TIME : '注册时间',
                  LAST_LOGIN_TIME : '上次登陆时间',
                  LAST_LOGIN_IP : '上次登陆ip',
                  STATUS : '状态',
                  STATUS_NORMAL : '正常',
                  STATUS_LOCK : '锁定',
                  STATUS_DELETE : '删除'
               },
               TOOLTIP_TEXT : {
                  NAME : '用来登陆的用户名',
                  PHONE : '可以用来登陆的用户手机号',
                  PASSWORD : '不修改请留空'
               }
            },
            DETAIL_INFO : {
               TITLE : '详细信息',
               FIELDS : {
                  PCD : '住址',
                  EMPTY_TEXT : '请选择',
                  ADDRESS : '详细地址',
                  QQ : 'QQ号码',
                  SEX : '性别',
                  SERVICE : '服务地区',
                  EXPERIENCE : '从业经验',
                  INTRO : '简介',
                  STYLE : '擅长风格',
                  TYPE : '擅长户型',
                  MAN : '男',
                  WOMAN : '女'
               }
            }
         },
         FOREMAN : {
           LIST_VIEW : {
              TITLE : '普通管理',
              EMPTY_TEXT : '没有工长',
              FIELDS : {
                 NICK_NAME : '用户昵称',
                 NAME : '登录名称',
                 PHONE : '手机号码',
                 QQ : 'QQ号码',
                 STATUS : '用户状态',
                 ID : 'ID'
              },
              STATUS_WIN : {
                 TITLE : '修改状态',
                 NORMAL : '<span style="color:green;">正常</span>',
                 LOCK : '<span style="color:blue">锁定</span>',
                 DELETE : '<span style="color:red;">删除</span>'
              },
              BTN : {
                 ADD_NORMAL : '添加工长用户',
                 SAVE : '保存',
                 CLOSE : '关闭'
              },
              MENU : {
                 MODIFY : '修改',
                 STATUS : '审核状态'
              },
              MSG : {
                 STATUS_CHANGE : '正在修改用户状态...'
              }
           },
           INFO : {
               TITLE : '工长添加/修改面板',
               MSG : {
                  LOAD_USER : '正在为您加载数据...',
                  SAVING : '正在为您保存数据...'
               }
            },
            BASIC_SETTING : {
               TITLE : '基本信息',
               FIELDS : {
                  AVATAR : '用户头像',
                  UPLOAD : '上传',
                  NICK_NAME : '用户昵称',
                  NAME : '用户名',
                  PHONE : '手机号',
                  EMAIL : '邮箱',
                  PASSWORD : '密码',
                  REGISTER_TIME : '注册时间',
                  LAST_LOGIN_TIME : '上次登陆时间',
                  LAST_LOGIN_IP : '上次登陆ip',
                  STATUS : '状态',
                  STATUS_NORMAL : '正常',
                  STATUS_LOCK : '锁定',
                  STATUS_DELETE : '删除'
               },
               TOOLTIP_TEXT : {
                  NAME : '用来登陆的用户名',
                  PHONE : '可以用来登陆的用户手机号',
                  PASSWORD : '不修改请留空'
               }
            },
            DETAIL_INFO : {
               TITLE : '详细信息',
               FIELDS : {
                  PCD : '住址',
                  EMPTY_TEXT : '请选择',
                  ADDRESS : '详细地址',
                  QQ : 'QQ号码',
                  SEX : '性别',
                  SERVICE : '服务地区',
                  EXPERIENCE : '从业经验',
                  INTRO : '简介',
                  TEAM : '团队人数',
                  MAN : '男',
                  WOMAN : '女'
               }
            }
         },
         MSG : {
             OVER_LENGTH : '最多只能选择5个.'
         }
      }
   }
});
