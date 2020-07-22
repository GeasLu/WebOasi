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

/**
 * Funzione che imposta una nuova breadcrumb e ne fa il refresh
 * @param {type} pLivello, indice dell'array bresadcrumb, 0 e 1 sono gli stati di default, quindi bisognerò partire da "2"
 * @param {type} pDesc
 * @returns {undefined}
 */
function ImpostaBreadCrumb(pLivello, pDesc) {
    //Luke 18/06/2020

    var arrBred = new Array(pLivello);
    var objBread;

    if (pLivello == 0) {
        localStorage.removeItem('breadcrumb');
        console.log("canellata breadcrumb")
    }

    // Leggo dal local storage l'elenco delle pagine 
    if (localStorage.getItem('breadcrumb') === null) {
        objBread = {
            desc: "WebOasi Home",
            url: "#"
        };
        arrBred.push(objBread);
        objBread = {
            desc: "Dashboard User",
            url: "#"
        };
        arrBred.push(objBread);
        localStorage.setItem('breadcrumb', JSON.stringify(arrBred));
        pDesc = "Dashboard User";
    } else {
        arrBred = JSON.parse(localStorage.getItem('breadcrumb'));
        objBread = {
            desc: pDesc,
            url: "#"
        };
        arrBred[pLivello] = objBread;
        localStorage.setItem('breadcrumb', JSON.stringify(arrBred));
        console.log(arrBred);
    }

    RefreshBreadCrumb(pDesc);

}

function RefreshBreadCrumb(pLocalPage) {
    //Luke 18/06/2020

    var arrBred = new Array();

    // Leggo dal local storage l'elenco delle pagine 
    if (localStorage.getItem('breadcrumb') !== null) {
        arrBred = JSON.parse(localStorage.getItem('breadcrumb'));

        var sHtml;
        console.log('*************************************************************');
        console.log(arrBred);

        sHtml = "";
        for (let i in arrBred) {
            if (pLocalPage == arrBred[i].desc) {
                sHtml += '  <li class="breadcrumb-item active"><a href="' + arrBred[i].url + ';">' + arrBred[i].desc + '</a></li> \n';
            } else {
                sHtml += '  <li class="breadcrumb-item"><a href="' + arrBred[i].url + ';">' + arrBred[i].desc + '</a></li> \n';
            }
        }
        ;
        sHtml += '  <li class="position-absolute pos-center pos-left d-none d-sm-block"><br> \n';
        sHtml += '  <div id="ph-get-date" style="color:#a6a4a6" >' + GetDateString() + '</div></li> \n';

        console.log(sHtml);

        var obj = document.getElementById('ph-breadcrumb');
        obj.innerHTML = sHtml;

    }
}
;


/**
 * Funzione per il caricamente del calendario utente
 * @param {type} pDataInizio devono essere formato Date, vengono trasformate in stringa successivamente
 * @param {type} pDataFine
 * @returns {undefined}
 */
function LoadCalendar(pDataInizio, pDataFine) {
    //Luke 07/05/2020

    var dToday = new Date();
    var dtFilterIniz, dtFilterFine;
    var elnEventi;
    var jwt = localStorage.getItem('jwt');

    if (pDataInizio) {
        dtFilterIniz = pDataInizio;
    } else {
        dtFilterIniz = new Date(dToday.getFullYear(), dToday.getMonth(), 1)
    }
    if (pDataFine) {
        dtFilterFine = pDataFine;
    } else {
        dtFilterFine = new Date(dToday.getFullYear(), dToday.getMonth() + 1, 0)
    }

    var paramSend = JSON.stringify({
        'jwt': jwt,
        'dbschema': 'Scadenze',
        'dtInizio': GetDateFormat(dtFilterIniz),
        'dtFine': GetDateFormat(dtFilterFine)
    });

    // Leggo dal model gli eventi per questo utente, nel periodo 
    $.ajax({
        type: "POST",
        url: cg_BaseUrl + '/api/eventi/read.php',
        async: true,
        data: paramSend,
        dataType: "json",
        success: function (res) {
            let jResponse = res;
            localStorage.setItem('jwt', jResponse.jwt); //aggiorno il token nel localstorage
            elnEventi = jResponse.eventi;
            // Carico i dati in un array di Elementi events le cui proprietà sono definite nalla documentazione del fullcalendar
            let eT, eD;
            var arrEvents = [];
            for (eT in elnEventi) {
                for (eD in elnEventi[eT].elnEventiDet) {
                    let eV = {
                        ID: elnEventi[eT].elnEventiDet[eD].idRow,
                        title: elnEventi[eT].evento,
                        start: elnEventi[eT].elnEventiDet[eD].dataOccorrenza,
                        description: elnEventi[eT].evento_esteso,
                        className: elnEventi[eT].classCSS
                    };
                    arrEvents.push(eV);
                }
            }

            var calendarEl = document.getElementById('calendar');
            var calendar = new FullCalendar.Calendar(calendarEl,
                    {
                        plugins: ['dayGrid', 'list', 'timeGrid', 'interaction', 'bootstrap'],
                        themeSystem: 'bootstrap',
                        timeZone: 'UTC',
                        dateAlignment: "month", //week, month
                        buttonText:
                                {
                                    today: 'Oggi',
                                    month: 'Mensile',
                                    week: 'Settimanale',
                                    day: 'Giornaliera',
                                    list: 'lista'
                                },
                        eventTimeFormat:
                                {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    meridiem: 'short'
                                },
                        navLinks: true,
                        header: {
                            left: 'prev,next today addEventButton',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                        },
                        footer:
                                {
                                    left: '',
                                    center: '',
                                    right: ''
                                },
                        customButtons:
                                {
                                    addEventButton:
                                            {
                                                text: '+',
                                                click: function ()
                                                {
                                                   // var dateStr = prompt('Enter a date in YYYY-MM-DD format');
                                                   // var date = new Date(dateStr + 'T00:00:00'); // will be in local time
                                                    
                                                    $('#sc-Evento').modal({backdrop: false});
                                                    
//                                                    if (!isNaN(date.valueOf()))
//                                                    { // valid?
//                                                        calendar.addEvent(
//                                                                {
//                                                                    title: 'dynamic event',
//                                                                    start: date,
//                                                                    allDay: true
//                                                                });
//                                                        alert('Great. Now, update your database...');
//                                                    } else
//                                                    {
//                                                        alert('Invalid date.');
//                                                    }
                                                }
                                            }
                                },

                        editable: true,
                        eventLimit: true, // allow "more" link when too many events
                        events: arrEvents,
                        viewSkeletonRender: function ()
                        {
                            $('.fc-toolbar .btn-default').addClass('btn-sm');
                            $('.fc-header-toolbar h2').addClass('fs-md');
                            $('#calendar').addClass('fc-reset-order');
                        }
                    });
            calendar.on('dateClick', function (info) {
                console.log('clicked on ' + info.dateStr);
            });
            calendar.render();
        },
        error: function (jqXHR) {
            var jResponse = JSON.parse(jqXHR.responseText);
            var html = msgAlert(jResponse.error, jResponse.message);
            document.getElementById('response').innerHTML = html;
        }
    });


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
        url: cg_BaseUrl + '//page//view//' + pFileTpl + '.tpl.php',
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





