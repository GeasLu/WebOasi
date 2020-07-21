<?php
// required headers
header("Access-Control-Allow-Origin: http://{$_SERVER['HTTP_HOST']}/WebOasi/page/page-login.php");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// database connection will be here
// files needed to connect to database
include_once 'config/database.php';
include_once 'objects/user.php';

// generate json web token
include_once 'config/core.php';
include_once 'libs/php-jwt-master/src/BeforeValidException.php';
include_once 'libs/php-jwt-master/src/ExpiredException.php';
include_once 'libs/php-jwt-master/src/SignatureInvalidException.php';
include_once 'libs/php-jwt-master/src/JWT.php';
include_once 'objects/log.php';
include_once 'objects/strutture.php';

use \Firebase\JWT\JWT;


// get database connection
$database = new Database();
$db = $database->getConnection();

// get posted data
$data = json_decode(file_get_contents("php://input"));

$username = $data->username;  
$password = $data->password;  

$struttura = new Strutture($db);

$struttura->idStruttura = $data->idStruttura;
$struttura->readOne();

// instantiate user object
$user = new User($db, $struttura->db);
//istanzio il log a db
$log = new Log($db,$struttura->db);

// set product property values
$user->UTENTE = $username;
$utente_exists = $user->utenteExists();

// check if email exists and if password is correct
if ($utente_exists && ($password === $user->PSW)) {

    $token = array(
        "iss" => $iss,
        "aud" => $aud,
        "iat" => $iat,
        "nbf" => $nbf,
        "data" => array(
            "ID_UTENTE" => $user->ID_UTENTE,
            "UTENTE" => $user->UTENTE,
            "ID_LIVELLO" => $user->ID_LIVELLO,
            "DATA_ORA_TOKEN" => date('Y-m-d H:i:s'),
            "idStruttura" => $struttura->idStruttura,
            "descStruttura" => $struttura->descrizione,
            "dbStruttura" => $struttura->db,
            "NomeUtente" => $user->NOME_UTENTE,
            "descLivello" => $user->DESCR_LIVELLO,
            "PathImg" => $user->PathImg
        )
    );

    // set response code
    http_response_code(200);

    // generate jwt
    $jwt = JWT::encode($token, $key);
   
    //Registro il log dell'operazione....
    $log->nomeComputer = $_SERVER['REMOTE_ADDR'];
    $log->applicazione = 'login';
    $log->dataOra = date('Y-m-d H:i:s'); //
    $log->tipo = 'information';
    $log->messaggio = 'ACCESSO OK,  UTENTE:' . $user->UTENTE . ', ORE:' . $log->dataOra . ', Struttura selezionata:' . $struttura->descrizione .'(' . $struttura->idStruttura .')';
    $log->errore = '';
    $log->create();
    //-----------------------------------
    
    echo json_encode(
            array(
                "message_title" => "Successful login.",
                "message_body" => "Bentornato/a $user->UTENTE",
                "message_system" => "",
                "jwt" => $jwt
            )
    );
}
// login failed
else {

    //Registro il log dell'operazione....
    $log->nomeComputer = $_SERVER['REMOTE_ADDR'];
    $log->applicazione = 'login';
    $log->dataOra = date('Y-m-d H:i:s'); //
    $log->tipo = 'information';
    $log->messaggio = 'ACCESSO NEGATO - UTENTE o PASSWORD NON VALIDI, UTENTE:' . $user->UTENTE . ', pass errata:' . $password . ', ORE:' . $log->dataOra;
    $log->errore = 'UTENTE o PASSWORD NON VALIDI';
    $log->create();
    //----------------------------------- ACCESSO NEGATO - UTENTE o PASSWORD NON VALIDI -> UTENTE:Paola pass errata:Z1G0ZAG0, ORE:02/08/2019 18:35:00
    
    // set response code
    http_response_code(401);

    // tell the user login failed
    echo json_encode(array(
                           "message_title" => "Login failed! ",
                           "message_body" => "Username or password incorrect",
                           "message_system" => "Tentativo (loggato) di login fallito utente: $username e Password: $password alle ore: ".$log->dataOra
                          ));
}
