<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license http://www.cntysoft.com/license/new-bsd     New BSD License
*/
namespace App\Sys\MetaInfo;
use Cntysoft\Kernel\App\AbstractLib;
use App\Sys\MetaInfo\Model\KvDictModel;
use Cntysoft\Kernel;

class KvDict extends AbstractLib
{
    /**
     * 获取所有的信息
     * 
     * @return 
     */
    public function getAllItems()
    {
        return KvDictModel::find();
    }
    
    /**
     * 添加新的数据字典
     * 
     * @param string $identifier
     * @param string $name
     * @return boolean
     */
    public function addItem($identifier, $name)
    {
        try{
            $item = new KvDictModel();
            $item->setIdentifier($identifier);
            $item->setName($name);
            
            return $item->save();
        }catch(\Exception $e) {
            $errorType = $this->getErrorType();
            Kernel\throw_exception(
                    new Exception($errorType->msg('E_ADD_KVDICT_ERROR'), $errorType->code('E_ADD_KVDICT_ERROR')), 
                    $this->getErrorTypeContext());
        }
    }
    
    /**
     * 保存数据字典信息
     * 
     * @param string $identifier
     * @param string $name
     * @return boolean
     */
    public function saveItem($identifier, $name)
    {
        $kvdict = KvDictModel::findFirst(array(
         'identifier = ?0',
         'bind' => array(
            0 => $identifier
         )));
        
        if(!$kvdict) {
            $errorType = $this->getErrorType();
            Kernel\throw_exception(
                    new Exception($errorType->msg('E_KVDICT_NOT_EXIST'), $errorType->code('E_KVDICT_NOT_EXIST')), 
                    $this->getErrorTypeContext());
        }
        
        try{
            $kvdict->setName($name);
            return $kvdict->save();
        }catch(\Exception $e){
            $errorType = $this->getErrorType();
            Kernel\throw_exception(
                    new Exception($errorType->msg('E_ADD_KVDICT_ERROR'), $errorType->code('E_ADD_KVDICT_ERROR')), 
                    $this->getErrorTypeContext());
        }
    }
    
    /**
     * 修改数据字典的项目值
     * 
     * @param int $id
     * @param array $items
     * @return boolean
     */
    public function addItemContent($identifier, $items)
    {
        $kvdict = KvDictModel::findFirst(array(
         'identifier = ?0',
         'bind' => array(
            0 => $identifier
         )));
        
        if(!$kvdict) {
            $errorType = $this->getErrorType();
            Kernel\throw_exception(
                    new Exception($errorType->msg('E_KVDICT_NOT_EXIST'), $errorType->code('E_KVDICT_NOT_EXIST')), 
                    $this->getErrorTypeContext());
        }
        
        $kvdict->setItems($items);
        
        return $kvdict->save();
    }
    
    /**
     * 获取指定键值的数据字典
     * 
     * @param string $identifier
     * @return 
     */
    public function getItemByIdentifier($identifier)
    {
        $kvdict = KvDictModel::findFirst(array(
         'identifier = ?0',
         'bind' => array(
            0 => $identifier
         )));
        
        if(!$kvdict) {
            $errorType = $this->getErrorType();
            Kernel\throw_exception(
                    new Exception($errorType->msg('E_KVDICT_NOT_EXIST'), $errorType->code('E_KVDICT_NOT_EXIST')), 
                    $this->getErrorTypeContext());
        }
        
        return $kvdict;
    }
    
    /**
     * 删除一项数据字典
     * 
     * @param int $id
     * @return boolean
     */
    public function deleteItem($identifier)
    {
        $kvdict = KvDictModel::findFirst(array(
         'identifier = ?0',
         'bind' => array(
            0 => $identifier
         )));
        
        if(!$kvdict) {
            $errorType = $this->getErrorType();
            Kernel\throw_exception(
                    new Exception($errorType->msg('E_KVDICT_NOT_EXIST'), $errorType->code('E_KVDICT_NOT_EXIST')), 
                    $this->getErrorTypeContext());
        }
        
        return $kvdict->delete();
    }
}
