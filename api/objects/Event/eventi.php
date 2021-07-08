<?php

/* Luke 10/06/2020 */

error_reporting(E_ALL);

include_once 'eventi_testata.php';

class Eventi {

    // database connection and table name
    private $conn;
    private $dbStruttura;
    private $Schema;
    //conterrà l'array di eventi_testata
    private $elnEventi;
    
    // object properties
    public $idUserLogin;
    public $DataStart;
    public $DataEnd;

    // constructor with $db as database connection
    public function __construct($pDb, $pDbStruttura, $pSchema) {
        $this->conn = $pDb;
        $this->dbStruttura = $pDbStruttura;
        $this->Schema = $pSchema;
    }

    function Initialize($pIdUserLogin, $pDataStart, $pDataEnd) {
        $this->idUserLogin = $pIdUserLogin;
        $this->DataStart = $pDataStart;
        $this->DataEnd = $pDataEnd;
    }

    function GetEventi() {
        //Luke 10/06/2020
        
        $db = "$this->dbStruttura.$this->Schema";

        $query = "SELECT distinct eT.idEvento \n"
                . "FROM $db.eventi_testata eT \n"
                . "INNER JOIN $db.eventi_userviewer eUV ON eT.idEvento = eUV.idEvento \n"
                . "                                    AND euv.idUser = :idUserLogin and eUV.flagVis = 1 \n"
                . "LEFT  JOIN $db.eventi_dett eD ON eD.idEvento = eT.idEvento \n"
                . "WHERE isnull(eT.idUserDel, 0) = 0"
                . "  AND  ((dataInizio >= '$this->DataStart' and dataInizio <= '$this->DataEnd') \n"
                . "   OR   (dataInizio < '$this->DataStart' and dataFine >= '$this->DataStart')) \n";

        // prepare query statement
        $stmt = $this->conn->prepare($query,array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));

        $idTmp = htmlspecialchars(strip_tags($this->idUserLogin));
//        $dtStartTmp = htmlspecialchars(strip_tags($this->DataStart));
//        $dtEndTmp = htmlspecialchars(strip_tags($this->DataEnd));
        
        // bind id of product to be updated
        $stmt->bindParam(":idUserLogin", $idTmp );
//        $stmt->bindParam(":dataInizio", $dtStartTmp);
//        $stmt->bindParam(":dataFine", $dtEndTmp);
        //var_dump($query);
        
        try {
            // execute query
            $stmt->execute();
            
            $this->elnEventi = array();
                        
            $num = $stmt->rowCount();
            //var_dump($num);
            // check if more than 0 record found
            if ($num > 0) {

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

                    $event_item = new EventiTestata($this->conn, $this->dbStruttura, $this->Schema);
                    $event_item ->Initialize($row['idEvento'], $this->idUserLogin, $this->DataStart, $this->DataEnd);

                    array_push($this->elnEventi, $event_item);
                }
            }
            
