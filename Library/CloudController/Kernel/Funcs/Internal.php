<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace Cntysoft\Kernel;

/**
 * 获取系统当前的模板方案
 *
 * @return int
 */
function get_tpl_project()
{
   static $project = null;
   if (null == $project) {
      $map = get_global_di()->get('AppCaller')->call('Sys', 'Setting', 'Config',
         'getSiteConfig', array());
      $project = isset($map['TplProject']) ? (int) $map['TplProject'] : 1;
   }
   return $project;
}

/**
 * 获取前台表单验证的token 此函数中已经保存进了Session
 *
 * @param $key
 * @return string
 */
function get_front_form_token($key)
{
   $token = md5(uniqid() . time() . '_' . $key);
   //设置SESSION
   $sessionManager = get_global_di()->get('SessionManager');
   $sessionManager->offsetSet($key, $token);
   return $token;
}

/**
 * 获取一个简便的版本字符串
 * 
 * @return string
 */
function get_sys_version_str()
{
   return ZHUCHAO_VERSION;
}

/**
 * 通过对比网址来探测是否是测试模式
 * 
 * @deprecated since version v0.0.1-rc11
 * @return boolean
 */
function is_devel_mode()
{
   static $develMode = null;
   if (null == $develMode) {
      $domain = $_SERVER['HTTP_HOST'];
      $parts = explode('.', $domain);
      $total = count($parts);
      $rootDomain = $parts[$total - 2] . '.' . $parts[$total - 1];
      if (\Cntysoft\SYS_DOMAIN_DEVEL == $rootDomain) {
         $develMode = true;
      } else {
         $develMode = false;
      }
   }
   return $develMode;
}
/**
 * 判断是否本地模式
 * 
 * @return boolean
 */
function is_local_deploy()
{
   if(\Cntysoft\RT_DEPLOY_TYPE == \Cntysoft\DEPLOY_TYPE_DEVEL ||
      \Cntysoft\RT_DEPLOY_TYPE == \Cntysoft\DEPLOY_TYPE_LOCAL_DEBUG ||
      \Cntysoft\RT_DEPLOY_TYPE == \Cntysoft\DEPLOY_TYPE_LOCAL_PRODUCT){
      return true;
   }
   return false;
}

/**
 * 这个函数主要是用于服务器图片的读取
 * 
 * @return string
 */
function get_image_oss_server_url()
{
   static $server = null;
   if ($server == null) {
      $server = 'http://' . \Cntysoft\RT_ZHUCHAO_OSS_IMG_BUCKET . '.' . \Cntysoft\OSS_PUBLIC_ENTRY;
   }
   return $server;
}

/**
 * 获取oss的bucket名称
 * 
 * @staticvar string $bucketName
 * @return string
 */
function get_image_oss_bucket_name()
{
   return \Cntysoft\RT_ZHUCHAO_OSS_IMG_BUCKET;
}

/**
 * 获取系统CDN的服务器地址
 * 
 * @return string
 */
function get_image_cdn_server_url()
{
   return 'http://'.\Cntysoft\RT_ZHUCHAO_IMG_CDN_SERVER;
}

/**
 * 获取图片的CDN地址
 * 
 * @param string $resource
 * @param int $width
 * @param int $height
 */
function get_image_cdn_url($resource, $width = null, $height = null)
{
   $resource = trim($resource);
   if('' == $resource){
      return $resource;
   }
   if ($resource[0] == '/') {
      //本地图片
      return $resource;
   } else {
      $url = get_image_cdn_server_url() . '/' . $resource;
      $style = '';
      if (is_int($height)) {
         $style .= $height . 'h';
      }
      if (is_int($width)) {
         $style .= '_' . $width . 'w';
      }
      if ('' != $style) {
         $url .= '@' . $style;
      }
      return $url;
   }
}

/**
 * 
 * @param type $resource
 * @param array $arguments 需要进行的图片处理参数
 * @param bool $watermark 是否打水印
 * <code>
 *    array(
 *       'w' => 0,   //宽度　1-4096
 *       'h' => 0,　 //高度  1-4096
 *       'e' => 0,   //缩放优先边(当长宽都在时生效)　默认0 长边, 1 短边, 2 强制按照长宽,可能失真 
 *       'c' => 0,   //自动从中间裁剪指定大小图片,需长宽存在,此处e需为1, 0 不裁剪 1 裁剪　
 *       'p' => 100, //按比例缩放,小于100就是缩小,大于100是放大
 *       'a' => 0-0-100-100, //前两个是起始坐标,后两个为裁剪到的长宽(为0表示截到末尾) 
 *       'ci' => 100-1, //第1个参数表示圆的半径,第2个参数表示图的大小 0 原图大小 1 包含圆的最小正方形
 *       '2ci' => 100,  //圆角矩形
 *       'bgc' => 100-100-100, //缩放后填充颜色，e必须为4,三个参数表示 红 绿 蓝　0-255
 *       'Q' => 100 //1-100 图片的质量
 *       't' => .src //生成的图片格式,src是原图格式,支持jpg png bmp webp
 *       'r' => 0 //0-360 旋转角度,顺时针　0不旋转
 *       'sh' => 100 //50-399 越大越清晰,推荐100
 *    )
 * </code>
 * @return string
 */
//$width = null, $height = null, $e = null, $c = null, $p = null, $a = null, $rc = null, $t = null, $ci = null, $ci2 = null, $ic = null, $bgc = null, $q = null, $Q = null, $r = null
function get_image_cdn_url_operate($resource, $arguments = array(), $watermark = false)
{
   $resource = trim($resource);
   if('' == $resource){
      return $resource;
   }
   if ($resource[0] == '/') {
      //本地图片
      return $resource;
   } else {
      $url = get_image_cdn_server_url() . '/' . $resource;
      $style = '';
      if(array_key_exists('c', $arguments)){
         $arguments['e'] = 1;
      }
      if(array_key_exists('bgc', $arguments)){
         $arguments['e'] = 4;
      }
      if(!array_key_exists('t', $arguments)){
         $arguments['t'] = 'src';
      }
      foreach($arguments as $key => $val){
         if('2ci' == $key){
            $style .= '_' . $val . '2ci';
         }else if('q' == $key){
            $style .= '_'. $val . 'Q';
         }else if('t' == $key){
            $style .= '_.'. $val;
         }else{
            $style .= '_'. $val . $key;
         }
      }
      if ('' != $style) {
         $url .= '@' . substr($style, 1);
      }
      $encodeObject = url_safe_base64_encode('Static/watermark.png');
      if(isset($arguments['h']) && $arguments['h'] < 150){
         $encodeObject = url_safe_base64_encode('Static/watermark.png@'. floor($arguments['h']/3).'h');
      }
      
      if($watermark){
         if('' == $style){
            $url.='@watermark=1&&object='.$encodeObject.'&p=3|watermark=1&&object='.$encodeObject.'&p=5|watermark=1&&object='.$encodeObject.'&p=7';
         }else{
            $url.='|watermark=1&&object='.$encodeObject.'&p=3|watermark=1&&object='.$encodeObject.'&p=5|watermark=1&&object='.$encodeObject.'&p=7';
         } 
      }
      return $url;
   }
}

function url_safe_base64_encode($string)
{
   $data = base64_encode($string);
   $data = str_replace(array('+','/','='),array('-','_',''),$data);
   return $data;
}

function url_safe_base64_decode($string) {
   $data = str_replace(array('-','_'),array('+','/'),$string);
   $mod4 = strlen($data) % 4;
   if ($mod4) {
       $data .= substr('====', $mod4);
   }
   return base64_decode($data);
 }

