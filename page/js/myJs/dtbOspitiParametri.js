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
            $('#wait').hide();
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
                        dom: '"<\'row mb-3\'<\'col-sm-12 col-md-6 d-flex align-items-center justify-content-start\'f><\'col-sm-12 col-md-6 d-flex align-items-center justify-content-end\'B>>" +\n' +
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
                    $('#wait').hide();
                    break;
            }
            ;
        },
        error:  function (jqXHR, exception) {
            //alert('error ajax startTmrCheckSession');
            // scrtivo messagi di sistema
            $('#wait').hide();

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

