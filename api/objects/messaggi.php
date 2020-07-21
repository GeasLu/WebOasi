<?php

class Messaggi {

    // database connection and table name
    private $conn;
    private $dbStruttura;
    private $table_name = "Messaggi.vMessaggi";
    private $idUserLogin;
    
    // object properties

    public function __construct($db, $dbStruttura, $IdUserLogin) {
        $this->conn = $db;
        $this->dbStruttura = $dbStruttura;
        $this->table_name = "$dbStruttura.$this->table_name";
        $this->idUserLogin = $IdUserLogin;
    }

    public function readAll($pidCom) {
        //Luke 28/05/2020
        
        // select all query
        $query = "SELECT V.* "
                . "     , Messaggi.MES_GetSeDaLeggere(V.ID_MESS, :idUserLogin) DA_LEGGERE "
                . "FROM " . $this->table_name . " as V";
        $query .= "Where V.ID_COM = :idCom";
        
        // prepare query statement
        $stmt = $this->conn->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));

        // bind values
        $stmt->bindParam(":idCom", $pidCom);
        $stmt->bindParam(":idUserLogin", $this->idUserLogin);
     

        try {
            // execute query
            $stmt->execute();
            return $stmt;
        } catch (Exception $e) {
            return $e;
        }
        
    }

}
