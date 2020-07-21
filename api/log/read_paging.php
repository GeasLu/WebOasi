<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
  
// include database and object files
include_once '../config/core.php';
include_once '../shared/utilities.php';
include_once '../config/database.php';
include_once '../objects/log.php';
  
// utilities
$utilities = new Utilities();
  
// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$log = new Log($db);
  
// query products
$stmt = $log->readPaging($from_record_num, $records_per_page);
$num = $stmt->rowCount();
  
// check if more than 0 record found
if($num>0){
  
    // products array
    $logs_arr=array();
    $logs_arr["records"]=array();
    $logs_arr["paging"]=array();
  
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
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
  
  
    // include paging
    $total_rows=$log->count();
    $page_url="{$home_url}log/read_paging.php?";
    $paging=$utilities->getPaging($page, $total_rows, $records_per_page, $page_url);
    $logs_arr["paging"]=$paging;
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($logs_arr);
}
  
else{
  
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell the user products does not exist
    echo json_encode(
        array("message" => "No logs found.")
    );
}
?>