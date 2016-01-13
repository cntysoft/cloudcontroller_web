/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Ui.Lang.zh_CN', {
   extend : 'Cntysoft.Kernel.AbstractLangHelper',
   data : {
      PM_TEXT : {
         DISPLAY_TEXT : '风格管理',
         ENTRY : {
            WIDGET_TITLE : '欢迎使用风格管理程序',
            TASK_BTN_TEXT : '风格管理'
         },
         TPL : {
            WIDGET_TITLE : '欢迎使用模板在线编辑程序',
            TASK_BTN_TEXT : '模板编辑'
         },
         Css : {
            WIDGET_TITLE : '欢迎使用皮肤在线编辑程序',
            TASK_BTN_TEXT : '皮肤Css编辑'
         },
         Js : {
            WIDGET_TITLE : '欢迎使用脚本在线编辑程序',
            TASK_BTN_TEXT : 'Js脚本编辑'
         },
         TAG : {
            WIDGET_TITLE : '欢迎使用标签管理程序',
            TASK_BTN_TEXT : '标签管理'
         }
      },
      WIDGET_NAMES : {
         TPL : '模板管理',
         CSS : '样式管理',
         JS : '脚本管理',
         TAG : '标签管理'
      },
      TAG : {
         CLASSIFY_TREE : {
            ROOT_NODE : '标签分类树',
            TITLE : '标签分类管理面板',
            NODE_TYPES : {
               Ds : '数据源标签分类',
               Label : '普通标签分类'
            },
            MENU : {
               CREATE_CLASSIFY : '创建新分类',
               RENAME_CLASSIFY : '修改分类名',
               DELETE_CLASSIFY : '删除分类',
               CREATE_TAG : '创建新标签'
            },
            MSG : {
               DELETE_CLASSIFY : '您确定要删除当前分类吗？此操作将删除此分类下的标签，操作不可逆。',
               DELETING : '正在删除所选分类......',
               CHANGE_SUCCESS : '标签分类修改成功！',
               DELETE_SUCCES : '标签分类删除成功！',
               NO_CHANGE : '没有修改，不用保存！'
            }
         },
         WELCOME : {
            TITLE : '欢迎使用系统标签管理程序',
            C_DATASOURCE : '数据源标签',
            D_DATASOURCE : '数据源标签可以在一个页面中实现一次取出多个数据， 避免多次查询数据库，在获取内容模型中经常使用'
         },
         LIST_VIEW : {
            EMPTY_TEXT : '没有标签哦',
            TITLE : '标签列表',
            COLS : {
               NAME : '标签名称',
               CLASS : '分类',
               DESCRIPTION : '标签简介',
               OP : '操作'
            },
            A_TEXT : {
               MODIFY_META : '修改元信息',
               MODIFY_CODE : '修改代码',
               DELETE : '删除',
               COPY : '复制'
            },
            MSG : {
               DELETE_ASK : '您确定删除标签 <span style = "color :red">{0}/{1}</span>, 删除之后不能恢复。'
            }
         },
         CLASSIFY_PANEL : {
            TITLE : '标签分类管理面板',
            FIELD_LABEL : {
               CLASSIFY : '分类名称',
               NAMESPACE : '命名空间'
            },
            BTN : {
               SAVE : '保存',
               RESET : '取消'
            },
            MSG : {
               BEFORE_CLOSE : '您有未保存的修改，确定关闭当前窗口？'
            },
            TOOLTIPTEXT : {
               CLASSIFY : '请输入需要的分类名称，此分类名要在本分类中唯一'
            }
         },
         TAG_EDITOR : {
            TITLE : '标签添加/修改面板',
            DS_META : {
               TITLE : '数据源标签元信息面板',
               FIELDS : {
                  NAME : '标签名称',
                  NS : '标签脚本名称空间',
                  DESCRIPTION : '标签简介',
                  CLASS : '标签脚本类名称'
               },
               TT_TEXT : {
                  NAME : '标签的名称必须在整个分类中保持唯一',
                  NS : '标签脚本类的名称空间，Label标签的基本名称空间是 <span style ="color:blue">\\TagLibrary\\Label</span>，并且名称空间要以字符开始',
                  CLASS : '标签脚本类名称，也就是在标签模板中 <span style = "color:blue">$this</span>指向的对象, 类名称一定\n\
要在自己的名称空间中保持唯一，否则出现类重复定义错误，并且类名称要以字符开始'
               },
               V_TEXT : {
                  CLASS : '标签脚本类名称只能包含字母和数字',
                  NS : '标签脚本类所属名称空间只能包含字母和数字'
               },
               B_TEXT : {
                  NAME : '标签名称不能为空',
                  TAG_CLS: '标签定义类不能为空'
               },
               ERROR : {
                  TAG_NAME_EXIST : '此标签名称已经存在，请重新填写',
                  TAG_CLS_EXIST : '标签定义类已经存在，请重新填写'
               }
            },
            LABEL_META : {
               TITLE : '普通标签元信息面板',
               FIELDS : {
                  NAME : '标签名称',
                  RUN_TYPE : '执行类型',
                  NS : '标签脚本名称空间',
                  DESCRIPTION : '标签简介',
                  STATIC : '静态标签',
                  CLASS : '标签脚本类名称'
               },
               TT_TEXT : {
                  NAME : '标签的名称必须在整个分类中保持唯一',
                  STATIC : '静态标签没有标签脚本，动态标签具有一个标签脚本，可以在脚本中定义本标签需要的数据\n\
和处理一些复杂的逻辑，这个函数可以在标签模板文件中进行调用',
                  NS : '标签脚本类的名称空间，Label标签的基本名称空间是 <span style ="color:blue">\\TagLibrary\\Label</span>，并且名称空间要以字符开始',
                  CLASS : '标签脚本类名称，也就是在标签模板中 <span style = "color:blue">$this</span>指向的对象, 类名称一定\n\
要在自己的名称空间中保持唯一，否则出现类重复定义错误，并且类名称要以字符开始'
               },
               V_TEXT : {
                  CLASS : '标签脚本类名称只能包含字母和数字',
                  NS : '标签脚本类所属名称空间只能包含字母和数字'
               },
               B_TEXT : {
                  NAME : '标签名称不能为空',
                  TAG_CLS: '标签定义类不能为空'
               },
               ERROR : {
                  TAG_NAME_EXIST : '此标签名称已经存在，请重新填写',
                  TAG_CLS_EXIST : '标签定义类已经存在，请重新填写'
               },
               ERROR_MAP : {
                  10012 : 'Label标签名称已经存在！'
               }
            },
            ATTRIBUTE : {
               TITLE : '标签文件管理',
               EMPTY_TEXT : '标签没有参数哦',
               COLS : {
                  NAME : '名称',
                  TYPE : '数据类型',
                  REQUIRED : '必要',
                  DEFAULT : '默认值',
                  DESCRIPTION : '属性描述'
               },
               YES : '是',
               NO : '否',
               MENU : {
                  DELETE : '删除该属性',
                  ADD_NEW : '添加新属性',
                  RESTORE : '还原修改'
               },
               ATTR_WIN : {
                  TITLE : '属性添加/修改窗口',
                  TYPE_EMPTY_TEXT : '请选择数据类型'
               },
               DELETE_ATTR__ASK : '您确定要删除属性<span style ="color:red">{0}</span>吗？操作不可逆',
               ATTR_NAME : '属性名称不能为空',
               ATTR_NAME_EXIT : '属性名称已经存在，请重新填写'
            },
            CANCEL_ASK : '您确定要关闭标签元信息编辑面板吗？',
            NEXT_STEP : '下一步',
            PRE_STEP : '上一步',
            MSG : {
               CREATE_OK : '恭喜您，标签创建成功',
               SAVE_OK : '恭喜您，标签元信息保存成功'
            }
         },
         TAG_FS_VIEW : {
            TITLE : '标签文件管理器',
            MSG : {
               CANNOT_DELETE_FILE : '标签定义文件不能删除！',
               CANNOT_DELETE_FILES : '要删除的文件包含标签定义文件，标签定义文件不能删除！'
            }
         }
      },
      COMP : {
         TAG_CLASSIFY : {
            EMPTY_TEXT : '请选择标签分类',
            FIELD_NAME : '标签分类'
         },
         CATEGORY_COMBO : {
            SELECT_NODE : '请选择标签目标栏目'
         },
         TAG_CLASSIFY_TREE : {
            TITLE : '标签选择面板'
         },
         TAG_GEN_WINDOW : {
            TITLE : '标签生成器窗口',
            CATEGORY_COMBO : '不限定节点',
            CATEGORY_COMBO_TEXT : '请选择节点',
            MSG : {
               NODE_ERROR : '请选择正确的节点',
               MODEL_ERROR : '请选择正确的内容模型'
            }
         }
      }
   }
});