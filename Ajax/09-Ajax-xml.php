<?php
// file_get_contents("./info.xml");
// echo '11';
// 在php中如果需要返回xml数据，必须在php文件顶部设置
header('content-type:text/xml; charset=utf-8');
echo file_get_contents("./info.xml");
