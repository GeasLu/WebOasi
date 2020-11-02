function OnClickbtnSaveOspitiParametri(pIdDtb) {
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

        var jwt = localStorage.getItem('jwt');

        if (txtTemp.val()=="") {
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

        var paramSend = JSON.stringify({
            'jwt': jwt,
            'dbschema': schema,
            'dataSchIso': objData
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
                            console.log(r);
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
                var jResponse = JSON.parse(jqXHR.responseText);
                var html = msgAlert(jResponse.error, jResponse.message);
                document.getElementById('response').innerHTML = html;
            }
        });

    });

}