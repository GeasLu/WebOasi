<?php

/* Luke 10/06/2020 */
error_reporting(E_ALL);

include_once 'eventi_dett.php';
include_once 'ricorrenza.php';

class EventiTestata {

    // database connection and table name
    private $conn;
    private $dbStruttura;
    private $Schema;
    private $table_name = "eventi_testata";
    private $table_name_dett = "eventi_dett";
    // object properties
    public $idUserLogin;
    public $idEvento;
    public $evento;
    public $evento_esteso;
    public $dataInizio;
    public $dataFine;
    public $ID_RICORRENZA;
    public $idRegistro;
    public $idUserIns;
    public $DataIns;
    public $idUserMod;
    public $dataUltMod;
    public $idUserDel;
    public $dataDel;
    public $elnEventiDet;
    public $classCSS;
    public $RegistraURL;

    public $ricorrenza;


    // constructor with $db as database connection
    public function __construct($pDb, $pDbStruttura, $pSchema) {
        $this->conn = $pDb;
        $this->dbStruttura = $pDbStruttura;
        $this->Schema = $pSchema;
        $this->table_name = "$pDbStruttura.$pSchema.$this->table_name";
        $this->table_name_dett = "$pDbStruttura.$pSchema.$this->table_name_dett";
    }

    /// PASSARE $pIdEvento=-1 se si vuole creare un evento nuovo
    function Initialize($pIdEvento=-1, $pIdUserLogin, $pDataStart, $pDataEnd, $pElnEventiDet= null) {
        $this->idEvento = $pIdEvento;
        $this->idUserLogin = $pIdUserLogin;
        $this->dataInizio = $pDataStart;
        $this->dataFine = $pDataEnd;

        //carico i dati dell'evento, nelle variabile della classe... e carico l'array d ieventi dettaglio filtrato per data
        if($pIdEvento>-1){
            $this->LoadDataEvento($pDataStart,$pDataEnd);
        }else{
            $this->elnEventiDet = $pElnEventiDet;
        }
    }

    // used when filling up the update product form
    function LoadDataEvento($pDataStart,$pDataEnd) {
        //Luke 11/06/2020
        //
        // query to read single record
        $query = "SELECT eT.* \n"
                . "FROM " . $this->table_name . " as eT \n"
                . "WHERE  eT.idEvento = :idEvento ";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // bind id of product to be updated
        $stmt->bindParam(":idEvento", $this->idEvento);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (isset($row)) {
            $this->evento = $row['evento'];
            $this->evento_esteso = $row['evento_esteso'];
            $this->dataInizio = $row['dataInizio'];
            $this->dataFine = $row['dataFine'];
            $this->ID_RICORRENZA = $row['ID_RICORRENZA'];
            $this->idRegistro = $row['idRegistro'];
            $this->idUserIns = $row['idUserIns'];
            $this->DataIns = $row['DataIns'];
            $this->idUserMod = $row['idUserMod'];
            $this->dataUltMod = $row['DataUltMod'];
            $this->idUserDel = $row['idUserDel'];
            $this->dataDel = $row['DataDel'];
            $this->classCSS = $row['classCSS'];
            $this->RegistraURL = $row['urlModulo'];
            
            $this->LoadEventiDett($pDataStart,$pDataEnd);
        }
    }

