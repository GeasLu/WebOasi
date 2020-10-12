<?php

include_once '../api/config/core.php';
include_once '../api/objects/token.php';

//altrimenti leggo il token e lo passo alla classe...
//$token = new token($_SESSION['JWT'], $key);
// Inizio renderizzazione pagina HTML
?>

<!DOCTYPE html>
<!-- 
Template Name:  SmartAdmin Responsive WebApp - Template build with Twitter Bootstrap 4
Version: 4.0.2
Author: Sunnyat Ahmmed
Website: http://gootbootstrap.com
Purchase: https://wrapbootstrap.com/theme/smartadmin-responsive-webapp-WB0573SK0
License: You must have a valid license purchased only from wrapbootstrap.com (link above) in order to legally use this theme for your project.
-->
<html lang="it">

    <head>
        <meta charset="utf-8">
        <title>
            Login - WEBOASI
        </title>
        <meta name="description" content="Login">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, minimal-ui">
        <!-- Call App Mode on ios devices -->
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <!-- Remove Tap Highlight on Windows Phone IE -->
        <meta name="msapplication-tap-highlight" content="no">
        <!-- base css -->
        <link rel="stylesheet" media="screen, print" href="css/vendors.bundle.css">
        <link rel="stylesheet" media="screen, print" href="css/app.bundle.css">
        <!-- Place favicon.ico in the root directory -->
        <link rel="apple-touch-icon" sizes="180x180" href="img/favicon/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="img/logoOASI_100x115.png">
        <link rel="mask-icon" href="img/favicon/safari-pinned-tab.svg" > <!--color="#5bbad5"-->
        <!-- Optional: page related CSS-->
        <link rel="stylesheet" media="screen, print" href="css/page-login.css">

    </head>

    <body>
<?php
include_once __DIR__ . '//view//modalStrutture.tpl.php';
?>
        <div class="blankpage-form-field">
            <div id="response"></div>
            <div class="page-logo m-0 w-100 align-items-center justify-content-center rounded border-bottom-left-radius-0 border-bottom-right-radius-0 px-4">
                <!-- TODO: fare la select per la selezione della struttura-->
                <a href="#" id="btnStrutture" class="page-logo-link press-scale-down d-flex align-items-center" data-toggle="modal" data-target=".example-modal-centered-transparent">
                    <img src="img/logoOASI_100x115.png" style ="width: 28px;" alt="WebOasi - Portale di Gestione" > <!--aria-roledescription="logo"-->
                    <span id="lblStruttura" class="page-logo-text mr-1">WebOasi - Portale di Gestione</span>
                    <i class="fal fa-angle-down d-inline-block ml-1 fs-lg color-primary-300"></i>
                </a>
            </div>
            <div class="card p-4 border-top-left-radius-0 border-top-right-radius-0">
                <form id="login_form" method="POST" >
                    <input type="hidden" id="idStruttura" name="idStruttura" value="-1">
                    <div class="form-group">
                        <label class="form-label" for="UTENTE">Username</label>
                        <input type="text" id="txtUtente" name="txtUtente" class="form-control" placeholder="Inserisci user-name" value="">
                        <span class="help-block">
                            Il tuo user name solito
                        </span>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="PSW">Password</label>
                        <input type="password" id="txtPass" name="txtPass" class="form-control" placeholder="password" value="">
                        <span class="help-block">
                            La tua password valida, comunicata in segreteria
                        </span>
                    </div>
                    <button type="submit" class="btn btn-default float-right">Secure login</button>
