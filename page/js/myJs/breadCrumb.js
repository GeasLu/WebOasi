/**
 * Funzione che imposta una nuova breadcrumb e ne fa il refresh
 * @param {type} pLivello, indice dell'array bresadcrumb, 0 e 1 sono gli stati di default, quindi bisognerò partire da "2"
 * @param {type} pDesc
 * @returns {undefined}
 */
function ImpostaBreadCrumb(pLivello, pDesc) {
    //Luke 18/06/2020

    var arrBred = new Array(pLivello);
    var objBread;

    if (pLivello == 0) {
        localStorage.removeItem('breadcrumb');
        console.log("canellata breadcrumb")
    }

    // Leggo dal local storage l'elenco delle pagine
    if (localStorage.getItem('breadcrumb') === null) {
        objBread = {
            desc: "WebOasi Home",
            url: "#"
        };
        arrBred.push(objBread);
        objBread = {
            desc: "Dashboard User",
            url: "#"
        };
        arrBred.push(objBread);
        localStorage.setItem('breadcrumb', JSON.stringify(arrBred));
        pDesc = "Dashboard User";
    } else {
        arrBred = JSON.parse(localStorage.getItem('breadcrumb'));
        objBread = {
            desc: pDesc,
            url: "#"
        };
        arrBred[pLivello] = objBread;
        localStorage.setItem('breadcrumb', JSON.stringify(arrBred));
        console.log(arrBred);
    }

    RefreshBreadCrumb(pDesc);

}

function RefreshBreadCrumb(pLocalPage) {
    //Luke 18/06/2020

    var arrBred = new Array();

    // Leggo dal local storage l'elenco delle pagine
    if (localStorage.getItem('breadcrumb') !== null) {
        arrBred = JSON.parse(localStorage.getItem('breadcrumb'));

        var sHtml;
        console.log('*************************************************************');
        console.log(arrBred);

        sHtml = "";
        for (var i in arrBred) {
            if (pLocalPage == arrBred[i].desc) {
                sHtml += '  <li class="breadcrumb-item active"><a href="' + arrBred[i].url + ';">' + arrBred[i].desc + '</a></li> \n';
            } else {
                sHtml += '  <li class="breadcrumb-item"><a href="' + arrBred[i].url + ';">' + arrBred[i].desc + '</a></li> \n';
            }
        }
        ;
        sHtml += '  <li class="position-absolute pos-center pos-left d-none d-sm-block"><br> \n';
        sHtml += '  <div id="ph-get-date" style="color:#a6a4a6" >' + GetDateString() + '</div></li> \n';

        console.log(sHtml);

        var obj = document.getElementById('ph-breadcrumb');
        obj.innerHTML = sHtml;

    }
}
;
