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
        //console.log(arrBred);
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
        //console.log('*************************************************************');
        //console.log(arrBred);

        sHtml = "";
        for (var i in arrBred) {
            if (pLocalPage == arrBred[i].desc) {
                sHtml += '  <li class="breadcrumb-item active"><a href="' + arrBred[i].url + ';">' + arrBred[i].desc + '</a></li> \n';
            } else {
                sHtml += '  <li class="breadcrumb-item"><a href="' + arrBred[i].url + ';">' + arrBred[i].desc + '</a></li> \n';
            }
        }
        ;
        sHtml += '  <li class="position-absolute pos-center pos-left d-none d-sm-block"><br> \n';
        sHtml += '  <div id="ph-get-date" style="color:#a6a4a6" >' + GetDateString() + '</div></li> \n';

        //console.log(sHtml);

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
            var jResponse = res;
            localStorage.setItem('jwt', jResponse.jwt); //aggiorno il token nel localstorage
            elnEventi = jResponse.eventi;
            // Carico i dati in un array di Elementi events le cui proprietà sono definite nalla documentazione del fullcalendar
            var eT, eD;
            var arrEvents = [];
            for (eT in elnEventi) {
                for (eD in elnEventi[eT].elnEventiDet) {
                    var eV = {
                        ID: elnEventi[eT].elnEventiDet[eD].idRow,
                        idEvento : elnEventi[eT].idEvento,
                        title: elnEventi[eT].evento,
                        evento_esteso :elnEventi[eT].evento_esteso,
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
                    eventClick : function (info) {
                        var idEv = info.event.extendedProps.idEvento;
                        var html = "Modifica evento... \n" +
                                   "<small class=\"m-0 text-danger\"> \n" +
                                   "Attenzione, modificando la ricorrenza si perderennao tutte le future scadenze!\n" +
                                   "</small>";

                        // Carico i dati dell'evento cliccato
                        document.getElementById('lblTitleModalScadenze').innerHTML = html;
                        document.getElementById('txtScEventoTitolo').value =  info.event.title;
                        document.getElementById('txtScEventoDesc').value = info.event.extendedProps.evento_esteso;

                        LoadDatatables('tableDipendentiViewer', { idEvento: idEv } );


                        $('#modalEvento').modal({backdrop: false});
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

                                        var html = "Aggiungi evento... \n" +
                                            "<small class=\"m-0 text-muted\"> \n" +
                                            "per aggiungere una ricorrenza, cliccare su \"RICORRENZA\" \n" +
                                            "</small>";
                                        document.getElementById('lblTitleModalScadenze').innerHTML = html;
                                        document.getElementById('txtScEventoTitolo').value="";
                                        document.getElementById('txtScEventoDesc').value="";
                                        LoadDatatables('tableDipendentiViewer', { idEvento: "1"} );
                                        $('#modalEvento').modal({backdrop: false});

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


// <editor-fold desc="COSTANTI GLOBALI" defaultstate="collapsed">
const cg_MinCheckSession = 30;
const cg_milliSecControlloSessione = 50000;
//const cg_BaseUrl = 'http://10.0.2.44:8080/WebOasi';
const cg_BaseUrl = location.origin + '/WebOasi';
const cg_PathImg = cg_BaseUrl + '/page/img';


var dtb;

/***********************************************
 * Dynamic Ajax Content- © Dynamic Drive DHTML code library (www.dynamicdrive.com)
 * This notice MUST stay intact for legal use
 * Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
 ***********************************************/

var loadedobjects = "";
var rootdomain = cg_BaseUrl;

function ajaxpage(url, containerid, pView, pSchema, pOption) {

    var jwt = localStorage.getItem('jwt');
    var page_request = false;

    if (window.XMLHttpRequest) // if Mozilla, Safari etc
        page_request = new XMLHttpRequest();
    else if (window.ActiveXObject) { // if IE
        try {
            page_request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                page_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            }
        }
    } else
        return false;
    page_request.onreadystatechange = function () {
        loadpage(page_request, containerid, pView, pSchema, pOption);
    };
    page_request.open('POST', url, true);
    page_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    page_request.send("jwt=" + jwt + "&schema=" + pSchema);

}

function loadpage(page_request, containerid, pView, pSchema, pOptions) {
    if (page_request.readyState == 4 && (page_request.status == 200 || window.location.href.indexOf("http") == -1)) {
        document.getElementById(containerid).innerHTML = page_request.responseText;
        if (pView){
            switch (pView.toUpperCase()) {
                case 'MAIN':
                    ImpostaBreadCrumb(0, "WebOasi Home");
                    LoadCalendar();
                    break;

                case 'SCADENZE':
                    ImpostaBreadCrumb(2, "Scadenze");
                    LoadCalendar();
                    break;

                case 'SCHISOLAMENTO':
                    ImpostaBreadCrumb(2, "Scheda Isolamento");
                    LoadDatatables('tableOspitiParametri', {Schema: pSchema});
                    OnClickbtnSchedaIsolamento('tableOspitiParametri');
                    break;

                case 'SCHISOLAMENTO-ANOMALIE':
                    var paramSend = {};
                    if(pOptions){
                        paramSend = pOptions;
                    }
                    paramSend['Schema'] = pSchema;
                    paramSend['DataDal'] = $('#dtpDataDal').val();
                    paramSend['DataAl'] = $('#dtpDataAl').val();
                    paramSend['paramTemp'] = $('#paramTemp').val();
                    paramSend['paramSat'] = $('#paramSat').val();

                    ImpostaBreadCrumb(3, "Anomalie Ospiti");
                    LoadDatatables('tableAnomalieOspiti', paramSend);
                    OnClickbtnSchedaIsolamento('tableAnomalieOspiti');
                    break;

                default:
                    var html = msgAlert("Errore Pagina Ajax", "Status: " + page_request.status);
                    $("#response").show();
                    document.getElementById('response').innerHTML = html;
                    setTimeout(function () {
                        $("#response").hide();
                    } , 10000);
                    ajaxpage(cg_BaseUrl + '/page/view/main.tpl.php', 'ph-main');
                    break;
            }
        }


    }
}


function loadobjs() {
    if (!document.getElementById)
        return;
    for (i = 0; i < arguments.length; i++) {
        var file = arguments[i];
        var fileref = "";
        if (loadedobjects.indexOf(file) == -1) { //Check to see if this object has not already been added to page before proceeding
            if (file.indexOf(".js") != -1) { //If object is a js file
                fileref = document.createElement('script');
                fileref.setAttribute("type", "text/javascript");
                fileref.setAttribute("src", file);
            } else if (file.indexOf(".css") != -1) { //If object is a css file
                fileref = document.createElement("link");
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", file);
            }
        }
        if (fileref != "") {
            document.getElementsByTagName("head").item(0).appendChild(fileref);
            loadedobjects += file + " "; //Remember this object as being already added to page
        }
    }
}

/**
 *
 * @param pIdDataTable
 * @param pOptions : è un object che conterrà le varie option delle datatable
 * @constructor
 */

function LoadDatatables (pIdDataTable, pOptions) {
    //Luke 29/07/2020

    //se non esiste il token redirect immediato alla login...
    if (localStorage.getItem('jwt') === null) {
        window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
    }

    var jwt = localStorage.getItem('jwt');

    var paramSend = {};
    if(pOptions){
        paramSend = pOptions;
    }
    paramSend['jwt'] = jwt;

    //alert("stop");

    //console.log(paramSend);
    paramSend = JSON.stringify(paramSend);

    AddWait(pIdDataTable);

    switch (pIdDataTable) {
        case 'tableDipendentiViewer':
            LoadDtbDipendentiViewver(pIdDataTable, paramSend)
            break;

        case 'tableOspitiParametri':
            LoadDtbOspitiParametri(pIdDataTable, paramSend)
            break;

        case 'tableAnomalieOspiti':
            LoadDtbAnomalieOspiti(pIdDataTable, paramSend)
            break;
    }

}

function LoadDtbAnomalieOspiti(pIdDataTable, pParamSend){
    //Luke 02/12/2020

    var elnAnomalieOsp;
    //var dtb;

    $.ajax({
        type: "POST",
        url: cg_BaseUrl + '/api/Ospiti/readAnomalieOspiti.php',
        async: true,
        data: pParamSend,
        dataType: "json",
        beforeSend: function () {
            $('#wait').show();
        },
        success: function (res, textStatus, xhr) {
            let jResponse = res;
            switch (xhr.status) {
                case 200:
                    //aggiorno il token nel localstorage
                    localStorage.setItem('jwt', jResponse.jwt);
                    elnAnomalieOsp = jResponse.elnAnomalieOspiti;

                    // risposta corretta e token valido
                    dtb =  $('#' + pIdDataTable).DataTable({
                        destroy: true,
                        responsive: true,
                        data : elnAnomalieOsp,
                        dataSrc : "elnAnomalieOspiti",
                        selectType : "row",
                        columns: [
                            { // 0
                                data: "ID_ROW",
                                title : 'ID_ROW',
                                visible : false
                            },
                            {// 1
                                data: "ID_OSPITE",
                                title : 'ID_OSPITE',
                                visible : false
                            },
                            {// 2
                                data: "OSPITE",
                                title : 'Ospite',
                                visible : true
                            },
                            {// 3
                                data: "dataRilevazione",
                                title : 'Data Ora Rilevazione',
                                visible : true
                            },
                            {// 4
                                data: "temperatura_num",
                                title : 'Temperatura',
                                visible : true
                            },
                            {// 5
                                data: "saturazione",
                                title : 'Saturazione',
                                visible : true
                            },
                            {// 6
                                data: "ossigeno",
                                title : 'Ossigeno',
                                visible : true
                            },
                            {// 7
                                data: 'fTosseSecca',
                                title : 'Tosse Secca',
                                visible : true
                            },
                            {// 8
                                data: "fDolMusc",
                                title : 'Dolori Muscolari',
                                visible : true
                            },
                            {// 9
                                data: "fMaleTesta",
                                title : 'Mal di Testa',
                                visible : true
                            },
                            {// 10
                                data: "fRinorrea",
                                title : 'Rinorrea',
                                visible : true
                            },
                            {// 11
                                data: "fMaleGola",
                                title : 'Mal di Gola',
                                visible : true
                            },
                            {// 12
                                data: "fAstenia",
                                title : 'Astenia',
                                visible : true
                            },
                            {// 13
                                data: "fInappetenza",
                                title : 'Inappetenza',
                                visible : true
                            },
                            {// 14
                                data: "fVomito",
                                title : 'Vomito',
                                visible : true
                            },
                            {// 15
                                data: "fDiarrea",
                                title : 'Diarrea',
                                visible : true
                            },
                            {// 16
                                data: "fCongiuntivite",
                                title : 'Congiuntivite',
                                visible : true
                            },
                            {// 17
                                data: "fNoAlteraz",
                                title : 'Nessuna Alterazione',
                                visible : true
                            },
                            {// 18
                                data: "Altro",
                                title : 'Altro',
                                visible : true
                            },
                            {// 19
                                data: "USER_INS",
                                title : 'Inseriti da:',
                                visible : true
                            },
                            {// 20
                                data: "idUserIns",
                                title : 'idUserIns',
                                visible : false
                            }
                        ],
                        dom: '"<\'row mb-3\'<\'col-sm-12 col-md-6 d-flex align-items-center justify-content-start\'f><\'col-sm-12 col-md-6 d-flex align-items-center justify-content-end\'B>>" +\n' +
                            '                        "<\'row\'<\'col-sm-12\'tr>>" +\n' +
                            ' "<\'row\'<\'col-sm-12 col-md-5\'i><\'col-sm-12 col-md-7\'p>>"',
                        columnDefs:[
                            {
                                targets: 3,
                                render:function(data){
                                    moment.locale('it');
                                    moment.updateLocale("it", {
                                        invalidDate: ""
                                    });

                                    return moment(data).calendar( null, {
                                        sameDay: '[Oggi alle] HH:mm',
                                        nextDay: '[Domani]',
                                        nextWeek: 'dddd',
                                        lastDay: '[Ieri alle] HH:mm',
                                        lastWeek: 'DD/MM/YYYY HH:mm',
                                        sameElse: 'DD/MM/YYYY'
                                    }  );}
                            },

                            {
                                targets: [7,8,9,10,11,12,13,14,15,16,17],
                                render: function(data, type)
                                {
                                    if (type === 'display') {
                                        if (data == 1){
                                            return '<i class="fal fa-check-circle text-success"></i>';
                                        } else {
                                            return '<i class="fal fa-circle text-warning"></i>';
                                        }
                                    }
                                    return data;
                                }
                            },
                            {
                                targets: [4], //temperatura_num
                                mRender: function(data, type)
                                {
                                    var num = data;

                                     if (num > 37.3){
                                        return '<span class="text-danger">' + roundTo(num,1) + '</span>';
                                     } else {
                                        return  roundTo(num,1);
                                     }
                                 }
                            },
                            {
                                targets: [5], //saturazione
                                mRender: function(data, type)
                                {
                                    var num = data;

                                    if (num <=91 ){
                                        return '<span class="text-danger">' + roundTo(num,0) + '</span>';
                                    } else {
                                        return  roundTo(num,0);
                                    }
                                }
                            }
                        ],
                    });
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
                    var html = msgAlert(jResponse.message_title, jResponse.message_body);
                    document.getElementById('response').innerHTML = html;
                    window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
                    break;
            }
            ;
        },
        error:  function (jqXHR, exception) {
            //alert('error ajax startTmrCheckSession');
            // scrtivo messagi di sistema

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

            if (jResponse.message_system !== "") {
                document.getElementById('message_system').innerHTML = "<strong>" + jResponse.message_system + "</strong>";
            }
            var html = msgAlert(jResponse.message_title, msg);
            document.getElementById('response').innerHTML = html;
        },
        complete: function () {
            $('#wait').hide();
        }
    });



    $.fn.dataTable.render.moment = function ( from, to, locale ) {
        // Argument shifting
        if ( arguments.length === 1 ) {
            locale = 'it';
            to = from;
            from = 'YYYY-MM-DD';
        }
        else if ( arguments.length === 2 ) {
            locale = 'it';
        }

        return function ( d, type, row ) {
            if (! d) {
                return type === 'sort' || type === 'type' ? 0 : d;
            }

            var m = window.moment( d, from, locale, true );

            // Order and type get a number value from Moment, everything else
            // sees the rendered value
            return m.format( type === 'sort' || type === 'type' ? 'x' : to );
        };
    };

}


function LoadDtbDipendentiViewver(pIdDataTable, pParamSend){
    //Luke 06/08/2020

    var elnEventi;

/*
    $('#' + pIdDataTable).on('select.dt',function (e,dt,type, indexes) {
        alert('select');
        console.log($(this));
    });

    $('#' + pIdDataTable).on('click.dt','tr', function () {
        alert('click');
        console.log($(this));
    });
*/

    $('#' + pIdDataTable).on('click', 'tbody td', function () {
        // Luke 11/08/2020

        var cellIndex = dtb.cell(this).index();
        var rowData = dtb.row(this).data();
        var colInd =  cellIndex.column;

        switch (dtb.column(colInd).header().textContent){
            case 'Mod.':
                alert('MODIFICA');
                rowData.NOME_UTENTE = 'Luke'
                break;
            case 'Canc.':
                alert('elimina');
                break;
        }

    });



    $.ajax({
        type: "POST",
        url: cg_BaseUrl + '//api//users//readEventViewer.php',
        async: true,
        data: pParamSend,
        dataType: "json",
        success: function (res, textStatus, xhr) {
            let jResponse = res;
            switch (xhr.status) {
                case 200:
                    //aggiorno il token nel localstorage
                    localStorage.setItem('jwt', jResponse.jwt);
                    elnEventi = jResponse.eventi;

                    // risposta corretta e token valido
                    dtb =  $('#' + pIdDataTable).DataTable({
                        destroy: true,
                        responsive: true,
                        data : elnEventi,
                        dataSrc : "eventi",
                        selectType : "cell",
                        columns: [
                            {
                                data: "idRow",
                                title : 'idRow',
                                visible : false
                            },
                            {
                                data: "idEvento",
                                title : 'idEvento',
                                visible : false
                            },
                            {
                                data: "idUser",
                                title : 'idUser',
                                visible : false
                            },
                            {
                                data: "IMG",
                                title : 'Immagine',
                                visible : true
                            },
                            {
                                data: "NOME_UTENTE",
                                title : 'Dipendente',
                                visible : true
                            },
                            {
                                data: 'flagVis',
                                title : 'Visualizza',
                                visible : true
                            },
                            {
                                data: "flagMod",
                                title : 'Modifica',
                                visible : true
                            },
                            {
                                data: "flagDel",
                                title : 'Cancella',
                                visible : true
                            },
                            {
                                data: "flagPrint",
                                title : 'Stampa',
                                visible : true
                            },
                            {
                                data: "UTENTE",
                                title : 'Utente',
                                visible : false
                            },
                            {
                                data: "MODIFICA",
                                title : 'Mod.',
                                visible : true
                            },
                            {
                                data: "ELIMINA",
                                title : 'Canc.',
                                visible : true
                            }

                        ],
                        columnDefs:[
                            {
                                targets: 10,
                                data: "img",
                                render: function(data, type, full)
                                {
                                    if (type === 'display') {
                                        return '<a href="#"><img src="' + cg_PathImg + '/ico/p24x24_Edit.png" width="24px" height="24px"></a>';
                                    }
                                    return data + 'ciao';
                                }
                            },
                            {
                                targets: 11,
                                data: "img",
                                render: function(data, type, full)
                                {
                                    if (type === 'display') {
                                        return '<a href="#"><img src="' + cg_PathImg + '/ico/p24x24_EliminaV2.png" width="24px" height="24px"></a>';
                                    }
                                    return data + 'ciao';
                                }
                            },
                            {
                                targets: 3,
                                data: "img",
                                render: function(data, type, full)
                                {
                                    if (type === 'display') {
                                        if (data.length > 2){
                                            return '<img src="' + data + '" id="imgDip24x24" width="24" height="24" class="profile-image rounded-circle mx-auto d-block">';
                                            //return '<span class="profile-image rounded-circle d-inline-block" style="background-image:url("' + data + '")"></span>';
                                        }
                                    }
                                    return data + 'ciao';
                                }
                            },
                            {
                                targets: [5,6,7,8],
                                render: function(data, type)
                                {
                                    if (type === 'display') {
                                        if (data == 1){
                                            return '<i class="fal fa-check-circle text-success"></i>';
                                        } else {
                                            return '<i class="fal fa-circle text-warning"></i>';
                                        }
                                    }
                                    return data;
                                }
                            },

                        ],
                        dom: '"<\'row mb-3\'<\'col-sm-12 col-md-6 d-flex align-items-center justify-content-start\'f><\'col-sm-12 col-md-6 d-flex align-items-center justify-content-end\'B>>" +\n' +
                            '                        "<\'row\'<\'col-sm-12\'tr>>" +\n' +
                            '                        "<\'row\'<\'col-sm-12 col-md-5\'i><\'col-sm-12 col-md-7\'p>>"',
                        buttons: [
                            {
                                text: 'Agg. Utente',
                                className : 'btn btn-outline-success',
                                action: function ( e, dt, node, config ) {
                                    alert( 'Button activated' );
                                }
                            }
                        ]

                    });
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
                    var html = msgAlert(jResponse.message_title, jResponse.message_body);
                    document.getElementById('response').innerHTML = html;
                    window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
                    break;
            }
            ;
        },
        error:  function (jqXHR, exception) {
            //alert('error ajax startTmrCheckSession');
            // scrtivo messagi di sistema

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

            if (jResponse.message_system !== "") {
                document.getElementById('message_system').innerHTML = "<strong>" + jResponse.message_system + "</strong>";
            }
            var html = msgAlert(jResponse.message_title, msg);
            document.getElementById('response').innerHTML = html;
        }
    });

}


function LoadDtbOspitiParametri(pIdDataTable, pParamSend){
    //Luke 15/09/2020

    var elnOspParam;

    $('#' + pIdDataTable).on('click', 'tbody td', function () {

        var cellIndex = dtb.cell(this).index();
        var rowData = dtb.row(this).data();
        var colInd =  cellIndex.column;
        var html;


        switch (dtb.column(colInd).header().textContent){
            case 'Param.':
                html = '  <h4 class="modal-title" id="modalParametriOspite"> \n'
                    + '     <img src="' + cg_PathImg + '/ospiti/' + rowData.ID_OSPITE + '.jpeg" alt=" nn -" class="profile-image rounded-circle" width="50" height="64" > \n'
                    + '     Dettaglio parametri inseriti per l\'ospite: ' + rowData.OSPITE + '\n'
                    + '  </h4>';
                document.getElementById('lblTitleElencoParametri').innerHTML = html;
                document.getElementById('idOspite').value = rowData.ID_OSPITE;
                document.getElementById('nomeOspite').value = rowData.OSPITE;

                // aggiungo l'idospite
                pParamSend = JSON.parse(pParamSend);
                pParamSend['idOspite'] = rowData.ID_OSPITE;
                pParamSend = JSON.stringify(pParamSend);

                LoadDtbParametriOspite('tableParametriOspite',pParamSend)
                $('#modalParametriOspite').modal({backdrop: false});

                break;

            default:
                //qua cerca l'indice dell'elemento nell'array...
                let indOsp = elnOspParam.map(function (e) {return e.ID_OSPITE}).indexOf(rowData.ID_OSPITE);

                if (indOsp>-1) {
                    html= '  <h4 class="modal-title" id="lblTitleModalParametri"> \n'
                        + '     <img src="' + cg_PathImg + '/ospiti/' + rowData.ID_OSPITE + '.jpeg" alt=" nn -" class="profile-image rounded-circle" width="50" height="64" > \n'
                        + '     Inserimento parametri per '  + rowData.OSPITE + '\n'
                        + '     <small class="m-0 text-muted" > \n'
                        + '      Ultimi parametri rilevati:  ' + DatetoDesc(rowData.DATA_ORA_ULTIMI) + ' \n'
                        + '     </small> \n'
                        + '  </h4>';

                    document.getElementById('lblTitleModalParametri').innerHTML = html;
                    document.getElementById('idOspite').value = rowData.ID_OSPITE;
                    document.getElementById('nomeOspite').value = rowData.OSPITE;

                    //resettoi valori della modale
                    if ($('#txtTemperatura').val() != "") {document.getElementById('txtTemperatura').value="";}
                    if ($('#txtOssigeno').val() != "") {document.getElementById('txtOssigeno').value="0";}
                    if ($('#txtSaturazione').val() != "") {document.getElementById('txtSaturazione').value="";}

                    document.getElementById('chkTosse').checked =false;
                    document.getElementById('chkDolori').checked =false;
                    document.getElementById('chkMaleTesta').checked =false;
                    document.getElementById('chkRinorrea').checked =false;
                    document.getElementById('chkMalDiGola').checked =false;
                    document.getElementById('chkAstenia').checked =false;
                    document.getElementById('chkInappetenza').checked =false;
                    document.getElementById('chkVomito').checked =false;
                    document.getElementById('chkDiarrea').checked =false;
                    document.getElementById('chkCongiuntivite').checked =false;
                    document.getElementById('chkDiarrea').checked =false;
                    document.getElementById('txtAltro').value="";
                    document.getElementById('chkNoAlteraz').checked =true;

                    $('#modalSchIsolamento').modal({backdrop: false});

                } else {
                    //Avviso che non è stato trovato
                    var html = msgAlert("Ospite non trovato!", "Manca nelle elenco Ospiti Paramatri ");
                    $("#response").show();
                    document.getElementById('response').innerHTML = html;

                    setTimeout(function () {
                        $("#response").hide();
                    } , 5000);

                }
                break;
        }
    });

    $.ajax({
        type: "POST",
        url: cg_BaseUrl + '/api/Ospiti/readOspitiParametri.php',
        async: true,
        data: pParamSend,
        dataType: "json",
        beforeSend: function () {
            $('#wait').show();
        },
        success: function (res, textStatus, xhr) {
            let jResponse = res;
            switch (xhr.status) {
                case 200:
                    //aggiorno il token nel localstorage
                    localStorage.setItem('jwt', jResponse.jwt);
                    elnOspParam = jResponse.ElnOspitiParametri;

                    // risposta corretta e token valido
                    dtb =  $('#' + pIdDataTable).DataTable({
                        destroy: true,
                        responsive: true,
                        data : elnOspParam,
                        dataSrc : "ElnOspitiParametri",
                        selectType : "row",
                        //lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                        language:{
                            "lengthMenu": "_MENU_ righe"
                        },
                        columns: [
                            { // 0
                                data: "ID_OSPITE",
                                title : 'ID_OSPITE',
                                visible : false
                            },
                            {// 1
                                data: "OSPITE",
                                title : 'Ospite',
                                visible : true
                            },
                            {// 2
                                data: "NUM_LETTO",
                                title : 'Letto',
                                visible : false
                            },
                            {// 3
                                data: "DATA_ORA_ULTIMI",
                                title : 'Ultimo ins.',
                                visible : true
                            },
                            {// 4
                                data: "NUM_CAMERA",
                                title : 'Camera',
                                visible : true
                            },
                            {// 5
                                data: "PIANO",
                                title : 'Piano',
                                visible : true
                            },
                            {// 6
                                data: 'SEZIONE',
                                title : 'Sezione',
                                visible : true
                            },
                            {// 7
                                data: "DETTAGLIO_DATI",
                                title : 'Param.',
                                visible : true
                            }
                        ],
                        dom: '"<\'row mb-3\'<\'col-sm-12 col-md-6 d-flex align-items-center justify-content-start\'f><\'col-sm-12 col-md-6 d-flex align-items-center justify-content-end\'B l>>" +\n' +
                            '                        "<\'row\'<\'col-sm-12\'tr>>" +\n' +
                            '                        "<\'row\'<\'col-sm-12 col-md-5\'i><\'col-sm-12 col-md-7\'p>>"',
                        columnDefs:[
                            {
                                targets: 3,
                                render:function(data){
                                    moment.locale('it');
                                    moment.updateLocale("it", {
                                        invalidDate: ""
                                    });

                                    var cls;
                                    var tmpDate;
                                    if (data){
                                        if (data.len >9){
                                            tmpDate = data.substring(0,10);
                                        } else {
                                            tmpDate = data;
                                        }
                                        //console.log('Data:' + tmpDate);
                                        if ( moment(tmpDate).isSame(moment(),'d') ){
                                            cls = "text-success";
                                        } else {
                                            cls = "text-danger";
                                        }
                                    } else {cls = "text-warning";}

                                    return  '<div class="' + cls + '">' + moment(data).calendar( null, {
                                    sameDay: '[Oggi alle] HH:mm',
                                    nextDay: '[Domani]',
                                    nextWeek: 'dddd',
                                    lastDay: '[Ieri alle] HH:mm',
                                    lastWeek: 'DD/MM/YYYY HH:mm',
                                    sameElse: 'DD/MM/YYYY'
                                    }) + '</div>';
                                }
                            },

                            {
                                targets: 7,
                                data: "img",
                                width: "24px",
                                render: function(data, type, full)
                                {
                                    if (type === 'display') {
                                        return '<a href="#"><img src="' + cg_PathImg + '/ico/p24x24_Eye.png" width="24px" height="24px"></a>';
                                    }
                                    return data + 'ciao';
                                }
                            },

                        ]
                    });
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
                    var html = msgAlert(jResponse.message_title, jResponse.message_body);
                    document.getElementById('response').innerHTML = html;
                    window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
                    $('#wait').hide();
                    break;
            }
            ;
        },
        error:  function (jqXHR, exception) {
            //alert('error ajax startTmrCheckSession');
            // scrtivo messagi di sistema

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

            if (jResponse.message_system !== "") {
                document.getElementById('message_system').innerHTML = "<strong>" + jResponse.message_system + "</strong>";
            }
            var html = msgAlert(jResponse.message_title, msg);
            document.getElementById('response').innerHTML = html;
        },
        complete: function () {
            $('#wait').hide();
        }
    });

    $.fn.dataTable.render.moment = function ( from, to, locale ) {
        // Argument shifting
        if ( arguments.length === 1 ) {
            locale = 'it';
            to = from;
            from = 'YYYY-MM-DD';
        }
        else if ( arguments.length === 2 ) {
            locale = 'it';
        }

        return function ( d, type, row ) {
            if (! d) {
                return type === 'sort' || type === 'type' ? 0 : d;
            }

            var m = window.moment( d, from, locale, true );

            // Order and type get a number value from Moment, everything else
            // sees the rendered value
            return m.format( type === 'sort' || type === 'type' ? 'x' : to );
        };
    };

}


function LoadDtbParametriOspite(pIdDataTable, pParamSend){
    //Luke 08/10/2020

    //evento click
    $('#' + pIdDataTable).on('click', 'tbody td', function () {
        console.clear();

        var cellIndex = dtb.cell(this).index();
        var rowData = dtb.row(this).data();
        var indCol =  cellIndex.column;

        let indRow = dtb.row(this).index;
        //var indCol = this._DT_CellIndex.column;
        var idUserLogin = $('#idUserLogin').val();

        console.log("dtb: ");
        console.log(dtb);
        console.log("this: ");
        console.log( this);
        console.log("riga colonna " +  indRow + " " + indCol);

        if (indRow > -1) {
            // var cellIndex = dtb.cell(this).index();
            // var rowData = dtb.row(this).data();
            // var colInd =  cellIndex.column;
            //console.log(dtb);

            var rowData = dtb.row(this).data();

            console.log("dtb");
            console.log(dtb);
            console.log("dati riga" );
            console.log(rowData);
            console.log("idUserLogin=" + $('#idUserLogin').val());

            switch (dtb.column(indCol).header().textContent){
                case 'Canc.':
                    if (idUserLogin == rowData.idUserIns){
                        $('#modalSiNo').modal({backdrop: false});
                    } else {
                        $('#modalNo').modal({backdrop: false});
                    }

                    // aggiungo l'idospite
                    // pParamSend = JSON.parse(pParamSend);
                    // pParamSend['idUserIns'] = rowData.idUserIns;
                    // pParamSend = JSON.stringify(pParamSend);
                    //
                    // $.ajax({
                    //     type: "POST",
                    //     url: cg_BaseUrl + '/api/Ospiti/readCanUserModOspParam.php',
                    //     async: true,
                    //     data: pParamSend,
                    //     dataType: "json",
                    //     success: function (res, textStatus, xhr) {
                    //         let jResponse = res;
                    //         //aggiorno il token nel localstorage
                    //         localStorage.setItem('jwt', jResponse.jwt);
                    //         if (jResponse.MODIFIED) {
                    //             $('#modalSiNo').modal({backdrop: false});
                    //         } else {
                    //             $('#modalNo').modal({backdrop: false});
                    //         }
                    //     }
                    // })

                    break;

                default:
                    break;
            }

        }

    });


    //carico la datatable
    $.ajax({
        type: "POST",
        url: cg_BaseUrl + '/api/Ospiti/readParametriOspite.php',
        async: true,
        data: pParamSend,
        dataType: "json",
        beforeSend: function () {
            $('#wait').show();
        },
        success: function (res, textStatus, xhr) {

            let jResponse = res;
            switch (xhr.status) {
                case 200:


                    //aggiorno il token nel localstorage
                    localStorage.setItem('jwt', jResponse.jwt);
                    elnParamOspite = jResponse.ElnParametriOspite;

                    // risposta corretta e token valido
                    dtb =  $('#' + pIdDataTable).DataTable({
                        destroy: true,
                        responsive: true,
                        data : elnParamOspite,
                        dataSrc : "ElnParametriOspite",
                        selectType : "row",
                        columns: [
                            { // 0
                                data: "ID_ROW",
                                title : 'ID_ROW',
                                visible : false
                            },
                            {// 1
                                 data: "ID_OSPITE",
                                 title : 'ID_OSPITE',
                                 visible : false
                            },
                            {// 2
                                data: "dataRilevazione",
                                title : 'Data',
                                visible : true
                            },
                            {// 3
                                data: "DELETE",
                                title : 'Canc.',
                                visible : true
                            },
                            {// 4
                                data: "temperatura",
                                title : 'Temperatura',
                                visible : true
                            },
                            {// 5
                                data: "saturazione",
                                title : 'Saturazione',
                                visible : true
                            },
                            {// 6
                                data: "ossigeno",
                                title : 'Ossigeno',
                                visible : true
                            },
                            {// 7
                                data: 'fTosseSecca',
                                title : 'Tosse Secca',
                                visible : true
                            },
                            {// 8
                                data: "fDolMusc",
                                title : 'Dolori Muscolari',
                                visible : true
                            },
                            {// 9
                                data: "fMaleTesta",
                                title : 'Mal di Testa',
                                visible : true
                            },
                            {// 10
                                data: "fRinorrea",
                                title : 'Rinorrea',
                                visible : true
                            },
                            {// 11
                                data: "fMaleGola",
                                title : 'Mal di Gola',
                                visible : true
                            },
                            {// 12
                                data: "fAstenia",
                                title : 'Astenia',
                                visible : true
                            },
                            {// 13
                                data: "fInappetenza",
                                title : 'Inappetenza',
                                visible : true
                            },
                            {// 14
                                data: "fVomito",
                                title : 'Vomito',
                                visible : true
                            },
                            {// 15
                                data: "fDiarrea",
                                title : 'Diarrea',
                                visible : true
                            },
                            {// 16
                                data: "fCongiuntivite",
                                title : 'Congiuntivite',
                                visible : true
                            },
                            {// 17
                                data: "fNoAlteraz",
                                title : 'Nessuna Alterazione',
                                visible : true
                            },
                            {// 18
                                data: "Altro",
                                title : 'Altro',
                                visible : true
                            },
                            {// 19
                                data: "USER_INS",
                                title : 'Inseriti da:',
                                visible : true
                            },
                            {// 20
                                data: "idUserIns",
                                title : 'idUserIns',
                                visible : false
                            }
                        ],
                        dom: '"<\'row mb-3\'<\'col-sm-12 col-md-6 d-flex align-items-center justify-content-start\'f><\'col-sm-12 col-md-6 d-flex align-items-center justify-content-end\'B>>" +\n' +
                            '                        "<\'row\'<\'col-sm-12\'tr>>" +\n' +
                            ' "<\'row\'<\'col-sm-12 col-md-5\'i><\'col-sm-12 col-md-7\'p>>"',
                        columnDefs:[
                            {
                                targets: 2,
                                render:function(data){
                                    moment.locale('it');
                                    moment.updateLocale("it", {
                                        invalidDate: ""
                                    });

                                    return moment(data).calendar( null, {
                                    sameDay: '[Oggi alle] HH:mm',
                                    nextDay: '[Domani]',
                                    nextWeek: 'dddd',
                                    lastDay: '[Ieri alle] HH:mm',
                                    lastWeek: 'DD/MM/YYYY HH:mm',
                                    sameElse: 'DD/MM/YYYY'
                                }  );}
                            },

                            {
                                targets: [7,8,9,10,11,12,13,14,15,16,17],
                                render: function(data, type)
                                {
                                    if (type === 'display') {
                                        if (data == 1){
                                            return '<i class="fal fa-check-circle text-success"></i>';
                                        } else {
                                            return '<i class="fal fa-circle text-warning"></i>';
                                        }
                                    }
                                    return data;
                                }
                            },

                            {
                                targets: 3,
                                data: "img",
                                render: function(data, type, full)
                                {
                                    if (type === 'display') {
                                        return '<a href="#"><img src="' + cg_PathImg + '/ico/p24x24_EliminaV2.png" width="24px" height="24px"></a>';
                                    }
                                    return data + 'ciao';
                                }
                            }

                        ],
                    });
                    //ordino per la colonna dataRilevamenti
                    dtb.order(2,'desc');
                    dtb.draw();
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
                    var html = msgAlert(jResponse.message_title, jResponse.message_body);
                    document.getElementById('response').innerHTML = html;
                    window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
                    break;
            };
        },
        error:  function (jqXHR, exception) {
            //alert('error ajax startTmrCheckSession');
            // scrtivo messagi di sistema

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

            if (jResponse.message_system !== "") {
                document.getElementById('message_system').innerHTML = "<strong>" + jResponse.message_system + "</strong>";
            }
            var html = msgAlert(jResponse.message_title, msg);
            document.getElementById('response').innerHTML = html;
        },
        complete: function () {
            $('#wait').hide();
        }
    });

    //funczione di rendering della data ora
    $.fn.dataTable.render.moment = function ( from, to, locale ) {
        // Argument shifting
        if ( arguments.length === 1 ) {
            locale = 'it';
            to = from;
            from = 'YYYY-MM-DD';
        }
        else if ( arguments.length === 2 ) {
            locale = 'it';
        }

        return function ( d, type, row ) {
            if (! d) {
                return type === 'sort' || type === 'type' ? 0 : d;
            }

            var m = window.moment( d, from, locale, true );

            // Order and type get a number value from Moment, everything else
            // sees the rendered value
            return m.format( type === 'sort' || type === 'type' ? 'x' : to );
        };
    };

}


function OnClickbtnLogout() {
    //Luke 05/05/2020
    let btnClick = $('#ph-btnLogout');
    btnClick.click(function (ev) {
        localStorage.removeItem('jwt');
        window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
    });
}

function OnClicMenuPrimary(object) {
    //Luke 06/07/2020
    let schema = object.name;
    let view =   object.name;
    let liTmp = $(object.parentNode);
    let clsTmp = '';

    if(schema.indexOf("-") !== -1){
        schema = schema.substr(0,schema.indexOf("-"))
    }
    switch (true) {
        case (liTmp[0].id=='lv1') :
            clsTmp ='active open';
            break;
        case (liTmp[0].id=='lv2') :
            clsTmp ='active';
            break;
        default:
            clsTmp ='active open';
            break;
    }

    // tolgo lo stato active open da tutti...
    let ulTmp = $(object.parentNode.parentNode);
    $(ulTmp).find('li').each(function(){
        var current = $(this); // qui punto all'elemnto ciclato nel for each quindi LI puntato
        current.removeClass(clsTmp); //qua rimuovo la classe active open
    });
    // lo metto solo all'LI parent dell'elemento cliccato (perchè il click ce l'ho sul tag A del menu e non sull'LI)
    liTmp.last().addClass(clsTmp);

    ajaxpage(cg_BaseUrl + '/page/view/' + view + '.tpl.php', 'ph-main', view, schema);
}


function OnSubmitAjaxLogin() {
    //Luke 09/04/2020

    let frm = $('#login_form');
    frm.submit(function (ev)
    //var btnLogin = $('#btnLogin');
    //btnLogin.click(function (ev)
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


function OnClickbtnSchedaIsolamento(pIdDtb) {
    //Luke 24/09/2020

    let btnClick = $('#btnSaveOspitiParametri');
    btnClick.click(function (ev) {

        //Controllo che tutti i campi/testo siano valorizzati
        let txtTemp = $('#txtTemperatura');
        let txtSat = $('#txtSaturazione');
        let txtOss = $('#txtOssigeno');
        let num;
        var idOspite= $('#idOspite').val();
        var schema= $('#schema').val();
        var objData;
        var dToday = new Date();
        var dtb= $('#' + pIdDtb).DataTable();
        let controllaParam = {};


        var jwt = localStorage.getItem('jwt');

        num = txtTemp.val();
        num = Number(num);
        if (isNaN(num) || txtTemp.val()=="") {
            txtTemp.last().addClass("is-invalid");
            return;
        } else {
            txtTemp.removeClass("is-invalid");
            txtTemp.last().addClass("is-valid");
        }

        num = txtSat.val();
        num = Number(num);
        if (isNaN(num) || txtSat.val()=="") {
            txtSat.last().addClass("is-invalid");
            return;
        } else {
            txtSat.removeClass("is-invalid");
            txtSat.last().addClass("is-valid");
        }

        num = txtOss.val();
        num = Number(num);
        if (isNaN(num) || txtOss.val()=="") {
            txtOss.last().addClass("is-invalid");
            return;
        } else {
            txtOss.removeClass("is-invalid");
            txtOss.last().addClass("is-valid");
        }

        objData = {
            "ID_OSPITE" : idOspite,
            "temperatura_num" : txtTemp.val(),
            "temperatura" : txtTemp.val(),
            "saturazione" : txtSat.val(),
            "ossigeno" : txtOss.val(),
            "fTosseSecca" : $('#chkTosse').is(":checked"),
            "fDolMusc" : $('#chkDolori').is(":checked"),
            "fMaleTesta" : $('#chkMaleTesta').is(":checked"),
            "fRinorrea" : $('#chkRinorrea').is(":checked"),
            "fMaleGola" : $('#chkMalDiGola').is(":checked"),
            "fAstenia" : $('#chkAstenia').is(":checked"),
            "fInappetenza" : $('#chkInappetenza').is(":checked"),
            "fVomito" : $('#chkVomito').is(":checked"),
            "fDiarrea" : $('#chkDiarrea').is(":checked"),
            "fCongiuntivite" : $('#chkCongiuntivite').is(":checked"),
            "fNoAlteraz" : $('#chkNoAlteraz').is(":checked"),
            "Altro" :  $('#cmbZona').val() + " -> altro:" + $('#txtAltro').val(),
            "idZona" : "1",
            "dataRilevazione": GetDateFormat(dToday),
            "DtIns": GetDateFormat(dToday)
        }

        controllaParam = CheckParamInserted(objData);
        if (controllaParam.save==true){
            var paramSend = JSON.stringify({
                'jwt': jwt,
                'dbschema': schema,
                'dataSchIso': objData,
                'controllaParam': controllaParam
            });

            $.ajax({
                type: "POST",
                url: cg_BaseUrl + '/api/schIsolamento/create.php',
                async: true,
                data: paramSend,
                dataType: "json",
                success: function (res) {
                    let jResponse = res;
                    localStorage.setItem('jwt', jResponse.jwt); //aggiorno il token nel localstorage

                    dtb.rows().every( function () {
                            var r = this.data();
                            if (r.ID_OSPITE == idOspite) {
                                //console.log(r);
                                r.DATA_ORA_ULTIMI =  dToday;
                            }
                            this.invalidate();
                        }
                    )
                    dtb.draw();

                    //Visualizzo la conferma dell'inserimento
                    var html = msgSuccess("Salvataggio avvenuto con successo!", jResponse.message.replace('OSPITE', $('#nomeOspite').val()));
                    $("#response").show();
                    document.getElementById('response').innerHTML = html;
                    setTimeout(function () {$("#response").hide();} , 2000);
                    //Nascondo la modale
                    $('#modalSchIsolamento').modal('hide');

                },

                error: function (jqXHR) {
                    console.log(jqXHR);
                    alert('errori nel salvataggio');
                    var jResponse = JSON.parse(jqXHR.responseText);
                    alert("scrittura non riuscita " + jResponse);
                    var html = msgAlert(jResponse.error, jResponse.message);
                    document.getElementById('response').innerHTML = html;
                }
            });
        }

    });

    //Controlla i valori inseriti e se necessario chiedee se inviare la segnalazione alla inf
    function CheckParamInserted(pData) {
        //Luke 07/12/2020

        let conf;
        let chiediConf;
        let confirmSave;
        let retObj = {};

        chiediConf = false;
        confirmSave = true;

        if (pData.temperatura_num >= 37.5) {chiediConf = true;}
        if (pData.saturazione < 95) {chiediConf = true;}
        if (pData.fTosseSecca == true) {chiediConf = true;}
        if (pData.fDolMusc== true) {chiediConf = true;}
        if (pData.fMaleTesta== true) {chiediConf = true;}
        if (pData.fRinorrea == true) {chiediConf = true;}
        if (pData.fMaleGola == true) {chiediConf = true;}
        if (pData.fAstenia == true) {chiediConf = true;}
        if (pData.fInappetenza == true) {chiediConf = true;}
        if (pData.fVomito == true) {chiediConf = true;}
        if (pData.fDiarrea == true) {chiediConf = true;}
        if (pData.fCongiuntivite == true) {chiediConf = true;}

        if (chiediConf == true) {
            conf = confirm("ATTENZIONE, i parametri inseriti devono essere segnalati, procedere con il salvataggio e successiva segnalazione all'infermiera? \n(verrà creata una nota a diario nella cartella clinica)");
            if (conf == false) {
                conf = confirm("ATTENZIONE, Salvare lo stesso i dati, SENZA segnalarli all'infermiera?");
                if (conf==false) {
                    confirmSave = false;
                } else {
                    confirmSave = true;
                    chiediConf = false;
                }
            } else {
                confirmSave = true;
            }
        }

        retObj['segnala'] = chiediConf;
        retObj['save'] = confirmSave;

        return retObj;

    }

    let btn3 = $('#btnRefreshDtpOspitiParametri');
    btn3.click(function (ev) {
        //faccio il refresh della griglia per l'inserimento dei parametri
        var paramSend = {};
        paramSend['Schema'] = $('#schema').val();
        paramSend['Piano'] = $('#paramPiano').val();
        paramSend['Camera'] = $('#paramCamera').val()=='' ? -1: $('#paramCamera').val() ;
        paramSend['Sezione'] = $('#paramSezione').val();
        LoadDatatables('tableOspitiParametri', paramSend);
    });


    let btn2 = $('#btnRefreshAnomalie');
    btn2.click(function (ev) {
        //faccio il refresh della griglia delle anomalie
        var paramSend = {};
        paramSend['Schema'] = $('#schema').val();
        paramSend['DataDal'] = $('#dtpDataDal').val();
        paramSend['DataAl'] = $('#dtpDataAl').val();
        paramSend['paramTemp'] = $('#paramTemp').val();
        paramSend['paramSat'] = $('#paramSat').val();
        LoadDatatables('tableAnomalieOspiti', paramSend);
    });

    var prev_dataDal;
    let dtpDataDal = $('#dtpDataDal');
    dtpDataDal.focus(function(){prev_dataDal = $(this).val();}).change(function (ev) {
        $(this).unbind('focus');
        let dtpAl = $('#dtpDataAl').val();
        if (ev.target.value > dtpAl) {
            alert("Data iniziale maggiore di quella finale!");
            $(this).val(prev_dataDal);
            $(this).bind('focus');
            return false
        } else {
            prev_dataDal = $(this).val();
        }
    });

    var prev_dataAl;
    let dtpDataAl = $('#dtpDataAl');
    dtpDataAl.focus(function(){prev_dataAl = $(this).val();}).change(function (ev) {
        $(this).unbind('focus');
        let dtpDal = $('#dtpDataDal').val();
        if (ev.target.value < dtpDal) {
            alert("Data finale minore di quella iniziale!");
            $(this).val(prev_dataAl);
            $(this).bind('focus');
            return false
        } else {
            prev_dataAl = $(this).val();
        }
    });

    $(":checkbox").change(function() {
        if(this.id == "chkNoAlteraz") {
            if(this.checked) {
                document.getElementById('chkTosse').checked =false;
                document.getElementById('chkDolori').checked =false;
                document.getElementById('chkMaleTesta').checked =false;
                document.getElementById('chkRinorrea').checked =false;
                document.getElementById('chkMalDiGola').checked =false;
                document.getElementById('chkAstenia').checked =false;
                document.getElementById('chkInappetenza').checked =false;
                document.getElementById('chkVomito').checked =false;
                document.getElementById('chkDiarrea').checked =false;
                document.getElementById('chkCongiuntivite').checked =false;
                document.getElementById('chkDiarrea').checked =false;
            }
        } else {
            document.getElementById('chkNoAlteraz').checked =false;
        }

    });




}




// <editor-fold desc="Funzioni comuni - HELPERS" defaultstate="collapsed">
/**
 * Questa funzione restituisce la data formattata YYYY-MM-DD
 *
 * @param {type} pData se non è stata specificata, carica la data di oggi.
 * @returns {String}
 */
function GetDateFormat(pData) {
    //Luke 17/06/2020
    var data;
    var gg, mm, aaaa;

    if (pData) {
        data = pData;
    } else {
        data = new Date();
    }

    gg = data.getDate();
    mm = data.getMonth() + 1;
    aaaa = data.getFullYear();

    return aaaa + '-' + mm + '-' + gg;
}

function GetDateString() {
    //luke 07/05/2020

    var data = new Date();
    var set, gg, mm, aaaa, h, m, s;
    //Crea la tabella dei mesi
    var mesi = new Array();
    mesi[0] = "Gennaio";
    mesi[1] = "Febbraio";
    mesi[2] = "Marzo";
    mesi[3] = "Aprile";
    mesi[4] = "Maggio";
    mesi[5] = "Giugno";
    mesi[6] = "Luglio";
    mesi[7] = "Agosto";
    mesi[8] = "Settembre";
    mesi[9] = "Ottobre";
    mesi[10] = "Novembre";
    mesi[11] = "Dicembre";
    //Crea la tabella dei giorni della settimana
    var giorni = new Array();
    giorni[0] = "Domenica";
    giorni[1] = "Lunedì";
    giorni[2] = "Martedì";
    giorni[3] = "Mercoledì";
    giorni[4] = "Giovedì";
    giorni[5] = "Venerdì";
    giorni[6] = "Sabato";
    //Estrae dalla tabella il giorno della settimana
    set = giorni[data.getDay()] + " ";
    gg = data.getDate() + " ";
    //Estrae dalla tabella il mese
    mm = mesi[data.getMonth()] + " ";
    aaaa = data.getFullYear() + " ";
    h = data.getHours() + ":";
    m = data.getMinutes() + ":";
    s = data.getSeconds();
    return "Oggi è " + set + gg + mm + aaaa + "";

}

// jquery extend function
$.extend(
    {
        redirectPost: function (location, args)
        {
            var form = '';
            $.each(args, function (key, value) {
                value = value.split('"').join('\"');
                form += '<input type="hidden" name="' + key + '" value="' + value + '">';
            });
            $('<form action="' + location + '" method="POST">' + form + '</form>').appendTo($(document.body)).submit();
        }
    });

// function to make form values to json format
$.fn.serializeObject = function () {

    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


function msgAlert(pTitle, pMessage) {
    //Luke 23/06/2020
    var html;

    html = '<div class="alert border-danger bg-transparent text-secondary fade show" role="alert">\n'
        + '   <div class="d-flex align-items-center"> \n'
        + '       <div class="alert-icon"> \n'
        + '           <span class="icon-stack icon-stack-md"> \n'
        + '               <i class="base-7 icon-stack-3x color-danger-900"></i> \n'
        + '               <i class="fal fa-times icon-stack-1x text-white"></i> \n'
        + '           </span> \n'
        + '       </div> \n'
        + '       <div class="flex-1"> \n'
        + '            <span class="h5 color-danger-900">' + pTitle + '</span> \n'
        + '           <br> \n'
        + '          ' + pMessage + ' \n'
        + '       </div> \n'
        + '   </div> \n'
        + '</div> \n';

    return html;
}

function msgSuccess(pTitle, pMessage) {
    //Luke 23/06/2020
    var html;

    html = '<div class="alert border-faded bg-transparent text-secondary fade show" role="alert">\n'
        + '   <div class="d-flex align-items-center"> \n'
        + '       <div class="alert-icon"> \n'
        + '           <span class="icon-stack icon-stack-md"> \n'
        + '               <i class="base-7 icon-stack-3x color-success-600"></i> \n'
        + '               <i class="fal fa-check icon-stack-1x text-white"></i> \n'
        + '           </span> \n'
        + '       </div> \n'
        + '       <div class="flex-1"> \n'
        + '            <span class="h5 color-success-600">' + pTitle + '</span> \n'
        + '           <br> \n'
        + '          ' + pMessage + ' \n'
        + '       </div> \n'
        + '   </div> \n'
        + '</div> \n';

    return html;
}

function DatetoDesc(data){
    //Luke 02/10/2020
    moment.locale('it');
    moment.updateLocale("it", {
        invalidDate: ""
    });
    return moment(data).calendar( null, {
        sameDay: '[Oggi alle] HH:mm',
        nextDay: '[Domani]',
        nextWeek: 'dddd',
        lastDay: '[Ieri alle] HH:mm',
        lastWeek: 'DD/MM/YYYY HH:mm',
        sameElse: 'DD/MM/YYYY'
    });
}

function roundTo(n, digits) {
    if (digits === undefined) {
        digits = 0;
    }

    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    return Math.round(n) / multiplicator;
}

/**
 * Aggiunge l'elemento ajax.loader usato per il caricamento durante le chiamate ajax
 * @param pIdTag
 * @constructor
 */
function AddWait(pIdTag){
    //Luke 07/01/2021

    if ($('#wait').length != 0) {
        return true
    }

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

}

// </editor-fold>
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





