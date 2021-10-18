function OnClickbtnRiepPesi(pIdDtb) {
    //Luke 04/10/2021


    let btn3 = $('#btnRefreshRiepPesi');
    btn3.click(function (ev) {

        //faccio il refresh della griglia per l'inserimento dei parametri
        console.clear();
        var paramSend = {};
        paramSend['Schema'] = $('#schema').val();
        paramSend['DataDal'] = GetDateTimeFormat($('#dtpDataDalPesi').val(),1);
        paramSend['DataAl'] = GetDateTimeFormat($('#dtpDataAlPesi').val(),1);
        paramSend['Piano'] = $('#paramPianoPesi').val()=='' ? -1: $('#paramPianoPesi').val();
        paramSend['Camera'] = $('#paramCameraPesi').val()=='' ? -1: $('#paramCameraPesi').val() ;
        paramSend['Sezione'] = $('#paramSezionePesi').val();

        console.log(paramSend);
        //alert("esami dati pesi 2");
        LoadDatatables('tableRiepPesi', paramSend);
    });

    var prev_dataDal;
    let dtpDataDal = $('#dtpDataDalPesi');
    dtpDataDal.focus(function(){prev_dataDal = $(this).val();}).change(function (ev) {
        $(this).unbind('focus');
        let dtpAl = $('#dtpDataAlPesi').val();
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
    let dtpDataAl = $('#dtpDataAlPesi');
    dtpDataAl.focus(function(){prev_dataAl = $(this).val();}).change(function (ev) {
        $(this).unbind('focus');
        let dtpDal = $('#dtpDataDalPesi').val();
        if (ev.target.value < dtpDal) {
            alert("Data finale minore di quella iniziale!");
            $(this).val(prev_dataAl);
            $(this).bind('focus');
            return false
        } else {
            prev_dataAl = $(this).val();
        }
    });

}


