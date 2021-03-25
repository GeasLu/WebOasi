<?php

/* Luke 10/06/2020 */
error_reporting(E_ALL);


class EventiDett {

    // database connection and table name
    private $conn;
    private $dbStruttura;
    private $Schema;
    private $table_name = "eventi_testata";
    private $table_name_dett = "eventi_dett";
    // object properties
    public $idRow;
    public $idEvento;
    public $dataInizio;
    public $dataFine;
    public $note;
    public $idUserNote;
    public $dataUserNote;
    public $idRegistro;
    public $flagRegistrazione;



    // constructor with $db as database connection
    public function __construct($pDb, $pDbStruttura, $pSchema) {
        $this->conn = $pDb;
        $this->dbStruttura = $pDbStruttura;
        $this->Schema = $pSchema;
        $this->table_name = "$pDbStruttura.$pSchema.$this->table_name";
        $this->table_name_dett = "$pDbStruttura.$pSchema.$this->table_name_dett";
    }

    /// PASSARE $pIdEvento=-1 se si vuole creare un evento nuovo
    function Initialize($pIdRow=-1, $pIdUserLogin) {
        $this->idRow = $pIdRow;
        $this->idUserLogin = $pIdUserLogin;

        //carico i dati dell'evento, nelle variabile della classe... e carico l'array d ieventi dettaglio filtrato per data
        if($pIdRow>-1){
            $this->LoadDatiEventoDett();
        }
    }

    // used when filling up the update product form
    function LoadDatiEventoDett() {
        //Luke 08/03/2021
        //
        // query to read single record
        $query = "SELECT eD.* \n"
                . "FROM " . $this->table_name_dett . " as eD \n"
                . "WHERE  eD.idRow = :idRow ";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // bind id of product to be updated
        $stmt->bindParam(":idRow", $this->idRow);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (isset($row)) {
            $this->dataOccorrenzaInizio = $row['dataOccorrenzaInizio'];
            $this->dataOccorrenzaFine = $row['dataOccorrenzaFine'];
            $this->note = $row['note'];
            $this->idUserNote = $row['idUserNote'];
            $this->dataUserNote = $row['dataUserNote'];
            $this->idRegistro = $row['idRegistro'];
            $this->flagRegistrazione = $row['flagRegistrazione'];
        }
    }

    function Create(){
        //Luke 08/03/2021

        //restituisce l'id della riga inserita altrimenti 0
        //$db = "$this->dbStruttura.$this->Schema";

        try {

            $query = "INSERT INTO " . $this->table_name_dett . "(idEvento \n"
                .    "                                     ,dataOccorrenzaInizio \n"
                .    "                                     ,dataOccorrenzaFine \n"
                .    "                                     ,note \n"
                .    "                                     ,idUserNote \n"
                .    "                                     ,dataUserNote \n"
                .    "                                     ,idRegistro \n"
                .    "                                     ,flagRegistrazione) \n"
                ." VALUES (:idEvento \n"
                ."        ,:dataOccorrenzaInizio \n"
                ."        ,:dataOccorrenzaFine \n"
                ."        ,:note \n"
                ."        ,:idUserNote \n"
                ."        ,:dataUserNote \n"
                ."        ,:idRegistro \n"
                ."        ,:flagRegistrazione) \n";

            // prepare query
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->idEvento = htmlspecialchars(strip_tags($this->idEvento));
            $this->dataInizio = htmlspecialchars(strip_tags($this->dataInizio));
            $this->dataFIne = htmlspecialchars(strip_tags($this->dataFine));
            $this->note = htmlspecialchars(strip_tags($this->note));
            $this->idUserNote = htmlspecialchars(strip_tags($this->idUserNote));
            $this->dataUserNote = htmlspecialchars(strip_tags($this->dataUserNote));
            $this->idRegistro = htmlspecialchars(strip_tags($this->idRegistro));
            $this->flagRegistrazione = htmlspecialchars(strip_tags($this->flagRegistrazione));

            // bind values
            $stmt->bindParam(":idEvento", $this->idEvento);
            $stmt->bindParam(":dataOccorrenzaInizio", $this->dataInizio);
            $stmt->bindParam(":dataOccorrenzaFine", $this->dataFine);
            $stmt->bindParam(":note", $this->note);
            $stmt->bindParam(":idUserNote", $this->idUserNote);
            $stmt->bindParam(":dataUserNote", $this->dataUserNote);
            $stmt->bindParam(":idRegistro", $this->idRegistro);
            $stmt->bindParam(":flagRegistrazione", $this->flagRegistrazione);

            // execute query
            if ($stmt->execute()) {
                $lastId =$this->conn->lastInsertId();
                return $lastId;
            }
            var_dump($stmt->errorInfo());
            return 0;

        } catch(PDOException $e){
            var_dump($e);
        }


    }


    function update(){
        //Luke 08/03/2021

        //restituisce l'id della riga inserita altrimenti 0
        $db = "$this->dbStruttura.$this->Schema";

        try {

            $query = "UPDATE " . $this->table_name . " \n"
                .    "   SET  idEvento =:idEvento                              \n"
                .    "     ,  dataOccorrenzaInizio =:dataOccorrenzaInizio \n"
                .    "     ,  dataOccorrenzaFine =:dataOccorrenzaFine \n"
                .    "     ,  note =:note \n"
                .    "     ,  idUserNote =:idUserNote \n"
                .    "     ,  dataUserNote =:dataUserNote \n"
                .    "     ,  idRegistro =:idRegistro \n"
                .    "     ,  flagRegistrazione =:flagRegistrazione \n"
                ."WHERE idRow=:idRow \n";


            // prepare query
            $stmt = $this->conn->prepare($query);


            // sanitize
            $this->idRow = htmlspecialchars(strip_tags($this->idRow));
            $this->idEvento = htmlspecialchars(strip_tags($this->idEvento));
            $this->dataOccorrenzaInizio = htmlspecialchars(strip_tags($this->dataOccorrenzaInizio));
            $this->dataOccorrenzaFine = htmlspecialchars(strip_tags($this->dataOccorrenzaFine));
            $this->note = htmlspecialchars(strip_tags($this->note));
            $this->idUserNote = htmlspecialchars(strip_tags($this->idUserNote));
            $this->dataUserNote = htmlspecialchars(strip_tags($this->dataUserNote));
            $this->idRegistro = htmlspecialchars(strip_tags($this->idRegistro));
            $this->flagRegistrazione = htmlspecialchars(strip_tags($this->flagRegistrazione));

            // bind values
            $stmt->bindParam(":idRow", $this->idRow);
            $stmt->bindParam(":idEvento", $this->idEvento);
            $stmt->bindParam(":dataOccorrenzaInizio", $this->dataOccorrenzaInizio);
            $stmt->bindParam(":dataOccorrenzaFine", $this->dataOccorrenzaFine);
            $stmt->bindParam(":note", $this->note);
            $stmt->bindParam(":idUserNote", $this->idUserNote);
            $stmt->bindParam(":dataUserNote", $this->dataUserNote);
            $stmt->bindParam(":idRegistro", $this->idRegistro);
            $stmt->bindParam(":flagRegistrazione", $this->flagRegistrazione);

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

    function delete(){
        //Luke 08/03/2021

        /*
         * La cancellazione avverrà in amniera logica della testata, di conseguenza i dettagli, saranno eleiminati solo se la testata sarà eliminata(logicamente) non fisicamente
         * */

    }



}
