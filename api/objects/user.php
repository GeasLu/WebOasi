<?php

$docRoot = $_SERVER['DOCUMENT_ROOT'];
include_once $docRoot.'/weboasi/api/config/core.php';

// 'user' object
class User {

    // database connection and table name
    private $conn;
    private $dbStruttura;
    private $table_name = ".dbo.vINFO_UTENTI_WEB";
    public $ID_UTENTE;
    public $UTENTE;
    public $NOME_UTENTE;
    public $PSW;
    public $ID_LIVELLO;
    public $DESCR_LIVELLO;
    public $PC_CORRENTE;
    public $DATA_SCADENZA;
    public $PROROGA_8ORE;
    public $COD_SEGRETO_GESTIONALE;
    public $ANNULLATO;
    public $psw_hash;
    public $PathImg;
    
    // constructor
    public function __construct($db, $dbStruttura) {
        $this->conn = $db;
        $this->dbStruttura = $dbStruttura;
        $this->table_name = $this->dbStruttura . $this->table_name;
    }
    ///
    /// Usata per il controllo della pasword!!!!!!
    ///
    function utenteExists() {
        //Luke 24/03/2020

        global $PathImgDip;

        //
        // query to check if email exists
        $query = "SELECT * \n"
                . "FROM ". $this->table_name . " \n"
                . "WHERE UTENTE = :UTENTE";
        
        //var_dump($query);
        
        // prepare the query
        $stmt = $this->conn->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));

        // sanitize
        $this->UTENTE = htmlspecialchars(strip_tags($this->UTENTE));

        // bind given email value
        $stmt->bindParam(":UTENTE", $this->UTENTE);
        
        try {
            // execute the query
            $stmt->execute();
        } catch (PDOException $ex) {
            echo $ex;
            return false;
        }
        
        // get number of rows
        $num = $stmt->rowCount();

        // if email exists, assign values to object properties for easy access and use for php sessions
        if ($num > 0) {

            // get record details / values
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            // assign values to object properties
            $this->ID_UTENTE = $row['ID_UTENTE'];
            $this->UTENTE = $row['UTENTE'];
            $this->PSW = $row['PSW'];
            $this->ID_LIVELLO = $row['ID_LIVELLO'];
            $this->DESCR_LIVELLO = $row['DESCR_LIVELLO'];
            $this->PathImg= $PathImgDip . $row['ID_UTENTE'] .'.jpg';
            $this->NOME_UTENTE = $row['NOME_UTENTE'];
            
            // return true because UTENTE exists in the database
            return true;
        }

        // return false if UTENTE does not exist in the database
        return false;
    }

    // create new user record
    function create() {

        // insert query
        $query = "INSERT INTO " . $this->table_name . "
            SET
                firstname = :firstname,
                lastname = :lastname,
                email = :email,
                password = :password";

        // prepare the query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->firstname = htmlspecialchars(strip_tags($this->firstname));
        $this->lastname = htmlspecialchars(strip_tags($this->lastname));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = htmlspecialchars(strip_tags($this->password));

        // bind the values
        $stmt->bindParam(':firstname', $this->firstname);
        $stmt->bindParam(':lastname', $this->lastname);
        $stmt->bindParam(':email', $this->email);

        // hash the password before saving to database
        $password_hash = password_hash($this->password, PASSWORD_BCRYPT);
        $stmt->bindParam(':password', $password_hash);

        // execute the query, also check if query was successful
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function readEventViewer($pIdEvent) {
        // Luke 29/07/2020

        // Seleziona tutti i visualizzatori dell'evento passato
        $query = "select EU.* \n"
            . "        , IUW.NOME_UTENTE \n"
            . "        , IUW.UTENTE \n"
            . "FROM " . $this->dbStruttura . ".Scadenze.eventi_userviewer EU \n"
            . "Inner join ". $this->table_name . " IUW on IUW.ID_UTENTE = EU.idUser and IUW.ANNULLATO = 0 \n"
            . "where idEvento = :idEvento  \n";
            //. "  and flagVis = 1 ";

        // prepare query statement
        $stmt = $this->conn->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        $stmt->bindParam(":idEvento", $pIdEvent);

        try {
            // execute query
            $stmt->execute();
            return $stmt;
        } catch (Exception $e) {
            return $e;
        }
    }

    function GetPathImg (){
        //Luke 31/07/2020
        return $this->PathImg;
    }

}
