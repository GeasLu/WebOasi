<?php
//Luke 25/03/2020
//
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// required to decode jwt
include_once 'config/core.php';
include_once 'libs/php-jwt-master/src/BeforeValidException.php';
include_once 'libs/php-jwt-master/src/ExpiredException.php';
include_once 'libs/php-jwt-master/src/SignatureInvalidException.php';
include_once 'libs/php-jwt-master/src/JWT.php';

use \Firebase\JWT\JWT;

//leggo i dati in json POST
$data = json_decode(file_get_contents("php://input"));

// get jwt
$jwt = isset($data->jwt) ? $data->jwt : "";

// if jwt is not empty
if ($jwt) {

    // if decode succeed, show user details
    try {
        // decode jwt
        $decoded = JWT::decode($jwt, $key, array('HS256'));
        
        //converto in datatime        
        $decoded->data->DATA_ORA_TOKEN = DateTime::createFromFormat('Y-m-d H:i:s', $decoded->data->DATA_ORA_TOKEN);
        $Now = DateTime::createFromFormat('Y-m-d H:i:s', date('Y-m-d H:i:s'));

        $interval = date_diff($decoded->data->DATA_ORA_TOKEN, $Now);
        
        // Interval %i prende il valore di minuti....
        if ($interval->format('%i') > $MinScadenzaToken) {
            //Luke 25/03/2020
            //
            // set response code
            http_response_code(401);

            // tell the user access denied  & show error message
            echo json_encode(array(
                "message" => "Access denied. Token Scaduto",
                "error" => 'Token scaduto da : '.$interval->format('%i').' min'
            ));
        } else {
            
            // set response code
            http_response_code(200);
            
            // show user details
            echo json_encode(array(
                "message" => "Access granted.",
                "data" => $decoded->data
            ));
        }
    }
    // if decode fails, it means jwt is invalid
    catch (Exception $e) {

        // set response code
        http_response_code(500); //inernal error

        // tell the user access denied  & show error message
        echo json_encode(array(
            "message" => "Access denied. Eccezione interna",
            "error" => $e->getMessage()
        ));
    }
}
/// show error message if jwt is empty
else {

    // set response code
    http_response_code(500);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied. Token vuoto"));
}