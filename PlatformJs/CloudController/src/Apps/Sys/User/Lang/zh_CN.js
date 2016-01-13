/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.User.Lang.zh_CN', {
   extend : 'Cntysoft.Kernel.AbstractLangHelper',
   data : {
      PM_TEXT : {
         DISPLAY_TEXT : '站点管理员管理',
         ENTRY : {
            WIDGET_TITLE : '欢迎使用站点管理员管理',
            TASK_BTN_TEXT : '管理员管理'
         },
         MEMBER : {
            WIDGET_TITLE : '欢迎使用管理员成员管理',
            TASK_BTN_TEXT : '成员管理'
         },
         ROLE_MGR : {
            WIDGET_TITLE : '欢迎使用管理员角色权限管理程序',
            TASK_BTN_TEXT : '角色权限管理'
         }
      },
      WIDGET_NAMES : {
         MEMBER : '成员管理',
         ROLE_MGR : '角色权限管理'
      },
      MEMBER : {
         BTN : {
            ADD_MEMBER : '添加管理员'
         }
      },
      ROLE_MGR : {
         TOP_BAR : {
            ADD_ROLE : '添加新角色',
            ROLE_GRANT : '授权相关',
            PERM_VIEW : '角色权限查看',
            PERM_GRANT : '角色授权赋予',
            ROLE_MEMBER_MGR : '角色成员管理',
            ROLE_LIST : '角色列表',
            ROLE_MGR : '角色相关'
         }
      },

      COMP : {
         ROLE_GRID_FIELD : {
            ADD_NEW : '添加新的角色',
            DELETE_SELECT : '删除选中角色',
            EMPTY_TEXT : '还没有选中角色哦',
            R_ID : '角色ID',
            R_NAME : '角色名称'
         },
         ROLE_LIST_WIN : {
            TITLE : '用户中心管理角色选择窗口',
            EMPTY_TEXT : '还没有选中角色哦',
            COLS : {
               ID : '角色ID',
               NAME : '角色名称'
            }
         },
         ROLE_TREE : {
            TITLE : '系统角色列表',
            ROOT : '所有角色'
         },
         PERM_RES_TREE : {
            ROOT : '系统APP权限资源树',
            HAS_DETAIL_TIP : '这个菜单具有详细权限设置, 当您勾选该项权限后，可以在节点上点击右键进行详细权限设置',
            DETAIL_TEXT : '具有详细权限',
            MENU : {
               EDIT_DETAIL : '设置详细权限'
            }
         }
      },

      UI : {
         MEMBER : {
            LIST_VIEW : {
               EMPTY_TEXT : '没有相关管理员',
               TITLE : '管理员列表管理面板',
               COLS : {
                  ID : 'ID',
                  ADMIN_NAME : '管理员名称',
                  ROLE : '角色',
                  MULTI_LOGIN : '多人登录',
                  LAST_LOGIN_IP : '最后登录IP',
                  LAST_LOGIN_TIME : '最后登录时间',
                  LAST_MODIFY_PSW_TIME : '最后修改密码时间',
                  LOGIN_TIMES : '登录次数',
                  STATUS : '状态'
               },
               SHOW_DETAIL_INFO : '查看详细信息',
               MODIFY : '修改管理员信息',
               DELETE : '删除此管理员',
               NO_RECORD : '暂未记录',
               LOCK_USER : '锁定该管理',
               UNLOCK_USER : '解除锁定',
               DELETE_USER_ASK : '您确定要删除管理员 <span style = "color:red">{0}</span> 吗？此操作不可逆。'
            },
            INFO_WIN : {
               TITLE : '管理员详细信息查看窗口',
               A_ID : '管理员ID',
               A_NAME : '管理员名称',
               ROLE : '角色',
               ENABLE_MULTI_LOGIN : '是否允许多人登录',
               LAST_LOGIN_IP : '最后登录IP',
               LAST_LOGIN_TIME : '最后登录时间',
               LAST_MODIFY_PWD_TIME : '最后修改密码时间',
               LOGIN_TIMES : '登录次数',
               STATUS : '管理员状态'
            },
            INFO_EDITOR : {
               TITLE : '管理员添加/修改面板',
               ADMIN : '管理员',
               PWD : '密码',
               R_PWD : '确认密码',
               ROLE : '角色设置',
               SUPER_ADMIN : '超级管理员',
               NORMAL_ADMIN : '普通管理员',
               ROLE_LIST : '角色列表',
               DEPARTMENT_LIST : '部门列表',
               STATUS : '帐号状态选项',
               MULTI_LOGIN : '允许多人同时使用此帐号登录',
               ALLOW_MODIFY_PWD : '允许管理员修改密码',
               LOCKED : '是否锁定',
               ADD_F_USER : '添加前台用户',
               CHANGE_PWD_TEXT : '不修改密码请留空',
               B_TEXT : {
                  NAME : '管理员名称不能为空',
                  PWD : '管理员密码不能为空'
               },
               ERROR : {
                  NAME_EXIST : '管理员 <span style = "color:blue">{0}</span> 已经存在',
                  F_NAME_FORMAT : '前端用户名必须是有效的电子邮件地址',
                  PWD_NOT_EQUAL : '两次输入密码不一致'
               },
               T_TEXT : {
                  SUPER_ADMIN : '拥有所有权限。某些权限（如管理员管理、网站信息配置、角色管理等管理权限）只有超级管理员才有',
                  NORMAL_ADMIN : '需要详细指定每一项角色权限'
               }
            }
         },
         ROLE_MGR : {
            LIST_VIEW : {
               TITLE : '角色管理列表',
               EMPTY_TEXT : '角色管理列表',
               DELETE_ASK : '您确定要删除角色 : <span style = "color:red">{0}</span> 吗?',
               COLS : {
                  ID : 'ID',
                  ROLE_NAME : '角色名称',
                  MEMBER_NUM : '成员个数',
                  DESCRIPTION : '角色描述',
                  OP : '角色操作'
               },
               //据色操作的按钮
               A_TEXT : {
                  M_MANAGER : '成员管理',
                  MODIFY : '修改角色信息',
                  DELETE : '删除角色'
               },
               T_TEXT : {
                  M_MANAGER : '给该角色添加成员',
                  MODIFY : '修改角色相关信息',
                  DELETE : '删除此角色'
               }
            },
            INFO_EDITOR : {
               TITLE : '角色添加/修改面板',
               BTN : {
                  SAVE : '保存',
                  BACK : '返回角色列表'
               },
               ROLE_NAME : '角色名称',
               B_TEXT : {
                  ROLE_NAME : '角色名称不能为空'
               },
               DESCRIPTION : '角色说明'
            },
            PERM_GRANT : {
               TITLE : '角色权限授权管理面板',
               CURRENT : '当前角色 >> ',

               BTN : {
                  SAVE : '保存授权数据',
                  RESET : '还原选择',
                  RETURN : '返回角色列表'
               },
               NO_NEED_SAVE : '权限选择没有改变，不需要保存',
               NOT_SAVE_ERROR : '您还没保存您的权限选择结果, 您确定要重新加载权限树数据吗，将覆盖你当前的权限选择!',
               START_HTML : '<div class = "app-sys-user-ui-rolemgr-perm-grant-wrapper">' +
               '<div class = "app-sys-user-ui-rolemgr-perm-grant-title">欢迎使用角色授权面板</div>' +
               '<ul>' +
               '<li><span>1. 您可以在右面的系统角色树上选择特定的角色，给其赋予系统中已经挂载的权限 。</span></li>' +
               '<li><span>2. 在授权树在给APP名称前面打勾，代表角色的系统桌面会出现该APP的图标。</span></li>' +
               '<li><span>3. 在给APP打勾的前提下，如果APP具有更详细的权限选项，如果您想让某个角色拥有某项权限，您可以' +
               '在其前面打勾。</span></li>' +
               '<li><span>4. 系统超级管理员具有系统所有权限。</span></li>' +
               '</ul>' +
               '</div>',
               SAVE_OK : '权限数据保存成功'
            },
            MEMBER_MANAGER : {
               TITLE : '角色成员管理',
               INCLUDE_TITLE : '属于该角色的管理员列表',
               EXCLUDE_TITLE : '不属于该角色的管理员列表',
               INFO_TITLE : '角色信息面板',
               COLS : {
                  ROLE_NAME : '角色名称',
                  NUM : '成员数目',
                  DESCRIPTION : '角色描述'
               }
            }
         }
      },
      ERROR_TYPE : {
         'App/Sys/User/RoleMgr' : {
            10019 : '角色不为空， 不能删除'
         }
      }
   }
});