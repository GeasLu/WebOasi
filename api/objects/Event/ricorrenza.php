<?php

/* Luke 26/02/2021 */
error_reporting(E_ALL);

class ricorrenza
{

    // database connection and table name
    private $conn;
    private $dbStruttura;
    private $Schema;
    private $table_name = "ricorrenze";

    //Property della classe
    public $idRicorrenza;
    public $tipoRic;
    public $startDate;
    public $descrizione;
    public $G1_num_GG;
    public $S1_num_SETT;
    public $S1_gg_SETT;
    public $M1_num_GG;
    public $M1_num_MESI;
    public $M2_gg_ORD;
    public $M2_gg_SETT;
    public $M2_num_MESI;
    public $A_num_ANNO;
    public $A1_mese;
    public $A1_gg;
    public $A2_gg_ORD;
    public $A2_gg_SETT;
    public $A2_MESE;
    public $END_A;
    public $END_B;
    public $END_B_NUM;
    public $END_C;
    public $END_C_END;


    // constructor with $db as database connection
    public function __construct($pDb, $pDbStruttura, $pSchema) {
        $this->conn = $pDb;
        $this->dbStruttura = $pDbStruttura;
        $this->Schema = $pSchema;
        $this->table_name = "$pDbStruttura.$pSchema.$this->table_name";
    }

