<?php
if (!isset($_POST['jwt'])) {
    header('location: page-login.php');
}

include_once '../../api/config/core.php';
include_once '..//..//api//objects//token.php';

//leggo i dati via post
$jwt = new token($_POST['jwt'], $key);

?>

<div class="subheader">
    <h1 class="subheader-title">
        <i class='subheader-icon fal fa-newspaper'></i> Scheda Rilevazione Parametri - <span class='fw-300'><?= $jwt->GetNomeUtente() ?></span>
    </h1>
</div>

<div class="row">

    <div class="col-lg-12">
        <div id="panel-1" class="panel panel-locked" data-panel-lock="false" data-panel-close="false" data-panel-fullscreen="false" data-panel-collapsed="false" data-panel-color="false" data-panel-locked="false" data-panel-refresh="false" data-panel-reset="false">
            <div class="panel-hdr">
                <h2>
                    Elenco Ospiti per l'inserimento dei parametri
                </h2>
            </div>
            <div class="panel-container show">
                <div class="panel-content border-faded border-left-0 border-right-0 border-top-0">
                    <div class="row no-gutters">
                        <div class="col-lg-12 col-xl-12">
                            <div class="position-relative">

                                <table id="tableOspitiParametri" class="table table-bordered table-hover table-striped w-100 table-sm ">
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

    <!-- BEGIN modal Parametri Ospite -->
    <div id="modalSchIsolamento" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">

        <!-- Campi hidden -->
        <input type="hidden" id="idOspite" name="idOspite" value="-1">
        <input type="hidden" id="nomeOspite" name="nomeOspite" value="">
        <input type="hidden" id="schema" name="schema" value="<?= $_POST['schema']?>">
        <!-- Campi hidden -->

        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header" style="padding:7px">
                    <div id="lblTitleModalParametri"></div>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fal fa-times"></i></span>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <div class="form-group" id="inline">
                            <label class="form-label" for="txtTemperatura">Temperatura</label>
                            <input type="text" id="txtTemperatura" name ="txtTemperatura" class="form-control" placeholder="Inserire: 35,5° 36,2°" required>
                            <div class="invalid-feedback" style="padding-bottom:2px" >
                                Inserire un numero.
                            </div>
                        </div>
                        <div class="form-group" id="inline">
                            <label class="form-label" for="txtSaturazione">Saturazione</label>
                            <input type="text" id="txtSaturazione" name ="txtSaturazione" class="form-control"  placeholder="Valore: Es. 95%" required>
                            <div class="invalid-feedback">
                                Inserire un numero.
                            </div>
                        </div>

                        <div class="form-group" id="inline">
                            <label class="form-label" for="txtOssigeno">Ossigeno</label>
                            <input type="text" id="txtOssigeno" name ="txtOssigeno" class="form-control" placeholder="L/Min" value="0" required>
                            <div class="invalid-feedback">
                                Inserire un numero.
                            </div>
                        </div>

                        <h5 class="frame-heading"></h5>
                        <div class="frame-wrap">
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="chkTosse" name="chkTosse">
                                <label class="custom-control-label" for="chkTosse">Tosse Secca o affezioni vie respiratorie anche lievi</label>
                            </div>
                            <br>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="chkDolori" name="chkDolori">
                                <label class="custom-control-label" for="chkDolori">Dolori Muscolari diffusi</label>
                            </div>
                            <br>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="chkMaleTesta" name="chkMaleTesta">
                                <label class="custom-control-label" for="chkMaleTesta">Mal di testa</label>
                            </div>
                            <br>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="chkRinorrea" name="chkRinorrea">
                                <label class="custom-control-label" for="chkRinorrea">Rinorrea(naso che cola)</label>
                            </div>
                            <br>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="chkMalDiGola" name="chkMalDiGola">
                                <label class="custom-control-label" for="chkMalDiGola">Mal di gola</label>
                            </div>
                            <br>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="chkAstenia" name="chkAstenia">
                                <label class="custom-control-label" for="chkAstenia">Astenia</label>
                            </div>
                            <br>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="chkInappetenza" name="chkInappetenza">
                                <label class="custom-control-label" for="chkInappetenza">Inappetenza</label>
                            </div>
                            <br>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="chkVomito" name="chkVomito">
                                <label class="custom-control-label" for="chkVomito">Vomito</label>
                            </div>
                            <br>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="chkDiarrea" name="chkDiarrea">
                                <label class="custom-control-label" for="chkDiarrea">Diarrea</label>
                            </div>
                            <br>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="chkCongiuntivite" name="chkCongiuntivite">
                                <label class="custom-control-label" for="chkCongiuntivite">Congiuntivite</label>
                            </div>
                            <br>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="chkNoAlteraz" name="chkNoAlteraz" checked>
                                <label class="custom-control-label" for="chkNoAlteraz">Non Presenti Alterazioni</label>
                            </div>
                            <br>
                            <br>
                            <div class="form-group" id="inline">
                                <label class="form-label" for="txtAltro">Altro</label>
                                <input type="text" id="txtAltro" name ="txtAltro" class="form-control" placeholder="Descrivere...">
                            </div>
                            <br>
                            <label class="form-label" for="cmbZona">Scegli La zona...</label>
                            <select class="form-control col-lg" id="cmbZona">
                                <option>Zona Bianca</option>
                                <option>Zona Gialla</option>
                                <option>Zona Rossa</option>
                            </select>
                        </div>

                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="btnSaveOspitiParametri"  name="btnSaveOspitiParametri">Save changes</button>
                </div>
            </div>

        </div>
    </div>
    </div>
    <!-- END modal event -->

    <!-- Modal ELENCO PARAMETRI OSPITE -->
    <div id="modalParametriOspite" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">

        <!-- Campi hidden -->
        <input type="hidden" id="idUserLogin" name="idUserLogin" value="<?= $jwt->GetIdUserLogin() ?>">
        <!-- Campi hidden -->

        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="modal-header" style="padding:7px">
                    <div id="lblTitleElencoParametri"></div>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fal fa-times"></i></span>
                    </button>
                </div>

                <div class="modal-body">

                    <table id="tableParametriOspite" class="table table-bordered table-hover table-striped w-100 table-sm ">
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
    <!-- END elenco parametri ospite -->

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
