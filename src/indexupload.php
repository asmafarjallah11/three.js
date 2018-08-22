<?php
$uploaddir = 'uploads/';
if(!is_dir($uploaddir)){
    mkdir($uploaddir);
 }   

$filename = $_FILES['upload_file']['name'];
$fileext = explode('.',$filename);
$fileextension=$fileext[sizeof($fileext) - 1];
if(!is_dir($uploaddir.$fileextension)){
mkdir($uploaddir.$fileextension, 0700);
}
$uploadfile = $uploaddir.$fileextension.'/' . basename($_FILES['upload_file']['name']);
if (move_uploaded_file($_FILES['upload_file']['tmp_name'], $uploadfile)) {
    echo'success';  
}


