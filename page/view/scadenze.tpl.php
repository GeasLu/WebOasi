<?php

if (!isset($_POST['jwt'])) {
    header('location: page-login.php');
}

include_once '../../api/config/core.php';
include_once '..//..//api//objects//token.php';

//leggo i dati via post
$jwt = new token($_POST['jwt'], $key);

$jwt->SetPathImg('img/user/');

$today = date('Y-m-d');

?>

<input type="hidden" id="schema" name="schema" value="<?= $_POST['schema']?>">

<div class="subheader">
    <h1 class="subheader-title">
        <i class='subheader-icon fal fa-home'></i> Scadenze/Appuntamenti <span class='fw-300'><?= $jwt->GetNomeUtente() ?></span>
    </h1>
    <div class="subheader-block d-lg-flex align-items-center">
        <div class="d-inline-flex flex-column justify-content-center mr-3">
            <span class="fw-300 fs-xs d-block opacity-50">
                <small>Eventi di Oggi</small>
            </span>
            <span class="fw-500 fs-xl d-block color-primary-500" id="numEventGiorno">
                2
            </span>
        </div>
    </div>
    <div class="subheader-block d-lg-flex align-items-center border-faded border-right-0 border-top-0 border-bottom-0 ml-3 pl-3">
        <div class="d-inline-flex flex-column justify-content-center mr-3">
            <span class="fw-300 fs-xs d-block opacity-50">
                <small>Eventi del Mese</small>
            </span>
            <span class="fw-500 fs-xl d-block color-danger-500" id="numEventMese">
                5
            </span>
        </div>
    </div>
</div>

