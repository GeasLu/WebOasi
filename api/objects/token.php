<?php
/* Luke 02/04/2020 */
error_reporting(E_ALL);

// required to decode jwt
$docRoot = $_SERVER['DOCUMENT_ROOT'];
include_once $docRoot.'/weboasi/api/config/core.php';
include_once $docRoot.'/weboasi/api/libs/php-jwt-master/src/BeforeValidException.php';
include_once $docRoot.'/weboasi/api/libs/php-jwt-master/src/ExpiredException.php';
include_once $docRoot.'/weboasi/api/libs/php-jwt-master/src/SignatureInvalidException.php';
include_once $docRoot.'/weboasi/api/libs/php-jwt-master/src/JWT.php';

use \Firebase\JWT\JWT;

class token {

    private $Jwt;
    private $Key;
    private $IdUtente;
    private $Utente;
    private $NomeUtente;
    private $idLivello;
    private $DataOraCreate;
    private $Valid;
    private $idStruttura;
    private $descStruttura;
    private $dbStruttura;
    private $descLivello;
    private $PathImg;

    // constructor with $db as database connection
    public function __construct($pJwt, $pKey="") {
        //di base setto il token come valido...
        $this->Valid = true;
        if ($pJwt != '') {
            $this->Key = $pKey;
            $this->Jwt = $pJwt;
            $this->ReadToken();
        } else { //se entra in reset property lo rende invalido...
            $this->ResetProperty();
        }
    }

    public function ReNew() {
        //Luke 17/06/2020
        
        global $iss, $aud, $iat, $nbf;
        
        $token = array(
        "iss" => $iss,
        "aud" => $aud,
        "iat" => $iat,
        "nbf" => $nbf,
        "data" => array(
            "ID_UTENTE" => $this->IdUtente ,
            "UTENTE" => $this->Utente ,
            "ID_LIVELLO" => $this->idLivello,
            "DATA_ORA_TOKEN" => date('Y-m-d H:i:s'),
            "idStruttura" => $this->idStruttura ,
            "descStruttura" => $this->descStruttura,
            "dbStruttura" => $this->dbStruttura,
            "NomeUtente" => $this->NomeUtente,
            "descLivello" => $this->descLivello,
            "PathImg" => $this->PathImg 
        )
    );
        
    // generate jwt
    $this->Jwt = JWT::encode($token, $this->Key);

    }    
          
    
    private function ReadToken() {

        $decoded = JWT::decode($this->Jwt, $this->Key, array('HS256'));

        if (isset($decoded->data->ID_UTENTE) && isset($decoded->data->UTENTE) && isset($decoded->data->ID_LIVELLO)) {
            $this->IdUtente = $decoded->data->ID_UTENTE;
            $this->Utente = $decoded->data->UTENTE;
            $this->idLivello = $decoded->data->ID_LIVELLO;
            $this->DataOraCreate = $decoded->data->DATA_ORA_TOKEN;
            $this->idStruttura = $decoded->data->idStruttura;
            $this->descStruttura = $decoded->data->descStruttura;
            $this->dbStruttura = $decoded->data->dbStruttura;
            $this->NomeUtente = $decoded->data->NomeUtente;
            $this->descLivello = $decoded->data->descLivello;
            $this->PathImg = $decoded->data->PathImg;
        }
        
        $this->Valid = $this->ValidateToken();
        if ($this->Valid) {
            $this->ReNew();
        }
        
    }

    private function ValidateToken(){
        //Luke 18/06/2020
        
        global $MinScadenzaToken;
        
         //converto in datatime        
        $this->DataOraCreate = DateTime::createFromFormat('Y-m-d H:i:s', $this->DataOraCreate);
        $Now = DateTime::createFromFormat('Y-m-d H:i:s', date('Y-m-d H:i:s'));

        $interval = date_diff($this->DataOraCreate, $Now);
        
        // Interval %i prende il valore di minuti....
        if ($interval->format('%i') > $MinScadenzaToken) {
            return false; 
        } else {
            return true; 
        }

    }
    
    private function ResetProperty() {
        // se il token è vuoto resetto tutte le property oppure il token non contiene i campi da me aspettati
        $this->IdUtente = -1;
        $this->Utente = '';
        $this->idLivello = -1;
        $this->DataOraCreate = 0;
        $this->Valid = false;
        $this->idStruttura = -1;
        $this->descStruttura = "";
        $this->dbStruttura = "";
        $this->NomeUtente = '';
        $this->$descLivello = '';
        $this->PathImg = '';
    }
    
    public function isValid(){
        return $this->Valid;
    }
    
    public function GetToken() {
        return $this->Jwt;
    }
        
    public function GetIdUserLogin() {
        return $this->IdUtente;
    }

    public function GetUserLogin() {
        return $this->Utente;
    }
    
    public function GetIdlivello() {
        return $this->idLivello;
    }

    public function GetDtHCreate() {
        return $this->DataOraCreate;
    }
    
    public function GetIdStruttura() {
        return $this->idStruttura;
    }
    
    public function GetDescStruttura() {
        return $this->descStruttura;
    }
    
    public function GetDbStruttura() {
        return $this->dbStruttura;
    }
        
    public function GetNomeUtente() {
        return $this->NomeUtente;
    }
    
    public function GetDescLivello() {
        return ucfirst(strtolower($this->descLivello));
    }
    
    public function GetPathImg() {
        return $this->PathImg;
    }
    
    public function SetPathImg($pPathDirImg) {
        $this->PathImg = $pPathDirImg . $this->PathImg;
    }
}
