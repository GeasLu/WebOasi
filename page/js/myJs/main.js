// Author: Luca Tiengo
// data: 01/03/2020
// File globale di gestione del portale WEBOASI
//
// 

// <editor-fold desc="APPUNTI DI CODICE - AJAX" defaultstate="collapsed">
// $.ajax({
//    url: 'some_unknown_page.html',
//    success: function (response) {
//        $('#post').html(response.responseText);
//    },
//    error: function (jqXHR, exception) {
//        var msg = '';
//        if (jqXHR.status === 0) {
//            msg = 'Not connect.\n Verify Network.';
//        } else if (jqXHR.status == 404) {
//            msg = 'Requested page not found. [404]';
//        } else if (jqXHR.status == 500) {
//            msg = 'Internal Server Error [500].';
//        } else if (exception === 'parsererror') {
//            msg = 'Requested JSON parse failed.';
//        } else if (exception === 'timeout') {
//            msg = 'Time out error.';
//        } else if (exception === 'abort') {
//            msg = 'Ajax request aborted.';
//        } else {
//            msg = 'Uncaught Error.\n' + jqXHR.responseText;
//        }
//        $('#post').html(msg);
//    },
//});
//
//
//PER SPEDIRE DATI IN POST durante una chiamata bAJAX devono essere stringa
//
//        var paramSend = {};
//paramSend['jwt'] = jwt;
//paramSend = JSON.stringify(paramSend);
//   e poi... nella chiamata 
//   data: paramSend,
//   
// *************************************************************
// RIGHE DI CODICE PER LA LETTURA DEI DATI DEL CAMPO BLOB  
//   You can use Blobs to create objects from binary data that you later pass as an url for image decoding. 
//   Assuming you have the binary data stored as typed array you could do something like this:
// 
//var blob = new Blob([myTypedArray], {type: 'application/octet-binary'});
//var url = URL.createObjectURL(blob);
//Now you can pass that url as a source for image:

//var img = new Image;
//    img.onload = function() {
//    URL.revokeObjectURL(url);
//    ...
//};
//img.src = url;
//Note that you still have make sure that the data you pass in is valid image format that the browser can handle.

// </editor-fold> 

switch (true) {
    case (self.location.href.indexOf("page-login") != - 1) :
        window.onload = function () {
            OnSubmitAjaxLogin();
            OnClickSelStruttura();
        };
        break;

    case (self.location.href.indexOf("page-home") != - 1) :
        window.onload = function () {
            //passa di qua solo quando ha finito di caricare completamente la pagina, 
            //se ci fosse un errore nel frattempo non la carica più.... 
            //e quindi non viene caricato questo evento
            // --- al caricamento della pagina faccio partire il timer...
            var secCheck = 60 * cg_MinCheckSession;
            Ping(secCheck); //display = document.querySelector('#time');

            Display("ph-primary_nav", "primary_nav");
            ajaxpage(cg_BaseUrl + '/page/view/main.tpl.php', 'ph-main', 'main');

            //Gestione EVENTI -------
            OnClickbtnLogout();
            // **********************
        };

        window.onunload = function () {
            //se scarico la pagina, per qualsiasi motivo, cancelloil token!
            //localStorage.clear();
        };
        break;

    default:
        alert('Route non gestita!');
        break;
}


function Ping(duration) {
    //Luke 03/04/2020 -  timer che controlla l'esistenza della sessione

    //se non esiste il token redirect immediato alla login...
    if (localStorage.getItem('jwt') === null) {
        window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
    }

    // OGNI 30 sec. controlla la sessione
    var timer = duration, minutes, seconds;
    var myTimer = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        console.log("Controllo sessione: " + minutes + ":" + seconds);
        --timer; //decremento la variabile del timer, così se volessi stmapar eil minuti mancanti al controllo sono pronto a farlo

        //Funzione di test del Token, se non valido faccio un redirect alla form di Login
        var actual_url = location.protocol.toString() + "//" + location.hostname.toString();
        var jwt = localStorage.getItem('jwt');

        var paramSend = {};
        paramSend['jwt'] = jwt;
        paramSend = JSON.stringify(paramSend);

        if (actual_url.indexOf("WebOasi") !== -1 ||
                actual_url.indexOf("oasionlus.com") !== -1 ||
                actual_url.indexOf("localhost") !== -1 ||
                actual_url.indexOf("10.0.2.44") !== -1 ||
                actual_url.indexOf("srv2012-mnt") !== -1 ||
                actual_url.indexOf("10.0.0.15") !== -1) {

            if (actual_url.indexOf("localhost") != -1) {
                actual_url = cg_BaseUrl;
            };

            //
            // se il token è vuoto o non esiste mando alla login
            if (jwt == "") {
                clearInterval(myTimer); //elimino il timer
                window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
            }

            $.ajax({
                type: "POST",
                url: cg_BaseUrl + '/api/validate_token.php',
                async: true,
                data: paramSend,
                dataType: "json",
                success: function (data, textStatus, xhr) {
                    //console.log(xhr);
                    // controllo che effettivamente l'header sia di risposta corretta...
                    switch (xhr.status) {
                        case 200:
                            // risposta corretta e token valido
                            console.log(data);
                            break;
                        case 401:
                            // token non valido perchè scaduto da server
                            console.log(data);
                        case 500:
                            // c'è stato qualche errore lato server. contenuto in data.message
                            console.log(data);
                            //non metto il break, così passa oltre e esegue il redirect
                        default:
                            // code block
                            console.log(data);
                            clearInterval(myTimer); //elimino il timer
                            window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
                            break;
                    }
                    ;
                },
                error: function (xhr) {
                    clearInterval(myTimer); //elimino il timer
                    window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
                }

            });
        } else {
            console.log("Controllo sessione non eseguito: " + minutes + ":" + seconds);
            return true;
        }

    }, cg_milliSecControlloSessione);
}

function Display(pIdTag, pFileTpl, pParamArray) {
    //Luke 09/04/2020

    //se non esiste il token redirect immediato alla login...
    if (localStorage.getItem('jwt') === null) {
        window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
    }

    var jwt = localStorage.getItem('jwt');


    var paramSend = {};
    paramSend['jwt'] = jwt;
    paramSend = JSON.stringify(paramSend);

    //se il token è vuoto o non esiste mando alla login
    if (jwt === "") {
        window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
    }

// --- Righe di codice per aggiungere il wait nel componente
    AddWait(pIdTag);
//
    $.ajax({
        type: "POST",
        url: cg_BaseUrl + '/page/view/' + pFileTpl + '.tpl.php',
        async: true,
        data: paramSend,
        dataType: "html",
        beforeSend: function () {
            $('#wait').show();
        },
        success: function (dataHtml, textStatus, xhr) {
            console.log(xhr);
            // controllo che effettivamente l'header sia di risposta corretta...
            switch (xhr.status) {
                case 200:
                    // risposta corretta e token valido
                    //console.log(dataHtml);
                    document.getElementById(pIdTag).innerHTML = dataHtml;
                    break;
                case 401:
                    // token non valido perchè scaduto da server
                    console.log(dataHtml);
                    //alert('dentro if prima del redirect ');
                case 500:
                    // c'è stato qualche errore lato server. contenuto in data.message
                    console.log(dataHtml);
                    //non metto il break, così passa oltre e esegue il redirect
                default:
                    // code block
                    console.log(dataHtml);
                    window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
                    break;
            };
        },
        error: function (xhr) {
            alert('error ajax Display (javascript)');
            console.log(xhr);
            window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
        },
        complete: function () {
            $('#wait').hide();
        }
    });
}





