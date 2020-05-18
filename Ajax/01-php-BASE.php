<?php

// 定义变量的格式
// $num = 10;
// 数组的定义
$arr = array(1,3,5);
// 字典（对象）的定义
// $dict = array('name'=>'lm','age'=>'18');
// print_r($dict);
// echo '<br>';
// echo $dict['name'];
// // 输出num中的内容
// echo $num;
// print_r($arr);
// echo '<br>';
// echo $arr[1];
// 遍历数组
// for($i = 0;$i < count($arr);$i++){
//     echo $arr[$i];
//     echo '<br>';
// }
$index = 0;
while ($index < count($arr)) {
    echo $arr[$index];
    echo '<br>';
    $index++;
}

?>