<?php
// Luke 13/01/2021

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
include_once '../objects/log.php';
include_once '../objects/diario.php';

$database = new Database();
$db = $database->getConnection();

// get posted data
$data = json_decode(file_get_contents("php://input"));


// get jwt
$jwt = isset($data->jwt) ? $data->jwt : "";
$ID_ROW = isset($data->ID_ROW) ? $data->ID_ROW : -1;
$idOspite = isset($data->idOspite) ? $data->idOspite : -1;
$nomeOspite = isset($data->nomeOspite) ? $data->nomeOspite : '';

if (!empty($jwt) && !empty($ID_ROW)) {

        // decode jwt, nella classe Token, se è valido il token pasato, viene rinnovata la data ora...
        $jwt = new token($jwt, $key);

        if ($jwt->isValid()) {

            $log = new Log($db, $jwt->GetDbStruttura());
            $schIso =  new schIsolamento($db, $jwt->GetDbStruttura(), $data->dbschema);

            // set product property values
            $schIso->ID_ROW = $ID_ROW;
            $schIso->idUserDel = $jwt->GetIdUserLogin();

            $res = $schIso->delete();

            if ($res){

                //Registro il log dell'operazione....
                $log->nomeComputer = $_SERVER['REMOTE_ADDR'];
                $log->applicazione = 'WEBOASI';
                $log->dataOra = date('Y-m-d H:i:s'); //
                $log->tipo = 'WARNING';
                $log->messaggio = 'Parametri elminati per l\'ospite id_row = '. $ID_ROW  .' id_ospite:' . $idOspite . ', NOME:' . $nomeOspite . ', alle:' . $log->dataOra . ' dall\'utente:' . $jwt->GetNomeUtente();
                $log->errore = '';
                $log->create();
                //-----------------------------------

                // set response code - 201 created
                http_response_code(201);

                // tell the user
                echo json_encode(array(  "message" => "Parametri $nomeOspite eliminati correttamente!"
                    , "ID_ROW"=> $ID_ROW
                    , "jwt"=>$jwt->GetToken()
                    )
                );

            } else {
                // set response code - 503 service unavailable
                http_response_code(503);

                // tell the user
                echo json_encode(array("message" => "Unable to DELETE, error in the delete"));
            }

        } else {
            http_response_code(500); //inernal error
            echo json_encode(array(
                "message" => "Token scaduto, verrai reindirizzato alla pagina di Login",
                "error" => "TOKEN SCADUTO"
            ));
        }

} else {
    // set response code - 400 bad request
    http_response_code(400);

    // tell the user
    echo json_encode(array("message" => "Unable to insert PARAMETRI OSPITE Data is incomplete."));
}
