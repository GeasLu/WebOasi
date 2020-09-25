function LoadDtbOspitiParametri(pIdDataTable, pParamSend){
    //Luke 15/09/2020

    var elnOspParam;
    var dtb;

    $('#' + pIdDataTable).on('click', 'tbody td', function () {

        var cellIndex = dtb.cell(this).index();
        var rowData = dtb.row(this).data();
        var colInd =  cellIndex.column;

        //qua cerca l'indice dell'elemento nell'array...
        let indOsp = elnOspParam.map(function (e) {return e.ID_OSPITE}).indexOf(rowData.ID_OSPITE);

        if (indOsp>-1) {
            let html= '<h4 class="modal-title" id="lblTitleModalParametri"> \n'
                    + '     Inserimento parametri per '  + rowData.OSPITE + '\n'
                    + '     <small class="m-0 text-muted" > \n'
                    + '      Ultimi parametri rilevati: Oggi, alle 9:30 \n'
                    + '     </small> \n'
                    + '</h4>';
            document.getElementById('lblTitleModalParametri').innerHTML = html;

            $('#modalSchIsolamento').modal({backdrop: false});

        } else {
            //Avviso che non è stato trovato
            var html = msgAlert("Ospite non trovato!", "Manca nelle elenco Ospiti Paramatri ");
            $("#response").show();
            document.getElementById('response').innerHTML = html;
            setTimeout(function () {
                $("#response").hide();
            } , 10000);
        }

    });

    $.ajax({
        type: "POST",
        url: cg_BaseUrl + '/api/Ospiti/readOspitiParametri.php',
        async: true,
        data: pParamSend,
        dataType: "json",
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
                        columns: [
                            {
                                data: "ID_OSPITE",
                                title : 'ID_OSPITE',
                                visible : false
                            },
                            {
                                data: "OSPITE",
                                title : 'Ospite',
                                visible : true
                            },
                            {
                                data: "NUM_LETTO",
                                title : 'Letto',
                                visible : false
                            },
                            {
                                data: "NUM_CAMERA",
                                title : 'Camera',
                                visible : true
                            },
                            {
                                data: "PIANO",
                                title : 'Piano',
                                visible : true
                            },
                            {
                                data: 'SEZIONE',
                                title : 'Sezione',
                                visible : true
                            }
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