    public function create() {
        //Luke 26/02/2021

        try{

            $query = "INSERT INTO " . $this->table_name . "( TIPO_RIC \n"
                    . "                                     , START_DATE \n"
                    . "                                     , DESCRIZIONE \n";

            switch ($this->tipoRic){
                case 'SINGOLO':
                    $query .= "                                     , END_A \n"
                            . "                                     , END_C \n"
                            . "                                     , END_C_DATE) \n"
                            . "VALUES( :TIPO_RIC \n"
                            . "       ,:START_DATE \n"
                            . "       ,:DESCRIZIONE \n";
                    break;

                case 'G1':
                    $query .= "                                     , G1_NUMERO_GG \n"
                        . "                                     , END_A \n"
                        . "                                     , END_C \n"
                        . "                                     , END_C_DATE) \n";
                    $query .= "VALUES( :TIPO_RIC \n"
                        . "       ,:START_DATE \n"
                        . "       ,:DESCRIZIONE \n"
                        . "       ,:G1_NUMERO_GG \n";
                    break;

                case 'G2':
                    $query .= "                                     , END_A \n"
                        . "                                     , END_C \n"
                        . "                                     , END_C_DATE) \n";
                    $query .= "VALUES( :TIPO_RIC \n"
                        . "       ,:START_DATE \n"
                        . "       ,:DESCRIZIONE \n";
                    break;

                case 'S1':
                    $query .= "                                     , S1_NUM_SETT \n"
                        . "                                     , S1_GG_SETT \n"
                        . "                                     , END_A \n"
                        . "                                     , END_C \n"
                        . "                                     , END_C_DATE) \n";
                    $query .= "VALUES( :TIPO_RIC \n"
                        . "       ,:START_DATE \n"
                        . "       ,:DESCRIZIONE \n"
                        . "       ,:S1_NUM_SETT \n"
                        . "       ,:S1_GG_SETT \n";

                    break;

                case 'M1':
                    $query .= "                                     , M1_NUM_GG \n"
                        . "                                     , M1_NUM_MESI \n"
                        . "                                     , END_A \n"
                        . "                                     , END_C \n"
                        . "                                     , END_C_DATE) \n";
                    $query .= "VALUES( :TIPO_RIC \n"
                        . "       ,:START_DATE \n"
                        . "       ,:DESCRIZIONE \n"
                        . "       ,:M1_NUM_GG \n"
                        . "       ,:M1_NUM_MESI \n";
                    break;

                case 'M2':
                    $query .= "                                     , M2_GG_ORD \n"
                        . "                                     , M2_GG_SETT \n"
                        . "                                     , M2_NUM_MESI \n"
                        . "                                     , END_A \n"
                        . "                                     , END_C \n"
                        . "                                     , END_C_DATE) \n";
                    $query .= "VALUES( :TIPO_RIC \n"
                        . "       ,:START_DATE \n"
                        . "       ,:DESCRIZIONE \n"
                        . "       ,:M2_GG_ORD \n"
                        . "       ,:M2_GG_SETT \n"
                        . "       ,:M2_NUM_MESI \n";
                    break;

                case 'A1':
                    $query .= "                                     , A_NUM_ANNO \n"
                        . "                                     , A1_MESE \n"
                        . "                                     , A1_GG \n"
                        . "                                     , END_A \n"
                        . "                                     , END_C \n"
                        . "                                     , END_C_DATE) \n";
                    $query .= "VALUES( :TIPO_RIC \n"
                        . "       ,:START_DATE \n"
                        . "       ,:DESCRIZIONE \n"
                        . "       ,:A_NUM_ANNO \n"
                        . "       ,:A1_MESE \n"
                        . "       ,:A1_GG \n";
                    break;
                case 'A2':
                    $query .= "                                     , A_NUM_ANNO \n"
                        . "                                     , A2_GG_ORD \n"
                        . "                                     , A2_GG_SETT \n"
                        . "                                     , A2_MESE \n"
                        . "                                     , END_A \n"
                        . "                                     , END_C \n"
                        . "                                     , END_C_DATE) \n";

                    $query .= "VALUES( :TIPO_RIC \n"
                        . "       ,:START_DATE \n"
                        . "       ,:DESCRIZIONE \n"
                        . "       ,:A_NUM_ANNO \n"
                        . "       ,:A2_GG_ORD \n"
                        . "       ,:A2_GG_SETT \n"
                        . "       ,:A2_MESE \n";
                    break;
            }
            $query .=  "       ,:END_A  \n"
                     . "       ,:END_C  \n"
                     . "       ,:END_C_DATE ) \n";


//            var_dump($query);

            // prepare query
            $stmt = $this->conn->prepare($query);

            //prepare property from EXT
            $this->SanitizeProperty();

            $stmt->bindParam(":TIPO_RIC", $this->tipoRic);
            $stmt->bindParam(":START_DATE", $this->startDate);
            $stmt->bindParam(":DESCRIZIONE", $this->descrizione);

            switch ($this->tipoRic){
                case 'SINGOLO':
                    break;

                case 'G1':
                    $stmt->bindParam(":G1_NUMERO_GG", $this->G1_num_GG);
                    break;

                case 'S1':
                    $stmt->bindParam(":S1_NUM_SETT", $this->G1_num_GG);
                    $stmt->bindParam(":S1_GG_SETT", $this->G1_num_GG);
                    break;

                case 'M1':
                    $stmt->bindParam(":M1_NUM_GG", $this->M1_num_GG);
                    $stmt->bindParam(":M1_NUM_MESI", $this->M1_num_MESI);
                    break;

                case 'M2':
                    $stmt->bindParam(":M2_GG_ORD", $this->M2_gg_ORD);
                    $stmt->bindParam(":M2_GG_SETT", $this->M2_gg_SETT);
                    $stmt->bindParam(":M2_NUM_MESI", $this->M2_num_MESI);

                    break;

                case 'A1':
                    $stmt->bindParam(":A_NUM_ANNO", $this->A_num_ANNO);
                    $stmt->bindParam(":A1_MESE", $this->A1_mese);
                    $stmt->bindParam(":A1_GG", $this->A1_gg);
                    break;

                case 'A2':
                    $stmt->bindParam(":A_NUM_ANNO", $this->A_num_ANNO);
                    $stmt->bindParam(":A2_GG_ORD", $this->A2_gg_ORD);
                    $stmt->bindParam(":A2_GG_SETT", $this->A2_gg_SETT);
                    $stmt->bindParam(":A2_MESE", $this->A2_MESE);
                    break;

            }

            $stmt->bindParam(":END_A",$this->END_A);
            $stmt->bindParam(":END_C",$this->END_C);
            $stmt->bindParam(":END_C_DATE",$this->END_C_END);

            // execute query
            if ($stmt->execute()) {
                $lastId = $this->conn->lastInsertId();
                return $lastId;
            }
            var_dump($stmt->errorInfo());
            return 0;


        } catch(PDOException $e){
            var_dump($e);
        }

    }

