/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Content.Lang.zh_CN', {
    extend : 'Cntysoft.Kernel.AbstractLangHelper',
    data : {
        PM_TEXT : {
            DISPLAY_TEXT : '内容管理程序',
            ENTRY : {
                WIDGET_TITLE : '欢迎使用内容管理程序',
                TASK_BTN_TEXT : '内容管理程序'
            },
            INFO_MANAGER : {
                WIDGET_TITLE : '欢迎使用内容管理程序,在这里支持添加/删除/修改文档',
                TASK_BTN_TEXT : '内容管理程序'
            },
            TRASHCAN : {
                WIDGET_TITLE : '回收站管理窗口',
                TASK_BTN_TEXT : '回收站管理'
            }
        },
        WIDGET_NAMES : {
            INFO_MANAGER : '信息管理',
            TRASHCAN : '信息回收站'
        },
        COMP : {
            CATEGORY_TREE : {
                ROOT_NODE : '系统栏目树'
            },
            REMOTE_IMAGE_SAVER : {
                SAVE_FILE : '正在为您保存文件 <span style = "color:red">{0}</span> , 请稍后 ... '
            }
        },

        INFO_MANAGER : {
            MSG : {
                CLOSE_WINDOW : '您还有模型发布器窗口没有关闭，可能造成数据丢失，请关闭发布器之后再关闭本窗口'
            }
        },
        TRASHCAN : {
            PANEL_TITLE_ALL : '系统所有文档'
        },
        LOAD_CE_MAP : '正在加载模型编辑器映射数据 ... ',
        UI : {
            IM : {
                CATEGORY_TREE : {
                    TITLE : '系统栏目树',
                    MENU : {
                        ADD : '添加',
                        ADMIN : '管理',
                        TRASHCAN_ADMIN : '回收站管理',
                        VIEW_NODE : '浏览节点'
                    }
                },
                VERIFY_EDIT_WINDOW : {
                    TITLE : '信息状态快速修改窗口',
                    ITEMS : {
                        DRAFT : '草稿',
                        REJECTION : '退稿',
                        VERIFY : '审核通过'
                    }
                },
                INFO_LIST_VIEW : {
                    PANEL_TITLE_ALL : '系统所有文档',
                    GRID_TITLE : {
                        ALL : '所有信息',
                        DRAFT : '草稿',
                        PEEDING : '等待审核',
                        VERIFY : '已审核',
                        REJECTION : '退稿'
                    },
                    COLS : {
                        ID : 'ID',
                        TITLE : '标题',
                        EDITOR : '责任编辑',
                        HITS : '点击数',
                        PRIORITY : '优先级',
                        STATUS : '状态',
                        OP : '操作',
                        INPUTER : '录入者'
                    },
                    MENU : {
                        STATUS_CHANGE : '审核状态修改',
                        MODIFY_INFO : '修改文档',
                        DELETE_INFO : '删除文档',
                        VIEW_INFO : '查看文档',
                        PREVIEW_INFO : '前台预览文档',
                        BATCH_DELETE : '删除选中信息',
                        BATCH_CHANGE_INFO_STATUS : '批量修改审核状态'
                    },
                    TOOLTIP : {
                        VIEW_INFO : '查看文档内容',
                        MODIFY_INFO : '修改文档内容',
                        DELETE_INFO : '删除文档'
                    },
                    MSG : {
                        STATUS_MAP : {
                            '0' : '未知状态',
                            '1' : '<span style="color:blue">草稿</span>',
                            '2' : '<span style="color:orange">等待审核</span>',
                            '3' : '<span style="color:green">审核通过</span>',
                            '4' : '<span style="color:red">退稿</span>'
                        },
                        EMPTY : '没有数据',
                        DELETE_INFO_TPL : '您确定要删除ID为<span style="color:blue"> {0} </span>的信息吗？',
                        OP_SUCCESS_TPL : '成功将ID为 [ <span style="color:blue">{0}</span> ] 的信息移向回收站'
                    },
                    INFO_TYPE : {
                        ARTICLE : '文章',
                        SOFT : '软件',
                        ANNOUNCE : '公告',
                        IMAGE : '图片',
                        VIDEO : '视频'
                    }
                },
                STARTUP : {
                    TITLE : '内容管理提示页面',
                    D_TITLE : '欢迎使用可乐系统内容管理程序',
                    C_C_M : '右键菜单 :',
                    C_DELETE : '关于删除信息 :',
                    D_C_M : '在内容管理面板的右边的节点树或者在信息标题上点击右键，会有惊喜出现哦。',
                    D_DELETE : '当您在这里将一条信息删除之后，这条信息并不是真正的被删除啦， 还可以到回收站进行恢复。 '
                }
            },
            TRASHCAN : {
                //回收站信息管理
                STARTUP : {
                    TITLE : 'CMS内容管理回收站提示页面',
                    D_TITLE : '欢迎使用思维智能平台回收站管理程序',
                    C_C_M : '右键菜单 :',
                    C_DELETE : '关于删除信息 :',
                    C_RESTORE : '关于还原信息',
                    D_C_M : '在内容管理面板的右边的节点树或者在信息标题上点击右键，会有惊喜出现哦。',
                    D_DELETE : '如果您在这里面进行删除，那么删除的信息就完成消失了，所以要慎重哦 ',
                    D_RESTORE : '您可以在列表中还原删除的信息，这样信息又会在内容管理的列表中出现，但是信息的状态是未审核'
                },
                TREE_PANEL : {
                    TITLE : '网站栏目面板'
                },
                LIST_VIEW : {
                    BTN : {
                        DELETE_SELECT : '彻底删除选中信息',
                        RESTORE_SELECT : '还原选中信息',
                        CLEAR_TRASHCAN : '清空回收站',
                        RESTORE_ALL : '还原所有信息'
                    },
                    COLS : {
                        ID : 'ID',
                        TITLE : '标题',
                        EDITOR : '责任编辑',
                        HITS : '点击数',
                        STATUS : '状态'
                    },
                    TOOLTIP : {
                        DELETE_INFO : '删除文档',
                        RESTORE_INFO : '还原文档'
                    },
                    MENU : {
                        DELETE_SELECT : '彻底删除选中信息',
                        RESTORE : '还原选中信息'
                    },
                    MSG : {
                        DELETE : '被删除(回收站)',
                        DELETE_TPL : '您确定要彻底删除ID为 <span style="color:blue">{0}</span> 的信息 吗? <span style="color:red;">此操作不可恢复。</span>',
                        RESTORE_TPL : '您确定要还原ID为 <span style="color:blue">{0}</span> 的信息吗?',
                        DELETE_ALL : '您确定要清空回收站吗？此操作不可恢复。',
                        RESTORE_ALL : '您确定要还原回收站中所有的信息吗？',
                        EMPTY_STORE : '回收站中没有任何信息！'
                    }
                }
            }
        },
        ERROR_MAP : {
            'App/Site/Content/Manager' : {
                38 : '数据操作缺少响应的字段'
            }
        }
    }
});