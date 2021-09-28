<?php

//Luke 03/03/2020
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/Event/ricorrenza.php';
include_once '../objects/token.php';

//leggo i dati in json POST
$data = json_decode(file_get_contents("php://input"));

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

// get jwt
$jwt = isset($data->jwt) ? $data->jwt : "";

$dataStart = isset($data->dataStart) ? $data->dataStart : date('Y-m-d');

//var_dump($data);
//var_dump($jwt);

// if jwt is not empty
if ($jwt) {

    try {
        // decode jwt, nella classe Token, se è valido il token pasato, viene rinnovata la data ora...
        $jwt = new token($jwt, $key);
        //var_dump($jwt);

        if ($jwt->isValid()) {
            // initialize object

            $ric = new ricorrenza($db, $jwt->GetDbStruttura(), $data->schema);
            /* TEST G1
            $ric->tipoRic = 'G1';
            $ric->G1_num_GG = 3;
            $ric->END_C = true;
            $ric->END_C_END = date('Y-m-d', strtotime($dataStart . '+1 year' ));
            */
            /* TEST G2
            $ric->tipoRic = 'G2';
            $ric->END_C = true;
            $ric->END_C_END = date('Y-m-d', strtotime($dataStart . '+1 year' ));
            */

            /* TEST S1
            $ric->tipoRic = 'S1';
            $ric->S1_num_SETT= 3;
            $ric->S1_gg_SETT = '1100111';
            $ric->END_C = true;
            $ric->END_C_END = date('Y-m-d', strtotime($dataStart . '+1 year' ));
            */

            /* TEST M1
            $ric->tipoRic = 'M1';
            $ric->M1_num_MESI= 2;
            $ric->M1_num_GG = 3;
            $ric->END_C = true;
            $ric->END_C_END = date('Y-m-d', strtotime($dataStart . '+1 year' ));
            */

            /* TEST M2
            $ric->tipoRic = 'M2';
            $ric->M2_gg_ORD = 'Terzo/a';
            $ric->M2_gg_SETT = 'Mercoledì';
            $ric->M2_num_MESI = 3;
            $ric->END_C = true;
            $ric->END_C_END = date('Y-m-d', strtotime($dataStart . '+10 year' ));
            */

            /* TEST A1
            $ric->tipoRic = 'A1';
            $ric->A_num_ANNO = 1;
            $ric->A1_mese = 'Marzo';
            $ric->A1_gg = 3;
            $ric->END_C = true;
            $ric->END_C_END = date('Y-m-d', strtotime($dataStart . '+10 year' ));
            */

            $ric->tipoRic = 'A2';
            $ric->A_num_ANNO = 2;
            $ric->A2_MESE = 'Giugno';
            $ric->A2_gg_ORD = 'Quarto/a';
            $ric->A2_gg_SETT = 'Lunedì';
            $ric->END_C = true;
            $ric->END_C_END = date('Y-m-d', strtotime($dataStart . '+20 year' ));

            $arrayTmp = $ric->calcolaRicorrenze($dataStart);
            $desc = $ric->GeneraStringaRic($dataStart);

            //var_dump($arrayTmp);

            if (isset($arrayTmp)) {
                // set response code - 200 OK
                http_response_code(200);

                echo json_encode(array(
                    "eventi" => $arrayTmp,
                    "desc" => $desc,
                    "jwt" => $jwt->GetToken() // token rigenerato e aggiornato
                ));
            } else {
                throw new Exception('Problemi nella restituzione dell\'array eventi');
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
} else {

    // set response code
    http_response_code(500); //inernal error
    // tell the user access denied  & show error message
    echo json_encode(array(
        "message" => "Access denied. Eccezione interna",
        "error" => "token non valido"
    ));

}