    private function SanitizeProperty(){
        //Luke 23/03/2021

        // sanitize
        $this->tipoRic = htmlspecialchars(strip_tags($this->tipoRic));
        $this->startDate = htmlspecialchars(strip_tags($this->startDate));
        $this->G1_num_GG = htmlspecialchars(strip_tags($this->G1_num_GG));
        $this->S1_num_SETT = htmlspecialchars(strip_tags($this->S1_num_SETT));
        $this->S1_gg_SETT = htmlspecialchars(strip_tags($this->S1_gg_SETT));
        $this->M1_num_GG = htmlspecialchars(strip_tags($this->M1_num_GG));
        $this->M1_num_MESI = htmlspecialchars(strip_tags($this->M1_num_MESI));
        $this->M2_gg_ORD = htmlspecialchars(strip_tags($this->M2_gg_ORD));
        $this->M2_gg_SETT = htmlspecialchars(strip_tags($this->M2_gg_SETT));
        $this->M2_num_MESI = htmlspecialchars(strip_tags($this->M2_num_MESI));
        $this->A_num_ANNO = htmlspecialchars(strip_tags($this->A_num_ANNO));
        $this->A1_mese = htmlspecialchars(strip_tags($this->A1_mese));
        $this->A1_gg = htmlspecialchars(strip_tags($this->A1_gg));
        $this->A2_gg_ORD = htmlspecialchars(strip_tags($this->A2_gg_ORD));
        $this->A2_gg_SETT = htmlspecialchars(strip_tags($this->A2_gg_SETT));
        $this->A2_MESE = htmlspecialchars(strip_tags($this->A2_MESE));
        $this->END_A = htmlspecialchars(strip_tags($this->END_A));
        $this->END_B = htmlspecialchars(strip_tags($this->END_B));
        $this->END_B_NUM = htmlspecialchars(strip_tags($this->END_B_NUM));
        $this->END_C = htmlspecialchars(strip_tags($this->END_C));
        $this->END_C_END = htmlspecialchars(strip_tags($this->END_C_END));


    }

