<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license http://www.cntysoft.com/license/new-bsd     New BSD License
*/
namespace App\Sys\MetaInfo\Model;
use Cntysoft\Phalcon\Mvc\Model as BaseModel;

class KvDictModel extends BaseModel
{
    private $id;
    private $identifier;
    private $name;
    private $items;
    
    public function getSource()
    {
        return 'app_sys_metainfo_kvdict';
    }
    
    public function getId()
    {
        return (int)$this->id;
    }

    public function getIdentifier()
    {
        return $this->identifier;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getItems()
    {
        return unserialize($this->items);
    }

    public function setId($id)
    {
        $this->id = (int)$id;
        return $this;
    }

    public function setIdentifier($identifier)
    {
        $this->identifier = $identifier;
        return $this;
    }

    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    public function setItems($items)
    {
        $this->items = serialize($items);
        return $this;
    }

}

