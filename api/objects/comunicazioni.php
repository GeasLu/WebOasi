<?php

/* Luke 28/05/2020 */
error_reporting(E_ALL);

include_once 'messaggi.php';

class Comunicazioni {

    // database connection and table name
    private $conn;
    private $dbStruttura;
    private $table_name = "Messaggi.COMUNICAZIONI";
    // object properties
    public $ID_COM;
    public $TITOLO;
    public $DtIns;
    public $IdUserIns;
    public $DtUltMod;
    public $idUserUltMod;

    // constructor with $db as database connection
    public function __construct($db, $dbStruttura) {
        $this->conn = $db;
        $this->dbStruttura = $dbStruttura;
        $this->table_name = "$dbStruttura.$this->table_name";
    }

    // read products
    function read($pDataDal, $pDataAl) {

        // select all query
        $query = "SELECT C.* "
                . "     , Messaggi.COM_GetNumRisposte(c.ID_COM) NUM_RISP "
                . "     , Messaggi.COM_GetRispDaLeggere(c.ID_COM, @IdUserIns) NUM_DA_LEGGERE"
                . "     , Messaggi.COM_GetPercLettUsr(c.ID_COM,@IdUserIns) PERC_LETT "
                . "     , Messaggi.COM_GetNumAllegati(c.ID_COM) NUM_ALLEGATI "
                . "     , ISNULL((Select DtUltCaricamento From Messaggi.UTENTI_CARICAMENTO UC Where ID_UTENTE = @IdUserIns and UC.ID_COM = C.ID_COM),'1900-01-01') AS DATA_CARICAMENTO "
                . "     , (select top 1 M.BODY from Messaggi.MESSAGGI M Where M.ID_COM = C.ID_COM and (M.IdUserIns = @IdUserIns OR M.ID_MESS in (Select distinct D.ID_MESS FROM Messaggi.DESTINATARI D WHERE D.ID_UTENTE = @IdUserIns)) order by m.ID_MESS DESC) BODY_LAST "
                . "     , (select top 1 M.DtIns from Messaggi.MESSAGGI M Where M.ID_COM = C.ID_COM and (M.IdUserIns = @IdUserIns OR M.ID_MESS in (Select distinct D.ID_MESS FROM Messaggi.DESTINATARI D WHERE D.ID_UTENTE = @IdUserIns)) order by m.ID_MESS DESC) DATA_LAST"
                . "     , ISNULL((select U.UTENTE from ANAG_UTENTI U Where ID_UTENTE = (select top 1 M.IdUserIns from Messaggi.MESSAGGI M Where M.ID_COM = C.ID_COM and ((M.IdUserIns = @IdUserIns OR M.ID_MESS in (Select distinct D.ID_MESS FROM Messaggi.DESTINATARI D WHERE D.ID_UTENTE = @IdUserIns))) order by m.ID_MESS DESC)),'') USER_LAST"
                . "     , (select U.UTENTE from ANAG_UTENTI U Where ID_UTENTE = C.IdUserIns) USER_SEND"
                . "FROM " . $this->table_name . " as C";
        $query .= "WHERE (C.IdUserIns = :IdUserIns OR C.ID_COM in (Select distinct D.ID_COM FROM Messaggi.DESTINATARI D WHERE D.ID_UTENTE = :IdUserIns))";
        if (isset($pDataDal) && isset($pDataAl)) {
            $query .= "  And ((C.DtUltMod  >= :dataDal and C.DtUltMod <= :dataAl) OR isnull(C.DtUltMod ,'1900-01-01') = '1900-01-01')";
        }
        $query .= "Order by C.DtIns DESC";
        // prepare query statement

        $stmt = $this->conn->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));

        // bind values
        $stmt->bindParam(":IdUserIns", $this->nomeComputer);
        if (isset($pDataDal) && isset($pDataAl)) {
            $stmt->bindParam(":dataDal", $pDataDal);
            $stmt->bindParam(":dataAl", $pDataAl);
        }

        try {
            // execute query
            $stmt->execute();
            return $stmt;
        } catch (Exception $e) {
            return $e;
        }
    }

    // create product
    function create() {
        //Luke 19/03/2020
        // query to insert record
        $query = "INSERT INTO " . $this->table_name . "(  NOME_COMPUTER \n"
                . "                                     , APPLICAZIONE \n"
                . "                                     , DATA_ORA \n"
                . "                                     , TIPO \n"
                . "                                     , MESSAGGIO \n"
                . "                                     , ERRORE ) \n"
                . "VALUES( :NOME_COMPUTER \n"
                . "       ,:APPLICAZIONE \n"
                . "       ,:DATA_ORA \n"
                . "       ,:TIPO \n"
                . "       ,:MESSAGGIO \n"
                . "       ,:ERRORE ) \n";


        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->nomeComputer = htmlspecialchars(strip_tags($this->nomeComputer));
        $this->applicazione = htmlspecialchars(strip_tags($this->applicazione));
        $this->dataOra = htmlspecialchars(strip_tags($this->dataOra));
        $this->tipo = htmlspecialchars(strip_tags($this->tipo));
        $this->messaggio = htmlspecialchars(strip_tags($this->messaggio));
        $this->errore = htmlspecialchars(strip_tags($this->errore));

        // bind values
        $stmt->bindParam(":NOME_COMPUTER", $this->nomeComputer);
        $stmt->bindParam(":APPLICAZIONE", $this->applicazione);
        $stmt->bindParam(":DATA_ORA", $this->dataOra);
        $stmt->bindParam(":TIPO", $this->tipo);
        $stmt->bindParam(":MESSAGGIO", $this->messaggio);
        $stmt->bindParam(":ERRORE", $this->errore);

        // execute query
        if ($stmt->execute()) {
            return true;
        }

        return false;
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
