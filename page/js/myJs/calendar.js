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
            let jResponse = res;
            localStorage.setItem('jwt', jResponse.jwt); //aggiorno il token nel localstorage
            elnEventi = jResponse.eventi;
            // Carico i dati in un array di Elementi events le cui proprietà sono definite nalla documentazione del fullcalendar
            let eT, eD;
            var arrEvents = [];
            for (eT in elnEventi) {
                for (eD in elnEventi[eT].elnEventiDet) {
                    let eV = {
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
                        let idEv = info.event.extendedProps.idEvento;
                        let html = "Modifica evento... \n" +
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

                                        let html = "Aggiungi evento... \n" +
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