    function LoadEventiDett($pDataStart,$pDataEnd) {
        //Luke 11/06/2020

        $this->elnEventiDet = array();

        // query to read single record
        $query = "SELECT eD.* \n"
                . "FROM " . $this->table_name_dett . " as eD \n"
                . "WHERE  eD.idEvento = :idEvento \n"
                . "  and (eD.dataOccorrenzaInizio >= '$pDataStart' and eD.dataOccorrenzaFine <= '$pDataEnd') \n"
                . "Order by eD.dataOccorrenzaInizio ASC \n";

        // prepare query statement
        $stmt = $this->conn->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));

        // bind id of product to be updated
        $stmt->bindParam(":idEvento", $this->idEvento);
        //var_dump($query);
        try {
            // execute query
            $stmt->execute();

            $num = $stmt->rowCount();
            // check if more than 0 record found
            if ($num > 0) {

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

                    $event_item = array(
                        "idRow" => $row['idRow'],
                        "idEvento" => $row['idEvento'],
                        "dataOccorrenzaInizio" => $row['dataOccorrenzaInizio'],
                        "dataOccorrenzaFine" => $row['dataOccorrenzaFine'],
                        "note" => html_entity_decode($row['note']),
                        "idUserNote" => $row['idUserNote'],
                        "dataUserNote" => $row['dataUserNote'],
                        "idRegistro" => $row['idRegistro'],
                        "flagRegistrazione" => $row['flagRegistrazione']
                    );

                    array_push($this->elnEventiDet, $event_item);
                }
            }
        } catch (Exception $e) {
            return $e;
        }
    }

    function Create(){
        //Luke 08/03/2021

        //restituisce l'id della riga inserita altrimenti 0
        $db = "$this->dbStruttura.$this->Schema";
        $this->idUserIns = $this->idUserLogin;

        try {

            $query = "INSERT INTO " . $this->table_name . "(evento \n"
                .    "                                     ,evento_esteso \n"
                .    "                                     ,dataInizio \n"
                .    "                                     ,dataFine \n"
                .    "                                     ,ID_RICORRENZA \n"
                .    "                                     ,idRegistro \n"
                .    "                                     ,idUserIns \n"
                .    "                                     ,idUserMod \n"
                .    "                                     ,DataUltMod \n"
                .    "                                     ,idUserDel \n"
                .    "                                     ,DataDel \n"
                .    "                                     ,classCSS \n"
                .    "                                     ,urlModulo) \n"
                ." VALUES (:evento \n"
                ."        ,:evento_esteso \n"
                ."        ,:dataInizio \n"
                ."        ,:dataFine \n"
                ."        ,:ID_RICORRENZA \n"
                ."        ,:idRegistro \n"
                ."        ,:idUserIns \n"
                ."        ,:idUserMod \n"
                ."        ,:DataUltMod \n"
                ."        ,:idUserDel \n"
                ."        ,:DataDel \n"
                ."        ,:classCSS \n"
                ."        ,:urlModulo) \n";


            //var_dump($query);

            // prepare query
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->SanitizeProperty();

            // bind values
            $stmt->bindParam(":evento", $this->evento);
            $stmt->bindParam(":evento_esteso", $this->evento_esteso);
            $stmt->bindParam(":dataInizio", $this->dataInizio);
            $stmt->bindParam(":dataFine", $this->dataFine);
            $stmt->bindParam(":ID_RICORRENZA", $this->ID_RICORRENZA);
            $stmt->bindParam(":idRegistro", $this->idRegistro);
            $stmt->bindParam(":idUserIns", $this->idUserIns);
            $stmt->bindParam(":idUserMod", $this->idUserMod);
            $stmt->bindParam(":DataUltMod", $this->DataUltMod);
            $stmt->bindParam(":idUserDel", $this->idUserDel);
            $stmt->bindParam(":DataDel", $this->DataDel);
            $stmt->bindParam(":classCSS", $this->classCSS);
            $stmt->bindParam(":urlModulo", $this->RegistraURL);

            // execute query
            if ($stmt->execute()) {
                $lastId =$this->conn->lastInsertId();
                $this->idEvento = $lastId;
                return $lastId;
            }
            var_dump($stmt->errorInfo());
            return 0;

        } catch(PDOException $e){
            var_dump($e);
        }

    }


    function update($pAggDate= false){
        //Luke 08/03/2021

        if($pAggDate){
            $this->idUserMod = $this->idUserLogin;
            $this->dataUltMod = date('Y-m-d H:i:s');
        }

        try {

            $query = "UPDATE " . $this->table_name . " \n"
                .    "   SET  evento =:evento\n"
                .    "     ,  evento_esteso =:evento_esteso \n"
                .    "     ,  dataInizio =:dataInizio \n"
                .    "     ,  dataFine =:dataFine \n"
                .    "     ,  ID_RICORRENZA =:ID_RICORRENZA \n"
                .    "     ,  idRegistro =:idRegistro \n"
                .    "     ,  urlModulo =:urlModulo \n";
                if($pAggDate){
                    $query .=  "     ,  idUserMod =:idUserMod \n"
                           .   "     ,  DataUltMod =:DataUltMod \n";
                };
            $query .= "     ,  classCSS =:classCSS \n"
                   .  "WHERE idEvento=:idEvento \n";

//var_dump($this);

            // prepare query
            $stmt = $this->conn->prepare($query);


            $this->SanitizeProperty();

            // bind values
            $stmt->bindParam(":idEvento", $this->idEvento);
            $stmt->bindParam(":evento", $this->evento);
            $stmt->bindParam(":evento_esteso", $this->evento_esteso);
            $stmt->bindParam(":dataInizio", $this->dataInizio);
            $stmt->bindParam(":dataFine", $this->dataFine);
            $stmt->bindParam(":ID_RICORRENZA", $this->ID_RICORRENZA);
            $stmt->bindParam(":idRegistro", $this->idRegistro);
            $stmt->bindParam(":urlModulo", $this->RegistraURL);
            if($pAggDate){
                $stmt->bindParam(":idUserMod", $this->idUserMod);
                $stmt->bindParam(":DataUltMod", $this->DataUltMod);
            }
            $stmt->bindParam(":classCSS", $this->classCSS);

            // execute query
            if ($stmt->execute()) {
                $lastId =$this->conn->lastInsertId();
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

    private function SanitizeProperty(){
        // Luke 24/03/2021

        // sanitize
        $this->evento = htmlspecialchars(strip_tags($this->evento));
        $this->evento_esteso = htmlspecialchars(strip_tags($this->evento_esteso));
        $this->dataInizio = htmlspecialchars(strip_tags($this->dataInizio));
        $this->dataFine = htmlspecialchars(strip_tags($this->dataFine));
        $this->ID_RICORRENZA = htmlspecialchars(strip_tags($this->ID_RICORRENZA));
        $this->idRegistro = htmlspecialchars(strip_tags($this->idRegistro));
        $this->idUserIns = htmlspecialchars(strip_tags($this->idUserIns));
        $this->DataIns = htmlspecialchars(strip_tags($this->DataIns));
        $this->idUserMod = htmlspecialchars(strip_tags($this->idUserMod));
        $this->dataUltMod = htmlspecialchars(strip_tags($this->dataUltMod));
        $this->classCSS = htmlspecialchars(strip_tags($this->classCSS));
        $this->RegistraURL = htmlspecialchars(strip_tags($this->RegistraURL));

    }

    function delete($pIdEvento=-1){
        //Luke 08/03/2021

        try {

            $query = "UPDATE " . $this->table_name . " \n"
                .    "   SET  idUserDel =:idUserDel \n"
                .    "     ,  DataDel =:DataDel \n"
                ."WHERE idEvento=:idEvento \n";

            // prepare query
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->idUserDel = htmlspecialchars(strip_tags($this->idUserDel));
            $this->DataDel = htmlspecialchars(strip_tags($this->DataDel));

            // bind values
            if($pIdEvento>-1){
                $stmt->bindParam(":idEvento", $pIdEvento);
            }else{
                $stmt->bindParam(":idEvento", $this->idEvento);
            }

            $stmt->bindParam(":idUserDel", $this->idUserDel);
            $stmt->bindParam(":DataDel", $this->DataDel);


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
