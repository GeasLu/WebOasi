<?php
//Luke 16/09/2020

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/Ospiti.php';
include_once '../objects/token.php';

//leggo i dati in json POST
$data = json_decode(file_get_contents("php://input"));

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

// get jwt
$jwt = isset($data->jwt) ? $data->jwt : "";
$user_ins = isset($data->USER_INS) ? $data->USER_INS : "";

// if jwt is not empty
if (($jwt<>"") && ($user_ins <> "")) {
    try {
        // decode jwt, nella classe Token, se è valido il token pasato, viene rinnovata la data ora...
        $jwt = new token($jwt, $key);

        if ($jwt->isValid()) {
            // initialize object
            $ulName =  $jwt->GetNomeUtente();

            if ($ulName==$user_ins) {
                // set response code - 200 OK
                http_response_code(200);

                echo json_encode(array(
                    "MODIFIED" => true,
                    "jwt" => $jwt->GetToken() // token rigenerato e aggiornato
                ));
            } else {
                echo json_encode(array(
                    "MODIFIED" => false,
                    "jwt" => $jwt->GetToken() // token rigenerato e aggiornato
                ));
            }
        } else {
            http_response_code(500); //inernal error
            echo json_encode(array(
                "message" => "Token scaduto, verrai reindirizzato alla pagina di Login (readParametriOspite.php)",
                "error" => "TOKEN SCADUTO"
            ));
        }
    } catch (Exception $e) {

        // set response code
        http_response_code(500); //inernal error
        // tell the user access denied  & show error message
        echo json_encode(array(
            "message" => "Access denied. Eccezione interna (readCanUserModOspParam.php)",
            "error" => $e->getMessage()
        ));
    }
} else {
    // set response code
    http_response_code(500); //inernal error
    // tell the user access denied  & show error message
    echo json_encode(array(
        "message" => "Token o parametro non valido",
        "error" => ""
    ));
}