<?php

// Luke 20/03/2020
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
include_once '../config/database.php';
include_once '../objects/log.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// prepare product object
$log = new Log($db);

// get id of product to be edited
$data = json_decode(file_get_contents("php://input"));

// set ID property of product to be edited
$log->idRow = $data->idRow;

// set product property values
$log->nomeComputer = $data->nomeComputer;
$log->applicazione = $data->applicazione;
$log->dataOra = date('Y-m-d H:i:s'); //
$log->tipo = $data->tipo;
$log->messaggio = $data->messaggio;
$log->errore = $data->errore;

// update the product
if ($log->update()) {

    // set response code - 200 ok
    http_response_code(200);

    // tell the user
    echo json_encode(array("message" => "Log was updated."));
}

// if unable to update the product, tell the user
else {

    // set response code - 503 service unavailable
    http_response_code(503);

    // tell the user
    echo json_encode(array("message" => "Unable to update this Log."));
}
?>