<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\MetaInfo\AjaxHandler;
use Cntysoft\Kernel\App\AbstractHandler;
use App\Sys\MetaInfo\Constant;
class KvDict extends AbstractHandler
{
    /**
     * 获取所有的数据字典
     * 
     * @return array
     */
    public function getAllKvDictMaps()
    {
        $items = $this->getAppCaller()->call(
                Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_KVDICT, 'getAllItems', array());

        $ret = array();
        foreach ($items as $item) {
            array_push($ret, array(
               'key'  => $item->getIdentifier(),
               'name' => $item->getName(),
               'id'   => $item->getId()
            ));
        }

        return $ret;
    }

    /**
     * 获取指定数据字典的值
     * 
     * @param array $params
     * @return array
     */
    public function getItemContent($params)
    {
        $this->checkRequireFields($params, array('identifier', 'start', 'limit'));
        $item = $this->getAppCaller()->call(
                Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_KVDICT, 'getItemByIdentifier', array($params['identifier']));
        $ret = array();
        $items = $item->getItems();
        if (!empty($items)) {
            $start = $params['start'];
            $stop = $params['start'] + $params['limit'];
            for ($start; $start < $stop; $start++) {
                if (!empty($items[$start])) {
                    array_push($ret, $items[$start]);
                }
            }

            return array(
               'total' => count($items),
               'items' => $ret
            );
        } else {
            return array(
               'total' => 0,
               'items' => array()
            );
        }
    }

    /**
     * 添加一个新的数据字典
     * 
     * @param array $params
     * @return boolean 
     */
    public function addItem($params)
    {
        $this->checkRequireFields($params, array('identifier', 'name'));

        return $this->getAppCaller()->call(
                        Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_KVDICT, 'addItem', array($params['identifier'], $params['name']));
    }

    /**
     * 保存数据字典的信息
     * 
     * @param array $params
     * @return boolean
     */
    public function saveItem($params)
    {
        $this->checkRequireFields($params, array('identifier', 'name'));

        return $this->getAppCaller()->call(
                        Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_KVDICT, 'saveItem', array($params['identifier'], $params['name']));
    }

    /**
     * 设置数据字典的值
     * 
     * @param array $params
     * @return boolean
     */
    public function saveItemContent($params)
    {
        $this->checkRequireFields($params, array('identifier', 'items'));

        return $this->getAppCaller()->call(
                        Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_KVDICT, 'addItemContent', array($params['identifier'], $params['items']));
    }

    /**
     * 删除一项数据字典
     * 
     * @param array $params
     * @return boolean
     */
    public function deleteItem($params)
    {
        $this->checkRequireFields($params, array('identifier'));

        return $this->getAppCaller()->call(
                        Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_KVDICT, 'deleteItem', array($params['identifier']));
    }
    
    /**
     * 获取数据字典的信息
     * 
     * @param array $params
     * @return array
     */
    public function getItem($params)
    {
        $this->checkRequireFields($params, array('identifier'));

        $item = $this->getAppCaller()->call(
                        Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_KVDICT, 'getItemByIdentifier', array($params['identifier']));
        
        return array(
           'name' => $item->getName(),
           'identifier' => $item->getIdentifier()
        );
    }

}