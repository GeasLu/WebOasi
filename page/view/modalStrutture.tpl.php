<?php

$pathRoot = __dir__;
$pathRoot = str_replace('page\view', '', $pathRoot);
include_once $pathRoot . 'api/objects/strutture.php';
include_once $pathRoot . 'api/config/database.php';


// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

// initialize object
$strutture = new Strutture($db);

// read products will be here
// query products
$stmt = $strutture->readAll();
$num = $stmt->rowCount();

if ($num > 0) {
    $innerHtml = "";
    //$innerHtml = '<form action="'. $_SERVER['PHP_SELF'] .'" method="post"> ';
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        //richiamando $row ho il record in letture della fetch
        $innerHtml .= '				<button type="button" id="btn'.$row['idStruttura'].'" class="btn btn-primary"   data-dismiss="modal"  value="' . $row['idStruttura'] . '">' . $row['descrizione'] . '</button> ';
    };
    //$innerHtml .= '</form>';

    $html = '<div id="modalStrutture" class="modal fade example-modal-centered-transparent" tabindex="-1" role="dialog" aria-hidden="true">'
            . '	<div class="modal-dialog modal-dialog-centered modal-transparent" role="document">'
            . '		<div class="modal-content"> '
            . '			<div class="modal-header">'
            . '				<h4 class="modal-title text-white">'
            . '					Seleziona struttura:'
            . '					<small class="m-0 text-white opacity-70"> '
            . '						Elenco delle strutture gestite, se non viene specificata una selezione verrà selezionata quella di default'
            . '					</small> '
            . '				</h4> '
            . '				<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"> '
            . '					<span aria-hidden="true"><i class="fal fa-times"></i></span> '
            . '				</button>'
            . '			</div>'
            . '			<div class="modal-body"> '
            . $innerHtml
            . '			</div> '
            . '			<div class="modal-footer">'
            . '				<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> '
            . '			</div> '
            . '		</div> '
            . '	</div> '
            . '</div> ';
}
echo $html;
?>



