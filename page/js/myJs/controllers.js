
/***********************************************
 * Dynamic Ajax Content- © Dynamic Drive DHTML code library (www.dynamicdrive.com)
 * This notice MUST stay intact for legal use
 * Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
 ***********************************************/

var loadedobjects = "";
var rootdomain = cg_BaseUrl;

function ajaxpage(url, containerid, pView, pSchema, pOption) {

    var jwt = localStorage.getItem('jwt');
    var page_request = false;

    if (window.XMLHttpRequest) // if Mozilla, Safari etc
        page_request = new XMLHttpRequest();
    else if (window.ActiveXObject) { // if IE
        try {
            page_request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                page_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            }
        }
    } else
        return false;
    page_request.onreadystatechange = function () {
        loadpage(page_request, containerid, pView, pSchema, pOption);
    };
    page_request.open('POST', url, true);
    page_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    page_request.send("jwt=" + jwt + "&schema=" + pSchema);

}

function loadpage(page_request, containerid, pView, pSchema, pOptions) {
    if (page_request.readyState == 4 && (page_request.status == 200 || window.location.href.indexOf("http") == -1)) {
        document.getElementById(containerid).innerHTML = page_request.responseText;
        if (pView){
            switch (pView.toUpperCase()) {
                case 'MAIN':
                    ImpostaBreadCrumb(0, "WebOasi Home");
                    LoadCalendar();
                    break;

                case 'SCADENZE':
                    ImpostaBreadCrumb(2, "Scadenze");
                    LoadCalendar();
                    break;

                case 'SCHISOLAMENTO':
                    ImpostaBreadCrumb(2, "Scheda Isolamento");
                    LoadDatatables('tableOspitiParametri', {Schema: pSchema});
                    OnClickbtnSchedaIsolamento('tableOspitiParametri');
                    break;

                case 'SCHISOLAMENTO-ANOMALIE':
                    var paramSend = {};
                    if(pOptions){
                        paramSend = pOptions;
                    }
                    paramSend['Schema'] = pSchema;
                    paramSend['DataDal'] = $('#dtpDataDal').val();
                    paramSend['DataAl'] = $('#dtpDataAl').val();
                    paramSend['paramTemp'] = $('#paramTemp').val();
                    paramSend['paramSat'] = $('#paramSat').val();

                    ImpostaBreadCrumb(3, "Anomalie Ospiti");
                    LoadDatatables('tableAnomalieOspiti', paramSend);
                    OnClickbtnSchedaIsolamento('tableAnomalieOspiti');
                    break;

                default:
                    var html = msgAlert("Errore Pagina Ajax", "Status: " + page_request.status);
                    $("#response").show();
                    document.getElementById('response').innerHTML = html;
                    setTimeout(function () {
                        $("#response").hide();
                    } , 10000);
                    ajaxpage(cg_BaseUrl + '/page/view/main.tpl.php', 'ph-main');
                    break;
            }
        }


    }
}


function loadobjs() {
    if (!document.getElementById)
        return;
    for (i = 0; i < arguments.length; i++) {
        var file = arguments[i];
        var fileref = "";
        if (loadedobjects.indexOf(file) == -1) { //Check to see if this object has not already been added to page before proceeding
            if (file.indexOf(".js") != -1) { //If object is a js file
                fileref = document.createElement('script');
                fileref.setAttribute("type", "text/javascript");
                fileref.setAttribute("src", file);
            } else if (file.indexOf(".css") != -1) { //If object is a css file
                fileref = document.createElement("link");
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", file);
            }
        }
        if (fileref != "") {
            document.getElementsByTagName("head").item(0).appendChild(fileref);
            loadedobjects += file + " "; //Remember this object as being already added to page
        }
    }
}
