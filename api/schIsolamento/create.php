<?php
// Luke 25/09/2020

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/schIsolamento.php';
include_once '../objects/token.php';

$database = new Database();
$db = $database->getConnection();

// get posted data
$data = json_decode(file_get_contents("php://input"));

// get jwt
$jwt = isset($data->jwt) ? $data->jwt : "";
$dataSchIso = isset($data->dataSchIso) ? $data->dataSchIso : "";

if (!empty($jwt) && !empty($dataSchIso)) {
    try {

        // decode jwt, nella classe Token, se è valido il token pasato, viene rinnovata la data ora...
        $jwt = new token($jwt, $key);

        if ($jwt->isValid()) {



            $schIso =  new schIsolamento($db, $jwt->GetDbStruttura(), $data->dbschema);

            // set product property values
            $schIso->ID_OSPITE = $dataSchIso->ID_OSPITE;
            $schIso->dataRilevazione = date('Y-m-d H:i:s');
            $schIso->idZona = $dataSchIso->idZona; //
            $schIso->temperatura = $dataSchIso->temperatura;
            $schIso->saturazione = $dataSchIso->saturazione;
            $schIso->ossigeno = $dataSchIso->ossigeno;
            $schIso->fTosseSecca = (bool)$dataSchIso->fTosseSecca;
            $schIso->fDolMusc = (bool)$dataSchIso->fDolMusc;
            $schIso->fMaleTesta = (bool)$dataSchIso->fMaleTesta;
            $schIso->fRinorrea = (bool)$dataSchIso->fRinorrea;
            $schIso->fMaleGola = (bool)$dataSchIso->fMaleGola;
            $schIso->fAstenia = (bool)$dataSchIso->fAstenia;
            $schIso->fInappetenza = (bool)$dataSchIso->fInappetenza;
            $schIso->fVomito = (bool)$dataSchIso->fVomito;
            $schIso->fDiarrea = (bool)$dataSchIso->fDiarrea;
            $schIso->fCongiuntivite = (bool)$dataSchIso->fCongiuntivite;
            $schIso->Altro = $dataSchIso->Altro;
            $schIso->idUserIns = $jwt->GetIdUserLogin();
            $schIso->DtIns = date('Y-m-d H:i:s');

            $newId = $schIso->create();
            //var_dump($newId);

            // create the product
            if ($newId) {

                // set response code - 201 created
                http_response_code(201);

                // tell the user
                echo json_encode(array(
                                        "message" => "Parametri per OSPITE inseriti correttamente."
                                       ,"ID_ROW"=> $newId
                                       ,"jwt"=>$jwt->GetToken()
                                      )
                                );
            } // if unable to create the product, tell the user
            else {

                // set response code - 503 service unavailable
                http_response_code(503);

                // tell the user
                echo json_encode(array("message" => "Unable to insert OSPITI PARAMETRI, error in the CREATE"));
            }


        } else {
            http_response_code(500); //inernal error
            echo json_encode(array(
                "message" => "Token scaduto, verrai reindirizzato alla pagina di Login",
                "error" => "TOKEN SCADUTO"
            ));
        }

    } catch (Exception $e) {

        // set response code
        http_response_code(500); //inernal error
        // tell the user access denied  & show error message
        echo json_encode(array(
            "message" => "Access denied. Eccezione interna",
            "error" => $e->getMessage()
        ));

    }
} // tell the user data is incomplete
else {

    // set response code - 400 bad request
    http_response_code(400);

    // tell the user
    echo json_encode(array("message" => "Unable to insert PARAMETRI OSPITE Data is incomplete."));
}

