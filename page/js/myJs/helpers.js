
// <editor-fold desc="Funzioni comuni - HELPERS" defaultstate="collapsed">
/**
 * Questa funzione restituisce la data formattata YYYY-MM-DD
 *
 * @param {type} pData se non è stata specificata, carica la data di oggi.
 * @returns {String}
 */
function GetDateFormat(pData) {
    //Luke 17/06/2020
    var data;
    var gg, mm, aaaa;

    if (pData) {
        data = pData;
    } else {
        data = new Date();
    }

    gg = data.getDate();
    mm = data.getMonth() + 1;
    aaaa = data.getFullYear();

    return aaaa + '-' + mm + '-' + gg;
}

function GetDateString() {
    //luke 07/05/2020

    var data = new Date();
    var set, gg, mm, aaaa, h, m, s;
    //Crea la tabella dei mesi
    var mesi = new Array();
    mesi[0] = "Gennaio";
    mesi[1] = "Febbraio";
    mesi[2] = "Marzo";
    mesi[3] = "Aprile";
    mesi[4] = "Maggio";
    mesi[5] = "Giugno";
    mesi[6] = "Luglio";
    mesi[7] = "Agosto";
    mesi[8] = "Settembre";
    mesi[9] = "Ottobre";
    mesi[10] = "Novembre";
    mesi[11] = "Dicembre";
    //Crea la tabella dei giorni della settimana
    var giorni = new Array();
    giorni[0] = "Domenica";
    giorni[1] = "Lunedì";
    giorni[2] = "Martedì";
    giorni[3] = "Mercoledì";
    giorni[4] = "Giovedì";
    giorni[5] = "Venerdì";
    giorni[6] = "Sabato";
    //Estrae dalla tabella il giorno della settimana
    set = giorni[data.getDay()] + " ";
    gg = data.getDate() + " ";
    //Estrae dalla tabella il mese
    mm = mesi[data.getMonth()] + " ";
    aaaa = data.getFullYear() + " ";
    h = data.getHours() + ":";
    m = data.getMinutes() + ":";
    s = data.getSeconds();
    return "Oggi è " + set + gg + mm + aaaa + "";

}

// jquery extend function
$.extend(
    {
        redirectPost: function (location, args)
        {
            var form = '';
            $.each(args, function (key, value) {
                value = value.split('"').join('\"');
                form += '<input type="hidden" name="' + key + '" value="' + value + '">';
            });
            $('<form action="' + location + '" method="POST">' + form + '</form>').appendTo($(document.body)).submit();
        }
    });

// function to make form values to json format
$.fn.serializeObject = function () {

    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


function msgAlert(pTitle, pMessage) {
    //Luke 23/06/2020
    var html;

    html = '<div class="alert border-danger bg-transparent text-secondary fade show" role="alert">\n'
        + '   <div class="d-flex align-items-center"> \n'
        + '       <div class="alert-icon"> \n'
        + '           <span class="icon-stack icon-stack-md"> \n'
        + '               <i class="base-7 icon-stack-3x color-danger-900"></i> \n'
        + '               <i class="fal fa-times icon-stack-1x text-white"></i> \n'
        + '           </span> \n'
        + '       </div> \n'
        + '       <div class="flex-1"> \n'
        + '            <span class="h5 color-danger-900">' + pTitle + '</span> \n'
        + '           <br> \n'
        + '          ' + pMessage + ' \n'
        + '       </div> \n'
        + '   </div> \n'
        + '</div> \n';

    return html;
}

function msgSuccess(pTitle, pMessage) {
    //Luke 23/06/2020
    var html;

    html = '<div class="alert border-faded bg-transparent text-secondary fade show" role="alert">\n'
        + '   <div class="d-flex align-items-center"> \n'
        + '       <div class="alert-icon"> \n'
        + '           <span class="icon-stack icon-stack-md"> \n'
        + '               <i class="base-7 icon-stack-3x color-success-600"></i> \n'
        + '               <i class="fal fa-check icon-stack-1x text-white"></i> \n'
        + '           </span> \n'
        + '       </div> \n'
        + '       <div class="flex-1"> \n'
        + '            <span class="h5 color-success-600">' + pTitle + '</span> \n'
        + '           <br> \n'
        + '          ' + pMessage + ' \n'
        + '       </div> \n'
        + '   </div> \n'
        + '</div> \n';

    return html;
}


/***********************************************
 * Dynamic Ajax Content- © Dynamic Drive DHTML code library (www.dynamicdrive.com)
 * This notice MUST stay intact for legal use
 * Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
 ***********************************************/

var loadedobjects = "";
var rootdomain = cg_BaseUrl;

function ajaxpage(url, containerid, pNameApp) {

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
        loadpage(page_request, containerid, pNameApp);
    };
    page_request.open('POST', url, true);
    page_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    page_request.send("jwt=" + jwt);

}

function loadpage(page_request, containerid, pNameApp) {
    if (page_request.readyState == 4 && (page_request.status == 200 || window.location.href.indexOf("http") == -1)) {
        document.getElementById(containerid).innerHTML = page_request.responseText;
        switch (pNameApp.toUpperCase()) {
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
                LoadDatatables('tableOspitiParametri', {Schema:"SchIsolamento"});
                OnClickbtnSaveOspitiParametri();
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


// </editor-fold>