function ImpostaBreadCrumb(e,t){var a,n=new Array(e);0==e&&(localStorage.removeItem("breadcrumb"),console.log("canellata breadcrumb")),null===localStorage.getItem("breadcrumb")?(a={desc:"WebOasi Home",url:"#"},n.push(a),a={desc:"Dashboard User",url:"#"},n.push(a),localStorage.setItem("breadcrumb",JSON.stringify(n)),t="Dashboard User"):(a={desc:t,url:"#"},(n=JSON.parse(localStorage.getItem("breadcrumb")))[e]=a,localStorage.setItem("breadcrumb",JSON.stringify(n))),RefreshBreadCrumb(t)}function RefreshBreadCrumb(e){var t=new Array;if(null!==localStorage.getItem("breadcrumb")){var a;for(var n in a="",t=JSON.parse(localStorage.getItem("breadcrumb")))e==t[n].desc?a+='  <li class="breadcrumb-item active"><a href="'+t[n].url+';">'+t[n].desc+"</a></li> \n":a+='  <li class="breadcrumb-item"><a href="'+t[n].url+';">'+t[n].desc+"</a></li> \n";a+='  <li class="position-absolute pos-center pos-left d-none d-sm-block"><br> \n',a+='  <div id="ph-get-date" style="color:#a6a4a6" >'+GetDateString()+"</div></li> \n",document.getElementById("ph-breadcrumb").innerHTML=a}}function LoadCalendar(e,t){var a,n,i,s=new Date,o=localStorage.getItem("jwt");a=e||new Date(s.getFullYear(),s.getMonth(),1),n=t||new Date(s.getFullYear(),s.getMonth()+1,0);var l=JSON.stringify({jwt:o,dbschema:"Scadenze",dtInizio:GetDateFormat(a),dtFine:GetDateFormat(n)});$.ajax({type:"POST",url:cg_BaseUrl+"/api/eventi/read.php",async:!0,data:l,dataType:"json",success:function(e){var t,a,n=e;localStorage.setItem("jwt",n.jwt),i=n.eventi;var s=[];for(t in i)for(a in i[t].elnEventiDet){var o={ID:i[t].elnEventiDet[a].idRow,idEvento:i[t].idEvento,title:i[t].evento,evento_esteso:i[t].evento_esteso,start:i[t].elnEventiDet[a].dataOccorrenza,description:i[t].evento_esteso,className:i[t].classCSS};s.push(o)}var l=document.getElementById("calendar"),r=new FullCalendar.Calendar(l,{plugins:["dayGrid","list","timeGrid","interaction","bootstrap"],themeSystem:"bootstrap",timeZone:"UTC",dateAlignment:"month",buttonText:{today:"Oggi",month:"Mensile",week:"Settimanale",day:"Giornaliera",list:"lista"},eventTimeFormat:{hour:"numeric",minute:"2-digit",meridiem:"short"},navLinks:!0,header:{left:"prev,next today addEventButton",center:"title",right:"dayGridMonth,timeGridWeek,timeGridDay,listWeek"},footer:{left:"",center:"",right:""},eventClick:function(e){var t=e.event.extendedProps.idEvento;document.getElementById("lblTitleModalScadenze").innerHTML='Modifica evento... \n<small class="m-0 text-danger"> \nAttenzione, modificando la ricorrenza si perderennao tutte le future scadenze!\n</small>',document.getElementById("txtScEventoTitolo").value=e.event.title,document.getElementById("txtScEventoDesc").value=e.event.extendedProps.evento_esteso,LoadDatatables("tableDipendentiViewer",{idEvento:t}),$("#modalEvento").modal({backdrop:!1})},customButtons:{addEventButton:{text:"+",click:function(){document.getElementById("lblTitleModalScadenze").innerHTML='Aggiungi evento... \n<small class="m-0 text-muted"> \nper aggiungere una ricorrenza, cliccare su "RICORRENZA" \n</small>',document.getElementById("txtScEventoTitolo").value="",document.getElementById("txtScEventoDesc").value="",LoadDatatables("tableDipendentiViewer",{idEvento:"1"}),$("#modalEvento").modal({backdrop:!1})}}},editable:!0,eventLimit:!0,events:s,viewSkeletonRender:function(){$(".fc-toolbar .btn-default").addClass("btn-sm"),$(".fc-header-toolbar h2").addClass("fs-md"),$("#calendar").addClass("fc-reset-order")}});r.on("dateClick",function(e){console.log("clicked on "+e.dateStr)}),r.render()},error:function(e){var t=JSON.parse(e.responseText),a=msgAlert(t.error,t.message);document.getElementById("response").innerHTML=a}})}const cg_MinCheckSession=30,cg_milliSecControlloSessione=5e4,cg_BaseUrl=location.origin+"/WebOasi",cg_PathImg=cg_BaseUrl+"/page/img";var dtb,loadedobjects="",rootdomain=cg_BaseUrl;function ajaxpage(e,t,a,n,i){var s=localStorage.getItem("jwt"),o=!1;if(window.XMLHttpRequest)o=new XMLHttpRequest;else{if(!window.ActiveXObject)return!1;try{o=new ActiveXObject("Msxml2.XMLHTTP")}catch(e){try{o=new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}}}o.onreadystatechange=function(){loadpage(o,t,a,n,i)},o.open("POST",e,!0),o.setRequestHeader("Content-type","application/x-www-form-urlencoded"),o.send("jwt="+s+"&schema="+n)}function loadpage(e,t,a,n,i){if(4==e.readyState&&(200==e.status||-1==window.location.href.indexOf("http"))&&(document.getElementById(t).innerHTML=e.responseText,a))switch(a.toUpperCase()){case"MAIN":ImpostaBreadCrumb(0,"WebOasi Home"),LoadCalendar();break;case"SCADENZE":ImpostaBreadCrumb(2,"Scadenze"),LoadCalendar();break;case"SCHISOLAMENTO":ImpostaBreadCrumb(2,"Scheda Isolamento"),LoadDatatables("tableOspitiParametri",{Schema:n}),OnClickbtnSchedaIsolamento("tableOspitiParametri");break;case"SCHISOLAMENTO-ANOMALIE":var s={};i&&(s=i),s.Schema=n,s.DataDal=$("#dtpDataDal").val(),s.DataAl=$("#dtpDataAl").val(),s.paramTemp=$("#paramTemp").val(),s.paramSat=$("#paramSat").val(),ImpostaBreadCrumb(3,"Anomalie Ospiti"),LoadDatatables("tableAnomalieOspiti",s),OnClickbtnSchedaIsolamento("tableAnomalieOspiti");break;default:var o=msgAlert("Errore Pagina Ajax","Status: "+e.status);$("#response").show(),document.getElementById("response").innerHTML=o,setTimeout(function(){$("#response").hide()},1e4),ajaxpage(cg_BaseUrl+"/page/view/main.tpl.php","ph-main")}}function loadobjs(){if(document.getElementById)for(i=0;i<arguments.length;i++){var e=arguments[i],t="";-1==loadedobjects.indexOf(e)&&(-1!=e.indexOf(".js")?((t=document.createElement("script")).setAttribute("type","text/javascript"),t.setAttribute("src",e)):-1!=e.indexOf(".css")&&((t=document.createElement("link")).setAttribute("rel","stylesheet"),t.setAttribute("type","text/css"),t.setAttribute("href",e))),""!=t&&(document.getElementsByTagName("head").item(0).appendChild(t),loadedobjects+=e+" ")}}function LoadDatatables(e,t){null===localStorage.getItem("jwt")&&window.location.replace(cg_BaseUrl+"/page/page-login.php");var a=localStorage.getItem("jwt"),n={};switch(t&&(n=t),n.jwt=a,n=JSON.stringify(n),AddWait(e),e){case"tableDipendentiViewer":LoadDtbDipendentiViewver(e,n);break;case"tableOspitiParametri":LoadDtbOspitiParametri(e,n);break;case"tableAnomalieOspiti":LoadDtbAnomalieOspiti(e,n)}}function LoadDtbAnomalieOspiti(e,t){var a;$.ajax({type:"POST",url:cg_BaseUrl+"/api/Ospiti/readAnomalieOspiti.php",async:!0,data:t,dataType:"json",beforeSend:function(){$("#wait").show()},success:function(t,n,i){let s=t;switch(i.status){case 200:localStorage.setItem("jwt",s.jwt),a=s.elnAnomalieOspiti,dtb=$("#"+e).DataTable({destroy:!0,responsive:!0,data:a,dataSrc:"elnAnomalieOspiti",selectType:"row",columns:[{data:"ID_ROW",title:"ID_ROW",visible:!1},{data:"ID_OSPITE",title:"ID_OSPITE",visible:!1},{data:"OSPITE",title:"Ospite",visible:!0},{data:"dataRilevazione",title:"Data Ora Rilevazione",visible:!0},{data:"temperatura_num",title:"Temperatura",visible:!0},{data:"saturazione",title:"Saturazione",visible:!0},{data:"ossigeno",title:"Ossigeno",visible:!0},{data:"fTosseSecca",title:"Tosse Secca",visible:!0},{data:"fDolMusc",title:"Dolori Muscolari",visible:!0},{data:"fMaleTesta",title:"Mal di Testa",visible:!0},{data:"fRinorrea",title:"Rinorrea",visible:!0},{data:"fMaleGola",title:"Mal di Gola",visible:!0},{data:"fAstenia",title:"Astenia",visible:!0},{data:"fInappetenza",title:"Inappetenza",visible:!0},{data:"fVomito",title:"Vomito",visible:!0},{data:"fDiarrea",title:"Diarrea",visible:!0},{data:"fCongiuntivite",title:"Congiuntivite",visible:!0},{data:"fNoAlteraz",title:"Nessuna Alterazione",visible:!0},{data:"Altro",title:"Altro",visible:!0},{data:"USER_INS",title:"Inseriti da:",visible:!0},{data:"idUserIns",title:"idUserIns",visible:!1}],dom:"\"<'row mb-3'<'col-sm-12 col-md-6 d-flex align-items-center justify-content-start'f><'col-sm-12 col-md-6 d-flex align-items-center justify-content-end'B>>\" +\n                        \"<'row'<'col-sm-12'tr>>\" +\n \"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>\"",columnDefs:[{targets:3,render:function(e){return moment.locale("it"),moment.updateLocale("it",{invalidDate:""}),moment(e).calendar(null,{sameDay:"[Oggi alle] HH:mm",nextDay:"[Domani]",nextWeek:"dddd",lastDay:"[Ieri alle] HH:mm",lastWeek:"DD/MM/YYYY HH:mm",sameElse:"DD/MM/YYYY"})}},{targets:[7,8,9,10,11,12,13,14,15,16,17],render:function(e,t){return"display"===t?1==e?'<i class="fal fa-check-circle text-success"></i>':'<i class="fal fa-circle text-warning"></i>':e}},{targets:[4],mRender:function(e,t){var a=e;return a>37.3?'<span class="text-danger">'+roundTo(a,1)+"</span>":roundTo(a,1)}},{targets:[5],mRender:function(e,t){var a=e;return a<=91?'<span class="text-danger">'+roundTo(a,0)+"</span>":roundTo(a,0)}}]});break;case 401:console.log(data);case 500:console.log(data);default:var o=msgAlert(s.message_title,s.message_body);document.getElementById("response").innerHTML=o,window.location.replace(cg_BaseUrl+"/page/page-login.php")}},error:function(e,t){var a="";console.log(e.responseText);var n=JSON.parse(e.responseText);a=0===e.status?"Not connect.\n Verify Network.":401==e.status?"Da rest api: "+n.message_body+" \n":404==e.status?"Requested page not found. [404]":500==e.status?"Internal Server Error [500].":"parsererror"===t?"Requested JSON parse failed.":"timeout"===t?"Time out error.":"abort"===t?"Ajax request aborted.":"Uncaught Error.\n"+n.message_body,""!==n.message_system&&(document.getElementById("message_system").innerHTML="<strong>"+n.message_system+"</strong>");var i=msgAlert(n.message_title,a);document.getElementById("response").innerHTML=i},complete:function(){$("#wait").hide()}}),$.fn.dataTable.render.moment=function(e,t,a){return 1===arguments.length?(a="it",t=e,e="YYYY-MM-DD"):2===arguments.length&&(a="it"),function(n,i,s){return n?window.moment(n,e,a,!0).format("sort"===i||"type"===i?"x":t):"sort"===i||"type"===i?0:n}}}function LoadDtbDipendentiViewver(e,t){var a;$("#"+e).on("click","tbody td",function(){var e=dtb.cell(this).index(),t=dtb.row(this).data(),a=e.column;switch(dtb.column(a).header().textContent){case"Mod.":alert("MODIFICA"),t.NOME_UTENTE="Luke";break;case"Canc.":alert("elimina")}}),$.ajax({type:"POST",url:cg_BaseUrl+"//api//users//readEventViewer.php",async:!0,data:t,dataType:"json",success:function(t,n,i){let s=t;switch(i.status){case 200:localStorage.setItem("jwt",s.jwt),a=s.eventi,dtb=$("#"+e).DataTable({destroy:!0,responsive:!0,data:a,dataSrc:"eventi",selectType:"cell",columns:[{data:"idRow",title:"idRow",visible:!1},{data:"idEvento",title:"idEvento",visible:!1},{data:"idUser",title:"idUser",visible:!1},{data:"IMG",title:"Immagine",visible:!0},{data:"NOME_UTENTE",title:"Dipendente",visible:!0},{data:"flagVis",title:"Visualizza",visible:!0},{data:"flagMod",title:"Modifica",visible:!0},{data:"flagDel",title:"Cancella",visible:!0},{data:"flagPrint",title:"Stampa",visible:!0},{data:"UTENTE",title:"Utente",visible:!1},{data:"MODIFICA",title:"Mod.",visible:!0},{data:"ELIMINA",title:"Canc.",visible:!0}],columnDefs:[{targets:10,data:"img",render:function(e,t,a){return"display"===t?'<a href="#"><img src="'+cg_PathImg+'/ico/p24x24_Edit.png" width="24px" height="24px"></a>':e+"ciao"}},{targets:11,data:"img",render:function(e,t,a){return"display"===t?'<a href="#"><img src="'+cg_PathImg+'/ico/p24x24_EliminaV2.png" width="24px" height="24px"></a>':e+"ciao"}},{targets:3,data:"img",render:function(e,t,a){return"display"===t&&e.length>2?'<img src="'+e+'" id="imgDip24x24" width="24" height="24" class="profile-image rounded-circle mx-auto d-block">':e+"ciao"}},{targets:[5,6,7,8],render:function(e,t){return"display"===t?1==e?'<i class="fal fa-check-circle text-success"></i>':'<i class="fal fa-circle text-warning"></i>':e}}],dom:"\"<'row mb-3'<'col-sm-12 col-md-6 d-flex align-items-center justify-content-start'f><'col-sm-12 col-md-6 d-flex align-items-center justify-content-end'B>>\" +\n                        \"<'row'<'col-sm-12'tr>>\" +\n                        \"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>\"",buttons:[{text:"Agg. Utente",className:"btn btn-outline-success",action:function(e,t,a,n){alert("Button activated")}}]});break;case 401:console.log(data);case 500:console.log(data);default:var o=msgAlert(s.message_title,s.message_body);document.getElementById("response").innerHTML=o,window.location.replace(cg_BaseUrl+"/page/page-login.php")}},error:function(e,t){var a="";console.log(e.responseText);var n=JSON.parse(e.responseText);a=0===e.status?"Not connect.\n Verify Network.":401==e.status?"Da rest api: "+n.message_body+" \n":404==e.status?"Requested page not found. [404]":500==e.status?"Internal Server Error [500].":"parsererror"===t?"Requested JSON parse failed.":"timeout"===t?"Time out error.":"abort"===t?"Ajax request aborted.":"Uncaught Error.\n"+n.message_body,""!==n.message_system&&(document.getElementById("message_system").innerHTML="<strong>"+n.message_system+"</strong>");var i=msgAlert(n.message_title,a);document.getElementById("response").innerHTML=i}})}function LoadDtbOspitiParametri(e,t){var a;$("#"+e).on("click","tbody td",function(){var e=dtb.cell(this).index(),n=dtb.row(this).data(),i=e.column;switch(dtb.column(i).header().textContent){case"Param.":s='  <h4 class="modal-title" id="modalParametriOspite"> \n     <img src="'+cg_PathImg+"/ospiti/"+n.ID_OSPITE+'.jpeg" alt=" nn -" class="profile-image rounded-circle" width="50" height="64" > \n     Dettaglio parametri inseriti per l\'ospite: '+n.OSPITE+"\n  </h4>",document.getElementById("lblTitleElencoParametri").innerHTML=s,document.getElementById("idOspite").value=n.ID_OSPITE,document.getElementById("nomeOspite").value=n.OSPITE,(t=JSON.parse(t)).idOspite=n.ID_OSPITE,LoadDtbParametriOspite("tableParametriOspite",t=JSON.stringify(t)),$("#modalParametriOspite").modal({backdrop:!1});break;default:if(a.map(function(e){return e.ID_OSPITE}).indexOf(n.ID_OSPITE)>-1)s='  <h4 class="modal-title" id="lblTitleModalParametri"> \n     <img src="'+cg_PathImg+"/ospiti/"+n.ID_OSPITE+'.jpeg" alt=" nn -" class="profile-image rounded-circle" width="50" height="64" > \n     Inserimento parametri per '+n.OSPITE+'\n     <small class="m-0 text-muted" > \n      Ultimi parametri rilevati:  '+DatetoDesc(n.DATA_ORA_ULTIMI)+" \n     </small> \n  </h4>",document.getElementById("lblTitleModalParametri").innerHTML=s,document.getElementById("idOspite").value=n.ID_OSPITE,document.getElementById("nomeOspite").value=n.OSPITE,""!=$("#txtTemperatura").val()&&(document.getElementById("txtTemperatura").value=""),""!=$("#txtOssigeno").val()&&(document.getElementById("txtOssigeno").value="0"),""!=$("#txtSaturazione").val()&&(document.getElementById("txtSaturazione").value=""),document.getElementById("chkTosse").checked=!1,document.getElementById("chkDolori").checked=!1,document.getElementById("chkMaleTesta").checked=!1,document.getElementById("chkRinorrea").checked=!1,document.getElementById("chkMalDiGola").checked=!1,document.getElementById("chkAstenia").checked=!1,document.getElementById("chkInappetenza").checked=!1,document.getElementById("chkVomito").checked=!1,document.getElementById("chkDiarrea").checked=!1,document.getElementById("chkCongiuntivite").checked=!1,document.getElementById("chkDiarrea").checked=!1,document.getElementById("txtAltro").value="",document.getElementById("chkNoAlteraz").checked=!0,$("#modalSchIsolamento").modal({backdrop:!1});else{var s=msgAlert("Ospite non trovato!","Manca nelle elenco Ospiti Paramatri ");$("#response").show(),document.getElementById("response").innerHTML=s,setTimeout(function(){$("#response").hide()},5e3)}}}),$.ajax({type:"POST",url:cg_BaseUrl+"/api/Ospiti/readOspitiParametri.php",async:!0,data:t,dataType:"json",beforeSend:function(){$("#wait").show()},success:function(t,n,i){$("#wait").hide();let s=t;switch(i.status){case 200:localStorage.setItem("jwt",s.jwt),a=s.ElnOspitiParametri,dtb=$("#"+e).DataTable({destroy:!0,responsive:!0,data:a,dataSrc:"ElnOspitiParametri",selectType:"row",columns:[{data:"ID_OSPITE",title:"ID_OSPITE",visible:!1},{data:"OSPITE",title:"Ospite",visible:!0},{data:"NUM_LETTO",title:"Letto",visible:!1},{data:"DATA_ORA_ULTIMI",title:"Ultimo ins.",visible:!0},{data:"NUM_CAMERA",title:"Camera",visible:!0},{data:"PIANO",title:"Piano",visible:!0},{data:"SEZIONE",title:"Sezione",visible:!0},{data:"DETTAGLIO_DATI",title:"Param.",visible:!0}],dom:"\"<'row mb-3'<'col-sm-12 col-md-6 d-flex align-items-center justify-content-start'f><'col-sm-12 col-md-6 d-flex align-items-center justify-content-end'B>>\" +\n                        \"<'row'<'col-sm-12'tr>>\" +\n                        \"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>\"",columnDefs:[{targets:3,render:function(e){var t,a;return moment.locale("it"),moment.updateLocale("it",{invalidDate:""}),e?(a=e.len>9?e.substring(0,10):e,t=moment(a).isSame(moment(),"d")?"text-success":"text-danger"):t="text-warning",'<div class="'+t+'">'+moment(e).calendar(null,{sameDay:"[Oggi alle] HH:mm",nextDay:"[Domani]",nextWeek:"dddd",lastDay:"[Ieri alle] HH:mm",lastWeek:"DD/MM/YYYY HH:mm",sameElse:"DD/MM/YYYY"})+"</div>"}},{targets:7,data:"img",width:"24px",render:function(e,t,a){return"display"===t?'<a href="#"><img src="'+cg_PathImg+'/ico/p24x24_Eye.png" width="24px" height="24px"></a>':e+"ciao"}}]});break;case 401:console.log(data);case 500:console.log(data);default:var o=msgAlert(s.message_title,s.message_body);document.getElementById("response").innerHTML=o,window.location.replace(cg_BaseUrl+"/page/page-login.php"),$("#wait").hide()}},error:function(e,t){$("#wait").hide();var a="";console.log(e.responseText);var n=JSON.parse(e.responseText);a=0===e.status?"Not connect.\n Verify Network.":401==e.status?"Da rest api: "+n.message_body+" \n":404==e.status?"Requested page not found. [404]":500==e.status?"Internal Server Error [500].":"parsererror"===t?"Requested JSON parse failed.":"timeout"===t?"Time out error.":"abort"===t?"Ajax request aborted.":"Uncaught Error.\n"+n.message_body,""!==n.message_system&&(document.getElementById("message_system").innerHTML="<strong>"+n.message_system+"</strong>");var i=msgAlert(n.message_title,a);document.getElementById("response").innerHTML=i},complete:function(){$("#wait").hide()}}),$.fn.dataTable.render.moment=function(e,t,a){return 1===arguments.length?(a="it",t=e,e="YYYY-MM-DD"):2===arguments.length&&(a="it"),function(n,i,s){return n?window.moment(n,e,a,!0).format("sort"===i||"type"===i?"x":t):"sort"===i||"type"===i?0:n}}}function LoadDtbParametriOspite(e,t){$("#"+e).on("click","tbody td",function(){console.clear();var e=dtb.cell(this).index(),t=dtb.row(this).data(),a=e.column;let n=dtb.row(this).index;var i=$("#idUserLogin").val();if(console.log("dtb: "),console.log(dtb),console.log("this: "),console.log(this),console.log("riga colonna "+n+" "+a),n>-1){t=dtb.row(this).data();switch(console.log("dtb"),console.log(dtb),console.log("dati riga"),console.log(t),console.log("idUserLogin="+$("#idUserLogin").val()),dtb.column(a).header().textContent){case"Canc.":i==t.idUserIns?$("#modalSiNo").modal({backdrop:!1}):$("#modalNo").modal({backdrop:!1})}}}),$.ajax({type:"POST",url:cg_BaseUrl+"/api/Ospiti/readParametriOspite.php",async:!0,data:t,dataType:"json",beforeSend:function(){$("#wait").show()},success:function(t,a,n){let i=t;switch(n.status){case 200:localStorage.setItem("jwt",i.jwt),elnParamOspite=i.ElnParametriOspite,(dtb=$("#"+e).DataTable({destroy:!0,responsive:!0,data:elnParamOspite,dataSrc:"ElnParametriOspite",selectType:"row",columns:[{data:"ID_ROW",title:"ID_ROW",visible:!1},{data:"ID_OSPITE",title:"ID_OSPITE",visible:!1},{data:"dataRilevazione",title:"Data",visible:!0},{data:"DELETE",title:"Canc.",visible:!0},{data:"temperatura",title:"Temperatura",visible:!0},{data:"saturazione",title:"Saturazione",visible:!0},{data:"ossigeno",title:"Ossigeno",visible:!0},{data:"fTosseSecca",title:"Tosse Secca",visible:!0},{data:"fDolMusc",title:"Dolori Muscolari",visible:!0},{data:"fMaleTesta",title:"Mal di Testa",visible:!0},{data:"fRinorrea",title:"Rinorrea",visible:!0},{data:"fMaleGola",title:"Mal di Gola",visible:!0},{data:"fAstenia",title:"Astenia",visible:!0},{data:"fInappetenza",title:"Inappetenza",visible:!0},{data:"fVomito",title:"Vomito",visible:!0},{data:"fDiarrea",title:"Diarrea",visible:!0},{data:"fCongiuntivite",title:"Congiuntivite",visible:!0},{data:"fNoAlteraz",title:"Nessuna Alterazione",visible:!0},{data:"Altro",title:"Altro",visible:!0},{data:"USER_INS",title:"Inseriti da:",visible:!0},{data:"idUserIns",title:"idUserIns",visible:!1}],dom:"\"<'row mb-3'<'col-sm-12 col-md-6 d-flex align-items-center justify-content-start'f><'col-sm-12 col-md-6 d-flex align-items-center justify-content-end'B>>\" +\n                        \"<'row'<'col-sm-12'tr>>\" +\n \"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>\"",columnDefs:[{targets:2,render:function(e){return moment.locale("it"),moment.updateLocale("it",{invalidDate:""}),moment(e).calendar(null,{sameDay:"[Oggi alle] HH:mm",nextDay:"[Domani]",nextWeek:"dddd",lastDay:"[Ieri alle] HH:mm",lastWeek:"DD/MM/YYYY HH:mm",sameElse:"DD/MM/YYYY"})}},{targets:[7,8,9,10,11,12,13,14,15,16,17],render:function(e,t){return"display"===t?1==e?'<i class="fal fa-check-circle text-success"></i>':'<i class="fal fa-circle text-warning"></i>':e}},{targets:3,data:"img",render:function(e,t,a){return"display"===t?'<a href="#"><img src="'+cg_PathImg+'/ico/p24x24_EliminaV2.png" width="24px" height="24px"></a>':e+"ciao"}}]})).order(2,"desc"),dtb.draw();break;case 401:console.log(data);case 500:console.log(data);default:var s=msgAlert(i.message_title,i.message_body);document.getElementById("response").innerHTML=s,window.location.replace(cg_BaseUrl+"/page/page-login.php")}},error:function(e,t){var a="";console.log(e.responseText);var n=JSON.parse(e.responseText);a=0===e.status?"Not connect.\n Verify Network.":401==e.status?"Da rest api: "+n.message_body+" \n":404==e.status?"Requested page not found. [404]":500==e.status?"Internal Server Error [500].":"parsererror"===t?"Requested JSON parse failed.":"timeout"===t?"Time out error.":"abort"===t?"Ajax request aborted.":"Uncaught Error.\n"+n.message_body,""!==n.message_system&&(document.getElementById("message_system").innerHTML="<strong>"+n.message_system+"</strong>");var i=msgAlert(n.message_title,a);document.getElementById("response").innerHTML=i},complete:function(){$("#wait").hide()}}),$.fn.dataTable.render.moment=function(e,t,a){return 1===arguments.length?(a="it",t=e,e="YYYY-MM-DD"):2===arguments.length&&(a="it"),function(n,i,s){return n?window.moment(n,e,a,!0).format("sort"===i||"type"===i?"x":t):"sort"===i||"type"===i?0:n}}}function OnClickbtnLogout(){$("#ph-btnLogout").click(function(e){localStorage.removeItem("jwt"),window.location.replace(cg_BaseUrl+"/page/page-login.php")})}function OnClicMenuPrimary(e){let t=e.name,a=e.name,n=$(e.parentNode),i="";switch(-1!==t.indexOf("-")&&(t=t.substr(0,t.indexOf("-"))),!0){case"lv1"==n[0].id:i="active open";break;case"lv2"==n[0].id:i="active";break;default:i="active open"}let s=$(e.parentNode.parentNode);$(s).find("li").each(function(){$(this).removeClass(i)}),n.last().addClass(i),ajaxpage(cg_BaseUrl+"/page/view/"+a+".tpl.php","ph-main",a,t)}function OnSubmitAjaxLogin(){$("#login_form").submit(function(e){var t=document.getElementById("txtUtente").value,a=document.getElementById("txtPass").value,n=document.getElementById("idStruttura").value,i=JSON.stringify({username:t,password:a,idStruttura:n});return $.ajax({type:"POST",url:"../api/login.php",data:i,context:document.body,async:!0,datatype:"json",success:function(e,t){try{console.log("ajax ok but: "+e),console.log(e);let t=e;""!==t.message_system&&(document.getElementById("message_system").innerHTML="<strong>"+t.message_system+"</strong>");var a=msgSuccess(t.message_title,t.message_body);document.getElementById("response").innerHTML=a,localStorage.setItem("jwt",t.jwt);var n={};n.jwt=t.jwt,n=JSON.stringify(n),$.redirectPost("page-home.php",JSON.parse(n))}catch(e){console.log(e),alert("Erroe ajax try"+e)}},error:function(e,t){var a="";console.log(e.responseText);var n=JSON.parse(e.responseText);a=0===e.status?"Not connect.\n Verify Network.":401==e.status?"Da rest api: "+n.message_body+" \n":404==e.status?"Requested page not found. [404]":500==e.status?"Internal Server Error [500].":"parsererror"===t?"Requested JSON parse failed.":"timeout"===t?"Time out error.":"abort"===t?"Ajax request aborted.":"Uncaught Error.\n"+n.message_body,""!==n.message_system&&(document.getElementById("message_system").innerHTML="<strong>"+n.message_system+"</strong>");var i=alertMsg(n.message_title,a);document.getElementById("response").innerHTML=i}}),e.preventDefault(),!1})}function OnClickSelStruttura(){$(".btn-primary").click(function(e){let t=document.getElementById("idStruttura");this.value>-1?t.value=this.value:t.value=-1})}function OnClickbtnSchedaIsolamento(e){var t;var a;$("#btnSaveOspitiParametri").click(function(t){let a,n=$("#txtTemperatura"),i=$("#txtSaturazione"),s=$("#txtOssigeno");var o,l=$("#idOspite").val(),r=$("#schema").val(),c=new Date,d=$("#"+e).DataTable();let m={};var u=localStorage.getItem("jwt");if(a=n.val(),a=Number(a),isNaN(a)||""==n.val())n.last().addClass("is-invalid");else if(n.removeClass("is-invalid"),n.last().addClass("is-valid"),a=i.val(),a=Number(a),isNaN(a)||""==i.val())i.last().addClass("is-invalid");else if(i.removeClass("is-invalid"),i.last().addClass("is-valid"),a=s.val(),a=Number(a),isNaN(a)||""==s.val())s.last().addClass("is-invalid");else if(s.removeClass("is-invalid"),s.last().addClass("is-valid"),1==(m=function(e){let t,a,n,i={};a=!1,n=!0,e.temperatura_num>=37.5&&(a=!0);e.saturazione<95&&(a=!0);1==e.fTosseSecca&&(a=!0);1==e.fDolMusc&&(a=!0);1==e.fMaleTesta&&(a=!0);1==e.fRinorrea&&(a=!0);1==e.fMaleGola&&(a=!0);1==e.fAstenia&&(a=!0);1==e.fInappetenza&&(a=!0);1==e.fVomito&&(a=!0);1==e.fDiarrea&&(a=!0);1==e.fCongiuntivite&&(a=!0);1==a&&(0==(t=confirm("ATTENZIONE, i parametri inseriti devono essere segnalati, procedere con il salvataggio e successiva segnalazione all'infermiera? \n(verrà creata una nota a diario nella cartella clinica)"))?0==(t=confirm("ATTENZIONE, Salvare lo stesso i dati, SENZA segnalarli all'infermiera?"))?n=!1:(n=!0,a=!1):n=!0);return i.segnala=a,i.save=n,i}(o={ID_OSPITE:l,temperatura_num:n.val(),temperatura:n.val(),saturazione:i.val(),ossigeno:s.val(),fTosseSecca:$("#chkTosse").is(":checked"),fDolMusc:$("#chkDolori").is(":checked"),fMaleTesta:$("#chkMaleTesta").is(":checked"),fRinorrea:$("#chkRinorrea").is(":checked"),fMaleGola:$("#chkMalDiGola").is(":checked"),fAstenia:$("#chkAstenia").is(":checked"),fInappetenza:$("#chkInappetenza").is(":checked"),fVomito:$("#chkVomito").is(":checked"),fDiarrea:$("#chkDiarrea").is(":checked"),fCongiuntivite:$("#chkCongiuntivite").is(":checked"),fNoAlteraz:$("#chkNoAlteraz").is(":checked"),Altro:$("#cmbZona").val()+" -> altro:"+$("#txtAltro").val(),idZona:"1",dataRilevazione:GetDateFormat(c),DtIns:GetDateFormat(c)})).save){var g=JSON.stringify({jwt:u,dbschema:r,dataSchIso:o,controllaParam:m});$.ajax({type:"POST",url:cg_BaseUrl+"/api/schIsolamento/create.php",async:!0,data:g,dataType:"json",success:function(e){let t=e;localStorage.setItem("jwt",t.jwt),d.rows().every(function(){var e=this.data();e.ID_OSPITE==l&&(e.DATA_ORA_ULTIMI=c),this.invalidate()}),d.draw();var a=msgSuccess("Salvataggio avvenuto con successo!",t.message.replace("OSPITE",$("#nomeOspite").val()));$("#response").show(),document.getElementById("response").innerHTML=a,setTimeout(function(){$("#response").hide()},2e3),$("#modalSchIsolamento").modal("hide")},error:function(e){console.log(e),alert("errori nel salvataggio");var t=JSON.parse(e.responseText);alert("scrittura non riuscita "+t);var a=msgAlert(t.error,t.message);document.getElementById("response").innerHTML=a}})}}),$("#btnRefreshDtpOspitiParametri").click(function(e){var t={};t.Schema=$("#schema").val(),t.Piano=$("#paramPiano").val(),t.Camera=""==$("#paramCamera").val()?-1:$("#paramCamera").val(),t.Sezione=$("#paramSezione").val(),LoadDatatables("tableOspitiParametri",t)}),$("#btnRefreshAnomalie").click(function(e){var t={};t.Schema=$("#schema").val(),t.DataDal=$("#dtpDataDal").val(),t.DataAl=$("#dtpDataAl").val(),t.paramTemp=$("#paramTemp").val(),t.paramSat=$("#paramSat").val(),LoadDatatables("tableAnomalieOspiti",t)}),$("#dtpDataDal").focus(function(){t=$(this).val()}).change(function(e){$(this).unbind("focus");let a=$("#dtpDataAl").val();if(e.target.value>a)return alert("Data iniziale maggiore di quella finale!"),$(this).val(t),$(this).bind("focus"),!1;t=$(this).val()}),$("#dtpDataAl").focus(function(){a=$(this).val()}).change(function(e){$(this).unbind("focus");let t=$("#dtpDataDal").val();if(e.target.value<t)return alert("Data finale minore di quella iniziale!"),$(this).val(a),$(this).bind("focus"),!1;a=$(this).val()}),$(":checkbox").change(function(){"chkNoAlteraz"==this.id?this.checked&&(document.getElementById("chkTosse").checked=!1,document.getElementById("chkDolori").checked=!1,document.getElementById("chkMaleTesta").checked=!1,document.getElementById("chkRinorrea").checked=!1,document.getElementById("chkMalDiGola").checked=!1,document.getElementById("chkAstenia").checked=!1,document.getElementById("chkInappetenza").checked=!1,document.getElementById("chkVomito").checked=!1,document.getElementById("chkDiarrea").checked=!1,document.getElementById("chkCongiuntivite").checked=!1,document.getElementById("chkDiarrea").checked=!1):document.getElementById("chkNoAlteraz").checked=!1})}function GetDateFormat(e){var t,a,n;return a=(t=e||new Date).getDate(),n=t.getMonth()+1,t.getFullYear()+"-"+n+"-"+a}function GetDateString(){var e,t,a,n,i=new Date,s=new Array;s[0]="Gennaio",s[1]="Febbraio",s[2]="Marzo",s[3]="Aprile",s[4]="Maggio",s[5]="Giugno",s[6]="Luglio",s[7]="Agosto",s[8]="Settembre",s[9]="Ottobre",s[10]="Novembre",s[11]="Dicembre";var o=new Array;return o[0]="Domenica",o[1]="Lunedì",o[2]="Martedì",o[3]="Mercoledì",o[4]="Giovedì",o[5]="Venerdì",o[6]="Sabato",e=o[i.getDay()]+" ",t=i.getDate()+" ",a=s[i.getMonth()]+" ",n=i.getFullYear()+" ",i.getHours()+":",i.getMinutes()+":",i.getSeconds(),"Oggi è "+e+t+a+n}function msgAlert(e,t){return'<div class="alert border-danger bg-transparent text-secondary fade show" role="alert">\n   <div class="d-flex align-items-center"> \n       <div class="alert-icon"> \n           <span class="icon-stack icon-stack-md"> \n               <i class="base-7 icon-stack-3x color-danger-900"></i> \n               <i class="fal fa-times icon-stack-1x text-white"></i> \n           </span> \n       </div> \n       <div class="flex-1"> \n            <span class="h5 color-danger-900">'+e+"</span> \n           <br> \n          "+t+" \n       </div> \n   </div> \n</div> \n"}function msgSuccess(e,t){return'<div class="alert border-faded bg-transparent text-secondary fade show" role="alert">\n   <div class="d-flex align-items-center"> \n       <div class="alert-icon"> \n           <span class="icon-stack icon-stack-md"> \n               <i class="base-7 icon-stack-3x color-success-600"></i> \n               <i class="fal fa-check icon-stack-1x text-white"></i> \n           </span> \n       </div> \n       <div class="flex-1"> \n            <span class="h5 color-success-600">'+e+"</span> \n           <br> \n          "+t+" \n       </div> \n   </div> \n</div> \n"}function DatetoDesc(e){return moment.locale("it"),moment.updateLocale("it",{invalidDate:""}),moment(e).calendar(null,{sameDay:"[Oggi alle] HH:mm",nextDay:"[Domani]",nextWeek:"dddd",lastDay:"[Ieri alle] HH:mm",lastWeek:"DD/MM/YYYY HH:mm",sameElse:"DD/MM/YYYY"})}function roundTo(e,t){void 0===t&&(t=0);var a=Math.pow(10,t);return e=parseFloat((e*a).toFixed(11)),Math.round(e)/a}function AddWait(e){var t=document.getElementById(e),a=document.createElement("img"),n=document.createAttribute("src"),i=document.createAttribute("id"),s=document.createAttribute("class");n.value="img/ajax-loader.gif",i.value="wait",s.value="align-self: center, position: relative",a.setAttributeNode(n),a.setAttributeNode(i),a.setAttributeNode(s),t.appendChild(a)}switch($.extend({redirectPost:function(e,t){var a="";$.each(t,function(e,t){t=t.split('"').join('"'),a+='<input type="hidden" name="'+e+'" value="'+t+'">'}),$('<form action="'+e+'" method="POST">'+a+"</form>").appendTo($(document.body)).submit()}}),$.fn.serializeObject=function(){var e={},t=this.serializeArray();return $.each(t,function(){void 0!==e[this.name]?(e[this.name].push||(e[this.name]=[e[this.name]]),e[this.name].push(this.value||"")):e[this.name]=this.value||""}),e},!0){case-1!=self.location.href.indexOf("page-login"):window.onload=function(){OnSubmitAjaxLogin(),OnClickSelStruttura()};break;case-1!=self.location.href.indexOf("page-home"):window.onload=function(){Ping(1800),Display("ph-primary_nav","primary_nav"),ajaxpage(cg_BaseUrl+"/page/view/main.tpl.php","ph-main","main"),OnClickbtnLogout()},window.onunload=function(){};break;default:alert("Route non gestita!")}function Ping(e){null===localStorage.getItem("jwt")&&window.location.replace(cg_BaseUrl+"/page/page-login.php");var t,a,n=e,i=setInterval(function(){t=parseInt(n/60,10),a=parseInt(n%60,10),t=t<10?"0"+t:t,a=a<10?"0"+a:a,console.log("Controllo sessione: "+t+":"+a),--n;var e=location.protocol.toString()+"//"+location.hostname.toString(),s=localStorage.getItem("jwt"),o={};if(o.jwt=s,o=JSON.stringify(o),-1===e.indexOf("WebOasi")&&-1===e.indexOf("oasionlus.com")&&-1===e.indexOf("localhost")&&-1===e.indexOf("10.0.2.44")&&-1===e.indexOf("srv2012-mnt")&&-1===e.indexOf("10.0.0.15"))return console.log("Controllo sessione non eseguito: "+t+":"+a),!0;-1!=e.indexOf("localhost")&&(e=cg_BaseUrl),""==s&&(clearInterval(i),window.location.replace(cg_BaseUrl+"/page/page-login.php")),$.ajax({type:"POST",url:cg_BaseUrl+"/api/validate_token.php",async:!0,data:o,dataType:"json",success:function(e,t,a){switch(a.status){case 200:console.log(e);break;case 401:console.log(e);case 500:console.log(e);default:console.log(e),clearInterval(i),window.location.replace(cg_BaseUrl+"/page/page-login.php")}},error:function(e){clearInterval(i),window.location.replace(cg_BaseUrl+"/page/page-login.php")}})},cg_milliSecControlloSessione)}function Display(e,t,a){null===localStorage.getItem("jwt")&&window.location.replace(cg_BaseUrl+"/page/page-login.php");var n=localStorage.getItem("jwt"),i={};i.jwt=n,i=JSON.stringify(i),""===n&&window.location.replace(cg_BaseUrl+"/page/page-login.php"),AddWait(e),$.ajax({type:"POST",url:cg_BaseUrl+"/page/view/"+t+".tpl.php",async:!0,data:i,dataType:"html",beforeSend:function(){$("#wait").show()},success:function(t,a,n){switch(console.log(n),n.status){case 200:document.getElementById(e).innerHTML=t;break;case 401:console.log(t);case 500:console.log(t);default:console.log(t),window.location.replace(cg_BaseUrl+"/page/page-login.php")}},error:function(e){alert("error ajax Display (javascript)"),console.log(e),window.location.replace(cg_BaseUrl+"/page/page-login.php")},complete:function(){$("#wait").hide()}})}