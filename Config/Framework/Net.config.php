<?php
use Cntysoft\Kernel;
return array (
   'upload' => array(
      'allowedDirs' => array(
         '/Data/UploadFiles',
         '/Statics/Templates' ,
         '/Statics/Skins',
      ),
      'allowFileTypes' =>
         array
         (
            0 => 'jpg',
            1 => 'jpeg',
            2 => 'gif',
            3 => 'png',
            4 => 'doc',
            5 => 'docx',
            6 => 'rar',
            7 => 'zip',
            8 => 'html',
            9 => 'css',
            10 => 'js',
         )
   ),
   'changYan' => array(
      'appid' => 'cyrz25J2C',
      'appkey' => 'cdee04a76adac4c9a84279acf7f1a49f'
   ),
   'yunpian' => array(
      'apikey' => '85400ad25a8e80ffd1ac85a76f5fa6a8'
   )
);