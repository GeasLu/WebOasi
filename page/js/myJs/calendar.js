/**
 * Funzione per il caricamente del calendario utente
 * @param {type} pDataInizio devono essere formato Date, vengono trasformate in stringa successivamente
 * @param {type} pDataFine
 * @returns {undefined}
 */
function LoadCalendar(pIdCalendar, pDataInizio, pDataFine, pView, pSchema) {
    //Luke 07/05/2020
    //note: Se non vengono specificate le date da estrapolare dal model , prendo 5 mesi indietro e 5 mesi avanti da oggi

    var dtFilterIniz;
    var dtFilterFine;
    var elnEventi;
    var jwt = localStorage.getItem('jwt');

    if (pDataInizio) {
        dtFilterIniz = pDataInizio;
    } else {
        let dToday = new Date();
        //dtFilterIniz = new Date(dToday.getFullYear(), dToday.getMonth()-1, 1)
        dToday.setDate(1);
        dtFilterIniz = new Date(dToday.setMonth(dToday.getMonth()-5));
    }
    if (pDataFine) {
        dtFilterFine = pDataFine;
    } else {
        let dToday = new Date();
        dToday.setDate(0);
        //dtFilterFine = new Date(dToday.getFullYear(), dToday.getMonth() + 1, 0)
        dtFilterFine = new Date(dToday.setMonth(dToday.getMonth()+5));
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
                        start: elnEventi[eT].elnEventiDet[eD].dataOccorrenzaInizio,
                        end: elnEventi[eT].elnEventiDet[eD].dataOccorrenzaFine,
                        description: elnEventi[eT].evento_esteso,
                        className: elnEventi[eT].classCSS
                    };
                    arrEvents.push(eV);
                }
            }

            var calendarEl;
            if (pIdCalendar){
                //alert (1);
                calendarEl = FullCalendar.Calendar(pIdCalendar).destroy();
                calendarEl =pIdCalendar;
            } else {
                //alert (2);
                calendarEl = document.getElementById('calendar');
            }

            var calendar = new FullCalendar.Calendar(calendarEl,
                {
                    plugins: ['dayGrid', 'list', 'timeGrid', 'interaction', 'bootstrap'],
                    themeSystem: 'bootstrap',
                    timeZone: 'UTC',
                    locale: 'it', // the initial locale. of not specified, uses the first one
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
                        document.getElementById('idEvento').value =  idEv;

                        LoadDatatables('tableDipendentiViewer', { idEvento: idEv } );
                        LoadDatatables('tableAllegatiEvento', { idEvento: idEv} );

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
                                            "<small class=\"m-0 text-muted mb-2\"> \n" +
                                            "per aggiungere una ricorrenza, cliccare su \"RICORRENZA\" \n" +
                                            "</small>";
                                        document.getElementById('lblTitleModalScadenze').innerHTML = html;
                                        document.getElementById('txtScEventoTitolo').value="";
                                        document.getElementById('txtScEventoDesc').value="";
                                        document.getElementById('idEvento').value =  -1;

                                        LoadDatatables('tableDipendentiViewer', { idEvento: "1"} );
                                        LoadDatatables('tableAllegatiEvento', { idEvento: "1"} );

                                        $('#modalEvento').modal({backdrop: false});

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
            eventScadenze(calendar, pView, pSchema);

        },
        error: function (jqXHR) {
            var jResponse = JSON.parse(jqXHR.responseText);
            var html = msgAlert(jResponse.error, jResponse.message);
            document.getElementById('response').innerHTML = html;
        }
    });


}

