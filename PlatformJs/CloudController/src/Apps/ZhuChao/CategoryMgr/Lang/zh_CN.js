/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 筑巢商品分类语言包
 */
Ext.define('App.ZhuChao.CategoryMgr.Lang.zh_CN', {
    extend : 'Cntysoft.Kernel.AbstractLangHelper',
    data : {
        PM_TEXT : {
            DISPLAY_TEXT : '商品分类管理',
            ENTRY : {
                WIDGET_TITLE : '欢迎使用分类管理程序',
                TASK_BTN_TEXT : '商品分类管理'
            }
        },
        COMP : {
            CATEGORY_TREE : {
                ROOT_NODE : '商品分类',
                PANEL_TITLE : '商品分类面板'
            },
            QUERY_ATTR_GRID : {
                BTN : {
                    ADD : '添加查询属性'
                },
                COLS : {
                    ID : 'ID',
                    NAME : '属性名称',
                    NODE : '所属节点',
                    GROUP : '属性分组'
                },
                MENU : {
                    DELETE : '删除选中属性'
                }
            },
            NORMAL_ATTR_PANEL : {
                TITLE : '属性组面板',
                BTN : {
                    ADD_GROUP : '添加属性组',
                    ADD_ATTR : '添加属性',
                    MODIFY_GROUP_NAME : '修改分组名称'
                },
                COLS : {
                    NAME : '属性名称',
                    OPT_VALUE : '可选属性值',
                    REQUIRED : '是否必须'
                },
                MENU : {
                    DELETE : '删除选中属性'
                },
                MSG : {
                    EMPTY_TEXT : '暂时没有属性'
                },
                DEFAULT_GROUP_NAME : '基本参数',
                ERROR : {
                    GROUP_ALREADY_EXIST : '属性分组 <span style = "color:blue">{0}</span> 已经存在'
                }
            },
            NORMAL_ATTR_WINDOW : {
                TITLE : '普通属性添加/修改窗口',
                FIELDS : {
                    NAME : '属性名称',
                    OPT_VALUE : '可选属性值',
                    GROUP : '属性分组',
                    REQUIRED : '是否必须'
                }
            },
            NORMAL_ATTR_GROUP_WINDOW : {
                TITLE : '普通属性添加/修改窗口',
                FIELDS : {
                    GROUP_NAME : '属性分组的名称'
                }
            },
            STD_ATTR_WINDOW : {
                TITLE : '规格属性添加/修改窗口',
                FIELDS : {
                    NAME : '规格名称',
                    OPT_VALUE : '可选属性值',
                    REQUIRED : '是否必须'
                }
            },
            COLOR_ATTR_ITEM_WINDOW : {
                TITLE : '自定义颜色规格属性添加/修改窗口',
                FIELDS : {
                    COLOR_NAME : '颜色名称'
                }
            },
            QUERY_ATTRS_WINDOW : {
                TITLE : '分类查询属性添加/修改窗口',
                FIELDS : {
                    ATTR_NAME : '属性名称',
                    ATTR_VALUES : '属性可选值'
                }
            },
            STD_ATTR_GRID : {
                TITLE : '商品规格面板',
                BTN : {
                    ADD : '添加规格'
                },
                COLS : {
                    NAME : '规格名称',
                    OPT_VALUE : '可选属性值',
                    REQUIRED : '是否必须'
                },
                MENU : {
                    DELETE : '删除选中属性',
                    DELETE_COLOR_ATTR : '删除选择颜色属性'
                },
                COLOR_NAMES : [
                    ['粉红色', '#FFB6C1'],
                    ['红色', '#FF0000'],
                    ['酒红色', '#990000'],
                    ['橘色', '#FFA500'],
                    ['巧克力色', '#D2691E'],
                    ['浅黄色', '#FFFFB1'],
                    ['黄色', '#FFFF00'],
                    ['绿色', '#008000'],
                    ['深卡其布色', '#BAB361'],
                    ['浅绿色', '#98FB98"'],
                    ['深紫色', '#4B0082'],
                    ['军绿色', '#5D762A'],
                    ['天蓝色', '#1EDDFF'],
                    ['褐色', '#FF0000'],
                    ['浅灰色', '#E4E4E4'],
                    ['紫色', '#800080'],
                    ['紫罗兰色', '#DDA0DD'],
                    ['蓝色', '#0000FF'],
                    ['深蓝色', '#041690'],
                    ['深灰色', '#666666'],
                    ['白色', '#ffffff'],
                    ['黑色', '#000000'],
                    ['透明', '#fcfcfc']
                ],
                CUSTOM_COLOR : {
                    TITLE : '自定义颜色面板',
                    EMPTY_TEXT : '暂时没有添加自定义颜色',
                    COLS : {
                        NAME : '颜色名称'
                    },
                    BTN : {
                        ADD : '增加自定义颜色'
                    }
                },
                EMPTY_ATTR_TEXT : '暂时没有规格数据'
            }
        },
        ENTRY : {
            MENU : {
                ROOT : '添加一级分类',
                TOP : '添加二级分类',
                SUB : '添加详细分类',
                MODIFY_INFO : '修改分类信息',
                MODIFY_QUERY_ATTR : '修改分类查询属性'
            }
        },
        UI : {
            ATTRS : {
                WELCOME_PANEL : {
                    TITLE : '欢迎面板'
                },
                PATH_INFO : {
                    TITLE : '分类添加/修改面板',
                    FIELD : {
                        NAME : '分类名称',
                        ID : '分类ID',
                        IMG : '分类图标',
                        IDENTIFIER : '分类标识符'
                    },
                    BTN : {
                        ADD_QUERY_ATTR : '添加查询属性'
                    },
                    MSG : {
                        SAVE_OK : '保存分类节点成功'
                    }
                },
                QUERY_ATTR : {
                    TITLE : '分类查询条件添加/修改面板',
                    BTN : {
                        ADD_ATTR : '添加查询属性'
                    },
                    COLS : {
                        NAME : '属性名称',
                        OPT_VALUES : '属性值范围'
                    },
                    MSG : {
                        EMPTY_TEXT : '暂时没有属性'
                    },
                    MENU : {
                        MODIFY_ATTR : '修改当前属性值',
                        DELETE_ATTR : '删除选中属性'
                    }
                },
                DETAIL_PANEL : {
                    TITLE : '分类添加/修改面板',
                    FIELD : {
                        IDENTIFIER : '分类标识符',
                        NAME : '分类名称',
                        ID : '分类ID',
                        IMG : '分类图标',
                        UPLOAD : '上传图标'
                    },
                    MSG : {
                        SAVE_OK : '保存分类节点成功'
                    },
                    BTN : {
                        ADD_NORMAL_ATTR : '添加普通属性'
                    }
                }
            }
        }
    }
});