    public function update() {
        //Luke 01/03/2021

        // query to insert record
        $query = "UPDATE " . $this->table_name . " \n"
               . "SET  TIPO_RIC = :TIPO_RIC \n"
            . "      , START_DATE = :START_DATE\n"
            . "      , DESCRIZIONE = :DESCRIZIONE\n"
            . "      , G1_NUMERO_GG = :G1_NUMERO_GG\n"
            . "      , S1_NUM_SETT = :S1_NUM_SETT\n"
            . "      , S1_GG_SETT = :S1_GG_SETT\n"
            . "      , M1_NUM_GG = :M1_NUM_GG\n"
            . "      , M1_NUM_MESI = :M1_NUM_MESI\n"
            . "      , M2_GG_ORD = :M2_GG_ORD\n"
            . "      , M2_GG_SETT = :M2_GG_SETT\n"
            . "      , M2_NUM_MESI = :M2_NUM_MESI\n"
            . "      , A_NUM_ANNO = :A_NUM_ANNO\n"
            . "      , A1_MESE = :A1_MESE\n"
            . "      , A1_GG = :A1_GG\n"
            . "      , A2_GG_ORD = :A2_GG_ORD\n"
            . "      , A2_GG_SETT = :A2_GG_SETT\n"
            . "      , A2_MESE = :A2_MESE \n"
            . "      , END_A = :END_A\n"
            . "      , END_B = :END_B\n"
            . "      , END_B_NUM = :END_B_NUM \n"
            . "      , END_C = :END_C \n"
            . "      , END_C_DATE = :END_C_DATE \n"
            . "WHERE ID_RICORRENZA = :ID_RICORRENZA \n";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->tipoRic = htmlspecialchars(strip_tags($this->Diario));
        $this->startDate = htmlspecialchars(strip_tags($this->DataIns));
        $this->descrizione = htmlspecialchars(strip_tags($this->descrizione));
        $this->G1_num_GG = htmlspecialchars(strip_tags($this->G1_num_GG));
        $this->S1_num_SETT = htmlspecialchars(strip_tags($this->S1_num_SETT));
        $this->S1_gg_SETT = htmlspecialchars(strip_tags($this->S1_gg_SETT));
        $this->M1_num_GG = htmlspecialchars(strip_tags($this->M1_num_GG));
        $this->M1_num_MESI = htmlspecialchars(strip_tags($this->M1_num_MESI));
        $this->M2_gg_ORD = htmlspecialchars(strip_tags($this->M2_gg_ORD));
        $this->M2_gg_SETT = htmlspecialchars(strip_tags($this->M2_gg_SETT));
        $this->M2_num_MESI = htmlspecialchars(strip_tags($this->M2_num_MESI));
        $this->A_num_ANNO = htmlspecialchars(strip_tags($this->A_num_ANNO));
        $this->A1_mese = htmlspecialchars(strip_tags($this->A1_mese));
        $this->A1_gg = htmlspecialchars(strip_tags($this->A1_gg));
        $this->A2_gg_ORD = htmlspecialchars(strip_tags($this->A2_gg_ORD));
        $this->A2_gg_SETT = htmlspecialchars(strip_tags($this->A2_gg_SETT));
        $this->A2_MESE = htmlspecialchars(strip_tags($this->A2_MESE));
        $this->END_A = htmlspecialchars(strip_tags($this->END_A));
        $this->END_B = htmlspecialchars(strip_tags($this->END_B));
        $this->END_B_NUM = htmlspecialchars(strip_tags($this->END_B_NUM));
        $this->END_C = htmlspecialchars(strip_tags($this->END_C));
        $this->END_C_END = htmlspecialchars(strip_tags($this->END_C_END));

        // bind values
        $stmt->bindParam(":TIPO_RIC", $this->tipoRic);
        $stmt->bindParam(":START_DATE", $this->startDate);
        $stmt->bindParam(":DESCRIZIONE", $this->descrizione);
        $stmt->bindParam(":G1_NUMERO_GG", $this->G1_num_GG);
        $stmt->bindParam(":S1_NUM_SETT", $this->S1_num_SETT);
        $stmt->bindParam(":S1_GG_SETT", $this->S1_gg_SETT);
        $stmt->bindParam(":M1_NUM_GG", $this->M1_num_GG);
        $stmt->bindParam(":M1_NUM_MESI", $this->M1_num_MESI);
        $stmt->bindParam(":M2_GG_ORD", $this->M2_gg_ORD);
        $stmt->bindParam(":M2_GG_SETT", $this->M2_gg_SETT);
        $stmt->bindParam(":M2_NUM_MESI",$this->M2_num_MESI);
        $stmt->bindParam(":A_NUM_ANNO",$this->A_num_ANNO);
        $stmt->bindParam(":A1_MESE",$this->A1_mese);
        $stmt->bindParam(":A1_GG",$this->A1_gg);
        $stmt->bindParam(":A2_GG_ORD",$this->A2_gg_ORD);
        $stmt->bindParam(":A2_GG_SETT",$this->A2_gg_SETT);
        $stmt->bindParam(":A2_MESE",$this->A2_MESE);
        $stmt->bindParam(":END_A",$this->END_A);
        $stmt->bindParam(":END_B",$this->END_B);
        $stmt->bindParam(":END_B_NUM",$this->END_B_NUM);
        $stmt->bindParam(":END_C",$this->END_C);
        $stmt->bindParam(":END_C_DATE",$this->END_C_END);

        // execute query
        if ($stmt->execute()) {
            $lastId = $this->conn->rowCount();
            return json_encode(array(
                                        "result" => "true",
                                        "row" => $lastId,
                                        "error" => ""
                                    ));
        } else {
            return print_r($stmt->errorInfo(), true);
        };

    }

