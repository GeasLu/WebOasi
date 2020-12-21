<?php

/* Luke 18/03/2020 */
error_reporting(E_ALL);

class Diario
{
    // database connection and table name
    private $conn;
    private $dbStruttura;
    private $table_name = "Comune.DIARIO_OSPITI"; //dove salvo la nota
    private $table_name_seq = "Comune.SEQUENZE_DIARIO_OSPITI";//dove salvo, aggiorno o inserisco il nuovo puntatore per le note a diario

    Private $idOspite;
    Private $RigaDiario;
    Private $NomeModuloChiamante;


    // campi della classe
    Private $Diario; //as string
    Private $FlagSegnalaMedico; // as boolean
    Private $VisAnagOspitiV2;// as boolean
    Private $VisCartellaClinica;// as boolean
    Private $SempreAttivo;// as boolean
    Private $DataIns;// As Date
    Private $idUtenteIns;// As Integer
    Private $idSegnalazione;// As Integer

    public function __construct($pDb, $pDbStruttura, $pIdOspite, $pIdUserIns) {
        //Luke 09/12/2020

        $this->conn = $pDb;
        $this->dbStruttura = $pDbStruttura;
        $this->table_name= $this->dbStruttura . '.' . $this->table_name;
        $this->table_name_seq= $this->dbStruttura . '.' . $this->table_name_seq;

        $this->idOspite = $pIdOspite;
        $this->idUtenteIns = $pIdUserIns;

    }

    public function InsertNote($pNotaDiario, $pDataIns){
        //Luke 18/12/2020

        $save = false;

        $this->RigaDiario = $this->sqlGetSeqDiarioOspite() + 1;
        $this->Diario = $pNotaDiario;
        $this->FlagSegnalaMedico = true;
        $this->VisAnagOspitiV2 = false;
        $this->VisCartellaClinica = true;
        $this->SempreAttivo = false;
        $this->DataIns = $pDataIns;
        $this->VisCartellaClinica = true;
        $this->NomeModuloChiamante = "WEBOASI";
        $this->idSegnalazione = -1;

        // query to insert record
        $query = "INSERT INTO " . $this->table_name . "(  ID_OSPITE \n"
            . "                                     , RIGA_DIARIO \n"
            . "                                     , DIARIO \n"
            . "                                     , FLAG_SEGNALAZ_MEDICO \n"
            . "                                     , VIS_ANAG_OSPITI \n"
            . "                                     , VIS_CARTELLA_CLINICA \n"
            . "                                     , SEMPRE_ATTIVO \n"
            . "                                     , DataIns \n"
            . "                                     , idUtenteIns \n"
            . "                                     , NOME_MODULO \n"
            . "                                     , ID_SEGNALAZIONE) \n"
            . "VALUES( :ID_OSPITE \n"
            . "       ,:RIGA_DIARIO \n"
            . "       ,:DIARIO \n"
            . "       ,:FLAG_SEGNALAZ_MEDICO \n"
            . "       ,:VIS_ANAG_OSPITI \n"
            . "       ,:VIS_CARTELLA_CLINICA  \n"
            . "       ,:SEMPRE_ATTIVO  \n"
            . "       ,:DataIns  \n"
            . "       ,:idUtenteIns  \n"
            . "       ,:NOME_MODULO  \n"
            . "       ,:ID_SEGNALAZIONE)  \n";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->Diario = htmlspecialchars(strip_tags($this->Diario));
        $this->DataIns = htmlspecialchars(strip_tags($this->DataIns));

        // bind values
        $stmt->bindParam(":ID_OSPITE", $this->idOspite);
        $stmt->bindParam(":RIGA_DIARIO", $this->RigaDiario);
        $stmt->bindParam(":DIARIO", $this->Diario);
        $stmt->bindParam(":FLAG_SEGNALAZ_MEDICO", $this->FlagSegnalaMedico);
        $stmt->bindParam(":VIS_ANAG_OSPITI", $this->VisAnagOspitiV2);
        $stmt->bindParam(":VIS_CARTELLA_CLINICA", $this->VisCartellaClinica);
        $stmt->bindParam(":SEMPRE_ATTIVO", $this->SempreAttivo);
        $stmt->bindParam(":DataIns", $this->DataIns);
        $stmt->bindParam(":idUtenteIns", $this->idUtenteIns);
        $stmt->bindParam(":NOME_MODULO", $this->NomeModuloChiamante);
        $stmt->bindParam(":ID_SEGNALAZIONE",$this->idSegnalazione);


        // execute query
        if ($stmt->execute()) {
            $save = true;
        } else {
            return print_r($stmt->errorInfo(), true);
        };

        if($save) {
            $aggiornaSeq = $this->AggiornaSequenza();
            if ($aggiornaSeq) {
                return $this->RigaDiario;    
            } else {
                return $aggiornaSeq;
            }
        };

        return 9999;


    }

    private function sqlGetSeqDiarioOspite(){
        //Luke 18/12/2020

        $query = "Select isnull(RIGA_DIARIO,0) RIGA_DIARIO \n"
               . "From $this->table_name_seq \n"
               . "Where ID_OSPITE  = :idOspite";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // bind id of product to be updated
        $stmt->bindParam(":idOspite", $this->idOspite);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (isset($row)) {
            $this->RigaDiario = $row['RIGA_DIARIO'];
        }

        return $this->RigaDiario;

    }

    private function AggiornaSequenza(){
        //Luke 18/12/2020

        if ($this->RigaDiario==1){
            $confirm = $this->sqlInsSeq();
        } else {
            $confirm = $this->sqlUpdSeq();
        }

        return $confirm;
        
    }

    private function sqlInsSeq(){
        //Luke 18/12/2020

        // query to insert record
        $query = "INSERT INTO " . $this->table_name_seq . "( ID_OSPITE \n"
               . "                                         , RIGA_DIARIO) \n"
               . "VALUES( :ID_OSPITE \n"
            .    "       ,:RIGA_DIARIO ) \n";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->Diario = htmlspecialchars(strip_tags($this->Diario));
        $this->DataIns = htmlspecialchars(strip_tags($this->DataIns));

        // bind values
        $stmt->bindParam(":ID_OSPITE", $this->idOspite);
        $stmt->bindParam(":RIGA_DIARIO", $this->RigaDiario);

        // execute query
        if ($stmt->execute()) {
            return true;
        }else{
            return print_r($stmt->errorInfo(), true);;
        }

    }

    private function sqlUpdSeq(){
        //Luke 18/12/2020

        $query = "UPDATE " . $this->table_name_seq . " \n"
               . "SET RIGA_DIARIO = :RigaDiario \n"
               . "Where ID_OSPITE   = :idOspite \n";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->Diario = htmlspecialchars(strip_tags($this->Diario));

        // bind values
        $stmt->bindParam(":idOspite", $this->idOspite);
        $stmt->bindParam(":RigaDiario", $this->RigaDiario);

        // execute query
        if ($stmt->execute()) {
            return true;
        }else{
            return  print_r($stmt->errorInfo(), true);;
        }

    }

}