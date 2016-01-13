/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.CmMgr.Lang.zh_CN', {
    extend : 'Cntysoft.Kernel.AbstractLangHelper',
    data : {
        PM_TEXT : {
            DISPLAY_TEXT : '内容管理程序',
            ENTRY : {
                WIDGET_TITLE : '欢迎使用内容管理程序',
                TASK_BTN_TEXT : '内容管理程序'
            }
        },
        WIDGET_NAMES : {
            INFO_MANAGER : '信息管理',
            TRASHCAN : '信息回收站'
        },
        UI : {
            MODEL_LIST_VIEW : {
                TITLE : '系统模型列表',
                EMPTY_TEXT : '当前系统没有模型哦',
                COLS : {
                    ID : 'ID',
                    KEY : '模型识别KEY',
                    ICON : '图标',
                    NAME : '模型名称',
                    DESCRIPTION : '模型描述',
                    ITEM : '项目名称',
                    STATUS : '模型状态'
                },
                STATUS : {
                    YES : '正常',
                    NO : '禁用'
                },
                MENU : {
                    FIELD : '字段管理',
                    DELETE : '删除内容模型'
                },
                DELETE_MODEL_ASK : '您确定要删除内容模型<span style = "color:red">{0}</span>吗？操作不可逆，删除之后所有属于这个模型的信息就不能正常的浏览。'
            },
            QUERY_PANEL : {
                TITLE : '功能导航面板',
                FN_PANEL_TITLE : '模型添加管理',
                ADD_MODEL : '添加一个新的模型',
                MANAGER_CODEL : '模型管理列表'
            },
            META_INFO : {
                TITLE : '添加/修改内容模型',
                BASIC_PANEL : {
                    TITLE : '模型基本信息',
                    FIELDS : {
                        MODEL_NAME : '内容模型名称',
                        MODEL_KEY : '模型识别KEY',
                        ITEM_NAME : '数据项名称',
                        ITEM_UNIT : '数据项单位',
                        DESCRIPTION : '模型描述',
                        DEFAULT_TPL : '默认内容页模板',
                        DEFAULT_ICON : '默认内容模型图标',
                        SELECT_TPL : '从模板库中选择',
                        UPLOAD_ICON : '上传模型的图标',
                        EDITOR : '模型编辑器类名称',
                        DATA_DAVER : '模型数据保存类名称',
                        ENABLED : '是否启用'
                    },
                    T_TEXT : {
                        MODEL_KEY : '每个模型都有一个识别KEY， 必须是字母开头， 后面跟着字母或者数字，这个值必须保证唯一，<span style = "color:red">注意 : 这个值一旦设置就不能改变</span>',
                        ITEM_NAME : '数据项的名称， 例如：文章，软件，图片，书籍 , 等等',
                        ITEM_UNIT : '数据项的单位, 例如 : 篇，个， 条，等等',
                        DEFAULT_TPL : '内容模型信息显示的默认内容页模板',
                        DEFAULT_ICON : '内容模型的小图标<span style="color:red;">系统只支持png格式的图标</span>',
                        EDITOR : '内容模型发布信息时候的默认编辑器， 一般情况下我们不需要更改使用系统默认的编辑器就可以了，如果自定义的话请将编辑器类存放到内容模型管理的Editor文件夹下',
                        DATA_DAVER : '内容模型服务器端负责保存模型数据的程序名称，一般情况下不需要改变， 如果自定义的话请将对应的类存放到信息管理程序的SaverAdapter文件夹下面'
                    }
                },
                EXTRA_PANEL : {
                    TITLE : '模型自定义参数',
                    ADD_BTN : '添加额外参数',
                    EXTRA_KEY : '配置名称',
                    EXTRA_VALUE : '配置值',
                    DELETE : '删除此配置项',
                    DELETE_EXTRA_ASK : '您确定要删除此配置项吗？如果系统在依赖这个选项，那么系统中这个模型相关的功能可能收到影响。如果删除之后有影响，您可以再加入此配置项。'
                },
                M_KEY_EXIST : '此内容模型的识别KEY已经存在',
                EXTRA_CFG_KEY_EXIST : '额外配置项 <span style = "color : blue">{0}</span> 已经存在',
                MODEL_KEY_EMPTY : '模型KEY不能为空'
            },
            FIELD_LIST_VIEW : {
                TITLE : '模型字段管理',
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
                DELETE_ASK : '您确定要删除字段 <span style = "color : blue">{0}</span>吗？<span style = "color:red">注意：字段删除后不能恢复， 可能会影响这个模型信息的展示。</span>',
                ADD_FIELD : '添加模型字段',
                MODEL_PREVIEW : '模型编辑器预览',
                DRAG_TEXT : '拖动鼠标重新排序',
                SAVE_PRIORITY : '正在为您保存字段优先级数据 ... '
            },
            FIELD_EDITOR : {
                TITLE : '内容模型字段添加/修改',
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
                    ALIAS : '为这个字段填写一个描述性强的名称，这个值将在内容模型编辑器中充当该字段的左边的Label的值',
                    TYPE : '请选择字段类型， 一旦保存，字段的类型就不可以改变了，但是可以设置相关类型的参数。',
                    DESCRIPTION : '温馨提示，字段描述里面支持HTML代码',
                    VIRTUAL : '虚拟字段是只会在编辑器中出现的字段，这种字段不会在模型表中出现，后端系统通过这个字段的值进行一些判断。'
                },
                F_EXIST : '对不起字段识别KEY已经存在'
            },
            MODEL_PREVIEW : {
                TITLE : '模型编辑器预览器'
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
            TITLE : {
                TITLE : '信息标题参数设置',
                FIELDS : {
                    WIDTH : '文本框宽度',
                    HEIGHT : '文本框高度'
                }
            },
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
                },
                T_TEXT : {
                    REGEX : '输入正确的正则表达式，不带分割符号'
                }
            },
            MULTI_LINE_TEXT : {
                TITLE : '多行文本选项设置面板',
                LEN_CHECK : '开启长度检查',
                FIELD_LENGTH : '设置字段长度',
                T_TEXT : {
                    LENGTH : '请填写您期望的长度，系统将会在内容编辑器中按照您填写的值进行长度检查。<span style = "color:red">注意，这个检查仅仅是在客户端。</span>'
                }
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
这个选项。</br> <span style ="color:red">注意 : 如果不勾选而数据长度不够容纳多项选择所有可能的值时候，可能导致模型编辑器保存信息时候出错。</span>\n\
</br><span style = "color:blue">勾选后选项数目不能改变，但是选项名称和选项值可以改变，但是还是要避免数据溢出</span>'
                }
            },
            WORD_EDITOR : {
                TITLE : '文字编辑器界面参数设置面板',
                T_TEXT : {
                    WIDTH : '这里的宽度代表百分比'
                },
                TYPE : {
                    SIMPLE : '简洁型编辑器',
                    STANDARD : '标准型编辑器',
                    FULL : '全功能型编辑器'
                },
                EDITOR_TYPE : '编辑器类型'
            },
            COVER_IMAGE : {
                TITLE : '封面图片界面参数设置面板'
            },
            CHECKBOX : {
                TITLE : '复选框界面参数设置面板',
                IS_SELECTED : '默认勾选'
            },
            FILE_SIZE : {
                TITLE : '文件大小节点参数设置面板'
            },
            NUMBER : {
                TITLE : '数字输入框UI参数设置面板',
                MAX : '最大值',
                MIN : '最小值',
                CHECK_DOMAIN : '检查范围',
                STEP : '步数'
            },
            DATE : {
                TITLE : '日期选择器UI参数设置面板',
                FORMAT : '日期显示格式'
            },
            COLOR : {
                TITLE : '颜色选择器UI参数设置面板',
                SELECT_BTN : '选择颜色',
                MSG : {
                    NOT_COLOR : '颜色值不正确, 缺少#',
                    WRONG_LEN : '颜色值不正确, 长度不正确',
                    NOT_0X : '颜色值不正确, 位置 {0} 的字符不是16进制'
                }
            },
            DICT_SELECTION : {
                TITLE : '数据字典选择器UI参数设置面板',
                KEY_TYPE : '数据字典关联键',
                MULTI_SELECT : '是否多选',
                TEXT_WIDTH : '文本框宽度',
                DATA_LEN : '数据字段长度',
                BTN_TEXT : '选择按钮名称',
                T_TEXT : {
                    KEY_TYPE : '选择这个组件的目标显示的数据字典识别KEY，如果没有您想要的您可以去 <span style = "color : blue"><strong>附件管理/键值数据字典</strong></span>中进行添加',
                    DATA_LEN : '注意这个选项很重要， 当是单选的时候，长度只要设定成最长的那个选项的长度，但是在多选的时候，一定要设置成总选项的80%以上，以降低数据溢出的可能性，保存后不可以修改。',
                    BTN_TEXT : '这个也就是文本框右边的选择按钮的文本'
                }
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
            //Category.js
            CATEGORY : {
                MSG : '选择模型匹配的节点',
                NO_PERMISSION : '您没有在当前节点发表信息的权限'
            },
            //CategoryTree.js
            CATEGORY_TREE : {
                TITLE : '系统节点树'
            },
            //ContentPageType.js
            CONTENT_PAGE_TYPE : {
                FIELD_LABEL : '分页方式',
                TYPES : {
                    NONE : '无',
                    HAND : '手动分页'
                },
                LABEL : '编辑器中有插入分页符选项，直接点击即可(请不要修改编辑器分页符的源码)'
            },
            //CoverImage.js
            COVER_IMAGE : {
                BTNS : {
                    UPLOAD : '上传图片',
                    SELECT : '从已上传文件中选择',
                    INTERNET : '添加网络图片'
                },
                MSG : {
                    LOADING : '正在为您保存图片...',
                    TITLE : '提示信息',
                    ERROR : '图片的网址不正确'
                },
                ERROR : {
                    DATA_NOT_OBJECT : '传入的不是Object！'
                },
                INVALID_TEXT : {
                    EMPTY : '图集信息不能为空'
                }
            },
            //ImageGroup.js
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
            },
            //InternetPicWindow.js
            INTERNET_PIC_WINDOW : {
                TITLE : '网络图片',
                FIELDS : {
                    TEXT : '图片Url地址',
                    CHECK : '是否下载到本地'
                },
                BTNS : {
                    ADD : '添加',
                    DELETE : '删除'
                },
                MSG : {
                    BLANK : '图片地址不能为空',
                    ERROR : '图片地址不正确'
                }
            },
            //Keyword.js
            KEYWORDS : {
                ITEMS : {
                    BTN : '自动获取',
                    LABEL : '正在获取关键字 ...'
                }
            },
            //SoftLocalServer.js
            SOFT_LOCAL_SERVER : {
                BTN : {
                    UPLOAD : '上传软件',
                    SELECT : '从已上传文件中选择',
                    INTERNET : '添加外部链接'
                },
                GRID : {
                    EMPTY_TEXT : '没有数据哦',
                    COLS : {
                        NAME : '地址名称',
                        URL : '软件下载地址列表',
                        IS_ENABLE : '启用'
                    },
                    RENDER : {
                        YES : '是',
                        NO : '否'
                    }
                },
                CONTEXT_MENU : {
                    EDIT : '修改',
                    DELETE : '删除'
                },
                ADD_WINDOW : {
                    TITLE : '软件外部链接地址窗口',
                    ITEMS : {
                        NAME : '本地服务器名称',
                        TEXT : '请输入软件地址',
                        CHECK : '是否启用'
                    },
                    SERVER_NAME : '外部链接'
                }
            },
            //SoftMirrorServer.js
            SOFT_MIRROR_SERVER : {
                FIELD_LABEL : '镜像下载地址',
                BTN : {
                    ADD : '添加镜像下载地址',
                    DELETE : '删除选中'
                },
                GRID : {
                    COLS : {
                        NAME : '镜像名称',
                        URL : '镜像下载地址列表',
                        IS_ENABLE : '启用'
                    },
                    EMPTY_TEXT : '没有数据哦',
                    RENDER : {
                        YES : '是',
                        NO : '否'
                    }
                },
                CONTEXT_MENU : {
                    DELETE : '删除',
                    EDIT : '修改'
                },
                INFO_ADD_WINDOW : {
                    TITLE : '镜像服务器添加窗口',
                    LABELS : {
                        TEXT : '镜像链接名称',
                        FIELD : '链接地址'
                    },
                    BLANK_TEXT : {
                        NAME : '镜像名称不能为空',
                        URL : '镜像地址不能为空'
                    },
                    BTN : '选择镜像服务器',
                    CHECK : '是否启用',
                    NAME : '镜像服务器'
                },
                LIST_VIEW : {
                    COLS : {
                        NAME : '镜像名称',
                        URL : '镜像地址'
                    },
                    NAMES : {
                        DISK115 : '115网盘',
                        VDISK : '微盘'
                    }
                }
            },
            //RelativeInfo.js
            RELATIVE_INFO : {
                LABEL : '相关信息',
                BTN : '添加相关信息',
                GRID : {
                    COLS : {
                        ID : 'ID',
                        TITLE : '信息标题'
                    },
                    EMPTY : '没有数据哦，点击上面的按钮添加数据...'
                },
                DELETE : '删除',
                LABEL_TEXT : '点右键删除已添加的相关信息，支持按住 Ctrl 多选'
            },
            //InfoSelectWindow.js
            INFO_SELECT_WINDOW : {
                TITLE : '相关信息选择窗口',
                GRID : {
                    COLS : {
                        ID : 'ID',
                        TITLE : '信息标题'
                    }
                }
            },
            //Status.js
            STATUS : {
                ITEMS : {
                    DRAFT : '草稿',
                    VERIFY : '终审通过',
                    REJECTION : '退稿',
                    PEEDING : '等待审核'
                }
            },
            //Title.js
            TITLE : {
                FIELD_LABEL : '标题',
                ITEMS : {
                    BLANK_TEXT : '标题不能为空',
                    BTN : '检查标题唯一性'
                },
                MSG : {
                    CHECKING : '正在检测标题重复性...',
                    INVALID : '信息标题已经存在',
                    TITLE : '系统提示',
                    ERROR : '检测出错请稍候再试',
                    LAST : '还剩 {0} 个字符',
                    NOT_DIRTY : '标题没有改变，不需要检查'
                }
            },
            //Color.js
            COLOR : {
                ITEMS : {
                    BTN : '选择颜色'
                },
                MSG : {
                    NOT_COLOR : '颜色值不正确, 缺少#',
                    WRONG_LEN : '颜色值不正确, 长度不正确',
                    NOT_0X : '颜色值不正确, 位置 {0} 的字符不是16进制'
                }
            },
            //MultiLineText.js
            MULTI_LINE_TEXT : {
                MSG : {
                    NULL : '您还可以输入 0 个字符',
                    CURRENT : '您还可以输入 {0} 个字符'
                }
            },
            //TplSelectWindow.js
            TPL_SELECT_WINDOW : {
                TITLE : '模板选择窗口'
            },
            //TplSelecter.js
            TPL_SELECTER : {
                FIELD_LABEL : '内容页模板',
                BTN : '选择模板'
            },
            //SelectLocalFileWindow.js
            SELECT_LOCAL_FILE : {
                TITLE : '文件选择器',
                ERROR : {
                    EMPTY_SELECT : '您没有选中任何文件！'
                }
            },
            WORD_EDITOR : {
                MSG : {
                    EMPTY : '内容不能为空！',
                    LEN_OVERFLOW : '编辑器长度超出限制'
                }
            },
            FILE_DOWNLOADER : {
                COLS : {
                    NAME : '名称',
                    URL : '下载地址'
                },
                ADD_FILE : '添加文件',
                EMPTY_TEXT : '没有数据哦..',
                WIN : {
                    TITLE : '文件上传窗口',
                    FILE_NAME : '文件名称',
                    FILE_URL : '文件下载地址',
                    UPLOAD : '上传文件',
                    BTNS : {
                        ADD : '添加',
                        CANCEL : '取消'
                    }
                },
                MENU : {
                    MODIFY : '修改信息',
                    DELETE : '删除信息'
                }
            }
        },

        ABSTRACT_EDITOR : {
            WIN_TITLE : '系统标准内容模型编辑器窗口',
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
            Title : '标题',
            SingleLineText : '单行文本',
            MultiLineText : '多行文本',
            Color : '颜色选择器',
            Selection : '选项',
            WordEditor : '文字编辑器',
            CoverImage : '封面图片设置',
            Checkbox : '复选框 (是/否)选项',
            Keywords : '标题关键字',
            Status : '信息状态',
            FileSize : '文件大小',
            Number : '数字输入框',
            Date : '日期选择器',
            DictSelection : '数据字典选择器'
        },

        ENTRY : {

        },
        ERROR_MAP : {
            'App/Site/CmMgr/Mgr' : {
                10011 : '指定的内容模型编辑器不存在，请检查'
            }
        }
    }
});