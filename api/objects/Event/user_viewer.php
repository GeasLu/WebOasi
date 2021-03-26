<?php

/* Luke 10/06/2020 */
error_reporting(E_ALL);

include_once 'eventi_dett.php';
include_once 'ricorrenza.php';

class user_viewer {

    // database connection and table name
    private $conn;
    private $dbStruttura;
    private $Schema;
    private $table_name = "eventi_userviewer";

    // object properties
    public $idRow;
    public $idEvento;
    public $idUser; //riferito al campo ID_UTENTE della tabella ANAG_UTENTI
    public $flagVis;
    public $flagMod;
    public $flagDel;
    public $flagPrint;

    // constructor with $db as database connection
    public function __construct($pDb, $pDbStruttura, $pSchema) {
        $this->conn = $pDb;
        $this->dbStruttura = $pDbStruttura;
        $this->Schema = $pSchema;
        $this->table_name = "$pDbStruttura.$pSchema.$this->table_name";
    }

    function readAll() {
        //Luke 24/03/2021

        try{

            // query to read single record
            $query = "SELECT uV.* \n"
                . "FROM " . $this->table_name . " as uV \n"
                . "WHERE  uV.idEvento = :idEvento ";

            // prepare query statement
            $stmt = $this->conn->prepare($query);

            // bind id of product to be updated
            $stmt->bindParam(":idEvento", $this->idEvento);

            // execute query
            $stmt->execute();
            $eln = array();

            // get retrieved row
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $num = $stmt->rowCount();
            // check if more than 0 record found
            if ($num > 0) {

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

                    $event_item = array(
                        "idRow" => $row['idRow'],
                        "idEvento" => $row['idEvento'],
                        "idUser" => $row['idUser'],
                        "flagVis" => $row['flagVis'],
                        "flagMod" => $row['flagMod'],
                        "flagDel" => $row['flagDel'],
                        "flagPrint" => $row['flagPrint']
                    );

                    array_push($eln, $event_item);
                }
            }

            return $eln;

        } catch (Exception $e) {
            return $e;
        }

    }

    function readOne($pidRow) {
        //Luke 24/03/2021

        try{

            // query to read single record
            $query = "SELECT uV.* \n"
                . "FROM " . $this->table_name . " as uV \n"
                . "WHERE  uV.idRow = :idRow ";

            // prepare query statement
            $stmt = $this->conn->prepare($query);

            // bind id of product to be updated
            $stmt->bindParam(":idRow", $pidRow);

            // execute query
            $stmt->execute();

            // get retrieved row
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            // check if more than 0 record found
            if ($row ) {

                $this->idRow = $pidRow;
                $this->idEvento = $row['idEvento'];
                $this->idUser = $row['idUser'];
                $this->flagVis = $row['flagVis'];
                $this->flagMod = $row['flagMod'];
                $this->flagDel = $row['flagDel'];
                $this->flagPrint = $row['flagPrint'];

            }

            return $pidRow;

        } catch (Exception $e) {
            return $e;
        }

    }

    function create(){
        //Luke 24/03/2021

        try {

            $query = "INSERT INTO " . $this->table_name . "(idEvento \n"
                .    "                                     ,idUser \n"
                .    "                                     ,flagVis \n"
                .    "                                     ,flagMod \n"
                .    "                                     ,flagDel \n"
                .    "                                     ,flagPrint) \n"
                ." VALUES (:idEvento \n"
                ."        ,:idUser \n"
                ."        ,:flagVis \n"
                ."        ,:flagMod \n"
                ."        ,:flagDel \n"
                ."        ,:flagPrint) \n";

            //var_dump($query);

            // prepare query
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->SanitizeProperty();

            // bind values
            $stmt->bindParam(":idEvento", $this->idEvento);
            $stmt->bindParam(":idUser", $this->idUser);
            $stmt->bindParam(":flagVis", $this->flagVis);
            $stmt->bindParam(":flagMod", $this->flagMod);
            $stmt->bindParam(":flagDel", $this->flagDel);
            $stmt->bindParam(":flagPrint", $this->flagPrint);

            // execute query
            if ($stmt->execute()) {
                $this->idRow =$this->conn->lastInsertId();
                return $this->idRow;
            }
            var_dump($stmt->errorInfo());
            return 0;

        } catch(PDOException $e){
            var_dump($e);
        }

    }

    private function SanitizeProperty(){
        //Luke 24/03/2021
        $this->idEvento = htmlspecialchars(strip_tags($this->idEvento));
        $this->idUser = htmlspecialchars(strip_tags($this->idUser));
        $this->flagVis = htmlspecialchars(strip_tags($this->flagVis));
        $this->flagMod = htmlspecialchars(strip_tags($this->flagMod));
        $this->flagDel = htmlspecialchars(strip_tags($this->flagDel));
        $this->flagPrint = htmlspecialchars(strip_tags($this->flagPrint));
    }

    function update(){
        //Luke 08/03/2021

        try {

            $query = "UPDATE " . $this->table_name . " \n"
                .    "   SET  idEvento =:idEvento\n"
                .    "     ,  idUser =:idUser \n"
                .    "     ,  flagVis =:flagVis \n"
                .    "     ,  flagMod =:flagMod \n"
                .    "     ,  flagDel =:flagDel \n"
                .    "     ,  flagPrint =:flagPrint \n"
                ."WHERE idRow=:idRow \n";
            // prepare query
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->SanitizeProperty();

            // bind values
            $stmt->bindParam(":idRow", $this->idRow);
            $stmt->bindParam(":idEvento", $this->idEvento);
            $stmt->bindParam(":idUser", $this->idUser);
            $stmt->bindParam(":flagVis", $this->flagVis);
            $stmt->bindParam(":flagMod", $this->flagMod);
            $stmt->bindParam(":flagDel", $this->flagDel);
            $stmt->bindParam(":flagPrint", $this->flagPrint);

            // execute query
            if ($stmt->execute()) {
                $lastId =$this->conn->lastInsertId();
                return json_encode(array(
                    "result" => "true",
                    "rowCount" => $lastId,
                    "error" => ""
                ));
            }
            var_dump($stmt->errorInfo());
            return 0;

        } catch(PDOException $e){
            var_dump($e);
        }

    }

    function delete($pIdEvento=-1){
        //Luke 24/03/2021

        try {

            $query = "DELETE " . $this->table_name . " \n"
                    ."WHERE idEvento=:idEvento \n";

            // prepare query
            $stmt = $this->conn->prepare($query);

            // bind values
            if($pIdEvento>-1){
                $stmt->bindParam(":idEvento", $pIdEvento);
            }else{
                $stmt->bindParam(":idEvento", $this->evento);
            }


            // execute query
            if ($stmt->execute()) {
                $lastId =$this->conn->rowCount();
                return json_encode(array(
                    "result" => "true",
                    "row" => $lastId,
                    "error" => ""
                ));
            }
            var_dump($stmt->errorInfo());
            return 0;

        } catch(PDOException $e){
            var_dump($e);
        }


    }



}
