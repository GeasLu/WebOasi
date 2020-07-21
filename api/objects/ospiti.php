<?php

class Ospiti {

    // database connection and table name
    private $conn;
    private $table_name = "dbo.ANAG_OSPITI";
    // object properties
    public $ID_OSPITE;
    public $COGNOME;
    public $NOME;
    public $COD_REG_ISTAT;
    public $SESSO;
    public $CITTA_NASCITA;
    public $PROV_NASCITA;
    public $PAESE_NASCITA;
    public $NAZIONALITA;
    public $DATA_NASCITA;
    public $ID_STATO_CIVILE;
    public $NOTE_STATO_CIVILE;
    public $NUMERO_CI;
    public $COMUNE_RILASCIO_CI;
    public $DATA_RILASCIO_CI;
    public $DATA_SCADENZA_CI;
    public $CODICE_FISCALE;
    public $NUMERO_TS;
    public $DATA_RILASCIO_TS;
    public $DATA_SCADENZA_TS;
    public $NUMERO_TS_EUR;
    public $DATA_RILASCIO_TS_EUR;
    public $DATA_SCADENZA_TS_EUR;
    public $RESIDENZA_CASA_RIPOSO;
    public $ULTIMA_RESIDENZA;
    public $COMUNE_PROVENIENZA;
    public $RESIDENZA;
    public $NOTE_RESIDENZA;
    public $USCITA_NO_ACCOMP;
    public $TIPO_TERMINE;
    public $ID_CAUSA_TERMINE;
    public $DATA_TERMINE;
    public $NOTE_TERMINE;
    public $TELEVISORE;
    public $PROPRIETARIO_TV;
    public $TELEFONO;
    public $INTERNO_TEL;
    public $RICHIEDE_TRASPORTO;
    public $DISTANZA;
    public $CONTR_ASSIST_MENS;
    public $ID_MEDICO;
    public $FLAG;
    public $NOTE_IMPORTANTI;
    public $SALA_PRANZO;
    public $N_BIANCHERIA;
    public $ELENCO_ASSISTENZE;
    public $ALTEZZA;
    public $FLAG_VALUTAZIONI;
    public $ELIMINATO;
    public $FlagModificaCartella;
    public $DtFlagModCartella;
    public $ID_ASL;
    public $ID_DISTRETTO;
    public $DATA_STAMPA_ALLERGIE;
    public $FLAG_CONS_IMG;
    public $DATA_INIZIO_DEG;

    public function __construct($db) {
        $this->conn = $db;
    }

    // used by select drop-down list
    public function readAll() {
        //select all data
        $query = "SELECT * \n"
                . "FROM " . $this->table_name . " \n"
                . "ORDER BY Cognome, Nome \n";

        $stmt = $this->conn->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        $stmt->execute();

        return $stmt;
    }

    // used by select drop-down list
    public function read() {

        //select all data
        $query = "SELECT * \n"
                . "FROM " . $this->table_name . " \n"
                . "ORDER BY Cognome, Nome \n";

        $stmt = $this->conn->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        $stmt->execute();

        return $stmt;
    }

}
