<?php
// Luke 19/03/2020

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get database connection
include_once '../config/database.php';
  
// instantiate product object
include_once '../objects/log.php';
  
$database = new Database();
$db = $database->getConnection();
  
$log = new Log($db);
   
// get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if(    
    !empty($data->applicazione) &&
    !empty($data->tipo) &&
    !empty($data->messaggio) &&
    !empty($data->errore)
){
  
    // set product property values
    $log->nomeComputer = $_SERVER['REMOTE_ADDR'];
    $log->applicazione = $data->applicazione;
    $log->dataOra = date('Y-m-d H:i:s'); //
    $log->tipo = $data->tipo;
    $log->messaggio = $data->messaggio;
    $log->errore =  $data->errore;
  
    // create the product
    if($log->create()){
  
        // set response code - 201 created
        http_response_code(201);
  
        // tell the user
        echo json_encode(array("message" => "Log was inserted."));
    }
  
    // if unable to create the product, tell the user
    else{
  
        // set response code - 503 service unavailable
        http_response_code(503);
  
        // tell the user
        echo json_encode(array("message" => "Unable to insert log."));
    }
}
  
// tell the user data is incomplete
else{
  
    // set response code - 400 bad request
    http_response_code(400);
  
    // tell the user
    echo json_encode(array("message" => "Unable to insert Log. Data is incomplete."));
}
?>
