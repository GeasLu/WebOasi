/**
 *
 * @param pIdDataTable
 * @param pOptions : è un object che conterrà le varie option delle datatable
 * @constructor
 */

function LoadDatatables (pIdDataTable, pOptions) {
    //Luke 29/07/2020

    //se non esiste il token redirect immediato alla login...
    if (localStorage.getItem('jwt') === null) {
        window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
    }

    var jwt = localStorage.getItem('jwt');

    var paramSend = {};
    if(pOptions){
        paramSend = pOptions;
    }
    paramSend['jwt'] = jwt;

    //alert("stop");

    //console.log(paramSend);
    paramSend = JSON.stringify(paramSend);

    switch (pIdDataTable) {
        case 'tableDipendentiViewer':
            LoadDtbDipendentiViewver(pIdDataTable, paramSend)
            break;

        case 'tableOspitiParametri':
            LoadDtbOspitiParametri(pIdDataTable, paramSend)
            break;

        case 'tableAnomalieOspiti':
            LoadDtbAnomalieOspiti(pIdDataTable, paramSend)
            break;
    }

}
