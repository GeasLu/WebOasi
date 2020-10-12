<?php

class Ospiti {

    // database connection and table name
    private $conn;
    private $dbStruttura;
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

    private $elnOspitiParametri;

    public function __construct($pDb, $pDbStruttura ) {
        $this->conn = $pDb;
        $this->dbStruttura = $pDbStruttura;
        $this->table_name= $this->dbStruttura . '.' . $this->table_name;
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

    function GetParametriOspite($pSchema, $pTabellaParametri, $pIdOspite) {
        //Luke 08/10/2020

        $tabTmp = $this->dbStruttura .".". $pSchema .".". $pTabellaParametri;

        $query = "Select OP.* \n"
               . "     , (select NOMINATIVO from dbo.vINFO_UTENTI where ID_UTENTE=OP.idUserIns) as USER_INS \n"
               . "From $tabTmp AS OP\n"
               . "Where ID_OSPITE = $pIdOspite  \n"
               . "  and ELIMINATO = 0 \n"
               . "order by dataRilevazione desc";

        // prepare query statement
        $stmt = $this->conn->prepare($query,array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));

        try {
            // execute query
            $stmt->execute();

            $elnParamOspite = array();

            $num = $stmt->rowCount();
            //var_dump($num);
            // check if more than 0 record found
            if ($num > 0) {

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

                    $OspParam_item =   array(
                        "ID_ROW" => $row['ID_ROW'],
                        "ID_OSPITE" => $row['ID_OSPITE'],
                        "dataRilevazione" => $row['dataRilevazione'],
                        "temperatura" => $row['temperatura'],
                        "saturazione" => $row['saturazione'],
                        "ossigeno" => $row['ossigeno'],
                        "fTosseSecca" => $row['fTosseSecca'],
                        "fDolMusc" => $row['fDolMusc'],
                        "fMaleTesta" => $row['fMaleTesta'],
                        "fRinorrea" => $row['fRinorrea'],
                        "fMaleGola" => $row['fMaleGola'],
                        "fAstenia" => $row['fAstenia'],
                        "fInappetenza" => $row['fInappetenza'],
                        "fVomito" => $row['fVomito'],
                        "fDiarrea" => $row['fDiarrea'],
                        "fCongiuntivite" => $row['fCongiuntivite'],
                        "Altro" => $row['Altro'],
                        "USER_INS" => $row['USER_INS']
                    );

                    array_push($elnParamOspite, $OspParam_item);
                }
            }

            return $elnParamOspite;

        } catch (Exception $e) {
            return $e;
        }

    }

    function GetElnOspitiParametri($pSchema, $pTabellaParametri) {
        //Luke 16/09/2020
        $tabTmp = $this->dbStruttura .".". $pSchema .".". $pTabellaParametri;

        $query = "Select V.ANAG_OSPITI#NOME +  ' ' + v.ANAG_OSPITI#COGNOME as OSPITE \n"
            . "     , V.ANAG_OSPITI#ID_OSPITE \n"
            . "     , V.ANAG_LETTI#NUM_LETTO \n"
            . "     , V.ANAG_LETTI#NUM_CAMERA \n"
            . "	    , V.ANAG_LETTI#PIANO \n"
            . "	    , V.ANAG_LETTI#SEZIONE  \n"
            . "     , (select MAX(dataRilevazione) from $tabTmp Where id_ospite=V.ANAG_OSPITI#ID_OSPITE) as DATA_ORA_ULTIMI \n"
            . "From ".$this->dbStruttura.".dbo.VISTA_OSPITI V \n"
            . "Where (ANAG_OSPITI#DATA_TERMINE = '19000101') \n"
            . "  and ANAG_OSPITI#ID_OSPITE >0 \n"
            . "  and (ANAG_LETTI#NUM_CAMERA>0) ";

        // prepare query statement
        $stmt = $this->conn->prepare($query,array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));

        try {
            // execute query
            $stmt->execute();

            $this->elnOspitiParametri = array();

            $num = $stmt->rowCount();
            //var_dump($num);
            // check if more than 0 record found
            if ($num > 0) {

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

                    $OspParam_item =   array(
                        "OSPITE" => $row['OSPITE'],
                        "ID_OSPITE" => $row['ANAG_OSPITI#ID_OSPITE'],
                        "NUM_LETTO" => $row['ANAG_LETTI#NUM_LETTO'],
                        "NUM_CAMERA" => $row['ANAG_LETTI#NUM_CAMERA'],
                        "PIANO" => $row['ANAG_LETTI#PIANO'],
                        "SEZIONE" => $row['ANAG_LETTI#SEZIONE'],
                        "DATA_ORA_ULTIMI" => $row['DATA_ORA_ULTIMI'],
                        "DETTAGLIO_DATI" => "" //mi serve per visualizzare l'occhio di caricamento parametri ospite
                    );

                    array_push($this->elnOspitiParametri, $OspParam_item);
                }
            }

            return $this->elnOspitiParametri;

        } catch (Exception $e) {
            return $e;
        }

    }


}
