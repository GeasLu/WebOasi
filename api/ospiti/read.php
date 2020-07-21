<?php

// required header
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/database.php';
include_once '../objects/Ospiti.php';

// instantiate database and category object
$database = new Database();
$db = $database->getConnection();

// initialize object
$Ospiti = new Ospiti($db);

// query categorys
$stmt = $Ospiti->read();
$num = $stmt->rowCount();

// check if more than 0 record found
if ($num > 0) {

    // products array
    $Ospiti_arr = array();
    $Ospiti_arr["records"] = array();

    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // extract row
        // this will make $row['name'] to
        // just $name only
        //extract($row);

        $Ospiti_item = array(
            "ID_OSPITE" => $row['ID_OSPITE'],
            "COGNOME" => $row['COGNOME'],
            "NOME" => $row['NOME'],
            "COD_REG_ISTAT" => $row['COD_REG_ISTAT'],
            "SESSO" => $row['SESSO'],
            "CITTA_NASCITA" => $row['CITTA_NASCITA'],
            "PROV_NASCITA" => $row['PROV_NASCITA'],
            "PAESE_NASCITA" => $row['PAESE_NASCITA'],
            "NAZIONALITA" => $row['NAZIONALITA'],
            "DATA_NASCITA" => $row['DATA_NASCITA'],
            "ID_STATO_CIVILE" => $row['ID_STATO_CIVILE'],
            "NOTE_STATO_CIVILE" => $row['NOTE_STATO_CIVILE'],
            "NUMERO_CI" => $row['NUMERO_CI'],
            "COMUNE_RILASCIO_CI" => $row['COMUNE_RILASCIO_CI'],
            "DATA_RILASCIO_CI" => $row['DATA_RILASCIO_CI'],
            "DATA_SCADENZA_CI" => $row['DATA_SCADENZA_CI'],
            "CODICE_FISCALE" => $row['CODICE_FISCALE'],
            "NUMERO_TS" => $row['NUMERO_TS'],
            "DATA_RILASCIO_TS" => $row['DATA_RILASCIO_TS'],
            "DATA_SCADENZA_TS" => $row['DATA_SCADENZA_TS'],
            "NUMERO_TS_EUR" => $row['NUMERO_TS_EUR'],
            "DATA_RILASCIO_TS_EUR" => $row['DATA_RILASCIO_TS_EUR'],
            "DATA_SCADENZA_TS_EUR" => $row['DATA_SCADENZA_TS_EUR'],
            "RESIDENZA_CASA_RIPOSO" => $row['RESIDENZA_CASA_RIPOSO'],
            "ULTIMA_RESIDENZA" => $row['ULTIMA_RESIDENZA'],
            "COMUNE_PROVENIENZA" => $row['COMUNE_PROVENIENZA'],
            "RESIDENZA" => $row['RESIDENZA'],
            "NOTE_RESIDENZA" => $row['NOTE_RESIDENZA'],
            "USCITA_NO_ACCOMP" => $row['USCITA_NO_ACCOMP'],
            "TIPO_TERMINE" => $row['TIPO_TERMINE'],
            "ID_CAUSA_TERMINE" => $row['ID_CAUSA_TERMINE'],
            "DATA_TERMINE" => $row['DATA_TERMINE'],
            "NOTE_TERMINE" => $row['NOTE_TERMINE'],
            "TELEVISORE" => $row['TELEVISORE'],
            "PROPRIETARIO_TV" => $row['PROPRIETARIO_TV'],
            "TELEFONO" => $row['TELEFONO'],
            "INTERNO_TEL" => $row['INTERNO_TEL'],
            "RICHIEDE_TRASPORTO" => $row['RICHIEDE_TRASPORTO'],
            "DISTANZA" => $row['DISTANZA'],
            "CONTR_ASSIST_MENS" => $row['CONTR_ASSIST_MENS'],
            "ID_MEDICO" => $row['ID_MEDICO'],
            "FLAG" => $row['FLAG'],
            "NOTE_IMPORTANTI" => $row['NOTE_IMPORTANTI'],
            "SALA_PRANZO" => $row['SALA_PRANZO'],
            "N_BIANCHERIA" => $row['N_BIANCHERIA'],
            "ELENCO_ASSISTENZE" => $row['ELENCO_ASSISTENZE'],
            "ALTEZZA" => $row['ALTEZZA'],
            "FLAG_VALUTAZIONI" => $row['FLAG_VALUTAZIONI'],
            "ELIMINATO" => $row['ELIMINATO'],
            "FlagModificaCartella" => $row['FlagModificaCartella'],
            "DtFlagModCartella" => $row['DtFlagModCartella'],
            "ID_ASL" => $row['ID_ASL'],
            "ID_DISTRETTO" => $row['ID_DISTRETTO'],
            "DATA_STAMPA_ALLERGIE" => $row['DATA_STAMPA_ALLERGIE'],
            "FLAG_CONS_IMG" => $row['FLAG_CONS_IMG'],
            "DATA_INIZIO_DEG" => $row['DATA_INIZIO_DEG']
        );

        array_push($Ospiti_arr["records"], $Ospiti_item);
    }

    // set response code - 200 OK
    http_response_code(200);

    // show categories data in json format
    echo json_encode($Ospiti_arr);
    
} else {

    // set response code - 404 Not found
    http_response_code(404);

    // tell the user no categories found
    echo json_encode(
            array("message" => "No ospiti found.")
    );
}
?>
