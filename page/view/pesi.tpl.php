<?php
if (!isset($_POST['jwt'])) {
    header('location: page-login.php');
}

include_once '../../api/config/core.php';
include_once '..//..//api//objects//token.php';

//leggo i dati via post
$jwt = new token($_POST['jwt'], $key);
if ($jwt->isValid()==false){
    header('location: page-login.php');
}

$today = date('Y-m-d');

?>

<div class="subheader">
    <h1 class="subheader-title mr-3">
        <i class='subheader-icon fal fa-newspaper'></i> Riepilogo Pesi Ospiti <span class='fw-300'><?= $jwt->GetNomeUtente() ?></span>
        <small>
            Secondo i filtri segnalati qui sotto
        </small>
    </h1>
</div>

<!-- Campi hidden -->
<input type="hidden" id="schema" name="schema" value="<?= $_POST['schema']?>">
<!-- Campi hidden -->


<div class="row">
    <div class="col-lg-12">
        <div id="panel-0" class="panel panel-locked" data-panel-lock="false" data-panel-close="false" data-panel-fullscreen="false" data-panel-collapsed="false" data-panel-color="false" data-panel-locked="false" data-panel-refresh="false" data-panel-reset="false">
            <div class="panel-container show flex-row">
                <div class="panel-content border-faded border-left-0 border-right-0 border-top-0">
                    <div class="row no-gutters">

                        <div class="d-inline-flex flex-column justify-content-center width-xs mr-3">
                            <span class="fw-300 fs-xs opacity-50">
                                <small> Piano</small>
                            </span>
                            <span class="fw-500 fs-xs color-primary-500">
                                <select class="form-control col-lg" id="paramPianoPesi">
                                    <option value="-1"> Tutti</option>
                                    <option value="1">1° Piano</option>
                                    <option value="2">2° Piano</option>
                                    <option value="3">3° Piano</option>
                                </select>
                            </span>
                        </div>

                        <div class="d-inline-flex flex-column justify-content-center mr-3">
                            <span class="fw-300 fs-xs opacity-50">
                                <small>Camera</small>
                            </span>
                            <span class="fw-500 fs-xl color-primary-500">
                                <input class="form-control" name="paramCameraPesi" id="paramCameraPesi" type="number" placeholder="Valore: Es. 25" value="" >
                            </span>
                        </div>

                        <div class="d-inline-flex flex-column justify-content-center mr-3">
                            <span class="fw-300 fs-xs opacity-50">
                                <small>Sezione</small>
                            </span>
                            <span class="fw-500 fs-xl color-primary-500">
                                <select class="form-control col-lg" id="paramSezionePesi">
                                    <option value=""> Tutti</option>
                                    <option value="AV">Ala Vecchia - AV</option>
                                    <option value="AN">Ala Nuova - AN</option>
                                </select>
                            </span>
                        </div>


                        <div class="d-inline-flex flex-column justify-content-center border-faded border-right-0 border-top-0 border-bottom-0 mr-3 pl-3 ">
                            <span class="fw-300 fs-xs d-block opacity-50">
                                <small>Dal</small>
                            </span>
                            <span class="fw-500 fs-xl d-block color-primary-500">
                                <input class="form-control" name="dtpDataDalPesi" id="dtpDataDalPesi" type="date" value="<?= date('Y-m-d', strtotime($today . '-1 year' )) ?>">
                            </span>
                        </div>
                        <div class="d-inline-flex flex-column justify-content-center">
                            <span class="fw-300 fs-xs d-block opacity-50">
                                <small>Al</small>
                            </span>
                            <span class="fw-500 fs-xl d-block color-danger-500">
                                <input class="form-control" name="dtpDataAlPesi" id="dtpDataAlPesi" type="date" value="<?= date('Y-m-d', strtotime($today . '+1 day' )) ?>">
                            </span>
                        </div>

                        <div class="d-lg-flex align-items-center border-faded border-right-0 border-top-0 border-bottom-0 ml-3 pl-3">
                            <div class="d-inline-flex flex-column justify-content-center">
                                <a href="javascript:void(0);" class="btn btn-success btn-lg btn-icon" id="btnRefreshRiepPesi">
                                    <i class="fal fa-redo"></i>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-lg-12">
        <div id="panel-1" class="panel panel-locked" data-panel-lock="false" data-panel-close="false" data-panel-fullscreen="false" data-panel-collapsed="false" data-panel-color="false" data-panel-locked="false" data-panel-refresh="false" data-panel-reset="false">
            <div class="panel-hdr">
                <h2>
                    Elenco riepilogo Pesi filtrati nel periodo
                </h2>
            </div>
            <div class="panel-container show">
                <div class="panel-content border-faded border-left-0 border-right-0 border-top-0">
                    <div class="row no-gutters">
                        <div class="col-lg-12 col-xl-12">
                            <div class="position-relative">
                                <table id="tableRiepPesi" class="table table-bordered table-hover table-striped w-100 table-sm ">
                                    <thead class="thead-dark">
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

    <!-- Modal elenco Pesi Dettaglio Ospite -->
    <div id="modalPesiDett" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">

        <!-- Campi hidden -->
        <input type="hidden" id="idUserLogin" name="idUserLogin" value="<?= $jwt->GetIdUserLogin() ?>">
        <input type="hidden" id="idOspite" name="idOspite" value="-1">
        <input type="hidden" id="nomeOspite" name="nomeOspite" value="">
        <!-- Campi hidden -->

        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="modal-header" style="padding:7px">
                    <div id="lblTitlePesiOspite"></div> <!-- L'intestazione la trovi nel file dtpRiepPesi -->
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fal fa-times"></i></span>
                    </button>
                </div>

                <div class="modal-body">

                    <div class="demo d-flex justify-content-center flex-wrap d-sm-block">
                        <div class="p-3 w-auto text-center d-inline-flex border-faded">
                            <span id ="PesiDett" class="sparkline" sparktype="line" sparklinecolor="#886ab5" sparkfillcolor="#9acffa" sparklinewidth="1" values="20,62,59,56,32,29,48,45"></span>'
                        </div>
                    </div>

                    <table id="tablePesiDettOspite" class="table table-bordered table-hover table-striped w-100 table-sm ">
                        <thead class="thead-dark">
                        </thead>
                    </table>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>

        </div>
    </div>
    </div>
    <!-- END  elenco Pesi Ospite -->


    <!-- Modal Si/No -->
    <div id="modalSiNo" class="modal modal-alert fade" id="example-modal-alert" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="TitleText">Eliminare i parametri inseriti?</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fal fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body">
                    l'eliminazione verrà loggata a sistema
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" id ="btnNo">No</button>
                    <button type="button" class="btn btn-primary" id="btnSi">Si</button>
                </div>
            </div>
        </div>
    </div>
    <!-- END Si/No -->

    <!-- Modal No Alert-->
    <div id="modalNo" class="modal modal-alert fade" id="example-modal-alert" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="TitleText">Impossibile eliminare i parametri selezionati! </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fal fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body">
                    perchè inseiti da un altro utente...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" id ="btnNo">Chiudi</button>
                </div>
            </div>
        </div>
    </div>
    <!-- END  No Alert -->
