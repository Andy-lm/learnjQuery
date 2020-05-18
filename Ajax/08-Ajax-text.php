<?php
// $products = array("nz"=>array("title"=>"甜美女装", "des"=>"人见人爱,花间花开,甜美系列", "image"=>"images/1.jpg"),
//     "bb"=>array("title"=>"奢华驴包", "des"=>"送女友,送情人,送学妹,一送一个准系列", "image"=>"images/2.jpg"),
//     "tx"=>array("title"=>"键盘拖鞋", "des"=>"程序员专属拖鞋, 屌丝气息浓郁, 你值得拥有", "image"=>"images/3.jpg"));

// $name = $_GET['name'];
// // echo $name;
// // print_r($products[$name]);
// $product = $products[$name];
// echo $product['title'];
// echo '|';
// echo $product['des'];
// echo '|';
// echo $product['image'];
header('content-type:text/xml; charset=utf-8');
echo file_get_contents("./08-Ajax-text.xml");

?>