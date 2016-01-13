/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.MetaInfo.Lang.zh_CN', {
    extend : 'Cntysoft.Kernel.AbstractLangHelper',
    data : {
        PM_TEXT : {
            DISPLAY_TEXT : '元信息管理',
            ENTRY : {
                WIDGET_TITLE : '欢迎使用系统元信息管理',
                TASK_BTN_TEXT : '元信息管理'
            },
            KVDICT : {
                WIDGET_TITLE : '欢迎使用系统数据字典程序',
                TASK_BTN_TEXT : '数据字典'
            }
        },
        WIDGET_NAMES : {
            KVDICT : '数据字典'
        },
        KVDICT_MANAGER : {
            TREE_PANEL : {
                TITLE : '映射类型面板',
                ROOT : '所有映射类型',
                MENU : {
                    ADD : '增加一个字典类型',
                    DELETE : '删除当前字典类型',
                    MODIFY_MAP : '修改映射名称'
                }
            },
            MAP_ITEMS_EDITOR : {
                TITLE : '数据字典项编辑器',
                COL_NAMES : {
                    IS_DEFAULT : '默认',
                    ENABLE : '启用',
                    VALUE : '数据值'
                },
                EMPTY_TEXT : '没有数据哦， 您可以添加数据',
                BTN : {
                    SAVE : '保存数据',
                    ADD_NEW : '添加数据',
                    RESTORE : '还原修改'
                },
                RECORD_WIN : {
                    TITLE : '数据字典项添加窗口',
                    FIELDS : {
                        IS_DEFAULT : '是否默认',
                        ENABLE : '是否启用',
                        VALUE : '数据值'
                    }
                },
                MENU : {
                    DELETE_SEL : '删除选中项',
                    DELETE : '删除此数据项'
                },
                DELETE_ASK : '您确定要删除吗？'
            },
            MAP_EDITOR : {
                TITLE : '数据字典项编辑器',
                FIELDS : {
                    KEY : '映射项识别KEY',
                    NAME : '映射项名字'
                },
                T_TEXT : {
                    KEY : '映射项的名称不必须唯一, 最好是按照模块+APP识别KEY+用途描述',
                    NAME : '可以给映射项填写一个描述性的名字'
                }
            },
            DELETE_MAP_ASK : '您确定要删除数据字典项 <span style = "color:red">{0}</span>?'
        }
    }
});