            return $this->elnEventi;
            //return $query;
            
        } catch (Exception $e) {
            return $e;
        }

    }

    // used when filling up the update product form
    function readOne() {
        //Luke 20/03/2020
        // query to read single record
        $query = "SELECT L.* \n"
                . "FROM " . $this->table_name . " as L \n"
                . "WHERE  L.ID_ROW= :ID_ROW ";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // bind id of product to be updated
        $stmt->bindParam(":ID_ROW", $this->idRow);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);


        // set values to object properties
        $this->nomeComputer = $row['NOME_COMPUTER'];
        $this->applicazione = $row['APPLICAZIONE'];
        $this->dataOra = $row['DATA_ORA'];
        $this->tipo = $row['TIPO'];
        $this->messaggio = $row['MESSAGGIO'];
        $this->errore = $row['ERRORE'];
    }

    // create product
    function create() {
        //Luke 29/09/2020
        //restituisce l'id della riga inserita altrimenti 0

        $db = "$this->dbStruttura.$this->Schema";

        try {

            $query = "INSERT INTO " . $this->table_name . "(ID_OSPITE \n"
                .    "                                     ,dataRilevazione \n"
                .    "                                     ,idZona \n"
                .    "                                     ,temperatura_num \n"
                .    "                                     ,temperatura \n"
                .    "                                     ,saturazione \n"
                .    "                                     ,ossigeno \n"
                .    "                                     ,fTosseSecca \n"
                .    "                                     ,fDolMusc \n"
                .    "                                     ,fMaleTesta \n"
                .    "                                     ,fRinorrea \n"
                .    "                                     ,fMaleGola \n"
                .    "                                     ,fAstenia \n"
                .    "                                     ,fInappetenza \n"
                .    "                                     ,fVomito \n"
                .    "                                     ,fDiarrea \n"
                .    "                                     ,fCongiuntivite \n"
                .    "                                     ,fNoAlteraz \n"
                .    "                                     ,Altro \n"
                .    "                                     ,idUserIns \n"
                .    "                                     ,DtIns) \n"
                ." VALUES (:ID_OSPITE \n"
                ."        ,:dataRilevazione \n"
                ."        ,:idZona \n"
                ."        ,:temperatura_num \n"
                ."        ,:temperatura \n"
                ."        ,:saturazione \n"
                ."        ,:ossigeno \n"
                ."        ,:fTosseSecca \n"
                ."        ,:fDolMusc \n"
                ."        ,:fMaleTesta \n"
                ."        ,:fRinorrea \n"
                ."        ,:fMaleGola \n"
                ."        ,:fAstenia \n"
                ."        ,:fInappetenza \n"
                ."        ,:fVomito \n"
                ."        ,:fDiarrea \n"
                ."        ,:fCongiuntivite \n"
                ."        ,:fNoAlteraz \n"
                ."        ,:Altro \n"
                ."        ,:idUserIns \n"
                ."        ,:DtIns)";

            // prepare query
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->ID_OSPITE = htmlspecialchars(strip_tags($this->ID_OSPITE));
            $this->dataRilevazione = htmlspecialchars(strip_tags($this->dataRilevazione));
            $this->idZona = htmlspecialchars(strip_tags($this->idZona));
            $this->temperatura_num = htmlspecialchars(strip_tags($this->temperatura_num));
            $this->temperatura = htmlspecialchars(strip_tags($this->temperatura));
            $this->saturazione = htmlspecialchars(strip_tags($this->saturazione));
            $this->ossigeno = htmlspecialchars(strip_tags($this->ossigeno));
            $this->fTosseSecca = htmlspecialchars(strip_tags($this->fTosseSecca));
            $this->fDolMusc = htmlspecialchars(strip_tags($this->fDolMusc));
            $this->fMaleTesta = htmlspecialchars(strip_tags($this->fMaleTesta));
            $this->fRinorrea = htmlspecialchars(strip_tags($this->fRinorrea));
            $this->fMaleGola = htmlspecialchars(strip_tags($this->fMaleGola));
            $this->fAstenia = htmlspecialchars(strip_tags($this->fAstenia));
            $this->fInappetenza = htmlspecialchars(strip_tags($this->fInappetenza));
            $this->fVomito = htmlspecialchars(strip_tags($this->fVomito));
            $this->fDiarrea = htmlspecialchars(strip_tags($this->fDiarrea));
            $this->fCongiuntivite = htmlspecialchars(strip_tags($this->fCongiuntivite));
            $this->fNoAlteraz = htmlspecialchars(strip_tags($this->fNoAlteraz));
            $this->Altro = htmlspecialchars(strip_tags($this->Altro));
            $this->idUserIns = htmlspecialchars(strip_tags($this->idUserIns));
            $this->DtIns = htmlspecialchars(strip_tags($this->DtIns));


            // bind values
            $stmt->bindParam(":ID_OSPITE", $this->ID_OSPITE);
            $stmt->bindParam(":dataRilevazione", $this->dataRilevazione);
            $stmt->bindParam(":idZona", $this->idZona);
            $stmt->bindParam(":temperatura_num", $this->temperatura_num);
            $stmt->bindParam(":temperatura", $this->temperatura);
            $stmt->bindParam(":saturazione", $this->saturazione);
            $stmt->bindParam(":ossigeno", $this->ossigeno);
            $stmt->bindParam(":fTosseSecca", $this->fTosseSecca);
            $stmt->bindParam(":fDolMusc", $this->fDolMusc);
            $stmt->bindParam(":fMaleTesta", $this->fMaleTesta);
            $stmt->bindParam(":fRinorrea", $this->fRinorrea);
            $stmt->bindParam(":fMaleGola", $this->fMaleGola);
            $stmt->bindParam(":fAstenia", $this->fAstenia);
            $stmt->bindParam(":fInappetenza", $this->fInappetenza);
            $stmt->bindParam(":fVomito", $this->fVomito);
            $stmt->bindParam(":fDiarrea", $this->fDiarrea);
            $stmt->bindParam(":fCongiuntivite", $this->fCongiuntivite);
            $stmt->bindParam(":fNoAlteraz", $this->fNoAlteraz);
            $stmt->bindParam(":Altro", $this->Altro);
            $stmt->bindParam(":idUserIns", $this->idUserIns);
            $stmt->bindParam(":DtIns", $this->DtIns);

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


    // update the product
    function update() {

        // update query
        $query = "UPDATE " . $this->table_name . " \n"
                . " SET NOME_COMPUTER = :NOME_COMPUTER \n"
                . "   , APPLICAZIONE = :APPLICAZIONE \n"
                . "   , DATA_ORA = :DATA_ORA \n"
                . "   , TIPO = :TIPO \n"
                . "   , MESSAGGIO = :MESSAGGIO \n"
                . "   , ERRORE = :ERRORE \n"
                . "WHERE ID_ROW = :ID_ROW \n";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->nomeComputer = htmlspecialchars(strip_tags($this->nomeComputer));
        $this->applicazione = htmlspecialchars(strip_tags($this->applicazione));
        $this->dataOra = htmlspecialchars(strip_tags($this->dataOra));
        $this->tipo = htmlspecialchars(strip_tags($this->tipo));
        $this->messaggio = htmlspecialchars(strip_tags($this->messaggio));
        $this->errore = htmlspecialchars(strip_tags($this->errore));

        // bind new values
        $stmt->bindParam(":ID_ROW", $this->idRow);
        $stmt->bindParam(":NOME_COMPUTER", $this->nomeComputer);
        $stmt->bindParam(":APPLICAZIONE", $this->applicazione);
        $stmt->bindParam(":DATA_ORA", $this->dataOra);
        $stmt->bindParam(":TIPO", $this->tipo);
        $stmt->bindParam(":MESSAGGIO", $this->messaggio);
        $stmt->bindParam(":ERRORE", $this->errore);

        // execute the query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // delete the product
    function delete() {

        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE ID_ROW = :ID_ROW";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->idRow = htmlspecialchars(strip_tags($this->idRow));

        // bind id of record to delete
        $stmt->bindParam(":ID_ROW", $this->idRow);

        // execute query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // search products
    function search($keywords) {

        // select all query
        $query = "SELECT * \n"
                . "FROM " . $this->table_name . " as L \n"
                . "WHERE L.NOME_COMPUTER like ? \n"
                . "   OR L.APPLICAZIONE like ?  \n"
                . "   OR L.MESSAGGIO like ?  \n"
                . "   OR L.ERRORE like ?  \n"
                . "ORDER BY DATA_ORA DESC \n";

        // prepare query statement
        $stmt = $this->conn->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));

        // sanitize
        $keywords = htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        // bind
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
        $stmt->bindParam(4, $keywords);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    // read products with pagination
    public function readPaging($from_record_num, $records_per_page) {

        // select query
        $query = "SELECT * \n"
                . "FROM " . $this->table_name . " \n"
                . "ORDER BY DATA_ORA DESC \n"
                . "OFFSET ? ROWS fetch next ? rows only ";

        // prepare query statement
        $stmt = $this->conn->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));

        // bind variable values
        $stmt->bindParam(1, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(2, $records_per_page, PDO::PARAM_INT);

        // execute query
        $stmt->execute();

        // return values from database
        return $stmt;
    }

    // used for paging products
    public function count() {
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name . "";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['total_rows'];
    }

}
