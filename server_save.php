<?php
	$var = $_POST['data'];
	 $fich=fopen('root2.json','w');
     fputs($fich,$var);
     fclose($fich);

?>