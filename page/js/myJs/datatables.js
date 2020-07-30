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
    alert("stop");
    console.log(paramSend);
    paramSend = JSON.stringify(paramSend);

    switch (pIdDataTable) {
        case 'tableDipendentiViewer':
            var elnEventi;

            $.ajax({
                type: "POST",
                url: cg_BaseUrl + '//api//users//readEventViewer.php',
                async: true,
                data: paramSend,
                dataType: "json",
                success: function (res, textStatus, xhr) {
                    let jResponse = res;
                    switch (xhr.status) {
                        case 200:
                            //aggiorno il token nel localstorage
                            localStorage.setItem('jwt', jResponse.jwt);
                            elnEventi = jResponse.eventi;
                            // Carico i dati in un array di Elementi events le cui proprietà sono definite nalla documentazione del fullcalendar
                            /*         let eT, eD;
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
                                     }*/

                            // risposta corretta e token valido
                            $('#' + pIdDataTable).DataTable({
                                destroy: true,
                                responsive: true,
                                data : elnEventi,
                                dataSrc : "eventi",
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
                                        data: "NOME_UTENTE",
                                        title : 'Dipendente',
                                        visible : true
                                    },
                                    {
                                        data: "UTENTE",
                                        title : 'Utente',
                                        visible : true
                                    }
                                ],
                                columnDefs:[
                                    {
                                        targets: [3,4,5,6],
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
                            var html = alertMsg(jResponse.message_title, jResponse.message_body);
                            document.getElementById('response').innerHTML = html;
                            window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
                            break;
                    }
                    ;
                },
                error: function (jqXHR, exception) {
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
                    var html = alertMsg(jResponse.message_title, msg);
                    document.getElementById('response').innerHTML = html;
                }
            });
            break;

    }

}
