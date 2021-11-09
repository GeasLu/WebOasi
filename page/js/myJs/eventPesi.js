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


/* line chart */
function LoadChartPeso(pIdDtb)
{
    var config = {
        type: 'line',
        data:
            {
                labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "May", "June", "July"],
                datasets: [
                    {
                        label: "Success",
                        borderColor: color.success._500,
                        pointBackgroundColor: color.success._700,
                        pointBorderColor: 'rgba(0, 0, 0, 0)',
                        pointBorderWidth: 1,
                        borderWidth: 1,
                        pointRadius: 3,
                        pointHoverRadius: 4,
                        data: [
                            23,
                            75,
                            60,
                            26,
                            45
                        ],
                        fill: false
                    }]
            },
        options:
            {
                responsive: true,
                title:
                    {
                        display: false,
                        text: 'Line Chart'
                    },
                tooltips:
                    {
                        mode: 'index',
                        intersect: false,
                    },
                hover:
                    {
                        mode: 'nearest',
                        intersect: true
                    },
                scales:
                    {
                        xAxes: [
                            {
                                display: true,
                                scaleLabel:
                                    {
                                        display: false,
                                        labelString: '6 months forecast'
                                    },
                                gridLines:
                                    {
                                        display: true,
                                        color: "#f2f2f2"
                                    },
                                ticks:
                                    {
                                        beginAtZero: true,
                                        fontSize: 11
                                    }
                            }],
                        yAxes: [
                            {
                                display: true,
                                scaleLabel:
                                    {
                                        display: false,
                                        labelString: 'Profit margin (approx)'
                                    },
                                gridLines:
                                    {
                                        display: true,
                                        color: "#f2f2f2"
                                    },
                                ticks:
                                    {
                                        beginAtZero: true,
                                        fontSize: 11
                                    }
                            }]
                    }
            }
    };
    new Chart($("#lineChart > canvas").get(0).getContext("2d"), config);
}
/* line chart -- end */

