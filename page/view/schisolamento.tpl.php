<?php
if (!isset($_POST['jwt'])) {
    header('location: page-login.php');
}

include_once '..//..//common//helper.php';
include_once '../../api/config/core.php';
include_once '..//..//api//objects//token.php';

//leggo i dati via post
$jwt = new token($_POST['jwt'], $key);

?>

<div class="subheader">
    <h1 class="subheader-title">
        <i class='subheader-icon fal fa-newspaper'></i> Scheda Isolamento - <span class='fw-300'><?= $jwt->GetNomeUtente() ?></span>
    </h1>
    <div class="subheader-block d-lg-flex align-items-center">
        <div class="d-inline-flex flex-column justify-content-center mr-3">
            <span class="fw-300 fs-xs d-block opacity-50">
                <small>Messaggi da leggere</small>
            </span>
            <span class="fw-500 fs-xl d-block color-primary-500">
                2
            </span>
        </div>
    </div>
    <div class="subheader-block d-lg-flex align-items-center border-faded border-right-0 border-top-0 border-bottom-0 ml-3 pl-3">
        <div class="d-inline-flex flex-column justify-content-center mr-3">
            <span class="fw-300 fs-xs d-block opacity-50">
                <small>Eventi di oggi</small>
            </span>
            <span class="fw-500 fs-xl d-block color-danger-500">
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
                <div class="panel-content p-0">
                    <div class="row row-grid no-gutters">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-3">
                            <div class="px-3 py-2 d-flex align-items-center">
                                <div class="js-easy-pie-chart color-primary-300 position-relative d-inline-flex align-items-center justify-content-center" data-percent="75" data-piesize="50" data-linewidth="5" data-linecap="butt" data-scalelength="0">
                                    <div class="d-flex flex-column align-items-center justify-content-center position-absolute pos-left pos-right pos-top pos-bottom fw-300 fs-lg">
                                        <span class="js-percent d-block text-dark"></span>
                                    </div>
                                </div>
                                <span class="d-inline-block ml-2 text-muted">
                                    SERVER LOAD
                                    <i class="fal fa-caret-up color-danger-500 ml-1"></i>
                                </span>
                                <div class="ml-auto d-inline-flex align-items-center">
                                    <div class="sparklines d-inline-flex" sparktype="line" sparkheight="30" sparkwidth="70" sparklinecolor="#886ab5" sparkfillcolor="false" sparklinewidth="1" values="5,6,5,3,8,6,9,7,4,2"></div>
                                    <div class="d-inline-flex flex-column small ml-2">
                                        <span class="d-inline-block badge badge-success opacity-50 text-center p-1 width-6">97%</span>
                                        <span class="d-inline-block badge bg-fusion-300 opacity-50 text-center p-1 width-6 mt-1">44%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-3">
                            <div class="px-3 py-2 d-flex align-items-center">
                                <div class="js-easy-pie-chart color-success-500 position-relative d-inline-flex align-items-center justify-content-center" data-percent="79" data-piesize="50" data-linewidth="5" data-linecap="butt">
                                    <div class="d-flex flex-column align-items-center justify-content-center position-absolute pos-left pos-right pos-top pos-bottom fw-300 fs-lg">
                                        <span class="js-percent d-block text-dark"></span>
                                    </div>
                                </div>
                                <span class="d-inline-block ml-2 text-muted">
                                    DISK SPACE
                                    <i class="fal fa-caret-down color-success-500 ml-1"></i>
                                </span>
                                <div class="ml-auto d-inline-flex align-items-center">
                                    <div class="sparklines d-inline-flex" sparktype="line" sparkheight="30" sparkwidth="70" sparklinecolor="#1dc9b7" sparkfillcolor="false" sparklinewidth="1" values="5,9,7,3,5,2,5,3,9,6"></div>
                                    <div class="d-inline-flex flex-column small ml-2">
                                        <span class="d-inline-block badge badge-info opacity-50 text-center p-1 width-6">76%</span>
                                        <span class="d-inline-block badge bg-warning-300 opacity-50 text-center p-1 width-6 mt-1">3%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-3">
                            <div class="px-3 py-2 d-flex align-items-center">
                                <div class="js-easy-pie-chart color-info-500 position-relative d-inline-flex align-items-center justify-content-center" data-percent="23" data-piesize="50" data-linewidth="5" data-linecap="butt">
                                    <div class="d-flex flex-column align-items-center justify-content-center position-absolute pos-left pos-right pos-top pos-bottom fw-300 fs-lg">
                                        <span class="js-percent d-block text-dark"></span>
                                    </div>
                                </div>
                                <span class="d-inline-block ml-2 text-muted">
                                    DATA TTF
                                    <i class="fal fa-caret-up color-success-500 ml-1"></i>
                                </span>
                                <div class="ml-auto d-inline-flex align-items-center">
                                    <div class="sparklines d-inline-flex" sparktype="line" sparkheight="30" sparkwidth="70" sparklinecolor="#51adf6" sparkfillcolor="false" sparklinewidth="1" values="3,5,2,5,3,9,6,5,9,7"></div>
                                    <div class="d-inline-flex flex-column small ml-2">
                                        <span class="d-inline-block badge bg-fusion-500 opacity-50 text-center p-1 width-6">10GB</span>
                                        <span class="d-inline-block badge bg-fusion-300 opacity-50 text-center p-1 width-6 mt-1">10%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-3">
                            <div class="px-3 py-2 d-flex align-items-center">
                                <div class="js-easy-pie-chart color-fusion-500 position-relative d-inline-flex align-items-center justify-content-center" data-percent="36" data-piesize="50" data-linewidth="5" data-linecap="butt">
                                    <div class="d-flex flex-column align-items-center justify-content-center position-absolute pos-left pos-right pos-top pos-bottom fw-300 fs-lg">
                                        <span class="js-percent d-block text-dark"></span>
                                    </div>
                                </div>
                                <span class="d-inline-block ml-2 text-muted">
                                    TEMP.
                                    <i class="fal fa-caret-down color-success-500 ml-1"></i>
                                </span>
                                <div class="ml-auto d-inline-flex align-items-center">
                                    <div class="sparklines d-inline-flex" sparktype="line" sparkheight="30" sparkwidth="70" sparklinecolor="#fd3995" sparkfillcolor="false" sparklinewidth="1" values="5,3,9,6,5,9,7,3,5,2"></div>
                                    <div class="d-inline-flex flex-column small ml-2">
                                        <span class="d-inline-block badge badge-danger opacity-50 text-center p-1 width-6">124</span>
                                        <span class="d-inline-block badge bg-info-300 opacity-50 text-center p-1 width-6 mt-1">40F</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- BEGIN modal Parametri Ospite -->
    <div id="modalSchIsolamento" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <input type="hidden" id="idOspite" name="idOspite" value="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <div id="lblTitleModalParametri"></div>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fal fa-times"></i></span>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <div class="form-group" id="inline">
                            <label class="form-label" for="txtTemperatura">Temperatura</label>
                            <input type="text" id="txtTemperatura" name ="txtTemperatura" class="form-control" placeholder="Inserire: 35,5° 36,2° Oppure una descrizione... APIRETTICA" required>
                            <div class="invalid-feedback">
                                Inserire un numero o un testo.
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
                            <input type="text" id="txtOssigeno" name ="txtOssigeno" class="form-control" placeholder="L/Min" required>
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
                            <br>
                            <div class="form-group" id="inline">
                                <label class="form-label" for="txtAltro">Altro</label>
                                <input type="text" id="txtAltro" name ="txtAltro" class="form-control" placeholder="Descrivere...">
                            </div>
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

