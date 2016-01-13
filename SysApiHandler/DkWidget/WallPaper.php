<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace SysApiHandler\DkWidget;
use Cntysoft\Kernel;
use Cntysoft\Framework\ApiServer\AbstractScript;
use Cntysoft\Stdlib\Filesystem;
use CloudController\Kernel\StdDir;
use App\Sys\User\Constant as SYS_USER_CONST;
use Cntysoft\Framework\Core\FileRef\Manager as FileRefManager;
/**
 * 壁纸相关的API接口
 */
class WallPaper extends AbstractScript
{
   const COLOR = 0;
   const WALLPAPER_LOCAL_IMAGE = 1;
   const WALLPAPER_NET_IMAGE = 2;
   /**
    * 设置桌面壁纸
    *
    * @param array $params
    */
   public function changeWallPaper(array $params)
   {
      /**
       * 设置管理员的概况信息
       */
      $this->checkRequireParams($params, array('wallPaper', 'type'));
      $type = $params['type'];
      $user = $this->getAppCaller()->call(
         SYS_USER_CONST::MODULE_NAME,
         SYS_USER_CONST::APP_NAME,
         SYS_USER_CONST::APP_API_ACL,
         'getCurUser'
      );

      if(self::WALLPAPER_NET_IMAGE == $type){
         $this->checkRequireParams($params, array('saveToLocal'));
         $parts = explode('|', $params['wallPaper']);
         $url = $parts[1];
         if($params['saveToLocal']){
            $path = $this->getWallPaperDir($user->getName()) . '/' . md5($url) . '.' .substr(strrchr($url, "."), 1);
            $this->downloadImageToLocal($url, $path);
            $params['wallPaper'] = $parts[0] . '|'. $path;
         }else{
            $params['wallPaper'] = $parts[0] . '|'. $url;
         }
         unset($params['saveToLocal']);
      }

      unset($params['type']);
      $this->getAppCaller()->call(
         SYS_USER_CONST::MODULE_NAME,
         SYS_USER_CONST::APP_NAME,
         SYS_USER_CONST::APP_API_MEMBER,
         'updateSysUserProfile',
         array(
            $user->getId(),
            $params
         )
      );
   }

   protected function getWallPaperDir($name)
   {
      return StdDir::getUploadFilesDir().DS.'WallPaper'.DS.$name;
   }

   /**
    * 下载图片到本地
    */
   protected  function downloadImageToLocal($url, $path)
   {
      if(file_exists($path)){
         return;
      }
      $orgTime = ini_get('max_execution_time');
      ini_set('max_execution_time', 1800);
      $img = Filesystem::fileGetContents($url);
      Filesystem::filePutContents($path, $img);
      ini_set('max_execution_time', $orgTime);
   }

   /**
    * 获取本地的图片
    *
    * @param array $params
    * @return array
    */
   public function getLocalImages()
   {
      $user = $this->getAppCaller()->call(
         SYS_USER_CONST::MODULE_NAME,
         SYS_USER_CONST::APP_NAME,
         SYS_USER_CONST::APP_API_ACL,
         'getCurUser'
      );
      $profile = $user->getProfile();
      $ret['fileRefs'] = array();
      $ret['imgRefMap'] = array();
      if($profile->getImgRefMap()){
         $ret['imgRefMap'] = $profile->getImgRefMap();
      }
      if($profile->getFileRefs()){
         $ret['fileRefs'] = explode(',', $profile->getFileRefs());
      }

      return $ret;
   }

   /**
    * 更新管理员的fileRefs和imgRefMap信息
    *
    * @param array $params
    */
   public function updateUserProfile(array $params)
   {
      $user = $this->getAppCaller()->call(
         SYS_USER_CONST::MODULE_NAME,
         SYS_USER_CONST::APP_NAME,
         SYS_USER_CONST::APP_API_ACL,
         'getCurUser'
      );
      $fm = new FileRefManager();
      foreach($params['fileRefs'] as $file){
         $fm->confirmFileRef($file);
      }
      $params['fileRefs'] = implode(',', $params['fileRefs']);
      $this->getAppCaller()->call(
         SYS_USER_CONST::MODULE_NAME,
         SYS_USER_CONST::APP_NAME,
         SYS_USER_CONST::APP_API_MEMBER, 'updateSysUserProfile',
         array($user->getId(), $params));
   }

   /**
    * 删除本地的一张图片
    *
    * @param array $params
    */
   public function deleteLocalImage(array $params)
   {
      $this->checkRequireParams($params, array('fileRefs', 'deleteFileRefs', 'imgRefMap'));
      $delFileRefs = $params['deleteFileRefs'];
      unset($params['deleteFileRefs']);
      $fm = new FileRefManager();
      $fm->removeFileRef($delFileRefs);
      $this->updateUserProfile($params);
   }
}