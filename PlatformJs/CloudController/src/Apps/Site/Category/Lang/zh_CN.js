/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Category.Lang.zh_CN', {
   extend : 'Cntysoft.Kernel.AbstractLangHelper',
   data : {
      PM_TEXT : {
         DISPLAY_TEXT : '栏目管理程序',
         ENTRY : {
            WIDGET_TITLE : '欢迎使用栏目管理程序',
            TASK_BTN_TEXT : '栏目管理程序'
         },
         STRUCTURE : {
            WIDGET_TITLE : '站点栏目结构管理面板',
            TASK_BTN_TEXT : '站点栏目结构'
         },
         SORTER : {
            WIDGET_TITLE : '站点排序管理面板',
            TASK_BTN_TEXT : '站点栏目顺序'
         }
      },
      WIDGET_NAMES : {
         STRUCTURE : '栏目结构管理',
         SORTER : '栏目排序'
      },
      COMP : {
         CATEGORY_TREE : {
            ROOT_NODE : '系统栏目树'
         },
         CATEGORY_COMBO : {
            SELECT_NODE : '请选择栏目'
         }
      },
      LOCAL_IMAGE_SELECT_WIN_TITLE : '本地图片选择窗口',
      ERROR : {
         SELECT_EMPTY_IMG : '您当前没有选中任何图片'
      },
      STRUCTURE : {
         COMMON : {
            TITLE_TYPE : {
               ADD : '添加',
               EDIT : '修改'
            },
            LABEL : {
               //所有面板共用的
               ID : '栏目ID',
               PID : '所属栏目',
               OPEN_TYPE : '打开方式',
               ENABLE_BUILD : '是否生成静态',
               OPEN_TYPE_NEW : '在新窗口打开',
               OPEN_TYPE_ORG : '在原窗口打开',
               SHOW_ON_INDEX_MENU : '是否在顶部菜单显示',
               SHOW_ON_PARENT_LIST : '是否在父栏目列表显示',
               YES : '是',
               NO : '否',
               META_KEYWORDS : 'META关键词',
               META_DESCRIPTION : 'META描述',
               CHECK_NODE_IDENTIFIER : '检查唯一性',
               TIP_LABEL : {
                  CHECKING : '正在为您检查.......',
                  NOT_EXIST : '没有重复',
                  EXIST : '已经存在',
                  NOT_DIRTY : '栏目标识符没有改变',
                  EMPTY_IDENTIFIER : '栏目标识符为空'
               },
               SELECT_NODE_PIC_BTN : '选择图片',
               UPLOAD_NODE_PIC_BTN : '上传图片'

            },
            TOOLTIP : {
               //公共的数据项
               ID : '当前栏目的ID号',
               PID : '请选择当前创建栏目的父栏目',
               ENABLE_BUILD : '选择之后相关页面需要生成静态才能访问, 每次改变这个配置的时候，需要删除相关静态文件然后重新生成。',
               NODE_IDENTIFIER : '请填写这个栏目的标示符，这个值必须全局唯一',
               GENERAL_NODE_DIR : '请填写栏目文件夹名称， 这个文件夹文明必须在当前父栏目的孩子中唯一',
               SHOW_ON_INDEX_MENU : '该栏目是否在顶部导航菜单上显示，当一级栏目很多时，这个选项非常有用',
               SHOW_ON_PARENT_LIST : '该栏目是否在其父栏目模板页的栏目列表处显示，当子栏目很多的时候，可以选择该出现的子栏目',
               SHOW_ON_MAP : '该栏目是否在网站地图处显示',
               SHOW_ON_INDEX_LIST : '该栏目是否在首页栏目列表显示，首页模板可能会列举网站的栏目，这个选项控制栏目的显示',
               META_KEYWORDS : '针对搜索引擎设置的关键词',
               META_DESCRIPTION : '针对搜索引擎设置的网页描述'
            },
            MSG : {
               DELETE_ASK_TPL : '您确定要删除栏目：{0}</br>\n\
如果删除的是栏目栏目， 那么将会删除栏目栏目下面的<span style = "color:red">所有子栏目以及普通栏目栏目的所有信息，并且操作不可逆。</span>您删除前仔细考虑。',
               DELETE_SUCCESS : '栏目 : {0} 删除成功',
               CANCEL_EDIT : '您确定要返回到起始面板吗？',
               LOAD_NODE : '正在为您加载栏目数据,请稍候...',
               SAVE_ASK : '您确定要修改此栏目吗 ? ',
               EMPTY_TEXT : '该栏目没有子栏目哦',
               BLANK_TEXT : {
                  CONTENT_TPL : '内容模型的模板不能为空，请填写'
               },
               SELECT_NODE : '请选择栏目',
               SAVE_OK : '栏目信息保存成功！',
               TITLE : '信息提示窗口',
               MODELS_TPL_EMPTY : '必须为普通栏目至少选择一个信息模型！',
               DELETE_EXTRA_CONFIG : '您确定要删除吗？ （<span style="color: red;">您的系统中可能有其他程序需要此项配置，若是删除之后对系统有影响，请您恢复此项配置</span>）'
            }
         },
         SINGLE_TAB_PANEL : {
            TITLE : '基本配置选项',
            FRONT_STYLE_SETTING : {
               TITLE : '单页选项',
               LABEL : {
                  TEXT : '单页名称',
                  NODE_IDENTIFIER : '单页标识符',
                  DEFAULT_TPL_FILE : '单页模板',
                  DESCRIPTION : '单页描述'
               },
               TOOLTIP : {
                  DESCRIPTION : '您可以填写一些关于单页栏目的说明，支持HTML',
                  TPL : '请选择这个单页栏目的模板文件'
               },
               BLANK_TEXT : {
                  //单页栏目类型
                  TEXT : '单页名称是必填项，请您填写',
                  NODE_IDENTIFIER : '单页标识符是必填项，请您填写',
                  DEFAULT_TPL_FILE : '单页名称是必填项，请您填写'
               }
             },
            BASIC_SETTING : {
                TITLE : '基本配置选项',
                LABEL : {
                  TEXT : '单页名称',
                  NODE_IDENTIFIER : '单页标识符',
                  DEFAULT_TPL_FILE : '单页模板',
                  DESCRIPTION : '单页描述'
              },
              TOOLTIP : {
                  DESCRIPTION : '您可以填写一些关于单页栏目的说明，支持HTML',
                  TPL : '请选择这个单页栏目的模板文件'
              },
              BLANK_TEXT : {
                  //单页栏目类型
                  TEXT : '单页名称是必填项，请您填写',
                  NODE_IDENTIFIER : '单页标识符是必填项，请您填写',
                  DEFAULT_TPL_FILE : '单页名称是必填项，请您填写'
              }
             }
         },
         LINK_TAB_PANEL : {
            TITLE : '外部链接栏目信息',
            LABEL : {
               TEXT : '外部链接名称',
               NODE_IDENTIFIER : '外部链接标识符',
               URL : '外部链接地址'
            },
            TOOLTIP : {
               URL : '外部链接转向的地址',
               TEXT : '请您填写外部链接的名称'
            },
            BLANK_TEXT : {
               TEXT : '外部链接名称是必填项，请您填写',
               NODE_IDENTIFIER : '外部链接标识符是必填项，请您填写',
               URL : '外部链接转向的地址是必须填写的项目，请您填写'
            }
         },
         GENERAL_TAB_PANEL : {
            TITLE : '普通栏目信息',
            BASIC_SETTING : {
               TITLE : '基本配置选项',
               LABEL : {
                  TEXT : '栏目名称',
                  NODE_IDENTIFIER : '栏目标识符',
                  NODE_DIR : '栏目文件夹',
                  DESCRIPTION : '栏目说明',
                  META_KEYWORDS : '栏目META关键词',
                  META_DESCRIPTION : '栏目META描述'
               },
               BLANK_TEXT : {
                  TEXT : '栏目名称不能为空',
                  NODE_IDENTIFIER : '栏目标识符不能为空',
                  NODE_DIR : '栏目的文件夹名称不能为空',
                  LIST_TPL : '一个节点的列表页模板不能为空，请填写一个能用的列表也模板'
               },
               TOOLTIP : {
                  TEXT : '填写您要创建的栏目的名称,长度255个字符',
                  NODE_IDENTIFIER : '用于前台调用时可以直接用标识符取代ID，<span style="color:red;">不区分大小写</span>',
                  DESCRIPTION : '用于在栏目页详细介绍栏目信息，支持HTML',
                  META_KEYWORDS : '针对搜索引擎设置的关键词多个关键词请用,号分隔',
                  META_DESCRIPTION : '针对搜索引擎设置的网页描述多个描述请用,号分隔',
                  CONTENT_MODE : '系统内容模型'
               }
            },
            CATEGORY_OPT : {
               TITLE : '栏目选项'
            },
            TPL_SETTING : {
               TITLE : '模板选项',
               LABEL : {
                  LIST_TPL : '栏目列表页模板',
                  HOME_TPL : '栏目首页模板'
               },
               TOOLTIP : {
                  LIST_TPL : '请填写该节点的列表页模板',
                  HOME_TPL : '当某个节点下既有子节点又有仅属于此节点的内容时，可以指定栏目首页模板用于显示一个分类列表一样的封面页，同时指定列表页模板用于显示只属于此节点的内容列表。而一般情况下，我们都只需要指定列表页模板即可。在开启生成静态页时，如果这个栏目下的数据不够分页的话，即使指定了两个模板，也只能生成一个封面页。<span style= "color:red">注意此模板不支持分页！</span>'
               },
               BLANK_TEXT : {
                  LIST_TPL : '一个节点的列表页模板不能为空，请填写一个能用的列表也模板',
                  CONTENT_TPL : '内容模型的模板不能为空，请填写'
               },
               MSG : {
                  CONTENT_MODEL : '选择内容模型对应的内容页模板',
                  MODELS_TPL_EMPTY : '必须为普通节点至少选择一个信息模型！'
               }
            }
         },
         STARTUP : {
            TITLE : '栏目管理起始页',
            D_TITLE : '欢迎使用可乐内容管理系统栏目管理程序',
            C_GENERAL : '添加栏目 :',
            C_SINGLE : '添加单页栏目 :',
            C_LINK : '添加外部连接 :',
            D_GENERAL : ' 为方便归类管理，界面中将信息归类成“基本信息”、“栏目选项”、“模板选项”等书签式管理选项，以方便按快捷分类设置信息选项。在填写好相关信息后，单击页面底部“添加”按钮保存所添加的栏目。',
            D_SINGLE : ' 当网站中需要显示“联系方式”、“公司简介”、“版权声明”等无分类需求的单个信息页面时，可以添加单页栏目的方式来实现。',
            D_LINK : ' 外部链接是指在网站中添加栏目的链接地址为网站外部的地址。如在网站顶部导航中，显示“思维论坛”文字，链接地址为http://bbs.cntysoft.com/，以新窗口打开方式打开网址，则可添加外部链接栏目的方式来实现。'
         },
         CATEGORY_TREE : {
            TITLE : '栏目管理树面板',
            MENU : {
               ADD_SINGLE_NODE : '添加单页栏目',
               ADD_GENERAL_NODE : '添加普通栏目',
               ADD_LINK_NODE : '添加外部链接',
               RM_NODE : '删除栏目',
               VIEW_NODE : '查看栏目',
               MODIFY_NODE : '修改栏目'
            }
         }
      },
      SORTER : {
         TREE_TITLE : '栏目选择树面板',
         PANEL_TITLE : '栏目排序节点树面板',
         COLS : {
            ID : '节点ID',
            TEXT : '节点名称',
            NODE_TYPE : '节点类型'
         },
         N_TYPE_SINGLE : '单页节点',
         N_TYPE_LINK : '外部链接',
         N_TYPE_GENERAL : '普通节点',
         N_TYPE_INDEX : '首页',
         MSG : {
            EMPTY_TEXT : '该节点没有子节点哦',
            DRAG_TEXT : '拖动鼠标重新排序'
         }
      },
      ERROR_TYPE : {
         'App/Site/Category/Structure' : {
            10005 : '栏目标识符已经存在！'
         }
      }
   }
});