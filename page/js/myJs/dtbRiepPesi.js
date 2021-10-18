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
            case 'Dettaglio':
                html = '  <h4 class="modal-title" id="modalPesiDett"> \n'
                    + '     <img src="' + cg_PathImg + '/ospiti/' + rowData.ID_OSPITE + '.jpeg" alt=" nn -" class="profile-image rounded-circle" width="50" height="64" > \n'
                    + '     Dettaglio PESI inseriti per l\'ospite: ' + rowData.COGNOME + ' ' + rowData.NOME + ' \n'
                    + '  </h4>';
                document.getElementById('lblTitlePesiOspite').innerHTML = html;
                document.getElementById('idOspite').value = rowData.ID_OSPITE;
                document.getElementById('nomeOspite').value = rowData.COGNOME + ' ' + rowData.NOME;

                // aggiungo l'idospite
                var paramSend = {};
                paramSend = JSON.parse(pParamSend);
                paramSend['idOspite'] = rowData.ID_OSPITE;

                LoadDatatables('tablePesiDettOspite',paramSend);
                $("#PesiDett" ).sparkline('html' );

                $('#modalPesiDett').modal({backdrop: false});

                break;

            default:
                break;
        }
    });

    $('#' + pIdDataTable).on('page', 'tbody', function () {
        $(".sparkline" ).sparkline();
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
                        "fnDrawCallback": function( oSettings ) {
                            $(".sparkline" ).sparkline('html', {width: '70px', height: '30px'} );
                        },
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
                                data: "CHART",
                                title : 'Andatura',
                                visible : true
                            },
                            {// 9
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
                            },
                            {
                                targets: 8,
                                render: function(data, type, row, full)
                                {
                                    let str;

/*                                    str='<div class="ml-auto d-inline-flex align-items-center"> ' +
                                        '    <span class="sparkline d-inline-flex" sparktype="line" sparkheight="30" sparkwidth="70" sparklinecolor="#886ab5" sparkfillcolor="false" sparklinewidth="1" values="5,6,7,8,9,3,2,1"></span>' +
                                        '    <div class="d-inline-flex flex-column small ml-2">' +
                                        '        <span class="d-inline-block badge badge-success opacity-50 text-center p-1 width-6\">97%</span> ' +
                                        '        <span class="d-inline-block badge bg-fusion-300 opacity-50 text-center p-1 width-6 mt-1\">44%</span> ' +
                                        '     </div> ' +
                                        '</div>'*/
                                    //console.log(row);
                                    //console.log(data);
                                    //console.log('type:' + type);
                                    //str = '<div class="demo d-flex justify-content-center flex-wrap d-sm-block">'
                                    //str = str +  ' <div class="p-3 w-auto text-center d-inline-flex border-faded">';
                                    str= '<span id="sp' + row.ID_OSPITE + '" class="sparkline" sparktype="line" sparklinecolor="#886ab5" sparkfillcolor="#9acffa" sparklinewidth="1" values="' + data + '"></span>';
                                    //str= str + '</div>';
                                    //str= str + '</div>';

                                    if (type === 'display') {
                                        return str;
                                    }
                                    return data + 'ciao';
                                }
                            },
                            {
                                targets: 9,
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

}

