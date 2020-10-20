<?php
$myPost = file_get_contents('php://input');
$myFile = fopen('scores.json', 'r');
$response = fread($myFile,4096);
fclose($myFile);
echo $response;
?>