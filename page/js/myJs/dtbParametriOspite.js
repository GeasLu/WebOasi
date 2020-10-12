function LoadDtbParametriOspite(pIdDataTable, pParamSend){
    //Luke 08/10/2020

    $.ajax({
        type: "POST",
        url: cg_BaseUrl + '/api/Ospiti/readParametriOspite.php',
        async: true,
        data: pParamSend,
        dataType: "json",
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
                                data: "temperatura",
                                title : 'Temperatura',
                                visible : true
                            },
                            {// 4
                                data: "saturazione",
                                title : 'Saturazione',
                                visible : true
                            },
                            {// 5
                                data: "ossigeno",
                                title : 'Ossigeno',
                                visible : true
                            },
                            {// 6
                                data: 'fTosseSecca',
                                title : 'Tosse Secca',
                                visible : true
                            },
                            {// 7
                                data: "fDolMusc",
                                title : 'Dolori Muscolari',
                                visible : true
                            },
                            {// 8
                                data: "fMaleTesta",
                                title : 'Mal di Testa',
                                visible : true
                            },
                            {// 9
                                data: "fRinorrea",
                                title : 'Rinorrea',
                                visible : true
                            },
                            {// 10
                                data: "fMaleGola",
                                title : 'Mal di Gola',
                                visible : true
                            },
                            {// 11
                                data: "fAstenia",
                                title : 'Astenia',
                                visible : true
                            },
                            {// 12
                                data: "fInappetenza",
                                title : 'Inappetenza',
                                visible : true
                            },
                            {// 13
                                data: "fVomito",
                                title : 'Vomito',
                                visible : true
                            },
                            {// 14
                                data: "fDiarrea",
                                title : 'Diarrea',
                                visible : true
                            },
                            {// 15
                                data: "fCongiuntivite",
                                title : 'Congiuntivite',
                                visible : true
                            },
                            {// 16
                                data: "Altro",
                                title : 'Altro',
                                visible : true
                            },
                            {// 17
                                data: "USER_INS",
                                title : 'Inseriti da:',
                                visible : true
                            }
                        ],
                        dom: '"<\'row mb-3\'<\'col-sm-12 col-md-6 d-flex align-items-center justify-content-start\'f><\'col-sm-12 col-md-6 d-flex align-items-center justify-content-end\'B>>" +\n' +
                            '                        "<\'row\'<\'col-sm-12\'tr>>" +\n' +
                            '          <h4 class="modal-title" id="modalParametriOspite">              "<\'row\'<\'col-sm-12 col-md-5\'i><\'col-sm-12 col-md-7\'p>>"',
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
                                targets: [6,7,8,9,10,11,12,13,14,15],
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

