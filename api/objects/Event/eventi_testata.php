<?php

/* Luke 10/06/2020 */
error_reporting(E_ALL);

class EventiTestata {

    // database connection and table name
    private $conn;
    private $dbStruttura;
    private $Schema;
    private $table_name = "eventi_testata";
    private $table_name_dett = "eventi_dett";
    // object properties
    public $idUserLogin;
    public $DataStart;
    public $DataEnd;
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

    // constructor with $db as database connection
    public function __construct($pDb, $pDbStruttura, $pSchema) {
        $this->conn = $pDb;
        $this->dbStruttura = $pDbStruttura;
        $this->Schema = $pSchema;
        $this->table_name = "$pDbStruttura.$pSchema.$this->table_name";
        $this->table_name_dett = "$pDbStruttura.$pSchema.$this->table_name_dett";
    }

    function Initialize($pIdEvento, $pIdUserLogin, $pDataStart, $pDataEnd) {
        $this->idEvento = $pIdEvento;
        $this->idUserLogin = $pIdUserLogin;
        $this->DataStart = $pDataStart;
        $this->DataEnd = $pDataEnd;
        //carico i dati dell'evento, nelle variabile della classe... e carico l'array d ieventi dettaglio filtrato per data
        $this->LoadDataEvento();
    }

    // used when filling up the update product form
    function LoadDataEvento() {
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
            
            $this->LoadEventiDett();
        }
    }

    function LoadEventiDett() {
        //Luke 11/06/2020

        $this->elnEventiDet = array();

        // query to read single record
        $query = "SELECT eD.* \n"
                . "FROM " . $this->table_name_dett . " as eD \n"
                . "WHERE  eD.idEvento = :idEvento \n"
                . "  and (eD.dataOccorrenza >= '$this->DataStart' and eD.dataOccorrenza <= '$this->DataEnd') \n"
                . "Order by eD.dataOccorrenza ASC \n";

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
                        "dataOccorrenza" => $row['dataOccorrenza'],
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

}
