<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
  
// include database and object files
include_once '../config/database.php';
include_once '../objects/log.php';
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare product object
$log = new Log($db);
  
// set ID property of record to read
$log->idRow = isset($_GET['id']) ? $_GET['id'] : die();
  
// read the details of product to be edited
$log->readOne();
  
/*
 ID_ROW       
,  NOME_COMPUTER      
, APPLICAZIONE      
, DATA_ORA      
, TIPO      
, MESSAGGIO      
, ERRORE 
 *  */

if($log->nomeComputer!=null){
    // create array
    $log_arr = array(
        "ID_ROW" =>  $log->idRow,
        "NOME_COMPUTER" => $log->nomeComputer,
        "APPLICAZIONE" => $log->applicazione,
        "DATA_ORA" => $log->dataOra,
        "TIPO" => $log->tipo,
        "MESSAGGIO" => $log->messaggio,
        "ERRORE" => $log->errore
    );
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($log_arr);
}
  
else{
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell the user product does not exist
    echo json_encode(array("message" => "Log id does not exist."));
}
?>