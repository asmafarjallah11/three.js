<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"></script>
</head>
<body>
<div class="container">
    <div class="row">
            <?php

$uploaddir = 'uploads/';

$filename = $_FILES['fileToUpload']['name'];
$fileext = explode('.',$filename);
$fileextension=$fileext[sizeof($fileext) - 1];
if(!is_dir($uploaddir.$fileextension)){
mkdir($uploaddir.$fileextension, 0700);
}
$uploadfile = $uploaddir.$fileextension.'/' . basename($_FILES['fileToUpload']['name']);
echo "<div class='container'>";
echo '<pre>';
if (move_uploaded_file($_FILES['fileToUpload']['tmp_name'], $uploadfile)) {
    echo " <div id='filename' class='alert alert-info alert-dismissible'>
  <strong>".$filename."</strong> 
 </div>";
     echo " <div style='display:none;'  id='filepath' >
 ".$uploadfile."
 </div>";
   //   var_dump($_FILES['fileToUpload']);
      
}

else {
     echo " <div class='alert alert-danger alert-dismissible'>
  <strong>".$filename." non recu</strong> 
 </div>";

}

echo '</pre>';

?>
    </div> 
  
     <div class="container">
               <div id="viewerbox" style='width: 800px;
				height: 500px;
				position: relative;
                                left:5%;
                                box-shadow: 3px 3px 3px 3px #bee5eb;
				border: 1px solid #007bff;
                                border-radius: .25rem;
                                float:left;
                               '>
                                    
                </div>
     <div class="form-group">
    <label for="volume">Volume</label>
    <input type="input"  id="volume" readonly class="form-control"  
         placeholder="Volume Loading">
  
      </div>
            <div class="form-group">
    <label for="surface">Surface</label>
    <input type="input"  id="surface" readonly class="form-control"
         placeholder="Surface Loading">
  
      </div>

       </div>

    <div class="row"> 
          <div id="scriptsdiv">
               <script src="build/three.js"></script>
               
               <script src="main.js" type="text/javascript"></script>
          </div>
    </div>
      </div>
   
</body>
</html>