    public function delete($pIdRic=-1) {
        //Luke 02/03/2021

        // query to insert record
        $query = "DELETE FROM " . $this->table_name . " \n"
               . "WHERE ID_RICORRENZA = :ID_RICORRENZA \n";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->idRicorrenza = htmlspecialchars(strip_tags($this->idRicorrenza));

        // bind values
        if($pIdRic>-1){
            $stmt->bindParam(":ID_RICORRENZA", $pIdRic);
        }else{
            $stmt->bindParam(":ID_RICORRENZA", $this->idRicorrenza);
        }

        // execute query
        if ($stmt->execute()) {
            $lastId = $this->conn->lastInsertId();
            return json_encode(array(
                                        "result" => "true",
                                        "row" => $lastId,
                                        "error" => ""
                                    ));;
        } else {
            return print_r($stmt->errorInfo(), true);
        };

    }

    ///Restituisce un array con tutte le date calcolate in base alla ricorrenza e alla data START
    /// se non c'è una data fine, le calcola per 2 anni.
    public function calcolaRicorrenze($pDataStart){
        //Luke 02/03/2021

        $elnDate =  Array();
        $dt = date('Y-m-d');

        if (!$pDataStart) {
            $pDataStart = $this->startDate;
        }

        if ($this->END_C) {
            $dateStop = $this->END_C_END;
        }elseif ($this->END_A) {
            $dateStop =  date('Y-m-d', strtotime($pDataStart . '+2 year' ));
        }else {
            $dateStop =  date('Y-m-d', strtotime($pDataStart . '+1 year' ));
        }

        //Può assumere i valori: G1, G2, S1, M1, M2, A1, A2 e indica il codice dei campi che devo leggere per questa tipologia
        switch ($this->tipoRic){
            case "G1":
                for($dt=$pDataStart;$dt<=$dateStop;$dt =date('Y-m-d', strtotime($dt . '+'.$this->G1_num_GG .' day')) ){
                    array_push($elnDate, $dt);
                }
                break;

            case "G2":
                for($dt=$pDataStart;$dt<=$dateStop;$dt =date('Y-m-d', strtotime($dt . '+1 day')) ){
                    if (date('D',strtotime($dt)) != 'Sat' && date('D',strtotime($dt)) != 'Sun'){
                        array_push($elnDate, $dt);
                    }
                }
                break;

            case "S1":
                // Lun(1) = pos 0, Mar(2) = pos 1 ecc...
                $numWOld = date('W',strtotime($pDataStart)) ;
                for($dt=$pDataStart;$dt<=$dateStop;$dt =date('Y-m-d', strtotime($dt . '+1 day')) ){
                    $numW = date('W',strtotime($dt));
                    if (($numW - $numWOld)>=$this->S1_num_SETT || ($numW == $numWOld)) {
                        $numWOld = $numW;
                        $indD = date('w',strtotime($dt)); //	0 (for Sunday) through 6 (for Saturday)
                        // cerco nella stringa giorni che è composta da 0000000 7 zeri partenza il primo carattere è Lunedì
                        switch ($indD){
                            case 0: //dome
                                $str = substr($this->S1_gg_SETT,6,1);
                                if ($str==1){
                                    array_push($elnDate, $dt);
                                }
                                break;
                            case 1: //lun
                                $str = substr($this->S1_gg_SETT,0,1);
                                if ($str==1){
                                    array_push($elnDate, $dt);
                                }
                                break;
                            case 2: //mart
                                $str = substr($this->S1_gg_SETT,1,1);
                                if ($str==1){
                                    array_push($elnDate, $dt);
                                }
                                break;
                            case 3: //merc
                                $str = substr($this->S1_gg_SETT,2,1);
                                if ($str==1){
                                    array_push($elnDate, $dt);
                                }
                                break;
                            case 4: //giov
                                $str = substr($this->S1_gg_SETT,3,1);
                                if ($str==1){
                                    array_push($elnDate, $dt);
                                }
                                break;
                            case 5: //ven
                                $str = substr($this->S1_gg_SETT,4,1);
                                if ($str==1){
                                    array_push($elnDate, $dt);
                                }
                                break;
                            case 6: //sab
                                $str = substr($this->S1_gg_SETT,5,1);
                                if ($str==1){
                                    array_push($elnDate, $dt);
                                }
                                break;
                        }

                    }

                }
                break;

            case "M1":
                $numMOld =date('n',strtotime($pDataStart)) ;
                for($dt=$pDataStart;$dt<=$dateStop;$dt =date('Y-m-d', strtotime($dt . '+1 day')) ){
                    $numM = date('n',strtotime($dt));
                    if (($numM - $numMOld)>=$this->M1_num_MESI || ($numM == $numMOld)) {
                        $numMOld =$numM;
                        $numDayinMonth = date('j',strtotime($dt));
                        if ($numDayinMonth == $this->M1_num_GG) {
                            array_push($elnDate, $dt);
                        }
                    }
                }
                break;

            case "M2":
                $numMOld =date('n',strtotime($pDataStart)) ;
                $count = 0;
                for($dt=$pDataStart;$dt<=$dateStop;$dt =date('Y-m-d', strtotime($dt . '+1 day')) ){
                    $numM = date('n',strtotime($dt));

                    if ($numM != $numMOld){
                        $count=0;
                    }
                    if (abs($numM - $numMOld)>=$this->M2_num_MESI || ($numM == $numMOld)) {
                        $numMOld =$numM;
                        $indD = date('w',strtotime($dt));
                        // conteggio l'occorrenza del giorno nel mese
                        if ($this->traduciGG_SETT($this->M2_gg_SETT)==$indD){
                            $count++;
                        }
                        if ($this->traduciGG_SETT($this->M2_gg_SETT)==$indD && $count==$this->traduciGG_ORD($this->M2_gg_ORD)){
                            array_push($elnDate, $dt);
                        }
                    }
                }
                break;

            case "A1":
                $numYOld =date('Y',strtotime($pDataStart)) ;
                for($dt=$pDataStart;$dt<=$dateStop;$dt =date('Y-m-d', strtotime($dt . '+1 day')) ){
                    $numY = date('Y',strtotime($dt));
                    if (abs($numY - $numYOld)>=$this->A_num_ANNO || ($numY == $numYOld)) {
                        $numYOld = $numY;
                        if (date('Y-m-d',mktime(0, 0, 0, $this->traduciMese($this->A1_mese), $this->A1_gg, $numYOld)) == $dt){
                            array_push($elnDate, $dt);
                        }
                    }
                }
                break;

            case "A2":
                $numYOld =date('Y',strtotime($pDataStart)) ;
                $count = 0;
                for($dt=$pDataStart;$dt<=$dateStop;$dt =date('Y-m-d', strtotime($dt . '+1 day')) ){
                    $numY = date('Y',strtotime($dt));
                    if ($numY != $numYOld){
                        $count=0;
                    }

                    if (abs($numY - $numYOld)>=$this->A_num_ANNO || ($numY == $numYOld)) {
                        $numYOld =$numY;
                        if ($this->traduciMese($this->A2_MESE) == date('n',strtotime($dt))){
                            $indD = date('w',strtotime($dt));
                            // conteggio l'occorrenza del giorno nel mese
                            if ($this->traduciGG_SETT($this->A2_gg_SETT)==$indD){
                                $count++;
                            }
                            if ($this->traduciGG_SETT($this->A2_gg_SETT)==$indD && $count==$this->traduciGG_ORD($this->A2_gg_ORD)){
                                array_push($elnDate, $dt);
                            }
                        }
                    }
                }

                break;

        }

        return $elnDate;

    }

