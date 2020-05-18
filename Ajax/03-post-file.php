<?php
// print_r($_POST);
// echo '<br>';
// print_r($_FILES);
// 获取上传过来的字典
$fileInfo = $_FILES['upFile'];
// print_r($fileInfo);
// 获取文件名称
$fileName = $fileInfo['name'];
// 获取文件路径
$filePath = $fileInfo['tmp_name'];
// echo $fileName;
// echo '<br>';
// echo $filePath;
// 修改文件路径
move_uploaded_file($filePath,"./source/".$fileName);
?>