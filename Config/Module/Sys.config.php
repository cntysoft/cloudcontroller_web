<?php

/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
return array(
    'routes' =>
    array(
        array(
            'rule' => '/ApiGate/{type:[A-Za-z]+}',
            'option' =>
            array(
                'module' => 'Sys',
                'controller' => 'Api',
                'action' => 'index',
                'type' => 1
            ),
        ),
        array(
            'key' => 'Test',
            'rule' => '/test',
            'option' => array(
                'module' => 'Sys',
                'controller' => 'Test',
                'action' => 'index'
            )
        ),
    )
);
