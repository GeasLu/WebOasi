function eventScadenze(pIdCalendar) {
    //Luke 15/02/2021
    //Qua inserisco tutta la gestione degli eventi delle scadenze

    var numEvtOggi=0;
    var numEvtMese=0;

    let btnRicorrenza = $('#btnRicorrenza');
    btnRicorrenza.on('click', function (e){
        // Luke 24/02/2021

        ResetHiddenRicorrenze();
        $('#modalRicorrenza').modal();

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
                if (!ret.result) {
                    alert(ret.message);
                    bClose = false;
                } else {
                    console.log(ret);
                    var data = $("#dtpDataEventoSingolo");
                    var OraI = $("#timeDalle");
                    var OraF = $("#timeAlle");

                    var str = data.val() + ' ' + OraI.val() + ':00';
                    var dI = new Date(str);
                    str = data.val() + ' ' + OraF.val() + ':00';
                    var dF = new Date(str);

                    document.getElementById('btnRicorrenza').innerHTML = 'Occorre -> ' + GetDateFormat(dI, true) + ' dalle ' + OraI.val() + ' alle ' + OraF.val()
                    document.getElementById('htipoRic').value = "SINGOLO";
                    document.getElementById('hSTART_TIME').value = data.val() + ' ' + OraI.val() + ':00';
                    document.getElementById('hEND_C').value = true;
                    document.getElementById('hEND_C_END').value = data.val() + ' ' + OraF.val() + ':00';

                    bClose = true;
                }
                break;

            case 'tabRicorrenzaMain':
                var tabSelRic = $("#tabRicorrenzaDett .active");

                var dataI = $("#dtpDataEventoIniz");
                var dataF = $("#dtpDataEventoFine");
                var OraI = $("#timeDalleRic");
                var OraF = $("#timeAlleRic");
                var opt;

                document.getElementById('hSTART_TIME').value = dataI.val();
                document.getElementById('hEND_C').value = true;
                document.getElementById('hEND_C_END').value = dataF.val();
                document.getElementById('hTimeDalleRic').value = OraI.val();
                document.getElementById('hTimeAlleRic').value = OraF.val();

                let tabSel = tabSelRic[0].id;
                switch (tabSel) {
                    case 'tabGiornalieroDett':
                        opt = $("input[type='radio'][name='optG']:checked")[0].id;
                        switch (opt) {
                            case 'optG1':
                                ret = CtrlSaveTabRic(tabSel, opt)
                                if (!ret.result) {
                                    alert(ret.message);
                                    bClose = false;
                                } else {
                                    document.getElementById('btnRicorrenza').innerHTML = 'Ogni ' + $("#txtG1").val() + ' giorni dal ' + GetDateFormat(new Date(dataI.val()), true) + ' al ' + GetDateFormat(new Date(dataF.val()), true) + ' tra le ' + OraI.val() + ' e ' + OraF.val();
                                    document.getElementById('htipoRic').value = "G1";
                                    document.getElementById('hNum_GG').value = $("#txtG1").val();
                                    bClose = true;
                                }
                                break;

                            case'optG2':
                                document.getElementById('btnRicorrenza').innerHTML = 'Ogni giorno feriale dal ' + GetDateFormat(new Date(dataI.val()), true) + ' al ' + GetDateFormat(new Date(dataF.val()), true) + ' tra le ' + OraI.val() + ' e ' + OraF.val();
                                document.getElementById('htipoRic').value = "G2";
                                bClose = true;
                                break;
                        }
                        break;

                    case 'tabSettimanaleDett':
                        ret = CtrlSaveTabRic(tabSel, '')
                        if (!ret.result) {
                            alert(ret.message);
                            bClose = false;
                        } else {
                            let s;
                            document.getElementById('btnRicorrenza').innerHTML = 'Nei giorni ' + GeneraStrGiorniRicSet() + ', ogni ' + $("#txtS1").val() + ' settimane, dal ' + GetDateFormat(new Date(dataI.val()), true) + ' al ' + GetDateFormat(new Date(dataF.val()), true) + ' tra le ' + OraI.val() + ' e ' + OraF.val();
                            document.getElementById('htipoRic').value = "S1";
                            document.getElementById('hNum_SETT').value = $("#txtS1").val();
                            s= DtoB($("#chkS1Lun").is(":checked")) + '' +DtoB($("#chkS1Mar").is(":checked")) + '' +DtoB($("#chkS1Mer").is(":checked")) + '' +DtoB($("#chkS1Giov").is(":checked")) + '' +DtoB($("#chkS1Ven").is(":checked")) + '' +DtoB($("#chkS1Sab").is(":checked")) + '' +DtoB($("#chkS1Dom").is(":checked"));
                            document.getElementById('hS1_gg_SETT').value = s;
                            bClose = true;
                        }
                        break;

                    case 'tabMensileDett':
                        opt = $("input[type='radio'][name='optM']:checked")[0].id;
                        switch (opt) {
                            case 'optM1':
                                ret = CtrlSaveTabRic(tabSel, opt)
                                if (!ret.result) {
                                    alert(ret.message);
                                    bClose = false;
                                } else {
                                    document.getElementById('btnRicorrenza').innerHTML = 'Il ' + $("#txtM1_NUM_GG").val() + '° giorno ogni ' + $("#txtM1_NUM_MESI").val() + ' mesi, dal ' + GetDateFormat(new Date(dataI.val()), true) + ' al ' + GetDateFormat(new Date(dataF.val()), true) + ' tra le ' + OraI.val() + ' e ' + OraF.val();
                                    document.getElementById('htipoRic').value = "M1";
                                    document.getElementById('hNum_GG').value = $("#txtM1_NUM_GG").val();
                                    document.getElementById('hNum_MESI').value = $("#txtM1_NUM_MESI").val();
                                    bClose = true;
                                }
                                break;

                            case'optM2':
                                ret = CtrlSaveTabRic(tabSel, opt)
                                if (!ret.result) {
                                    alert(ret.message);
                                    bClose = false;
                                } else {
                                    document.getElementById('btnRicorrenza').innerHTML = 'Ogni ' + $("#cmbM2_GG_ORD").val() + ' ' + $("#cmbM2_GG_SETT").val() + ', ogni ' + $("#txtM2_NUM_MESI").val() + ' mese/i dal ' +  GetDateFormat(new Date(dataI.val()), true) + ' al ' + GetDateFormat(new Date(dataF.val()), true) + ' tra le ' + OraI.val() + ' e ' + OraF.val();
                                    document.getElementById('htipoRic').value = "M2";
                                    document.getElementById('hGg_ORD').value = $("#cmbM2_GG_ORD").val();
                                    document.getElementById('hGg_SETT').value = $("#cmbM2_GG_SETT").val();
                                    document.getElementById('hNum_MESI').value = $("#txtM2_NUM_MESI").val();
                                    bClose = true;
                                }
                                break;
                        }
                        break;

                    case 'tabAnnualeDett':
                        opt = $("input[type='radio'][name='optA']:checked")[0].id;
                        switch (opt) {
                            case 'optA1':
                                ret = CtrlSaveTabRic(tabSel, opt)
                                if (!ret.result) {
                                    alert(ret.message);
                                    bClose = false;
                                } else {
                                    document.getElementById('btnRicorrenza').innerHTML = 'Ricorre ogni ' + $("#txtA_NUM_ANNO").val() + ' anno/i, in data ' + $("#txtA1_GG").val() + '/' + $("#cmbA1_MESE").val() + ',  dal ' + dataI.val() + ' al ' + dataF.val() + ' tra le ' + OraI.val() + ' e ' + OraF.val();
                                    document.getElementById('htipoRic').value = "A1";
                                    document.getElementById('hNum_ANNO').value = $("#txtA_NUM_ANNO").val();
                                    document.getElementById('hMese').value = $("#cmbA1_MESE").val();
                                    document.getElementById('hGg').value = $("#txtA1_GG").val();
                                    bClose = true;
                                }
                                break;

                            case 'optA2':
                                ret = CtrlSaveTabRic(tabSel, opt)
                                if (!ret.result) {
                                    alert(ret.message);
                                    bClose = false;
                                } else {
                                    document.getElementById('btnRicorrenza').innerHTML = 'Ricorre ogni ' + $("#txtA_NUM_ANNO").val() + ' anno/i, il ' + $("#cmbM2_GG_ORD").val() + ' ' + $("#cmbA2_GG_SETT").val() + ' di ' + $("#cmbA2_MESE").val() + ', dal ' + dataI.val() + ' al ' + dataF.val() + ' tra le ' + OraI.val() + ' e ' + OraF.val();
                                    document.getElementById('htipoRic').value = "A2";
                                    document.getElementById('hNum_ANNO').value = $("#txtA_NUM_ANNO").val();
                                    document.getElementById('hGg_ORD').value = $("#cmbA2_GG_ORD").val();
                                    document.getElementById('hGg_SETT').value = $("#cmbA2_GG_SETT").val();
                                    document.getElementById('hMese').value = $("#cmbA2_MESE").val();
                                    bClose = true;
                                }
                                break;
                        }


                        break;
                    default:
                        break;
                }
                break;
        }
        if (bClose) {
            $('#modalRicorrenza').modal('hide');
            $('#modalEvento').focus();
        }

    });

    function GeneraStrGiorniRicSet(){
        //Luke 23/04/2021

        var str= "";
        var checkboxes = document.getElementsByName('chkS1');

        for (var i=0, n=checkboxes.length;i<n;i++)
        {
            if (checkboxes[i].checked)
            {
                str += ", "+checkboxes[i].value;
            }
        }
        if (str) str = str.substring(1);

        return str;
    }

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

        var schema= $('#schema').val();
        var objData;
        //var dToday = new Date();

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
                $('#modalEvento').modal('hide');
                LoadCalendar(pIdCalendar);

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
        //Luke 03/05/2021

        var schema= $('#schema').val();
        var objData;

        var jwt = localStorage.getItem('jwt');
        objData = {
            "hTipoRic" : $('#htipoRic').val(),
            "hSTART_TIME" : $('#hSTART_TIME').val(),
            "hEND_C" : $('#hEND_C').val(),
            "hEND_C_END" : $('#hEND_C_END').val(),
            "evento" : $('#txtScEventoTitolo').val(),
            "evento_esteso" : $('#txtScEventoDesc').val(),
            "classCSS" : $("input[type='radio'][name='optCol']:checked").val()
        };

        switch ( $('#htipoRic').val()){
            case 'G1':
                objData.hNum_GG = $('#hNum_GG').val();
                break;
            case 'G2':
                // NESSUNA VARIABILE DA inviare
                break;
            case 'S1':
                objData.hNum_SETT = $('#hNum_SETT').val();
                objData.hS1_gg_SETT =$('#hS1_gg_SETT').val();
                break;
            case 'M1':
                objData.hNum_GG =$('#hNum_GG').val();
                objData.hNum_MESI =$('#hNum_MESI').val();
                break;
            case 'M2':
                objData = {
                    "hGg_ORD" :  $('#hGg_ORD').val(),
                    "hGg_SETT" :  $('#hGg_SETT').val(),
                    "hNum_MESI" :  $('#hNum_MESI').val()
                }
                break;
            case 'A1':
                objData.hNum_ANNO =$('#hNum_ANNO').val();
                objData.hMese =$('#hMese').val();
                objData.hGg =$('#hGg').val();
                break;
            case 'A2':
                objData.hNum_ANNO =$('#hNum_ANNO').val();
                objData.hGg_ORD =$('#hGg_ORD').val();
                objData.hGg_SETT =$('#hGg_SETT').val();
                objData.hMese =$('#hMese').val();
                break;
        }

        var paramSend = JSON.stringify({
            'jwt': jwt,
            'dbschema': schema,
            'datiEvento': objData
        });

        console.log(paramSend);
        alert('controlla parametri');

        $.ajax({
            type: "POST",
            url: cg_BaseUrl + '/api/eventi/createR.php',
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
                $('#modalEvento').modal('hide');
                LoadCalendar(pIdCalendar);

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

    function CtrlSaveTabRic(pTabSel, pOptSel){
        //Luke 22/04/2021

        let dtpI = new Date($('#dtpDataEventoIniz').val());
        let dtpF = new Date($('#dtpDataEventoFine').val());

        let oraStart = $('#timeDalleRic ').val();
        let oraEnd = $('#timeAlleRic').val();
        //new Date(year, month, day, hours, minutes, seconds, milliseconds)

        //let dtpStart = new Date(dtpI.getFullYear(), dtpI.getMonth(),dtpI.getDay());
        //let dtpEnd = new Date(dtpF.getFullYear(), dtpF.getMonth(),dtpF.getDay());

/*        console.log($('#dtpDataEventoIniz').val());
        console.log($('#dtpDataEventoFine').val());
        console.log(dtpI);
        console.log(dtpF);*/

        switch (pTabSel) {
            case 'tabGiornalieroDett':
                switch (pOptSel){
                    case 'optG1':
                        if ($('#txtG1').val()<=0)  {
                            return {
                                result : false,
                                message : 'Numero giorni mancante!'
                            };
                        };
                        break;

                    case'optG2':
                        break;
                }
                break;

            case 'tabSettimanaleDett':
                var checkedNum = $('input[name="chkS1"]:checked').length;
                //console.log(checkedNum);
                if (checkedNum==0) {
                    return {
                        result : false,
                        message : 'Selezionare almeno un giorno della settimana!'
                    };
                }
                if ($('#txtS1').val()<=0)  {
                    return {
                        result : false,
                        message : 'Numero Settimane errato deve essere Maggiore di 0!'
                    };
                };
                break;

            case 'tabMensileDett':
                switch (pOptSel){
                    case 'optM1':
                        if ($('#txtM1_NUM_GG').val()<=0)  {
                            return {
                                result : false,
                                message : 'Numero giorni a zero o inferiori no ammesso!'
                            };
                        };
                        if ($('#txtM1_NUM_MESI').val()<=0)  {
                            return {
                                result : false,
                                message : 'Numero MESI a zero o inferiori no ammesso!'
                            };
                        };
                        break;

                    case'optM2':
                        if ($('#txtM2_NUM_MESI').val()<=0)  {
                            return {
                                result : false,
                                message : 'Numero MESI a zero o inferiori no ammesso!'
                            };
                        };
                        break;
                }

                break;
            case 'tabAnnualeDett':
                if ($('#txtA_NUM_ANNO').val()<=0)  {
                    return {
                        result : false,
                        message : 'Numero ANNI a zero o inferiori no ammesso!'
                    };
                };
                switch (pOptSel){
                    case 'optA1':
                        if ($('#txtA1_GG').val()<=0)  {
                            return {
                                result : false,
                                message : 'Numero giorni a zero o inferiori no ammesso!'
                            };
                        };
                        break;

                    case'optA2':
                        break;
                }

                break;

        }

        if (isNaN(dtpI.valueOf())) {
            return {
                result : false,
                message : 'Data Inizio non impostata o data non valida!'
            };
        };
        if (isNaN(dtpF.valueOf())) {
            return {
                result : false,
                message : 'Data Inizio non impostata o data non valida!'
            };
        };


        if (!oraStart || !oraEnd){
            return {
                result : false,
                message : 'Ora mancante!'
            };
        };

        if (dtpI > dtpF){
            return {
                result : false,
                message : 'Data inizio superiore alla data fine!'
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

    function valorizzaContatori(pEvtOggi, pEvtMese){

        var schema= $('#schema').val();
        var objData;
        //var dToday = new Date();

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

}
