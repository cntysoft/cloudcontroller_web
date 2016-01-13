<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\User;
use Cntysoft\Kernel\App\AbstractLib;
use App\Sys\User\Model\BasicInfo as BasicInfoModel;
use Cntysoft\Kernel;
/**
 * 教堂管理员信息管理类
 */
class Info extends AbstractLib
{
   /**
    * 获取指定教堂的管理员列表
    *
    * @return \Phalcon\Mvc\Model\Resultset\Simple
    */
   public function getUserList()
   {
      return BasicInfoModel::find();
   }
   /**
    * 获取教堂用户基本信息
    *
    * @param int $id
    * @return \App\Sys\User\Model\BasicInfo
    */
   public function getUserBasicInfo($id)
   {
      return BasicInfoModel::findFirst((int)$id);
   }

   /**
    * 根据用户名称获取教堂管理对象
    *
    * @param string $name
    * @return \App\Sys\User\Model\BasicInfo
    */
   public function getUserByName($name)
   {
      return BasicInfoModel::findFirst("name = '{$name}'");
   }

   /**
    * 检查系统用户是否存在
    *
    * @param string $name
    * @return boolean
    */
   public function UserExist($name)
   {
      return $this->getUserByName($name) ? true : false;
   }

   /**
    * 增加一个教堂管理用户
    *
    * @param array $data
    * @return \App\Sys\User\Model\BasicInfo
    */
   public function addUser(array $data, $isFounder = false)
   {
      unset($data['id']);
      $User = new BasicInfoModel();
      $requires = $User->getRequireFields(array(
         'id'
      ));
      $data['isLock'] = 0;
      $data['loginErrorTimes'] = 0;
      $data['isFounder'] = $isFounder ? 1 : 0;
      $data['loginTimes'] = 0;
      Kernel\ensure_array_has_fields($data, $requires);
      $pwdHasher =  Kernel\get_global_di()->getShared('security');
      $data['password'] = $pwdHasher->hash($data['password']);
      //检查User是否存在
      if($this->UserExist($data['name'])){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_SYS_USER_EXIST', $data['name'])), $this->getErrorTypeContext());
      }
      $User->assign($data);
      $User->create();
      return $User;
   }

   /**
    * 更新系统用户信息
    *
    * @param int $uid
    * @param array $data
    */
   public function updateUser($uid, $data)
   {
      if(array_key_exists('id', $data)){
         unset($data['id']);
      }
      $User = $this->getUserBasicInfo((int)$uid);
      if(!$User){
         return;
      }
      $User->update($data);
   }

   /**
    * 删除指定的教堂用户
    *
    * @param int $uid
    */
   public function deleteUser($uid)
   {
      $uid = (int)$uid;
      $User = $this->getUserBasicInfo($uid);
      if(!$User){
         return;
      }
      if($User->getIsFounder()){
         return;
      }
      $User->delete();
   }

   /**
    * @param int $uid
    * @param boolean $status
    */
   public function updateUserStatus($uid, $status)
   {
      $User = $this->getUserBasicInfo((int)$uid);
      if($User){
         $User->setIsLock((boolean)$status);
         $User->update();
      }
   }
}