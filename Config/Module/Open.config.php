<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
return array(
   'routes' =>
      array(
         0 =>
            array(
               'rule'   => '/internal-api-entry',
               'option' =>
                  array(
                     'module'     => 'Open',
                     'controller' => 'InternalApiEntry',
                     'action'     => 'index',
                  ),
            ),
         1 => array(
            'rule'   => '/front-api-entry',
            'option' =>
               array(
                  'module'     => 'Open',
                  'controller' => 'FrontApiEntry',
                  'action'     => 'index',
               ),
         ),
         2 => array(
            'rule'   => '/mobile-api-entry',
            'option' =>
               array(
                  'module'     => 'Open',
                  'controller' => 'MobileApiEntry',
                  'action'     => 'index',
               )
         )
      ),
   'api_map' => array(
      'Category' => array('\InternalApi\Category', true),
      'Merchant' => array('\InternalApi\Merchant', true),
      'Product'  => array('\InternalApi\Product', true),
      'Uploader' => array('\InternalApi\Uploader', false), //这个接口没有验证
      'Advice' => array('\InternalApi\Advice', true),
      'Order' => array('\InternalApi\Order', true)
   ),
   'front_api_map' => array(
      'User' => array('\FrontApi\User', 2),
      'Normal' => array('\FrontApi\Normal', 2),
      'Good' => array('\FrontApi\Good', 1),
      'Gonglue' => array('\FrontApi\Gonglue',1),
      'SearchResult' => array('\FrontApi\SearchResult',1),
      'Utils'   => array('\FrontApi\Utils', 1),
      'Xiaoguotu' => array('\FrontApi\Xiaoguotu',1),
      'MobileDesigner' => array('\FrontApi\MobileDesigner',1),
      'MobileDecorator' => array('\FrontApi\MobileDecorator',1),
      'Jiazhuangbao' => array('\FrontApi\Jiazhuangbao',1),
      'ShopCart' => array('\FrontApi\ShopCart',2),
      'Foreman' => array('\FrontApi\Foreman',2),
      'ForemanNotLogin' => array('\FrontApi\ForemanNotLogin',1),
      'Designer' => array('\FrontApi\Designer',2),
      'Decorator' => array('\FrontApi\Decorator',2)
   ),
   'mobile_api_map' => array(
      'User'      => array('\MobileApi\User', 2),
      'GongLue'   => array('\MobileApi\GongLue', 1),
      'Xiaoguotu' => array('\MobileApi\Xiaoguotu', 1),
      'Goods'     => array('\MobileApi\Goods', 1),
      'Merchant'  => array('\MobileApi\Merchant', 1),
      'ShopCart'  => array('\MobileApi\ShopCart', 2),
      'Decorator' => array('\MobileApi\Decorator', 1),
      'Designer'  => array('\MobileApi\Designer', 1),
      'Foreman'   => array('\MobileApi\Foreman', 1),
      'Index'     => array('\MobileApi\Index', 1),
      'Search'    => array('\MobileApi\Search', 1)
   ),
   'open_api_invoke_token' => '@#$SDFERFQWaerfjsahk23$!@#Rasdfckhaser3'
);
