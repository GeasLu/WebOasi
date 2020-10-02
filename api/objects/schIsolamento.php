<?php
//Luke 25/09/2020

class schIsolamento{

    private $conn;
    private $dbStruttura;
    private $Schema;
    private $table_name = "OSPITI_PARAMETRI";

    public $ID_OSPITE;
    public $dataRilevazione;
    public $idZona;
    public $temperatura;
    public $saturazione;
    public $ossigeno;
    public $fTosseSecca;
    public $fDolMusc;
    public $fMaleTesta;
    public $fRinorrea;
    public $fMaleGola;
    public $fAstenia;
    public $fInappetenza;
    public $fVomito;
    public $fDiarrea;
    public $fCongiuntivite;
    public $Altro;
    public $idUserIns;
    public $DtIns;
    public $Eliminato;
    public $DtEliminato;
    public $idUserDel;

    public function __construct($pConn, $pDbStruttura, $pSchema) {
        $this->conn = $pConn;
        $this->dbStruttura = $pDbStruttura;
        $this->Schema = $pSchema;
        $this->table_name = $this->dbStruttura .'.'.$this->Schema .'.'.$this->table_name;
    }

    // create product
    function create() {
        //Luke 29/09/2020
        //restituisce l'id della riga inserita altrimenti 0

        try {



        $query = "INSERT INTO " . $this->table_name . "(ID_OSPITE \n"
            .    "                                     ,dataRilevazione \n"
            .    "                                     ,idZona \n"
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
            .    "                                     ,Altro \n"
            .    "                                     ,idUserIns \n"
            .    "                                     ,DtIns) \n"
            ." VALUES (:ID_OSPITE \n"
            ."        ,:dataRilevazione \n"
            ."        ,:idZona \n"
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
            ."        ,:Altro \n"
            ."        ,:idUserIns \n"
            ."        ,:DtIns)";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->ID_OSPITE = htmlspecialchars(strip_tags($this->ID_OSPITE));
        $this->dataRilevazione = htmlspecialchars(strip_tags($this->dataRilevazione));
        $this->idZona = htmlspecialchars(strip_tags($this->idZona));
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
        $this->Altro = htmlspecialchars(strip_tags($this->Altro));
        $this->idUserIns = htmlspecialchars(strip_tags($this->idUserIns));
        $this->DtIns = htmlspecialchars(strip_tags($this->DtIns));


        // bind values
        $stmt->bindParam(":ID_OSPITE", $this->ID_OSPITE);
        $stmt->bindParam(":dataRilevazione", $this->dataRilevazione);
        $stmt->bindParam(":idZona", $this->idZona);
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



}