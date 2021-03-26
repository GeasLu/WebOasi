<?php
//Luke 29/07/2020

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/user.php';
include_once '../objects/token.php';

//leggo i dati in json POST
$data = json_decode(file_get_contents("php://input"));

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

// get jwt
$jwt = isset($data->jwt) ? $data->jwt : "";
$idEventSearch = isset($data->idEvento) ? $data->idEvento : -1;

// if jwt is not empty
if ($jwt && $idEventSearch>-1) {

    try {
        // decode jwt, nella classe Token, se è valido il token pasato, viene rinnovata la data ora...
        $jwt = new token($jwt, $key);

        if ($jwt->isValid()) {
            // initialize object
            $user = new User($db, $jwt->GetDbStruttura());
            $stmt = $user->readEventViewer($idEventSearch);
            $num = $stmt->rowCount();

            // users array
            $user_arr = array();
            $user_arr["records"] = array();

            if($num>0) {
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

                    $user_item = array(
                        "idRow" => $row['idRow'],
                        "idEvento" => $row['idEvento'],
                        "idUser" => $row['idUser'],
                        "flagVis" => $row['flagVis'],
                        "flagMod" => $row['flagMod'],
                        "flagDel" => html_entity_decode($row['flagDel']),
                        "flagPrint" => $row['flagPrint'],
                        "NOME_UTENTE" => $row['NOME_UTENTE'],
                        "UTENTE" => $row['UTENTE'],
                        "IMG" => $PathImgDip.$row['idUser'].'.jpg',
                        "MODIFICA" => '',
                        "ELIMINA" => '',

                    );

                    array_push($user_arr["records"] , $user_item);
                }

            } else {
                //throw new Exception('Nessun UserViever');

            }

            //var_dump($eventi);

            if (isset($user_arr)) {
                // set response code - 200 OK
                http_response_code(200);

                echo json_encode(array(
                    "eventi" => $user_arr["records"],
                    "jwt" => $jwt->GetToken() // token rigenerato e aggiornato
                ));

            } else {
                throw new Exception('Problemi nella restituzione dell\'array UserViewer');
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