<?php
//Controller per la gestione del login utente reindirizza a home oppure alla forma di login nuovamente inc aso di errore
session_start();

// required headers
header("Access-Control-Allow-Origin: http://{$_SERVER['HTTP_HOST']}/WebOasi/page/page-login.php");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


// generate json web token
include_once '../api/config/core.php';
include_once '../api/libs/php-jwt-master/src/BeforeValidException.php';
include_once '../api/libs/php-jwt-master/src/ExpiredException.php';
include_once '../api/libs/php-jwt-master/src/SignatureInvalidException.php';
include_once '../api/libs/php-jwt-master/src/JWT.php';
include_once '../api/objects/log.php';
include_once '../api/config/database.php';
include_once '../api/objects/user.php';
include_once '../common/helper.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// instantiate user object
$user = new User($db);

// get posted data
//$data = json_decode(file_get_contents("php://input"));

//i dati li leggo direttament ein $_POST
// set product property values
$user->UTENTE = $_POST['txtUtente'];
$utente_exists = $user->utenteExists();

use \Firebase\JWT\JWT;

$database = new Database();
$db = $database->getConnection();
$log = new Log($db);

// check if email exists and if password is correct
if ($utente_exists && ($_POST['txtPass'] === $user->PSW)) {
    //elimino le variabile dall'ambiete POST
    unset($_POST['txtUtente'], $_POST['txtPass']);
    
    $token = array(
        "iss" => $iss,
        "aud" => $aud,
        "iat" => $iat,
        "nbf" => $nbf,
        "data" => array(
            "ID_UTENTE" => $user->ID_UTENTE,
            "UTENTE" => $user->UTENTE,
            "ID_LIVELLO" => $user->ID_LIVELLO,
            "DATA_ORA_TOKEN" => date('Y-m-d H:i:s')
        )
    );

    // set response code
    // generate jwt
    $jwt = JWT::encode($token, $key);

    //Inserisco nella sessione il token che contiene le info del mio utente
    $_SESSION['JWT'] = $jwt;

    //Registro il log dell'operazione....
    $log->nomeComputer = $_SERVER['REMOTE_ADDR'];
    $log->applicazione = 'login';
    $log->dataOra = date('Y-m-d H:i:s'); //
    $log->tipo = 'information';
    $log->messaggio = 'ACCESSO OK,  UTENTE:' . $user->UTENTE . ', ORE:' . $log->dataOra;
    $log->errore = '';
    $log->create();
    //-----------------------------------

    http_response_code(200);

    $response = array(
        "message" => "Successful login.",
        "message_note" => "",
        "message_system" => "no message system",
        "success" => true
    );
    $_SESSION['responseLogin'] = $response;
   
       
    //---- mando all Home Page
    header("location: ../page/page-home.php");
}
// login failed
else {
    //Registro il log dell'operazione....
    $log->nomeComputer = $_SERVER['REMOTE_ADDR'];
    $log->applicazione = 'login';
    $log->dataOra = date('Y-m-d H:i:s'); //
    $log->tipo = 'information';
    $log->messaggio = 'ACCESSO NEGATO - UTENTE o PASSWORD NON VALIDI, UTENTE:' . $user->UTENTE . ', pass errata:' . $_POST['txtPass'] . ', ORE:' . $log->dataOra;
    $log->errore = 'UTENTE o PASSWORD NON VALIDI';
    $log->create();
    //----------------------------------- ACCESSO NEGATO - UTENTE o PASSWORD NON VALIDI -> UTENTE:Paola pass errata:Z1G0ZAG0, ORE:02/08/2019 18:35:00

    $response = array(
        "message" => "ACCESSO NEGATO!",
        "message_note" => "Username o password errati",
        "message_system" => "Tentativo LOGGATO per l' utente:".$user->UTENTE." alle ore:".$log->dataOra ,
        "success" => false
    );
    $_SESSION['responseLogin'] = $response;
    //rimando alla login con messaggio di errore
    header("location: ../page/page-login.php");
    exit;
}
?>