<!--                    <button type="button" class="btn btn-default float-right"  id="btnLogin"  name="btnLogin" >Secure login</button>-->

                </form>
            </div>
            <div class="blankpage-footer text-center">
                <!-- non mi serve -->
            </div>
        </div>
        <div class="login-footer p-2">
            <div class="row">
                <div class="col col-sm-12 text-center">
                    <i id="message_system"><strong></strong>

                    </i>
                </div>
            </div>
        </div>
        <video poster="img/backgrounds/clouds.png" id="bgvid" playsinline  muted loop> <!--autoplay-->
            <source src="media/video/cc.webm" type="video/webm">
            <source src="media/video/cc.mp4" type="video/mp4">
        </video>
        <p id="js-color-profile" class="d-none">
            <span class="color-primary-50"></span>
            <span class="color-primary-100"></span>
            <span class="color-primary-200"></span>
            <span class="color-primary-300"></span>
            <span class="color-primary-400"></span>
            <span class="color-primary-500"></span>
            <span class="color-primary-600"></span>
            <span class="color-primary-700"></span>
            <span class="color-primary-800"></span>
            <span class="color-primary-900"></span>
            <span class="color-info-50"></span>
            <span class="color-info-100"></span>
            <span class="color-info-200"></span>
            <span class="color-info-300"></span>
            <span class="color-info-400"></span>
            <span class="color-info-500"></span>
            <span class="color-info-600"></span>
            <span class="color-info-700"></span>
            <span class="color-info-800"></span>
            <span class="color-info-900"></span>
            <span class="color-danger-50"></span>
            <span class="color-danger-100"></span>
            <span class="color-danger-200"></span>
            <span class="color-danger-300"></span>
            <span class="color-danger-400"></span>
            <span class="color-danger-500"></span>
            <span class="color-danger-600"></span>
            <span class="color-danger-700"></span>
            <span class="color-danger-800"></span>
            <span class="color-danger-900"></span>
            <span class="color-warning-50"></span>
            <span class="color-warning-100"></span>
            <span class="color-warning-200"></span>
            <span class="color-warning-300"></span>
            <span class="color-warning-400"></span>
            <span class="color-warning-500"></span>
            <span class="color-warning-600"></span>
            <span class="color-warning-700"></span>
            <span class="color-warning-800"></span>
            <span class="color-warning-900"></span>
            <span class="color-success-50"></span>
            <span class="color-success-100"></span>
            <span class="color-success-200"></span>
            <span class="color-success-300"></span>
            <span class="color-success-400"></span>
            <span class="color-success-500"></span>
            <span class="color-success-600"></span>
            <span class="color-success-700"></span>
            <span class="color-success-800"></span>
            <span class="color-success-900"></span>
            <span class="color-fusion-50"></span>
            <span class="color-fusion-100"></span>
            <span class="color-fusion-200"></span>
            <span class="color-fusion-300"></span>
            <span class="color-fusion-400"></span>
            <span class="color-fusion-500"></span>
            <span class="color-fusion-600"></span>
            <span class="color-fusion-700"></span>
            <span class="color-fusion-800"></span>
            <span class="color-fusion-900"></span>
        </p>
        <!-- base vendor bundle:
                             DOC: if you remove pace.js from core please note on Internet Explorer some CSS animations may execute before a page is fully loaded, resulting 'jump' animations
                                                    + pace.js (recommended)
                                                    + jquery.js (core)
                                                    + jquery-ui-cust.js (core)
                                                    + popper.js (core)
                                                    + bootstrap.js (core)
                                                    + slimscroll.js (extension)
                                                    + app.navigation.js (core)
                                                    + ba-throttle-debounce.js (core)
                                                    + waves.js (extension)
                                                    + smartpanels.js (extension)
                                                    + src/../jquery-snippets.js (core) -->
        <!-- jQuery & Bootstrap 4 JavaScript libraries -->
        <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>


        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

        <!-- jquery scripts will be here -->
        <script src="js/vendors.bundle.js"></script>
        <script src="js/app.bundle.js"></script>
		
        <!-- Page related scripts -->
        <script src="js/myJs/dist/main-min.js"></script>

<script id="__bs_script__">//<![CDATA[
    document.write("<script async src='http://HOST:3000/browser-sync/browser-sync-client.js?v=2.26.10'><\/script>".replace("HOST", location.hostname));
    //]]>
</script>

    </body>

</html>