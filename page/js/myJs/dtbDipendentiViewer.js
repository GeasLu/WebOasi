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