    private function traduciGG_ORD($pDayORD){
        //Luke 05/03/2021
         switch ($pDayORD){
             case 'Primo/a': return 1;
             case 'Secondo/a':  return 2;
             case 'Terzo/a':  return 3;
             case 'Quarto/a':  return 4;
             case 'Ultimo/a':  return 5;
         }
    }

    private function traduciGG_SETT($pDaySETT){
        //Luke 05/03/2021
        switch ($pDaySETT){
            case 'Lunedì': return 1;
            case 'Martedì':  return 2;
            case 'Mercoledì':  return 3;
            case 'Giovedì':  return 4;
            case 'Venerdì':  return 5;
            case 'Sabato':  return 5;
            case 'Domenica':  return 0;
        }
    }

    private function traduciMese($pMese){
        //Luke 05/03/2021
        switch ($pMese){
            case 'Gennaio': return 1;
            case 'Febbraio':  return 2;
            case 'Marzo':  return 3;
            case 'Aprile':  return 4;
            case 'Maggio':  return 5;
            case 'Giugno':  return 6;
            case 'Luglio':  return 7;
            case 'Agosto':  return 8;
            case 'Settembre':  return 9;
            case 'Ottobre':  return 10;
            case 'Novembre':  return 11;
            case 'Dicembre':  return 12;
        }
    }

