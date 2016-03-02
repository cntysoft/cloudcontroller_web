UpgradeEnv.writeLogMsg("开始创建数据表 app_sys_setting_server_info");
UpgradeEnv.dbQuery("CREATE TABLE IF NOT EXISTS `app_sys_setting_server_info` (\
  `id` int(11) NOT NULL,\
  `type` tinyint(4) NOT NULL COMMENT '服务器类型',\
  `ip` char(15) NOT NULL COMMENT '服务器地址',\
  `description` varchar(255) NOT NULL COMMENT '描述'\
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='服务器信息'");
UpgradeEnv.dbQuery("ALTER TABLE `app_sys_setting_server_info`\
  ADD PRIMARY KEY (`id`)");
UpgradeEnv.dbQuery("ALTER TABLE `app_sys_setting_server_info`\
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT");