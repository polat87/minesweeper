<?php
$myPost = file_get_contents('php://input');
$myFile = fopen('scores.json', 'w');
fwrite($myFile,$myPost);
fclose($myFile);
echo $myPost;
?>