    public function GeneraStringaRic(){
        //Luke 05/03/2021

        $dt = date('Y-m-d');
        $str='';

        if ($this->END_C) {
            $dateStop = $this->END_C_END;
        } else {
            $dateStop =  date('Y-m-d', strtotime($this->startDate . '+1 year' ));
        }

        //Può assumere i valori: G1, G2, S1, M1, M2, A1, A2 e indica il codice dei campi che devo leggere per questa tipologia
        switch ($this->tipoRic){
            case "SINGOLO":
                $str="Ricorre il giorno ". $this->startDate . " dalle " . date('H:i', strtotime($this->startDate))  . " alle " . date('H:i', strtotime($dateStop));
                break;

            case "G1":
                $str="Ricorre ogni ". $this->G1_num_GG;
                break;

            case "G2":
                $str="Ricorre dal Lunedì al Venerdì";
                break;

            case "S1":
                // Lun(1) = pos 0, Mar(2) = pos 1 ecc...
                $str="Ricorre il ";
                //var_dump($this->S1_gg_SETT);
                for($i=0;$i<=6;$i++){
                    // cerco nella stringa giorni che è composta da 0000000 7 zeri partenza il primo carattere è Lunedì
                    //var_dump(substr($this->S1_gg_SETT,$i,1));
                    switch ($i){
                        case 0: //Lun
                            substr($this->S1_gg_SETT,$i,1) ? $str = $str . " Lunedì,":"";
                            break;
                        case 1: //Mart
                            substr($this->S1_gg_SETT,$i,1) ?  $str =  $str . " Martedì,": "";
                            break;
                        case 2: //Merc
                            substr($this->S1_gg_SETT,$i,1) ? $str = $str ." Mercoledì,":"";
                            break;
                        case 3: //Giov
                            substr($this->S1_gg_SETT,$i,1) ? $str = $str ." Giovedì,":"";
                            break;
                        case 4: //Vene
                            substr($this->S1_gg_SETT,$i,1) ? $str = $str . " Venerdì,":"";
                            break;
                        case 5: //Sab
                            substr($this->S1_gg_SETT,$i,1) ? $str = $str . " Sabato,":"";
                            break;
                        case 6: //Dom
                            substr($this->S1_gg_SETT,$i,1) ? $str = $str . " Domenica,":"";
                            break;
                    }
                }
                $str = $str . " ogni " . $this->S1_num_SETT . " settimane";
                break;

            case "M1":
                $str="Ricorre il giorno " . $this->M1_num_GG ." ogni " . $this->M1_num_MESI . " mese/i";
                break;

            case "M2":
                $str="Ricorre il " . $this->M2_gg_ORD . " " . $this->M2_gg_SETT . " ogni " . $this->M2_num_MESI . " mese/i";
                break;

            case "A1":
                $str="Ricorre ogni " . $this->A_num_ANNO . " anno/i, in data " . $this->A1_gg . "/" . $this->A1_mese;
                break;

            case "A2":
                $str="Ricorre ogni " . $this->A_num_ANNO . " anno/i, il " . $this->A2_gg_ORD . " " . $this->A2_gg_SETT . " di ogni " . $this->A2_MESE;
                break;

        }

        if ($this->END_A){
            $str .= ", e non ha una fine";
        }else{
            $str .= ", fino al " . date('Y-m-d', strtotime($this->END_C_END));
        }

        return $str;

    }

    private function giornoData($g,$m,$a){
        $gShort = array('Dom','Lun','Mart','Merc','Giov','Ven','Sab');
        $ts = mktime(0,0,0,$m,$g,$a);
        $gd = getdate($ts);
        return $gShort[$gd['wday']];
        // return $gd['wday']; ritorna l'indice del giorno compreso tra 0 e 6
    }

}