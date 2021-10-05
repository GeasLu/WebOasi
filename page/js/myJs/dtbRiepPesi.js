function LoadDtbRiepPesi(pIdDataTable, pParamSend){
    //Luke 04/10/2021



    $('#' + pIdDataTable).on('click', 'tbody td', function () {

        var cellIndex = dtb.cell(this).index();
        var rowData = dtb.row(this).data();
        var colInd =  cellIndex.column;
        var html;

        console.log(cellIndex);
        console.log(rowData);
        console.log(colInd);

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
                var paramSend = {};
                paramSend = JSON.parse(pParamSend);
                paramSend['idOspite'] = rowData.ID_OSPITE;
                //pParamSend['idOspite'] = rowData.ID_OSPITE;
                //pParamSend = JSON.stringify(pParamSend);

                LoadDatatables('tableParametriOspite',paramSend);

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
                    if ($('#txtSaturazione').val() != "") {document.getElementById('txtSaturazione').value="0";}

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
        url: cg_BaseUrl + '/api/Ospiti/readRiepPesi.php',
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
                    elnRiepPesi = jResponse.elnRiepPesi;

                    // risposta corretta e token valido
                    dtb =  $('#' + pIdDataTable).DataTable({
                        destroy: true,
                        responsive: true,
                        data : elnRiepPesi,
                        dataSrc : "elnRiepPesi",
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
                                data: "COGNOME",
                                title : 'COGNOME',
                                visible : true
                            },
                            {// 2
                                data: "NOME",
                                title : 'NOME',
                                visible : true
                            },
                            {// 3
                                data: "PIANO",
                                title : 'Piano',
                                visible : true
                            },
                            {// 4
                                data: "DATA_ORA",
                                title : 'Data Ora Inserimento',
                                visible : true
                            },
                            {// 5
                                data: 'VALORE1',
                                title : 'Ultimo Peso (Kg.)',
                                visible : true
                            },
                            {// 6
                                data: "VALORE2",
                                title : 'VALORE2.',
                                visible : false
                            },
                            {// 7
                                data: "IMC",
                                title : 'I.m.c.',
                                visible : true
                            },
                            {// 8
                                data: "DETT",
                                title : 'Dettaglio',
                                visible : true
                            }
                        ],
                        dom: '"<\'row mb-3\'<\'col-sm-12 col-md-6 d-flex align-items-center justify-content-start\'f><\'col-sm-12 col-md-6 d-flex align-items-center justify-content-end\'B l>>" +\n' +
                            '                        "<\'row\'<\'col-sm-12\'tr>>" +\n' +
                            '                        "<\'row\'<\'col-sm-12 col-md-5\'i><\'col-sm-12 col-md-7\'p>>"',
                        columnDefs:[

                            {
                                targets: 4,
                                render:function(data){

                                    var tmp;
                                    if (data){
                                        let y, m, d, h, min, sec;

                                        y = data.substr(0,4);
                                        m = data.substr(4,2);
                                        d = data.substr(6,2);
                                        h = data.substr(8,2);
                                        min = data.substr(10,2);
                                        //sec = data.substring(12,2);
                                        tmp = d + '/' + m + '/' + y + ' ' + h + ':' + min

                                     /*   moment.locale('it');
                                        moment.updateLocale("it", {
                                            invalidDate: ""
                                        });

                                        tmp = moment(tmp).calendar( null, {
                                            sameDay: '[Oggi alle] HH:mm',
                                            nextDay: '[Domani]',
                                            nextWeek: 'dddd',
                                            lastDay: '[Ieri alle] HH:mm',
                                            lastWeek: 'DD/MM/YYYY HH:mm',
                                            sameElse: 'DD/MM/YYYY'
                                        });*/

                                    } else {tmp = ''}

                                    return  tmp;
                                }
                            },
                            {
                                targets: [5,6],
                                mRender: function(data, type)
                                {
                                    var num = data;

                                    if (num > 99){
                                        return '<span class="text-danger">' + roundTo(num,1) + '</span>';
                                    } else {
                                        return  roundTo(num,1);
                                    }
                                }
                            },

                            {
                                targets: [7],
                                mRender: function(data, type)
                                {
                                    var num = data;
                                    if (num<19) {
                                        return '<span class="text-warning"> Sottopeso (' + roundTo(num,2) + ') </span>';
                                    } else if(num>=19 && num<25) {
                                        return '<span class="text-success"> Normopeso (' + roundTo(num,2) + ')  </span>';
                                    }else if(num>=25 && num<30) {
                                        return '<span class="text-danger"> Sovrappeso (' + roundTo(num,2) + ')  </span>';
                                    }else if(num>=30 ) {
                                        return '<span class="text-danger"> Obeso (' + roundTo(num,2) + ') </span>';
                                    }
                                }
                            },
                            {
                                targets: 8,
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

