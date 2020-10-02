<?php

// ogni vista dovrà avere la parte di sicurezza 
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get posted data
$data = json_decode(file_get_contents("php://input"));
// mi aspetto ti avere il token valido...
$rootUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/weboasi/';


include_once '../../api/config/core.php';
include_once '../../api/objects/token.php';
include_once '../../api/config/database.php';
include_once '../../api/objects/Ospiti.php';

// instantiate database and category object
$database = new Database();
$db = $database->getConnection();

$jwt = new token($data->jwt, $key);

$idPrimaryNav = "js-primary-nav";
$html = "";

$html = '<nav id="' . $idPrimaryNav . '" class="primary-nav" role="navigation">';
$html .= '  <div class="nav-filter">';
$html .= '          <div class="position-relative">';
$html .= '              <input type="text" id="nav_filter_input" placeholder="Filter menu" class="form-control" tabindex="0">';
$html .= '              <a href="#" onclick="return false;" class="btn-primary btn-search-close js-waves-off" data-action="toggle" data-class="list-filter-active" data-target=".page-sidebar">';
$html .= '                  <i class="fal fa-chevron-up"></i>';
$html .= '              </a>';
$html .= '          </div>';
$html .= '  </div>';

// card di info utente loggato
$html .= '    <div class="info-card">';
$html .= '        <img src="' . $jwt->GetPathImg() . '" class="profile-image rounded-circle" alt="' . $jwt->GetNomeUtente() . '">';
$html .= '        <div class="info-card-text">';
$html .= '            <a href="#" class="d-flex align-items-center text-white">';
$html .= '                <span class="text-truncate text-truncate-sm d-inline-block">';
$html .= '                    ' . $jwt->GetNomeUtente();
$html .= '                </span>';
$html .= '            </a>';
$html .= '            <span class="d-inline-block text-truncate text-truncate-sm "><small>(' . $jwt->GetUserLogin() . ')</small></span><br>';
$html .= '            <span class="d-inline-block text-truncate text-truncate-sm">' . $jwt->GetDescLivello() . '</span>';
$html .= '        </div>';
$html .= '        <img src="' . $rootUrl . '/page/img/card-backgrounds/cover-2-lg.png" class="cover" alt="cover">';
$html .= '        <a href="#" onclick="return false;" class="pull-trigger-btn" data-action="toggle" data-class="list-filter-active" data-target=".page-sidebar" data-focus="nav_filter_input">';
$html .= '            <i class="fal fa-angle-down"></i>';
$html .= '        </a>';
$html .= '    </div>';


// BEGIN ******************************* SEZIONE CARICAMENTO MENU UTENTE
//Ricavo i moduli abilitati per quell'utente
$query = "SELECT * \n"
        . "FROM " . $jwt->GetDbStruttura() . ".dbo.vModuliUser_WEB \n"
        . "WHERE ID_UTENTE = :ID_UTENTE \n"
        . "ORDER BY OrderBy \n";

try {
    $stmt = $db->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
    $idUserTmp = $jwt->GetIdUserLogin();
    $stmt->bindParam(":ID_UTENTE", $idUserTmp);
    $stmt->execute();
} catch (Exception $ex) {
    var_dump($ex);
}
if (isset($stmt)) {
    $num = $stmt->rowCount();
} else
    $num = 0;


if (($num > 0) && isset($stmt)) {

    $html .= '    <ul id="js-nav-menu" class="nav-menu">';
    $html .= '        <li class="active open">';
    $html .= '            <a href="#" title="Home"  onclick="OnClicMenuPrimary(this);" data-filter-tags="Home">';
    $html .= '                <i class="fal fa-home"></i>';
    $html .= '                <span class="nav-link-text" data-i18n="nav.application_intel">Home</span>';
    $html .= '            </a>';
    $html .= '            <ul>';

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $html .= '                <li>'; // mettere class="active" se preme questo link 
        $html .= '                    <a href="#" onclick="OnClicMenuPrimary(this);" id="ph-'.$row['schemaDb'].'" title="' . $row['descrizione'] . '" name="' . $row['schemaDb'] . '">';
        $html .= '                    '. $row['icoName'];
        $html .= '                    <span class="nav-link-text">' . $row['descrizione'] . '</span>';
        $html .= '                    </a>';
        $html .= '                </li>';
    }

    $html .= '            </ul>';
    $html .= '        </li>';
    $html .= '    </ul>';

// FINE ******************************* SEZIONE CARICAMENTO MENU UTENTE
}

$html .= '    <div class="filter-message js-filter-message bg-success-600"></div>';
$html .= '</nav>';


echo $html;