<div class="row">

    <div class="col-lg-12">
        <div id="panel-1" class="panel panel-locked" data-panel-lock="false" data-panel-close="false" data-panel-fullscreen="false" data-panel-collapsed="false" data-panel-color="false" data-panel-locked="false" data-panel-refresh="false" data-panel-reset="false">
            <div class="panel-hdr">
                <h2>
                    Eventi / Scadenze / Ricorrenze
                </h2>
            </div>
            <div class="panel-container show">
                <div class="panel-content border-faded border-left-0 border-right-0 border-top-0">
                    <div class="row no-gutters">
                        <div class="col-lg-12 col-xl-12">
                            <div class="position-relative">
                                <div id="calendar"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- BEGIN modal event -->
    <div id="modalEvento" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">

        <!-- Campi hidden -->
        <input type="hidden" id="hidEvento" name="idEvento" value="-1">
        <input type="hidden" id="htipoRic" name="htipoRic" value="SINGOLO">
        <input type="hidden" id="hSTART_TIME" name="hSTART_TIME" value="">
        <input type="hidden" id="hEND_A" name="hEND_A" value="true">
        <input type="hidden" id="hEND_C" name="hEND_C" value="false">
        <input type="hidden" id="hEND_C_END" name="hEND_C_END" value="">
        <input type="hidden" id="hNum_GG" name="hNum_GG" value="-1">
        <input type="hidden" id="hNum_SETT" name="hNum_SETT" value="-1">
        <input type="hidden" id="hNum_MESI" name="hNum_MESI" value="-1">
        <input type="hidden" id="hGg_ORD" name="hGg_ORD" value="Primo\a">
        <input type="hidden" id="hGg_SETT" name="hGg_SETT" value="Lunedì">
        <input type="hidden" id="hNum_ANNO" name="hNum_ANNO" value="1">
        <input type="hidden" id="hMese" name="hMese" value="Gennaio">
        <input type="hidden" id="hGg" name="hGg" value="1">
        <input type="hidden" id="hclassCSS" name="hclassCSS" value="">
        <!-- Campi hidden -->

        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header mb-1">
                    <h4 class="modal-title" id="lblTitleModalScadenze">
                        Aggiungi evento...
                        <small class="m-0 text-muted">
                            per aggiungere una ricorrenza, cliccare su "RICORRENZA"
                        </small>
                    </h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fal fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">

                        <label class="form-label" for="txtScEventoTitolo">Titolo evento</label>
                        <input type="text" id="txtScEventoTitolo" name ="txtScEventoTitolo" class="form-control" placeholder="Titolo evento...">
                        <span class="help-block">
                            Sarà visualizzata come titolo nei promemoria.
                        </span>

                        <br>

                        <label class="form-label" for="txtScEventoDesc">Descrizione evento</label>
                        <textarea class="form-control" id="txtScEventoDesc"  name ="txtScEventoDesc" rows="3" placeholder="Descrizione evento..."></textarea>
                        <span class="help-block mb-4">
                            Descrizione estesa dell'evento.
                        </span>
                        <br>

                        <label class="form-label" for="btnRicorrenza">Quando accade...</label>
                        <button type="button" class="btn btn-block btn-outline-info mb-2" id="btnRicorrenza">
                            <span class="fal fa-calendar mr-1"></span>
                            Premi QUI per programmare l'evento...
                        </button>

                        <label class="form-label" for="tabMainEvent">Gestione Condivisioni e Allegati</label>
                        <ul class="nav nav-tabs" role="tablist" id="tabMainEvent" name="tabMainEvent">
                            <li class="nav-item">
                                <a class="nav-link active" data-toggle="tab" href="#tabCondiviso" role="tab" id="tabCondivisoMain">
                                    <i class="fal fa-share-square text-success"></i>
                                    <span class="hidden-sm-down ml-1">Condiviso con...</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#tabAllegati" role="tab" id="tabAllegatiMain">
                                    <i class="ni ni-paper-clip text-success"></i>
                                    <span class="hidden-sm-down ml-1">Allegati</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#tabColori" role="tab" id="tabColoriMain">
                                    <i class="ni ni-paper-clip text-success"></i>
                                    <span class="hidden-sm-down ml-1">Colori</span>
                                </a>
                            </li>
                        </ul>
                        <div class="tab-content border border-top-0 p-3">

                            <div class="tab-pane fade show active" id="tabCondiviso" role="tabpanel">
                                <table id="tableDipendentiViewer" class="table table-bordered table-hover table-striped w-100 table-sm ">
                                    <thead class="thead-dark">
                                    </thead>
                                </table>
                            </div>
                            <div class="tab-pane fade show " id="tabAllegati" role="tabpanel">
                                <table id="tableAllegatiEvento" class="table table-bordered table-hover table-striped w-100 table-sm ">
                                    <thead class="thead-dark">
                                    </thead>
                                </table>
                            </div>
                            <div class="tab-pane fade show " id="tabColori" role="tabpanel">
                                <h5 class="frame-heading">Scegli il colore</h5>
                                <div class="frame-wrap demo">
                                    <div class="demo">
                                        <div class="row">
                                            <div class="col-6">
                                                <div class="custom-control custom-switch rounded bg-success border-success text-white m-1">
                                                    <input type="radio" class="custom-control-input" id="optColSucc" name="optCol" value="border-warning-800 bg-warning text-dark mr-2">
                                                    <label class="custom-control-label " for="optColSucc">Evento</label>
                                                </div>
                                                <div class="custom-control custom-switch  rounded bg-warning text-dark border-warning m-1">
                                                    <input type="radio" class="custom-control-input" id="optColErr" checked="" name="optCol" value="bg-warning text-dark border-warning-800">
                                                    <label class="custom-control-label " for="optColErr">Evento</label>
                                                </div>
                                                <div class="custom-control custom-switch  rounded bg-info border-info m-1">
                                                    <input type="radio" class="custom-control-input" id="optColInfo" checked="" name="optCol" value="bg-info border-info-800">
                                                    <label class="custom-control-label " for="optColInfo">Evento</label>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="custom-control custom-switch rounded bg-danger border-danger text-white m-1">
                                                    <input type="radio" class="custom-control-input" id="optColDanger" name="optCol" value="bg-danger border-danger-800 text-white">
                                                    <label class="custom-control-label " for="optColDanger">Evento</label>
                                                </div>
                                                <div class="custom-control custom-switch rounded bg-white border-primary text-primary m-1">
                                                    <input type="radio" class="custom-control-input" id="optColWhite" checked="" name="optCol" value="bg-white border-primary-800 text-primary">
                                                    <label class="custom-control-label " for="optColWhite">Evento</label>
                                                </div>
                                                <div class="custom-control custom-switch rounded bg-primary border-primary text-white m-1">
                                                    <input type="radio" class="custom-control-input" id="optColPrimary" checked="" name="optCol" value="bg-primary border-primary-800 text-white">
                                                    <label class="custom-control-label " for="optColPrimary">Evento</label>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="cmdSaveEvent">Save changes</button>
                </div>
            </div>

        </div>
    </div>
    <!-- END modal event -->

    <!-- BEGIN modal Ricorrenze -->
    <div id="modalRicorrenza" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">

        <!-- Campi hidden -->
        <input type="hidden" id="idEvento" name="idEvento" value="-1">
        <!-- Campi hidden -->

        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header mb-1">
                    <h4 class="modal-title" id="lblTitleModalScadenze">
                        Configura ricorrenza o evento singolo
                    </h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fal fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">

                        <ul class="nav nav-tabs" role="tablist" id="tabMainRicorrenza" name="tabMainRicorrenza">
                            <li class="nav-item" id="tabSingoloMain">
                                <a class="nav-link active" data-toggle="tab" href="#tabSingolo" role="tab" id="tabSingoloMain">
                                    <i class="fal fa-calendar text-success"></i>
                                    <span class="hidden-sm-down ml-1">Singolo evento</span>
                                </a>
                            </li>
                            <li class="nav-item" id="tabRicorrenzaMain">
                                <a class="nav-link"  data-toggle="tab" href="#tabRicorrenza" role="tab" id="tabRicorrenzaMain">
                                    <i class="fal fa-calendar-alt text-primary"></i>
                                    <span class="hidden-sm-down ml-1">Ricorrenza</span>
                                </a>
                            </li>
                        </ul>
                        <div class="tab-content border border-top-0 p-3">
                            <div class="tab-pane fade show active" id="tabSingolo" role="tabpanel">
                                <div class="form-group">
                                    <label class="form-label" for="dtpDataEventoSingolo">Data Evento...</label>
                                    <input class="form-control" name="dtpDataEventoSingolo" id="dtpDataEventoSingolo" type="date" value="<?=  $today?>">
                                </div>
                                <div class="form-group" id="inline">
                                    <label class="form-label" for="timeDalle">Dalle</label>
                                    <input class="form-control col-3" id="timeDalle" type="time" name="timeDalle">
                                    <label class="form-label" for="timeAlle">  Alle</label>
                                    <input class="form-control col-3" id="timeAlle" type="time" name="timeAlle">
                                </div>
                            </div>
                            <div class="tab-pane fade" id="tabRicorrenza" role="tabpanel">
                                <!-- Inizio tab per ricorrenza -->

                                <ul class="nav nav-tabs" role="tablist">
                                    <li class="nav-item">
                                        <a class="nav-link active" data-toggle="tab" href="#tabGiornaliero" role="tab">
                                            <i class="fal fa-circle text-success"></i>
                                            <span class="hidden-sm-down ml-1">Giornaliero</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" data-toggle="tab" href="#tabSettimanale" role="tab">
                                            <i class="fal fa-circle text-primary"></i>
                                            <span class="hidden-sm-down ml-1">Settimanale</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" data-toggle="tab" href="#tabMensile" role="tab">
                                            <i class="fal fa-circle text-warning"></i>
                                            <span class="hidden-sm-down ml-1">Mensile</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" data-toggle="tab" href="#tabAnnuale" role="tab">
                                            <i class="fal fa-circle text-info"></i>
                                            <span class="hidden-sm-down ml-1">Annuale</span>
                                        </a>
                                    </li>
                                </ul>

                                <div class="tab-content border border-top-0 p-3">
                                    <div class="tab-pane fade show active" id="tabGiornaliero" role="tabpanel">
                                        <h5 class="frame-heading">Scegli tra le due opzioni</h5>
                                        <div class="frame-wrap demo">
                                            <div class="demo">
                                                <div class="custom-control custom-switch" id="inline">
                                                    <input type="radio" class="custom-control-input" id="optG1" name="optG">
                                                    <label class="custom-control-label" for="optG1"></label>
                                                    <label class="form-label" for="example-number">Ogni</label>
                                                    <input class="form-control col-3" id="example-number" type="number" name="txtG1" value="1">
                                                    <span class="hidden-sm-down ml-1"> giorno/i</span>
                                                </div>
                                                <div class="custom-control custom-switch">
                                                    <input type="radio" class="custom-control-input" id="optG2" checked="" name="optG">
                                                    <label class="custom-control-label" for="optG2">Ogni giorno Feriale</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade show" id="tabSettimanale" role="tabpanel">
                                        <h5 class="frame-heading">Seleziona  i giorni della settimana</h5>
                                        <div class="frame-wrap">
                                            <div class="custom-control custom-checkbox custom-control-inline">
                                                <input type="checkbox" class="custom-control-input" id="chkS1Lun" name="chkS1Lun">
                                                <label class="custom-control-label" for="chkS1Lun">Lunedì</label>
                                            </div>
                                            <div class="custom-control custom-checkbox custom-control-inline">
                                                <input type="checkbox" class="custom-control-input" id="chkS1Mar" name="chkS1Mar">
                                                <label class="custom-control-label" for="chkS1Mar">Martedì</label>
                                            </div>
                                            <div class="custom-control custom-checkbox custom-control-inline">
                                                <input type="checkbox" class="custom-control-input" id="chkS1Mer" name="chkS1Mer">
                                                <label class="custom-control-label" for="chkS1Mer">Mercoledì</label>
                                            </div>
                                            <div class="custom-control custom-checkbox custom-control-inline">
                                                <input type="checkbox" class="custom-control-input" id="chkS1Giov" name="chkS1Giov">
                                                <label class="custom-control-label" for="chkS1Giov">Giovedì</label>
                                            </div>
                                            <br>
                                            <div class="custom-control custom-checkbox custom-control-inline">
                                                <input type="checkbox" class="custom-control-input" id="chkS1Ven" name="chkS1Ven">
                                                <label class="custom-control-label" for="chkS1Ven">Venerdì</label>
                                            </div>
                                            <div class="custom-control custom-checkbox custom-control-inline">
                                                <input type="checkbox" class="custom-control-input" id="chkS1Sab" name="chkS1Sab">
                                                <label class="custom-control-label" for="chkS1Sab">Sabato</label>
                                            </div>
                                            <div class="custom-control custom-checkbox custom-control-inline">
                                                <input type="checkbox" class="custom-control-input" id="chkS1Dom" name="chkS1Dom">
                                                <label class="custom-control-label" for="chkS1Dom">Domenica</label>
                                            </div>
                                            <br>
                                            <br>
                                            <label class="form-label" for="txtS1">Ogni quante settimane?</label>
                                            <input class="form-control col-3" id="txtS1" type="number" name="txtS1" value="1">
                                        </div>
                                    </div>
                                    <div class="tab-pane fade show" id="tabMensile" role="tabpanel">
                                        <h5 class="frame-heading">Scegli tra le due opzioni</h5>
                                        <div class="frame-wrap demo">
                                            <div class="demo">
                                                <!-- Mese 1 -->
                                                <div class="custom-control custom-switch" id="inline">

                                                    <input type="radio" class="custom-control-input" id="optM1" name="optM">
                                                    <label class="custom-control-label" for="optM1">Il giorno     </label>

                                                    <label class="form-label" for="txtM1_NUM_GG"></label>
                                                    <input class="form-control col-3" id="txtM1_NUM_GG" type="number" name="txtM1_NUM_GG" value="1">

                                                    <label class="form-label" for="txtM1_NUM_MESI"> ogni </label>
                                                    <input class="form-control col-3" id="txtM1_NUM_MESI" type="number" name="txtM1_NUM_MESI" value="1">

                                                </div>

                                                <!-- Mese 2 -->
                                                <div class="custom-control custom-switch" id="inline">
                                                    <input type="radio" class="custom-control-input" id="optM2" checked="" name="optM">
                                                    <label class="custom-control-label" for="optM2">Ogni </label>

                                                    <label class="form-label" for="cmbM2_GG_ORD"></label>
                                                    <select class="form-control col-lg-3" id="cmbM2_GG_ORD">
                                                        <option>Primo/a</option>
                                                        <option>Secondo/a</option>
                                                        <option>Terzo/a</option>
                                                        <option>Quarto/a</option>
                                                    </select>

                                                    <label class="form-label" for="cmbM2_GG_SETT"></label>
                                                    <select class="form-control col-lg-3" id="cmbM2_GG_SETT">
                                                        <option>Lunedì</option>
                                                        <option>Martedì</option>
                                                        <option>Mercoledì</option>
                                                        <option>Giovedì</option>
                                                        <option>Venerdì</option>
                                                        <option>Sabato</option>
                                                        <option>Domenica</option>
                                                    </select>

                                                    <label class="form-label" for="txtM2_NUM_MESI"> ogni </label>
                                                    <input class="form-control col-2" id="txtM2_NUM_MESI" type="number" name="txtM2_NUM_MESI" value="1">
                                                    <label class="form-label" for="txtM2_NUM_MESI"> mese/i </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade show" id="tabAnnuale" role="tabpanel">
                                        <h5 class="frame-heading">Scegli tra le due opzioni</h5>
                                        <div class="frame-wrap demo">
                                            <div class="demo">
                                                <div class="custom-control custom-switch" id="inline">

                                                    <label class="form-label" for="txtA_NUM_ANNO">Ricorre ogni </label>
                                                    <input class="form-control col-3" id="txtA_NUM_ANNO" type="number" name="txtA_NUM_ANNO" value="1">
                                                    <label class="form-label" for="txtA_NUM_ANNO"> anno/i </label>

                                                </div>
                                                <!-- ANNO 1 -->
                                                <div class="custom-control custom-switch" id="inline">

                                                    <input type="radio" class="custom-control-input" id="optA1" name="optA">
                                                    <label class="custom-control-label" for="optA1">In data: </label>

                                                    <label class="form-label" for="cmbA1_MESE"></label>
                                                    <select class="form-control col-lg-3" id="cmbA1_MESE">
                                                        <option>Gennaio</option>
                                                        <option>Febbraio</option>
                                                        <option>Marzo</option>
                                                        <option>Aprile</option>
                                                        <option>Maggio</option>
                                                        <option>Giugno</option>
                                                        <option>Luglio</option>
                                                        <option>Agosto</option>
                                                        <option>Settembre</option>
                                                        <option>Ottobre</option>
                                                        <option>Novembre</option>
                                                        <option>Dicembre</option>
                                                    </select>

                                                    <label class="form-label" for="txtA1_GG"></label>
                                                    <input class="form-control col-3" id="txtA1_GG" type="number" name="txtA1_GG" value="1">

                                                </div>

                                                <!-- ANNO 2 -->
                                                <div class="custom-control custom-switch" id="inline">

                                                    <input type="radio" class="custom-control-input" id="optA2_MESE" checked="" name="optA">
                                                    <label class="custom-control-label" for="optA2_MESE">Il/la </label>

                                                    <label class="form-label" for="cmbA2_GG_ORD"></label>
                                                    <select class="form-control col-lg-3" id="cmbA2_GG_ORD">
                                                        <option>Primo/a</option>
                                                        <option>Secondo/a</option>
                                                        <option>Terzo/a</option>
                                                        <option>Quarto/a</option>
                                                    </select>

                                                    <label class="form-label" for="cmbA2_GG_SETT"></label>
                                                    <select class="form-control col-lg-3" id="cmbA2_GG_SETT">
                                                        <option>Lunedì</option>
                                                        <option>Martedì</option>
                                                        <option>Mercoledì</option>
                                                        <option>Giovedì</option>
                                                        <option>Venerdì</option>
                                                        <option>Sabato</option>
                                                        <option>Domenica</option>
                                                    </select>

                                                    <label class="form-label" for="cmbA2_MESE"> di </label>
                                                    <select class="form-control col-lg-3" id="cmbA2_MESE">
                                                        <option>Gennaio</option>
                                                        <option>Febbraio</option>
                                                        <option>Marzo</option>
                                                        <option>Aprile</option>
                                                        <option>Maggio</option>
                                                        <option>Giugno</option>
                                                        <option>Luglio</option>
                                                        <option>Agosto</option>
                                                        <option>Settembre</option>
                                                        <option>Ottobre</option>
                                                        <option>Novembre</option>
                                                        <option>Dicembre</option>
                                                    </select>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div class="form-group">
                                    <label class="form-label" for="dtpDataEventoIniz">Data Inizio</label>
                                    <input class="form-control" name="dtpDataEventoIniz" id="dtpDataEventoIniz" type="date" value="<?=  $today?>">
                                    <label class="form-label" for="dtpDataEventoFine">Data Fine</label>
                                    <input class="form-control" name="dtpDataEventoFine" id="dtpDataEventoFine" type="date" value="<?=  date('Y-m-d', strtotime($today . '+1 day' )) ?>">
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="cmdSaveRicorrenza">Salva Ricorrenza</button>
                </div>
            </div>

        </div>
    </div>
    <!-- END modal Ricorrenze -->
</div>