<?php

class Strutture {

    // database connection and table name
    private $conn;
    private $table_name = "Comune.STRUTTURE";
    
// object properties
    public $idStruttura;
    public $descrizione;
    public $db;
    public $flagAttivo;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    function readAll() {

        // select all query
        $query = "SELECT * \n"
                . "FROM " . $this->table_name . " \n"
                . "WHERE flagAttivo = 1 \n"
                . "ORDER BY descrizione ";
        // prepare query statement

        $stmt = $this->conn->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        try {
            // execute query
            $stmt->execute();
            return $stmt;
        } catch (Exception $e) {
            return $e;
        }
    }
   
    // used when filling up the update product form
    function readOne() {
        //Luke 16/04/2020
        // query to read single record
        $query = "SELECT TOP(1) * \n"
                . "FROM " . $this->table_name . " \n"
                . "WHERE flagAttivo = 1 ";
                if($this->idStruttura > -1) {
                    $query .= "  AND idStruttura = :idStruttura \n";    
                }
        $query .= "ORDER BY flagDefault DESC"; 
                

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        if($this->idStruttura > -1) {
            // bind id of product to be updated
            $stmt->bindParam(":idStruttura", $this->idStruttura);
        }
    
        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // set values to object properties
        $this->descrizione = $row['descrizione'];
        $this->db = $row['db'];
        $this->flagAttivo = $row['flagAttivo'];

    }
    
        
}
