// Author: Luca Tiengo
// data: 01/03/2020
// File globale di gestione del portale WEBOASI
// da valutare se dividere in altri file la gestione delle griglie...
// tutto dipende da quanto grande diventa questo file

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



function OnClickSelStruttura() {
    //Luke 17/04/2020
    var btnClick = $('.btn-primary');
    btnClick.click(function (ev) {
        let hiddenIdStrutt = document.getElementById('idStruttura');
        if (this.value > -1) {
            hiddenIdStrutt.value = this.value;
        } else {
            hiddenIdStrutt.value = -1;
        }
    });
}

function OnClickbtnLogout() {
    //Luke 05/05/2020
    var btnClick = $('#ph-btnLogout');
    btnClick.click(function (ev) {
        localStorage.removeItem('jwt');
        window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
    });
}


function OnClicMenuPrimary(object) {
    //Luke 06/07/2020
    var app = object.name;
    ajaxpage(cg_BaseUrl + '/page/view/' + app + '.tpl.php', 'ph-main', app);
}

function OnSubmitAjaxLogin() {
    //Luke 09/04/2020
    var frm = $('#login_form');
    frm.submit(function (ev)
    {
        // get data  
        var username = document.getElementById('txtUtente').value;
        var password = document.getElementById('txtPass').value;
        var idStruttura = document.getElementById('idStruttura').value;

        var dataJson = JSON.stringify({'username': username, 'password': password, 'idStruttura': idStruttura})

        // send data  
        $.ajax({
            type: "POST",
            url: "../api/login.php",
            data: dataJson,
            context: document.body,
            async: true,
            datatype: "json",
            success: function (res, stato)
            {
                try {
                    // da stringa a oggetto JSON...
                    console.log("ajax ok but: " + res);
                    console.log(res);
                    let jResponse = res;

                    if (jResponse.message_system !== "") {
                        document.getElementById('message_system').innerHTML = "<strong>" + jResponse.message_system + "</strong>";
                    }

                    var html = msgSuccess(jResponse.message_title, jResponse.message_body);
                    document.getElementById('response').innerHTML = html;

                    //memorizzo il token nello storage...
                    localStorage.setItem('jwt', jResponse.jwt);
                    //window.location.replace('page-home.php');

                    var paramSend = {};
                    paramSend['jwt'] = jResponse.jwt;
                    paramSend = JSON.stringify(paramSend);

                    $.redirectPost('page-home.php', JSON.parse(paramSend));

                } catch (e) {
                    console.log(e);
                    alert('Erroe ajax try' + e);
                }
            },
            error: function (jqXHR, exception)
            {
                var msg = '';
                console.log(jqXHR.responseText);

                var jResponse = JSON.parse(jqXHR.responseText);

                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 401) {
                    msg = 'Da rest api: ' + jResponse.message_body + ' \n';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jResponse.message_body;
                }
                // scrtivo messagi di sistema
                if (jResponse.message_system !== "") {
                    document.getElementById('message_system').innerHTML = "<strong>" + jResponse.message_system + "</strong>";
                }
                var html = alertMsg(jResponse.message_title, msg);
                document.getElementById('response').innerHTML = html;
            }
        });
        ev.preventDefault();
        return false;
    });
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
                actual_url.indexOf("10.0.2.44") !== -1) {

            if (actual_url.indexOf("localhost") != -1) {
                actual_url = cg_BaseUrl;
            }
            ;

            //se il token è vuoto o non esiste mando alla login
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
                            alert('dentro if prima del redirect ');
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
                    //alert('error ajax startTmrCheckSession');
                    console.log(xhr);
                    clearInterval(myTimer); //elimino il timer
                    window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
                }

            });
        } else {
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
    var MainTag = document.getElementById(pIdTag);
    var imgLoading = document.createElement("img");
    var srcAttr = document.createAttribute("src");
    var idAttr = document.createAttribute("id");
    var classAttr = document.createAttribute("class");

    srcAttr.value = "img/ajax-loader.gif";
    idAttr.value = "wait";
    classAttr.value = "align-self: center, position: relative";

    imgLoading.setAttributeNode(srcAttr);
    imgLoading.setAttributeNode(idAttr);
    imgLoading.setAttributeNode(classAttr);
    MainTag.appendChild(imgLoading);
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
                    console.log(dataHtml);
                    document.getElementById(pIdTag).innerHTML = dataHtml;
                    break;
                case 401:
                    // token non valido perchè scaduto da server
                    console.log(dataHtml);
                    alert('dentro if prima del redirect ');
                case 500:
                    // c'è stato qualche errore lato server. contenuto in data.message
                    console.log(dataHtml);
                    //non metto il break, così passa oltre e esegue il redirect
                default:
                    // code block
                    console.log(dataHtml);
                    window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
                    break;
            }
            ;
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





