<?php

//Luke 18/03/2020
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/database.php';
include_once '../objects/log.php';

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

// initialize object
$log = new Log($db);

// read products will be here
// query products
$stmt = $log->read();
$num = $stmt->rowCount();

// check if more than 0 record found
if ($num > 0) {

    // products array
    $logs_arr = array();
    $logs_arr["records"] = array();

    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // extract row
        // this will make $row['name'] to
        // just $name only
        //extract($row);

        $log_item = array(
            "ID_ROW" => $row['ID_ROW'],
            "NOME_COMPUTER" => $row['NOME_COMPUTER'],
            "APPLICAZIONE" => $row['APPLICAZIONE'],
            "DATA_ORA" => $row['DATA_ORA'],
            "TIPO" => $row['TIPO'],
            "MESSAGGIO" => html_entity_decode($row['MESSAGGIO']),
            "ERRORE" => $row['ERRORE']
        );

        array_push($logs_arr["records"], $log_item);
    }

    // set response code - 200 OK
    http_response_code(200);

    // show LOGS data in json format
    echo json_encode($logs_arr);
} else {// no products found will be here
    // set response code - 404 Not found
    http_response_code(404);

    // tell the user no products found
    echo json_encode(
            array("message" => "No LOGS found.")
    );
}
  
