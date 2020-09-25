function OnClickbtnSaveOspitiParametri() {
    //Luke 24/09/2020

    let btnClick = $('#btnSaveOspitiParametri');
    btnClick.click(function (ev) {

        //Controllo che tutti i campi/testo siano valorizzati
        let txtTemp = $('#txtTemperatura');
        let txtSat = $('#txtSaturazione');
        let txtOss = $('#txtOssigeno');
        let num;


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


        $('#modalSchIsolamento').modal('hide');

    });

}