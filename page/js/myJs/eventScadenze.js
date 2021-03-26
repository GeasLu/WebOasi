function eventScadenze(pIdCalendar) {
    //Luke 15/02/2021
    //Qua inserisco tutta la gestione degli eventi delle scadenze

    //$('#tabRicorrenzaMain').hide()

    let btnRicorrenza = $('#btnRicorrenza');
    btnRicorrenza.on('click', function (e){
        // Luke 24/02/2021

        ResetHiddenRicorrenze();
        $('#modalRicorrenza').modal({backdrop: false});

    });

    let cmdSaveRicorrenza = $('#cmdSaveRicorrenza');
    cmdSaveRicorrenza.on('click', function (e){
        // Luke 24/02/2021

        var tabSelect =  $("#tabMainRicorrenza .active");
        var ret = {};
        let bClose = true;

        switch (tabSelect[0].id) {
            case 'tabSingoloMain':
                ret = CtrlSaveTabSingolo();
                if (!ret.result){
                    alert(ret.message);
                    bClose = false;
                } else {
                    console.log(ret);
                    var data = $("#dtpDataEventoSingolo");
                    var OraI = $("#timeDalle");
                    var OraF = $("#timeAlle");

                    var str=data.val()+' '+OraI.val()+':00'; var dI = new Date(str);
                        str=data.val()+' '+OraF.val()+':00'; var dF = new Date(str);

                    document.getElementById('btnRicorrenza').innerHTML = 'Occorre -> ' + GetDateFormat(dI,true) + ' dalle ' + OraI.val() + ' alle ' + OraF.val()
                    document.getElementById('htipoRic').value = "SINGOLO";
                    document.getElementById('hSTART_TIME').value = data.val()+' '+OraI.val()+':00';
                    document.getElementById('hEND_C').value = true;
                    document.getElementById('hEND_C_END').value = data.val()+' '+OraF.val()+':00';

                    bClose = true;
                }

                //ret= SaveRic
               /* if (!ret.result){
                    // in caso vada male
                } else {
                    //Salvataggio ok!
                }*/
                break;

            case 'tabRicorrenzaMain':
                break;
        }
        if (bClose) {
            $('#modalRicorrenza').modal('hide');
        }

    });

    function ResetHiddenRicorrenze(){
        //Luke 16/03/2021

        document.getElementById('btnRicorrenza').innerHTML = 'Premi QUI per programmare l\'evento...';
        document.getElementById('htipoRic').value = "SINGOLO";
        document.getElementById('hSTART_TIME').value = "";
        document.getElementById('hEND_A').value = true;
        document.getElementById('hEND_C').value = false;
        document.getElementById('hEND_C_END').value = "";
        document.getElementById('hNum_GG').value = -1;
        document.getElementById('hNum_SETT').value = -1;
        document.getElementById('hNum_MESI').value = -1;
        document.getElementById('hGg_ORD').value = 'Primo/a';
        document.getElementById('hGg_SETT').value = 'Lunedì';
        document.getElementById('hNum_ANNO').value = 1;
        document.getElementById('hMese').value = "Gennaio";
        document.getElementById('hGg').value = 1;

    }

    function CreaEventoSingolo(){
        //Luke 16/03/2021

/*  document.getElementById('btnRicorrenza').innerHTML = 'Occorre -> ' + GetDateFormat(dI,true) + ' dalle ' + OraI.val() + ' alle ' + OraF.val()
    document.getElementById('hTipoRic').value = "SINGOLO";
    document.getElementById('hSTART_TIME').value = dI;
    document.getElementById('hEND_C').value = true;
    document.getElementById('hEND_C_END').value = dF;*/

        var schema= $('#schema').val();
        var objData;
        var dToday = new Date();
        var classCSS = $("radio .active"); ;

        var jwt = localStorage.getItem('jwt');
        objData = {
            "hTipoRic" : 'SINGOLO',
            "hSTART_TIME" : $('#hSTART_TIME').val(),
            "hEND_C" : $('#hEND_C').val(),
            "hEND_C_END" : $('#hEND_C_END').val(),
            "evento" : $('#txtScEventoTitolo').val(),
            "evento_esteso" : $('#txtScEventoDesc').val(),
            "classCSS" : $("input[type='radio'][name='optCol']:checked").val()
        };

        var paramSend = JSON.stringify({
            'jwt': jwt,
            'dbschema': schema,
            'datiEvento': objData
        });

        $.ajax({
            type: "POST",
            url: cg_BaseUrl + '/api/eventi/createS.php',
            async: true,
            data: paramSend,
            dataType: "json",
            success: function (res) {
                let jResponse = res;
                localStorage.setItem('jwt', jResponse.jwt); //aggiorno il token nel localstorage

                //Visualizzo la conferma dell'inserimento
                var html = msgSuccess("Salvataggio avvenuto con successo!", jResponse.message);
                $("#response").show();
                document.getElementById('response').innerHTML = html;
                setTimeout(function () {$("#response").hide();} , 2000);
                //Nascondo la modale
                $('#modalSchIsolamento').modal('hide');

            },

            error: function (jqXHR) {
                console.log(jqXHR);
                alert('errori nel salvataggio');
                var jResponse = JSON.parse(jqXHR.responseText);
                alert("scrittura non riuscita " + jResponse);
                var html = msgAlert(jResponse.error, jResponse.message);
                document.getElementById('response').innerHTML = html;
            }
        });

    }

    function CreaRicorrenza(){
        //Luke 16/03/2021




    }

    function CtrlSaveTabSingolo(){
        //Luke 24/02/2021
        let dtpObj = new Date($('#dtpDataEventoSingolo').val());
        let oraStart = $('#timeDalle').val();
        let oraEnd = $('#timeAlle').val();
        //new Date(year, month, day, hours, minutes, seconds, milliseconds)

        let dtpStart = new Date(dtpObj.getFullYear(), dtpObj.getMonth(),dtpObj.getDay(),oraStart.substring(0,2), oraStart.substring(3,5));
        let dtpEnd = new Date(dtpObj.getFullYear(), dtpObj.getMonth(),dtpObj.getDay(),oraEnd.substring(0,2), oraEnd.substring(3,5));

        //console.log(oraStart);
        //console.log(oraEnd);

        if (isNaN(dtpObj.valueOf())) {
            return {
                result : false,
                message : 'Data non impostata o data non valida!'
            };
        };

        if (!oraStart || !oraEnd){
            return {
                result : false,
                message : 'Ora mancante!'
            };
        };

        if (dtpStart > dtpEnd){
            return {
                result : false,
                message : 'Ora inizio superiore all\'ora fine!'
            };
        };

         return {
             result : true,
             message : 'Dati OK!'
         };

    }

    let btnClick = $('#cmdSaveEvent');
    btnClick.click(function (ev) {

        var idEvent= $('#idEvento').val(); //se vale -1, significa che è in inserimento... altrimenti è l'id evento in modific
        var tipoRic = $('#htipoRic').val();

        if (idEvent>-1) {
            //modifica
            if (tipoRic == 'SINGOLO'){
                //ModificaEventoSingolo()
            } else {
                //ModificaRicorrenza()
            }
        }else{
            //Inserimento
            if (tipoRic == 'SINGOLO'){
                CreaEventoSingolo()
            } else {
                CreaRicorrenza()
            }
        }

    });

}
