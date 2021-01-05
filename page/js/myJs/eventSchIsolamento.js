function OnClickbtnSchedaIsolamento(pIdDtb) {
    //Luke 24/09/2020

    let btnClick = $('#btnSaveOspitiParametri');
    btnClick.click(function (ev) {

        //Controllo che tutti i campi/testo siano valorizzati
        let txtTemp = $('#txtTemperatura');
        let txtSat = $('#txtSaturazione');
        let txtOss = $('#txtOssigeno');
        let num;
        var idOspite= $('#idOspite').val();
        var schema= $('#schema').val();
        var objData;
        var dToday = new Date();
        var dtb= $('#' + pIdDtb).DataTable();
        let controllaParam = {};


        var jwt = localStorage.getItem('jwt');

        num = txtTemp.val();
        num = Number(num);
        if (isNaN(num) || txtTemp.val()=="") {
            txtTemp.last().addClass("is-invalid");
            return;
        } else {
            txtTemp.removeClass("is-invalid");
            txtTemp.last().addClass("is-valid");
        }

        num = txtSat.val();
        num = Number(num);
        if (isNaN(num) || txtSat.val()=="") {
            txtSat.last().addClass("is-invalid");
            return;
        } else {
            txtSat.removeClass("is-invalid");
            txtSat.last().addClass("is-valid");
        }

        num = txtOss.val();
        num = Number(num);
        if (isNaN(num) || txtOss.val()=="") {
            txtOss.last().addClass("is-invalid");
            return;
        } else {
            txtOss.removeClass("is-invalid");
            txtOss.last().addClass("is-valid");
        }

        objData = {
            "ID_OSPITE" : idOspite,
            "temperatura_num" : txtTemp.val(),
            "temperatura" : txtTemp.val(),
            "saturazione" : txtSat.val(),
            "ossigeno" : txtOss.val(),
            "fTosseSecca" : $('#chkTosse').is(":checked"),
            "fDolMusc" : $('#chkDolori').is(":checked"),
            "fMaleTesta" : $('#chkMaleTesta').is(":checked"),
            "fRinorrea" : $('#chkRinorrea').is(":checked"),
            "fMaleGola" : $('#chkMalDiGola').is(":checked"),
            "fAstenia" : $('#chkAstenia').is(":checked"),
            "fInappetenza" : $('#chkInappetenza').is(":checked"),
            "fVomito" : $('#chkVomito').is(":checked"),
            "fDiarrea" : $('#chkDiarrea').is(":checked"),
            "fCongiuntivite" : $('#chkCongiuntivite').is(":checked"),
            "fNoAlteraz" : $('#chkNoAlteraz').is(":checked"),
            "Altro" :  $('#cmbZona').val() + " -> altro:" + $('#txtAltro').val(),
            "idZona" : "1",
            "dataRilevazione": GetDateFormat(dToday),
            "DtIns": GetDateFormat(dToday)
        }

        controllaParam = CheckParamInserted(objData);
        if (controllaParam.save==true){
            var paramSend = JSON.stringify({
                'jwt': jwt,
                'dbschema': schema,
                'dataSchIso': objData,
                'controllaParam': controllaParam
            });

            $.ajax({
                type: "POST",
                url: cg_BaseUrl + '/api/schIsolamento/create.php',
                async: true,
                data: paramSend,
                dataType: "json",
                success: function (res) {
                    let jResponse = res;
                    localStorage.setItem('jwt', jResponse.jwt); //aggiorno il token nel localstorage

                    dtb.rows().every( function () {
                            var r = this.data();
                            if (r.ID_OSPITE == idOspite) {
                                //console.log(r);
                                r.DATA_ORA_ULTIMI =  dToday;
                            }
                            this.invalidate();
                        }
                    )
                    dtb.draw();

                    //Visualizzo la conferma dell'inserimento
                    var html = msgSuccess("Salvataggio avvenuto con successo!", jResponse.message.replace('OSPITE', $('#nomeOspite').val()));
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

    });

    //Controlla i valori inseriti e se necessario chiedee se inviare la segnalazione alla inf
    function CheckParamInserted(pData) {
        //Luke 07/12/2020

        let conf;
        let chiediConf;
        let confirmSave;
        let retObj = {};

        chiediConf = false;
        confirmSave = true;

        if (pData.temperatura_num >= 37.5) {chiediConf = true;}
        if (pData.saturazione < 95) {chiediConf = true;}
        if (pData.fTosseSecca == true) {chiediConf = true;}
        if (pData.fDolMusc== true) {chiediConf = true;}
        if (pData.fMaleTesta== true) {chiediConf = true;}
        if (pData.fRinorrea == true) {chiediConf = true;}
        if (pData.fMaleGola == true) {chiediConf = true;}
        if (pData.fAstenia == true) {chiediConf = true;}
        if (pData.fInappetenza == true) {chiediConf = true;}
        if (pData.fVomito == true) {chiediConf = true;}
        if (pData.fDiarrea == true) {chiediConf = true;}
        if (pData.fCongiuntivite == true) {chiediConf = true;}

        if (chiediConf == true) {
            conf = confirm("ATTENZIONE, i parametri inseriti devono essere segnalati, procedere con il salvataggio e successiva segnalazione all'infermiera? \n(verrà creata una nota a diario nella cartella clinica)");
            if (conf == false) {
                conf = confirm("ATTENZIONE, Salvare lo stesso i dati, SENZA segnalarli all'infermiera?");
                if (conf==false) {
                    confirmSave = false;
                } else {
                    confirmSave = true;
                    chiediConf = false;
                }
            } else {
                confirmSave = true;
            }
        }

        retObj['segnala'] = chiediConf;
        retObj['save'] = confirmSave;

        return retObj;

    }

    let btn3 = $('#btnRefreshDtpOspitiParametri');
    btn3.click(function (ev) {
        //faccio il refresh della griglia per l'inserimento dei parametri
        var paramSend = {};
        paramSend['Schema'] = $('#schema').val();
        paramSend['Piano'] = $('#paramPiano').val();
        paramSend['Camera'] = $('#paramCamera').val()=='' ? -1: $('#paramCamera').val() ;
        paramSend['Sezione'] = $('#paramSezione').val();
        LoadDatatables('tableOspitiParametri', paramSend);
    });


    let btn2 = $('#btnRefreshAnomalie');
    btn2.click(function (ev) {
        //faccio il refresh della griglia delle anomalie
        var paramSend = {};
        paramSend['Schema'] = $('#schema').val();
        paramSend['DataDal'] = $('#dtpDataDal').val();
        paramSend['DataAl'] = $('#dtpDataAl').val();
        paramSend['paramTemp'] = $('#paramTemp').val();
        paramSend['paramSat'] = $('#paramSat').val();
        LoadDatatables('tableAnomalieOspiti', paramSend);
    });

    var prev_dataDal;
    let dtpDataDal = $('#dtpDataDal');
    dtpDataDal.focus(function(){prev_dataDal = $(this).val();}).change(function (ev) {
        $(this).unbind('focus');
        let dtpAl = $('#dtpDataAl').val();
        if (ev.target.value > dtpAl) {
            alert("Data iniziale maggiore di quella finale!");
            $(this).val(prev_dataDal);
            $(this).bind('focus');
            return false
        } else {
            prev_dataDal = $(this).val();
        }
    });

    var prev_dataAl;
    let dtpDataAl = $('#dtpDataAl');
    dtpDataAl.focus(function(){prev_dataAl = $(this).val();}).change(function (ev) {
        $(this).unbind('focus');
        let dtpDal = $('#dtpDataDal').val();
        if (ev.target.value < dtpDal) {
            alert("Data finale minore di quella iniziale!");
            $(this).val(prev_dataAl);
            $(this).bind('focus');
            return false
        } else {
            prev_dataAl = $(this).val();
        }
    });

    $(":checkbox").change(function() {
        if(this.id == "chkNoAlteraz") {
            if(this.checked) {
                document.getElementById('chkTosse').checked =false;
                document.getElementById('chkDolori').checked =false;
                document.getElementById('chkMaleTesta').checked =false;
                document.getElementById('chkRinorrea').checked =false;
                document.getElementById('chkMalDiGola').checked =false;
                document.getElementById('chkAstenia').checked =false;
                document.getElementById('chkInappetenza').checked =false;
                document.getElementById('chkVomito').checked =false;
                document.getElementById('chkDiarrea').checked =false;
                document.getElementById('chkCongiuntivite').checked =false;
                document.getElementById('chkDiarrea').checked =false;
            }
        } else {
            document.getElementById('chkNoAlteraz').checked =false;
        }

    });




}


