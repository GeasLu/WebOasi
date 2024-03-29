function LoadDtbPesiDettOspite(pIdDataTable, pParamSend){
    //Luke 04/10/2021

    $.ajax({
        type: "POST",
        url: cg_BaseUrl + '/api/Ospiti/readPesiDettOspite.php',
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
                    elnPesiDettOspite = jResponse.elnPesiDettOspite;

                    // risposta corretta e token valido
                    dtbAux =  $('#' + pIdDataTable).DataTable({
                        destroy: true,
                        responsive: true,
                        data : elnPesiDettOspite,
                        dataSrc : "elnPesiDettOspite",
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
                                data: "DATA_ORA",
                                title : 'Data Ora Inserimento',
                                visible : true
                            },
                            {// 4
                                data: 'VALORE1',
                                title : 'Ultimo Peso (Kg.)',
                                visible : true
                            },
                            {// 5
                                data: "VALORE2",
                                title : 'VALORE2.',
                                visible : false
                            },
                            {// 6
                                data: "IMC",
                                title : 'I.m.c.',
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

                                    var tmp;
                                    if (data){
                                        let y, m, d, h, min, sec;

                                        y = data.substr(0,4);
                                        m = data.substr(4,2);
                                        d = data.substr(6,2);
                                        h = data.substr(8,2);
                                        min = data.substr(10,2);
                                        //sec = data.substring(12,2);
                                        //tmp = d + '/' + m + '/' + y + ' ' + h + ':' + min
                                        tmp = y + '-' + m + '-' + d + 'T' + h + ':' + min + ':00'

                                        moment.locale('it');
                                        moment.updateLocale("it", {
                                            invalidDate: ""
                                        });

                                        tmp = moment(tmp).calendar( null, {
                                            sameDay: 'DD/MM/YYYY HH:mm',
                                            nextDay: '[Domani]',
                                            nextWeek: 'DD/MM/YYYY HH:mm',
                                            lastDay: 'DD/MM/YYYY HH:mm',
                                            lastWeek: 'DD/MM/YYYY HH:mm',
                                            sameElse: 'DD/MM/YYYY HH:mm'
                                        });

                                    } else {tmp = ''}

                                    return  tmp;
                                }
                            },
                            {
                                targets: [4,5],
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
                                targets: [6],
                                mRender: function(data, type)
                                {
                                    var num = data;
                                    if (num<3) {
                                        return '<span class="text-danger"> * </span>';
                                    } else if (num>=3 && num<19) {
                                        return '<span class="text-warning"> Sottopeso (' + roundTo(num,2) + ') </span>';
                                    } else if(num>=19 && num<25) {
                                        return '<span class="text-success"> Normopeso (' + roundTo(num,2) + ')  </span>';
                                    }else if(num>=25 && num<30) {
                                        return '<span class="text-danger"> Sovrappeso (' + roundTo(num,2) + ')  </span>';
                                    }else if(num>=30 ) {
                                        return '<span class="text-danger"> Obeso (' + roundTo(num,2) + ') </span>';
                                    }
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

}

