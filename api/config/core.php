<?php
// show error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// set your default time-zone
date_default_timezone_set('Europe/Rome');

//$config = parse_ini_file(.'://'. $_SERVER['HTTP_HOST'].'/WebOasi/config.ini', true);

//var_dump($config);

// home page url
//$home_url="http://10.0.2.44:8080/WebOasi/";
$home_url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'].'/WebOasi/';

$login_page_url = $home_url.'page/page-login.php';

// page given in URL parameter, default page is one
$page = isset($_GET['page']) ? $_GET['page'] : 1;

// set number of records per page
$records_per_page = 5;
  
// calculate for the query LIMIT clause
$from_record_num = ($records_per_page * $page) - $records_per_page;

// Path immagini dipendenti
$PathImgDip = $home_url.'page/img/user/';

// variables used for jwt
$key = "Vittoria3Admin";
$iss = "http://weboasi.org";
$aud = "http://weboasi.com";
$iat = 1356999524;
$nbf = 1357000000;

$MinScadenzaToken = 30;


?>

