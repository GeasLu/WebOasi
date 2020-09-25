<?php
/* Luke 18/09/2020 */

error_reporting(E_ALL);

class ZoneIsolamento {

    // database connection and table name
    private $conn;
    private $dbStruttura;
    private $Schema;
    private $table_name = "Zone";

    // object properties
    public $idZona;
    public $nomeZona;
    public $idUserIns;
    public $DtIns;
    public $idUserMod;
    public $DtMod;
    public $idUserDel;
    public $DtDel;

    // constructor with $db as database connection
    public function __construct($pDb, $pDbStruttura, $pSchema) {
        $this->conn = $pDb;
        $this->dbStruttura = $pDbStruttura;
        $this->Schema = $pSchema;
        $this->table_name = "$this->dbStruttura.$this->Schema.$this->table_name";
    }

    // read products
    function read() {

        // select all query
        $query = "SELECT \n"
                . "     , idZona \n"
                . "     , nomeZona \n"
                . "     , idUserIns \n"
                . "     , DtIns \n"
                . "     , idUserMod \n"
                . "     , DtMod \n"
                . "     , idUserDel \n"
                . "     , DtDel \n"
                . "FROM " . $this->table_name . " \n"
                . "WHERE ISNULL(DtDel ,'01-01-1900') = '01-01-1900' \n"
                . "ORDER BY nomeZona";
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
                . "FROM ".$this->table_name." \n"
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
        $query = "SELECT COUNT(*) as total_rows FROM ".$this->table_name."";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['total_rows'];
    }

}
