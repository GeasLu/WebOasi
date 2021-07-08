<?php

//Luke 11/06/2020
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/Event/eventi_testata.php';
include_once '../objects/Event/eventi_dett.php';
include_once '../objects/Event/ricorrenza.php';
include_once '../objects/Event/user_viewer.php';
include_once '../objects/token.php';

//leggo i dati in json POST
$data = json_decode(file_get_contents("php://input"));

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

// get jwt
$jwt = isset($data->jwt) ? $data->jwt : "";

$saveOk = false;

// if jwt is not empty
if ($jwt) {

    try {
        // decode jwt, nella classe Token, se è valido il token pasato, viene rinnovata la data ora...
        $jwt = new token($jwt, $key);
        $dE = isset($data->datiEvento) ? $data->datiEvento : "";
        $elnDate = array();
        $elnEvDett = array();

        if ($jwt->isValid() && $dE) {

            // initialize object
            $eT = new EventiTestata($db, $jwt->GetDbStruttura(), $data->dbschema);
            $ric = new ricorrenza($db, $jwt->GetDbStruttura(), $data->dbschema );

            // Valorizzo la ricorrenza
            $ric->tipoRic = $dE->hTipoRic;
            $ric->startDate = $dE->hSTART_TIME;
            $ric->END_C = $dE->hEND_C;
            $ric->END_C_END = $dE->hEND_C_END;
            $elnDate = $ric->calcolaRicorrenze($dE->hSTART_TIME);
            $ric->descrizione =$ric->GeneraStringaRic();
            //***************

            // SALVO EVENTO TESTATA
            $eT->Initialize(-1, $jwt->GetIdUserLogin(), $dE->hSTART_TIME, $dE->hEND_C_END );

            $eT->evento = $dE->evento ;
            $eT->evento_esteso = $dE->evento_esteso ;
            $eT->classCSS = $dE->classCSS;
            $idEventoNew = $eT->Create();

            if ($idEventoNew>0) {
                //SALVO EVENTO DETTAGLIO
                $eD = new EventiDett($db, $jwt->GetDbStruttura(), $data->dbschema);
                $eD->Initialize(-1,$jwt->GetIdUserLogin());
                $eD->idEvento = $idEventoNew;
                $eD->dataInizio =$eT->dataInizio;
                $eD->dataFine = $eT->dataFine;
                $eD->note = "" ;
                $eD->idUserNote = -1;
                $eD->dataUserNote = "";
                $eD->idRegistro = -1;
                $eD->flagRegistrazione = false;
                $idRow = $eD->Create();
                if($idRow>-1){
                    //SALVO LA RICORRENZA
                    $idRic = $ric->create();
                    if($idRic){
                        //aggiorno la ricorrenza sul record della testata....
                        $eT->ID_RICORRENZA = $idRic;
                        $res = $eT->update();
                        if(isset($res)){
                            //a questo punto devo salvare anche gli user viewer
                            $uV = new user_viewer($db, $jwt->GetDbStruttura(), $data->dbschema);
                            $uV->idEvento = $idEventoNew;
                            $uV->idUser = $jwt->GetIdUserLogin();
                            $uV->flagVis = 1;
                            $uV->flagMod = 1;
                            $uV->flagDel = 0;
                            $uV->flagPrint = 1;
                            $res = $uV->create();
                            if ($res){
                                $saveOk = true;
                            }
                        }
                    }
                }
            }

            if ($saveOk) {
                // set response code - 200 OK
                http_response_code(200);

                echo json_encode(array(
                    "idEvento" => $idEventoNew,
                    "jwt" => $jwt->GetToken() // token rigenerato e aggiornato
                ));
            } else {
                // RollBack degl inserimenti
                isset($uV)?$uV->delete($idEventoNew):'';
                isset($ric)&&isset($idRic)?$ric->delete($idRic):'';
                isset($eD)?$eD->delete($idEventoNew):'';
                isset($uV)?$eT->delete($idEventoNew):'';
                //**************************************

                throw new Exception('Problemi nella durante il salvataggio dell\'evento');
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
}

function CalcolaElencoDett(){
    //Luke 16/03/2021



}