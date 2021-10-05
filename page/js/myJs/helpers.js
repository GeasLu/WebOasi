
// <editor-fold desc="Funzioni comuni - HELPERS" defaultstate="collapsed">
/**
 * Questa funzione restituisce la data formattata YYYY-MM-DD
 *
 * @param {type} pData se non è stata specificata, carica la data di oggi.
 * @returns {String}
 */
function GetDateFormat(pData, pFormatIta= false) {
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
    if(pFormatIta){
        return gg + '/' + mm + '/' + aaaa;
    } else{
        return aaaa + '-' + mm + '-' + gg;
    }

}

/**
 * Questa funzione restituisce la data formattata YYYY-MM-DD
 *
 * @param {type} pDataTime se non è stata specificata, carica la data di oggi.
 * @returns {String}
 */
function GetDateTimeFormat(pDataTime, pNoSeparetor = 0) {
    //Luke 17/06/2020
    var dt;
    var gg, mm, aaaa, hh, nn, ss;

    if (pDataTime) {
        dt = new Date(pDataTime);
    } else {
        dt = new Date();
    };

    gg = dt.getDate();
    mm = dt.getMonth() + 1;
    aaaa = dt.getFullYear();
    hh = dt.getHours();
    nn = dt.getMinutes();
    ss = dt.getSeconds();

    if (pNoSeparetor=1){
        let s = aaaa + ' ' + ('0' + mm).slice(-2) + ' ' + ('0' + gg).slice(-2) + ' ' + ('0' + hh).slice(-2) + ' ' + ('0' + nn).slice(-2) + ' ' + ('0' + ss).slice(-2) ;
        return  s.replace(/ /g,"");
    }
    else
        return aaaa + '-' + mm + '-' + gg + ' ' + hh + ':' + nn + ':' + ss;
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

function DatetoDesc(data){
    //Luke 02/10/2020
    moment.locale('it');
    moment.updateLocale("it", {
        invalidDate: ""
    });
    return moment(data).calendar( null, {
        sameDay: '[Oggi alle] HH:mm',
        nextDay: '[Domani]',
        nextWeek: 'dddd',
        lastDay: '[Ieri alle] HH:mm',
        lastWeek: 'DD/MM/YYYY HH:mm',
        sameElse: 'DD/MM/YYYY'
    });
}

function roundTo(n, digits) {
    if (digits === undefined) {
        digits = 0;
    }

    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    return Math.round(n) / multiplicator;
}

/**
 * Aggiunge l'elemento ajax.loader usato per il caricamento durante le chiamate ajax
 * @param pIdTag
 * @constructor
 */
function AddWait(pIdTag){
    //Luke 07/01/2021

    if ($('#wait').length != 0) {
        return true
    }

    var MainTag = document.getElementById(pIdTag);
    var imgLoading = document.createElement("img");
    var srcAttr = document.createAttribute("src");
    var idAttr = document.createAttribute("id");
    var classAttr = document.createAttribute("class");

    srcAttr.value = "img/ajax-loader.gif";
    idAttr.value = "wait";
    classAttr.value = "align-self: center, position: relative";

    imgLoading.setAttributeNode(srcAttr);
    imgLoading.setAttributeNode(idAttr);
    imgLoading.setAttributeNode(classAttr);
    MainTag.appendChild(imgLoading);

}

function DtoB(pValBool){
    //Luke 04/05/2021

    return pValBool? 1:0;

}


// </editor-fold>