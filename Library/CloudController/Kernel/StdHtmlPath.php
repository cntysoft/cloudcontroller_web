<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Kernel;
use Cntysoft\Kernel\StdHtmlPath as BaseHtmlPath;
class StdHtmlPath extends BaseHtmlPath
{
   /**
    * 获取筑巢系统的文件链接地址
    * 
    * @param string $rawUrl
    * @param boolean $useCdn
    */
   public function getZhuChaoImageUrl($rawUrl, $useCdn = false)
   {
      $parts = explode('#', $rawUrl);
      if(count($parts) == 1){
         return $rawUrl;
      }else{
         if($parts[0] == \Cntysoft\STORAGE_BACKEND_OSS){
            if($useCdn){
               return \Cntysoft\Kernel\get_image_cdn_server_url().'/'.$parts[1];
            }else{
               return \Cntysoft\Kernel\get_image_oss_server_url().'/'.$parts[1];
            }
         }else{
            return $parts[1];
         }
      }
   }
}
