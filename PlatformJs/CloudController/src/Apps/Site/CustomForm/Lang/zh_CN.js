/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.CustomForm.Lang.zh_CN', {
    extend : 'Cntysoft.Kernel.AbstractLangHelper',
    data : {
        PM_TEXT : {
            DISPLAY_TEXT : '自定义表单管理程序',
            ENTRY : {
                WIDGET_TITLE : '欢迎使用自定义表单管理程序',
                TASK_BTN_TEXT : '自定义表单管理程序'
            }
        },
        UI : {
            FORM_LIST_VIEW : {
                TITLE : '自定义表单列表',
                EMPTY_TEXT : '当前系统没有自定义表单哦',
                COLS : {
                    ID : 'ID',
                    KEY : '表单识别KEY',
                    NAME : '表单名称',
                    DESCRIPTION : '表单描述',
                    ITEM : '项目名称',
                    STATUS : '表单状态'
                },
                STATUS : {
                    YES : '正常',
                    NO : '禁用'
                },
                MENU : {
                    FIELD : '字段管理',
                    DELETE : '删除表单',
                    INFO_MANAGE : '表单信息管理'
                },
                DELETE_MODEL_ASK : '您确定要删除表单<span style = "color:red">{0}</span>吗？操作不可逆，删除之后所有属于这个表单的信息就不能正常的浏览。'
            },
            QUERY_PANEL : {
                TITLE : '功能导航面板',
                FN_PANEL_TITLE : '表单添加管理',
                ADD_MODEL : '添加一个新的表单',
                MANAGER_CODEL : '表单管理列表'
            },
            META_INFO : {
                TITLE : '添加/修改表单',
                BASIC_PANEL : {
                    TITLE : '表单基本信息',
                    FIELDS : {
                        MODEL_NAME : '表单名称',
                        MODEL_KEY : '表单识别KEY',
                        ITEM_NAME : '数据项名称',
                        ITEM_UNIT : '数据项单位',
                        DESCRIPTION : '表单描述',
                        EDITOR : '表单编辑器类名称',
                        DATA_DAVER : '表单数据保存类名称',
                        ENABLED : '是否启用'
                    },
                    T_TEXT : {
                        MODEL_KEY : '每个表单都有一个识别KEY， 必须是字母开头(最好是大写字母)， 后面跟着字母或者数字，这个值必须保证唯一，<span style = "color:red">注意 : 这个值一旦设置就不能改变</span>',
                        ITEM_NAME : '数据项的名称， 例如：文章，软件，图片，书籍 , 等等',
                        ITEM_UNIT : '数据项的单位, 例如 : 篇，个， 条，等等',
                        EDITOR : '表单发布信息时候的默认编辑器， 一般情况下我们不需要更改使用系统默认的编辑器就可以了，如果自定义的话请将编辑器类存放到表单管理的Editor文件夹下',
                        DATA_DAVER : '表单服务器端负责保存表单数据的程序名称，一般情况下不需要改变， 如果自定义的话请将对应的类存放到信息管理程序的SaverAdapter文件夹下面'
                    }
                },
                M_KEY_EXIST : '此表单的识别KEY已经存在',
                MODEL_KEY_EMPTY : '表单KEY不能为空'
            },
            FIELD_LIST_VIEW : {
                TITLE : '表单字段管理',
                T_SYSTEM : '系统内置',
                T_USER : '自定义',
                COLS : {
                    ID : 'ID',
                    KEY : '识别KEY',
                    NAME : '字段名',
                    LEVEL : '级别',
                    FEILD_TYPE : '字段类型',
                    VIRTUAL : '虚拟',
                    REQUIRE : '必要',
                    DISPLAY : '显示',
                    DESCRIPTION : '描述'
                },
                MENU : {
                    MODIFY : '修改字段信息',
                    DELETE : '删除此字段'
                },
                DELETE_ASK : '您确定要删除字段 <span style = "color : blue">{0}</span>吗？<span style = "color:red">注意：字段删除后不能恢复， 可能会影响这个表单信息的展示。</span>',
                ADD_FIELD : '添加表单字段',
                FORM_PREVIEW : '表单编辑器预览',
                FORM_FRONT_PREVIEW : '表单前台预览',
                DRAG_TEXT : '拖动鼠标重新排序',
                SAVE_PRIORITY : '正在为您保存字段优先级数据 ... '
            },
            INFO_LIST_VIEW : {
               TITLE : '表单信息管理',
               COLS : {
                  ID : 'ID'
               },
               MENU : {
                  LOOK : '查看信息',
                  DELETE : '删除此信息'
               },
               STATUS_MAP : {
                  '0' : '<span style="color:blue">未阅</span>',
                  '1' : '<span style="color:orange">已阅</span>'
               }, 
               DELETE_ASK : '您确定要删除信息 <span style = "color : blue">{0}</span>吗？<span style = "color:red">注意：信息删除后不能恢复。</span>'
            },
            FIELD_EDITOR : {
                TITLE : '表单字段添加/修改',
                FIELDS : {
                    NAME : '字段识别KEY',
                    ALIAS : '字段名称',
                    DESCRIPTION : '字段描述',
                    REQUIRE : '是否必要',
                    DISPLAY : '是否显示在编辑器',
                    TYPE : '字段类型',
                    TYPE_S_BTN : '设置类型',
                    VIRTUAL : '是否虚拟'
                },
                T_TEXT : {
                    NAME : '请填写字段的识别KEY，这个值只能由字母和数字组成，可以在数据源标签通过如下语法获取 </br><span style = "color:blue">{Qs.Field group = "数据源ID" field = "字段识别KEY"/}</span> 获取相应的值。<span style = "color:red">注意 : 这个值一旦设置就不能修改.',
                    ALIAS : '为这个字段填写一个描述性强的名称，这个值将在表单编辑器中充当该字段的左边的Label的值',
                    TYPE : '请选择字段类型， 一旦保存，字段的类型就不可以改变了，但是可以设置相关类型的参数。',
                    DESCRIPTION : '温馨提示，字段描述里面支持HTML代码',
                    VIRTUAL : '虚拟字段是只会在编辑器中出现的字段，这种字段不会在表单表中出现，后端系统通过这个字段的值进行一些判断。'
                },
                F_EXIST : '对不起字段识别KEY已经存在'
            },
            FORM_PREVIEW : {
                TITLE : '表单编辑器预览器'
            },
            FIELD_TYPE_WIN : {
                TITLE : '字段类型设置窗口',
                TREE_PANEL : {
                    TITLE : '类型选择面板'
                }
            }
        },
        //字段类型设置器
        FIELD_OPT_SETTER : {
            WIDTH : '文本框宽度',
            HEIGHT : '文本框高度',
            DEFAULT : '默认值',
            EMPTY_HTML : '<div style = "color:#005675; font-size:15px;font-weight:bold;margin : 150px 0 0 50px">这个类型没有相关参数设置， 您可以点击保存进行选择</div>',
            SINGLE_LINE_TEXT : {
                TITLE : '单行文本参数设置面板',
                FIELDS : {
                    OPEN_VALIDATE : '开启验证',
                    ERROR : '出错提示',
                    VALIDATE_TYPE : '验证类型'
                },
                VALIDATOR_NAMES : {
                    EMAIL : '电子邮件',
                    URL : '网址',
                    ALPHA : '纯字母',
                    ALPHA_NUM : '字母数字',
                    SELF : '自定义'
                }
            },
            MULTI_LINE_TEXT : {
                TITLE : '多行文本选项设置面板'
            },
            SELECTION : {
                TITLE : '选项界面参数设置面板',
                COMBO : '下拉框选项',
                LIST : '多项选择列表',
                RADIO : '单选框集合',
                CHECKBOX : '复选框集合',
                SELECTION_TYPE : '选项类型',
                COL_SIZE : '一行显示列数',
                COLLECTION : '选项集合',
                ADD_NEW : '添加新的选项',
                DATA_TYPE : '数据类型',
                DENEY_CHANGE_ITEM : '创建后禁止选项数目变动',
                GRID : {
                    EMPTY : '暂时没有选项哦',
                    NAME : '选项名称',
                    VALUE : '选项值'
                },
                MENU : {
                    DELETE : '删除选中的项',
                    SET_DEFAULT : '设为默认值'
                },
                T_TEXT : {
                    GRID : '温馨提示，支持右键操作, 双击选项，可以原地修改选项相关的值',
                    DATA_TYPE : '请选择选项在数据库的类型，当前支持两种类型<br/>\n\
<span style = "color:blue">Text</span> 这种类型支持数据量比较大的选项，占用空间大</br>\n\
<span style = "color:blue">Varchar</span> 这种类型数据长度自己选择，灵活性高，根据需求指定数据长度',
                    DENEY_CHANGE_ITEM : '当数据类型选择<span style = "color:blue">Varchar</span>并且数据长度很紧凑的时候，我们必须勾选\n\
这个选项。</br> <span style ="color:red">注意 : 如果不勾选而数据长度不够容纳多项选择所有可能的值时候，可能导致表单编辑器保存信息时候出错。</span>\n\
</br><span style = "color:blue">勾选后选项数目不能改变，但是选项名称和选项值可以改变，但是还是要避免数据溢出</span>'
                }
            },
            CHECKBOX : {
                TITLE : '复选框界面参数设置面板',
                IS_SELECTED : '默认勾选'
            },
            DATE : {
                TITLE : '日期选择器UI参数设置面板',
                FORMAT : '日期显示格式'
            }
        },

        /*
         * 各种插件
         */
        FIELD_WIDGET : {
            BLANK_ERROR : '这个字段不能为空',
            //Selection.js
            SELECTION : {
                GRID : {
                    NAME : '选项名称',
                    VALUE : '选项值'
                },
                T_TEXT : {
                    GRID : '支持Ctrl键多选'
                }
            },
            //MultiLineText.js
            MULTI_LINE_TEXT : {
                MSG : {
                    NULL : '您还可以输入 0 个字符',
                    CURRENT : '您还可以输入 {0} 个字符'
                }
            }
        },

        ABSTRACT_EDITOR : {
            WIN_TITLE : '系统标准表单编辑器窗口',
            FORM : {
                BASIC : {
                    TITLE : '基本信息面板'
                },
                PROPERTY : {
                    TITLE : '信息属性选项',
                    FIELDS : {
                        HITS : '点击数',
                        DAY_HITS : '日点击数',
                        WEEK_HITS : '周点击数',
                        MONTH_HITS : '月点击数',
                        UPDATE_TIME : '更新时间'
                    }
                }
            },
            MSG : {
                SAVE_FILE : '正在为您保存文件 <span style = "color:red">{0}</span> , 请稍后 ... '
            },
            ERROR : {
                NOT_DIRTY : '数据没有改变不需要提交！'
            }
        },

        FIELD_WIDGET_NAME_MAP : {
//            Title : '标题',
            SingleLineText : '单行文本',
            MultiLineText : '多行文本',
//            Color : '颜色选择器',
            Selection : '选项'
//            WordEditor : '文字编辑器',
//            CoverImage : '封面图片设置',
//            Checkbox : '复选框 (是/否)选项',
//            Keywords : '标题关键字',
//            Status : '信息状态',
//            FileSize : '文件大小',
//            Number : '数字输入框',
//            Date : '日期选择器',
//            DictSelection : '数据字典选择器'
        },
         SELECTION_TYPE : {
            1 : '下拉框选项',
            2 : '多项选择列表',
            3 : '单选框集合',
            4 : '复选框集合'
         },
        ENTRY : {

        },
        ERROR_MAP : {
            'App/Site/CustomForm/Mgr' : {
                10011 : '指定的表单编辑器不存在，请检查'
            }
        }
    }
});