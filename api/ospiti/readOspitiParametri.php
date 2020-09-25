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

// if jwt is not empty
if ($jwt) {

    try {
        // decode jwt, nella classe Token, se è valido il token pasato, viene rinnovata la data ora...
        $jwt = new token($jwt, $key);

        if ($jwt->isValid()) {
            // initialize object
            $Ospiti = new Ospiti($db, $jwt->GetDbStruttura());

            $arrayTmp = $Ospiti->GetElnOspitiParametri();

            //var_dump($eventi);

            if (isset($arrayTmp)) {
                // set response code - 200 OK
                http_response_code(200);

                echo json_encode(array(
                    "ElnOspitiParametri" => $arrayTmp,
                    "jwt" => $jwt->GetToken() // token rigenerato e aggiornato
                ));
            } else {
                throw new Exception('Problemi nella restituzione dell\'array eventi');
            }
        } else {
            http_response_code(500); //inernal error
            echo json_encode(array(
                "message" => "Token scaduto, verrai reindirizzato alla pagina di Login (readOspitiParametri.php)",
                "error" => "TOKEN SCADUTO"
            ));
        }
    } catch (Exception $e) {

        // set response code
        http_response_code(500); //inernal error
        // tell the user access denied  & show error message
        echo json_encode(array(
            "message" => "Access denied. Eccezione interna (readOspitiParametri.php)",
            "error" => $e->getMessage()
        ));
    }
}    