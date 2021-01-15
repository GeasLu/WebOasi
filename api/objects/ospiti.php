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
    private $elnAnomalieOspiti;

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
               . "     , (select COGNOME +  ' ' + NOME from ANAG_OSPITI where ID_OSPITE=OP.ID_OSPITE) as OSPITE \n"
               . "From $tabTmp AS OP\n"
               . "Where ID_OSPITE = $pIdOspite  \n"
               . "  and ELIMINATO = 0 \n"
               . "order by dataRilevazione DESC";

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
                        "fNoAlteraz" => $row['fNoAlteraz'],
                        "Altro" => $row['Altro'],
                        "USER_INS" => $row['USER_INS'],
                        "idUserIns" => $row['idUserIns'],
                        "DELETE" =>  "0",
                        "OSPITE" =>  $row['OSPITE']
                    );

                    array_push($elnParamOspite, $OspParam_item);
                }
            }

            return $elnParamOspite;

        } catch (Exception $e) {
            return $e;
        }

    }

    function GetElnOspitiParametri($pSchema, $pTabellaParametri, $pPiano, $pCamera, $pSezione) {
        //Luke 16/09/2020
        $tabTmp = $this->dbStruttura .".". $pSchema .".". $pTabellaParametri;

        $query = "Select V.ANAG_OSPITI#COGNOME +  ' ' + v.ANAG_OSPITI#NOME as OSPITE \n"
            . "     , V.ANAG_OSPITI#ID_OSPITE \n"
            . "     , V.ANAG_LETTI#NUM_LETTO \n"
            . "     , V.ANAG_LETTI#NUM_CAMERA \n"
            . "	    , V.ANAG_LETTI#PIANO \n"
            . "	    , V.ANAG_LETTI#SEZIONE  \n"
            . "     , (select MAX(dataRilevazione) from $tabTmp Where id_ospite=V.ANAG_OSPITI#ID_OSPITE and Eliminato=0) as DATA_ORA_ULTIMI \n"
            . "From ".$this->dbStruttura.".dbo.VISTA_OSPITI V \n"
            . "Where (ANAG_OSPITI#DATA_TERMINE = '19000101') \n"
            . "  and ANAG_OSPITI#ID_OSPITE >0 \n"
            . "  and (ANAG_LETTI#PIANO>0) ";

        if ($pPiano <> -1){
            $query .= "   and ANAG_LETTI#PIANO = $pPiano \n";
        }
        if ($pCamera <> -1){
            $query .= "   and ANAG_LETTI#NUM_CAMERA = $pCamera \n";
        }
        if ($pSezione <> ''){
            $query .= "   and ANAG_LETTI#SEZIONE = '$pSezione' \n";
        }

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

    function GetAnomalieOspiti($pSchema, $pTabellaParametri, $pDataDal, $pDataAl, $pTemp, $pSat) {
        //Luke 16/09/2020
        $tabTmp = $this->dbStruttura .".". $pSchema .".". $pTabellaParametri;

        $query = "select OP.ID_ROW \n"
               . "     , AO.ID_OSPITE \n"
               . "     , AO.COGNOME + ' ' + AO.NOME AS OSPITE \n"
               . "     , OP.dataRilevazione \n"
	           . "     , OP.temperatura_num \n"
               . "     , OP.saturazione \n"
               . "     , OP.ossigeno \n"
               . "     , op.fTosseSecca   \n"
               . "     , op.fDolMusc  \n"
               . "     , op.fMaleTesta  \n"
               . "     , op.fRinorrea \n"
               . "     , op.fMaleGola  \n"
               . "     , op.fAstenia  \n"
               . "     , op.fInappetenza  \n"
               . "     , op.fVomito  \n"
               . "     , op.fDiarrea  \n"
               . "     , op.fCongiuntivite   \n"
               . "     , op.fNoAlteraz \n"
               . "     , op.Altro \n"
               . "     , (select NOMINATIVO from dbo.vINFO_UTENTI where ID_UTENTE=OP.idUserIns) as USER_INS \n"
               . "     , op.idUserIns \n"
               . "From ".$tabTmp." OP \n"
               . "Left outer join ANAG_OSPITI as AO ON AO.ID_OSPITE =  OP.ID_OSPITE \n"
               . "Where op.dataRilevazione >= '".$pDataDal."' and op.dataRilevazione <= '".$pDataAl."' \n"
               . "     and (    temperatura_num> :pTemp  \n"
               . "     or saturazione < :pSat \n"
               . "     or fTosseSecca = 1 \n"
               . "     or fDolMusc = 1 \n"
               . "     or fMaleTesta = 1 \n"
               . "     or fRinorrea = 1 \n"
               . "     or fMaleGola = 1 \n"
               . "     or fAstenia = 1 \n"
               . "     or fInappetenza = 1 \n"
               . "     or fVomito = 1 \n"
               . "     or fDiarrea = 1 \n"
               . "     or fCongiuntivite = 1) \n"
               . "     Order By COGNOME ";

        // prepare query statement
        $stmt = $this->conn->prepare($query,array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));

//        $pDataDal = htmlspecialchars(strip_tags($pDataDal));
//        $pDataAl = htmlspecialchars(strip_tags($pDataAl));
//
        $stmt->bindParam(":pTemp", $pTemp);
        $stmt->bindParam(":pSat", $pSat);

        try {
            // execute query
            $stmt->execute();

            $this->elnAnomalieOspiti = array();

            $num = $stmt->rowCount();
            //var_dump($num);
            //var_dump($stmt);

            // check if more than 0 record found
            if ($num > 0) {

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

                    $anomalieOsp_item =   array(
                        "ID_ROW" => $row['ID_ROW'],
                        "ID_OSPITE" => $row['ID_OSPITE'],
                        "OSPITE" => $row['OSPITE'],
                        "dataRilevazione" => $row['dataRilevazione'],
                        "temperatura_num" => $row['temperatura_num'],
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
                        "fNoAlteraz" => $row['fNoAlteraz'],
                        "Altro" => $row['Altro'],
                        "USER_INS" => $row['USER_INS'],
                        "idUserIns" => $row['idUserIns']
                    );

                    array_push($this->elnAnomalieOspiti, $anomalieOsp_item);
                }
            }

            return $this->elnAnomalieOspiti;

        } catch (PDOException $e) {
            return $e;
        }

    }

}
