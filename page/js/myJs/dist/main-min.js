const cg_MinCheckSession=30,cg_milliSecControlloSessione=3e4,cg_BaseUrl="http://10.0.2.44/WebOasi";function GetDateFormat(e){var t,a,n;return a=(t=e||new Date).getDate(),n=t.getMonth()+1,t.getFullYear()+"-"+n+"-"+a}function GetDateString(){var e,t,a,n,o=new Date,r=new Array;r[0]="Gennaio",r[1]="Febbraio",r[2]="Marzo",r[3]="Aprile",r[4]="Maggio",r[5]="Giugno",r[6]="Luglio",r[7]="Agosto",r[8]="Settembre",r[9]="Ottobre",r[10]="Novembre",r[11]="Dicembre";var s=new Array;return s[0]="Domenica",s[1]="Lunedì",s[2]="Martedì",s[3]="Mercoledì",s[4]="Giovedì",s[5]="Venerdì",s[6]="Sabato",e=s[o.getDay()]+" ",t=o.getDate()+" ",a=r[o.getMonth()]+" ",n=o.getFullYear()+" ",o.getHours()+":",o.getMinutes()+":",o.getSeconds(),"Oggi è "+e+t+a+n}function msgAlert(e,t){return'<div class="alert border-danger bg-transparent text-secondary fade show" role="alert">\n   <div class="d-flex align-items-center"> \n       <div class="alert-icon"> \n           <span class="icon-stack icon-stack-md"> \n               <i class="base-7 icon-stack-3x color-danger-900"></i> \n               <i class="fal fa-times icon-stack-1x text-white"></i> \n           </span> \n       </div> \n       <div class="flex-1"> \n            <span class="h5 color-danger-900">'+e+"</span> \n           <br> \n          "+t+" \n       </div> \n   </div> \n</div> \n"}function msgSuccess(e,t){return'<div class="alert border-faded bg-transparent text-secondary fade show" role="alert">\n   <div class="d-flex align-items-center"> \n       <div class="alert-icon"> \n           <span class="icon-stack icon-stack-md"> \n               <i class="base-7 icon-stack-3x color-success-600"></i> \n               <i class="fal fa-check icon-stack-1x text-white"></i> \n           </span> \n       </div> \n       <div class="flex-1"> \n            <span class="h5 color-success-600">'+e+"</span> \n           <br> \n          "+t+" \n       </div> \n   </div> \n</div> \n"}$.extend({redirectPost:function(e,t){var a="";$.each(t,function(e,t){t=t.split('"').join('"'),a+='<input type="hidden" name="'+e+'" value="'+t+'">'}),$('<form action="'+e+'" method="POST">'+a+"</form>").appendTo($(document.body)).submit()}}),$.fn.serializeObject=function(){var e={},t=this.serializeArray();return $.each(t,function(){void 0!==e[this.name]?(e[this.name].push||(e[this.name]=[e[this.name]]),e[this.name].push(this.value||"")):e[this.name]=this.value||""}),e};var loadedobjects="",rootdomain="http://"+window.location.hostname;function ajaxpage(e,t,a){var n=localStorage.getItem("jwt"),o=!1;if(window.XMLHttpRequest)o=new XMLHttpRequest;else{if(!window.ActiveXObject)return!1;try{o=new ActiveXObject("Msxml2.XMLHTTP")}catch(e){try{o=new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}}}o.onreadystatechange=function(){loadpage(o,t,a)},o.open("POST",e,!0),o.setRequestHeader("Content-type","application/x-www-form-urlencoded"),o.send("jwt="+n)}function loadpage(e,t,a){if(4==e.readyState&&(200==e.status||-1==window.location.href.indexOf("http")))switch(document.getElementById(t).innerHTML=e.responseText,a.toUpperCase()){case"MAIN":ImpostaBreadCrumb(0,"WebOasi Home"),LoadCalendar();break;case"SCADENZE":ImpostaBreadCrumb(2,"Scadenze"),LoadCalendar();break;default:var n=msgAlert("Errore Pagina Ajax","Statu: "+e.status);$("#response").show(),document.getElementById("response").innerHTML=n,setTimeout(function(){$("#response").hide()},5e3),ajaxpage(cg_BaseUrl+"/page/view/main.tpl.php","ph-main")}}function loadobjs(){if(document.getElementById)for(i=0;i<arguments.length;i++){var e=arguments[i],t="";-1==loadedobjects.indexOf(e)&&(-1!=e.indexOf(".js")?((t=document.createElement("script")).setAttribute("type","text/javascript"),t.setAttribute("src",e)):-1!=e.indexOf(".css")&&((t=document.createElement("link")).setAttribute("rel","stylesheet"),t.setAttribute("type","text/css"),t.setAttribute("href",e))),""!=t&&(document.getElementsByTagName("head").item(0).appendChild(t),loadedobjects+=e+" ")}}switch(!0){case-1!=self.location.href.indexOf("page-login"):window.onload=function(){OnSubmitAjaxLogin(),OnClickSelStruttura(),HelloWorld()};break;case-1!=self.location.href.indexOf("page-home"):window.onload=function(){Ping(1800),Display("ph-primary_nav","primary_nav"),ajaxpage(cg_BaseUrl+"/page/view/main.tpl.php","ph-main","main"),OnClickbtnLogout()},window.onunload=function(){};break;default:alert("Route non gestita!")}function ImpostaBreadCrumb(e,t){var a,n=new Array(e);0==e&&(localStorage.removeItem("breadcrumb"),console.log("canellata breadcrumb")),null===localStorage.getItem("breadcrumb")?(a={desc:"WebOasi Home",url:"#"},n.push(a),a={desc:"Dashboard User",url:"#"},n.push(a),localStorage.setItem("breadcrumb",JSON.stringify(n)),t="Dashboard User"):(a={desc:t,url:"#"},(n=JSON.parse(localStorage.getItem("breadcrumb")))[e]=a,localStorage.setItem("breadcrumb",JSON.stringify(n)),console.log(n)),RefreshBreadCrumb(t)}function RefreshBreadCrumb(e){var t=new Array;if(null!==localStorage.getItem("breadcrumb")){var a;t=JSON.parse(localStorage.getItem("breadcrumb")),console.log("*************************************************************"),console.log(t),a="";for(let n in t)e==t[n].desc?a+='  <li class="breadcrumb-item active"><a href="'+t[n].url+';">'+t[n].desc+"</a></li> \n":a+='  <li class="breadcrumb-item"><a href="'+t[n].url+';">'+t[n].desc+"</a></li> \n";a+='  <li class="position-absolute pos-center pos-left d-none d-sm-block"><br> \n',a+='  <div id="ph-get-date" style="color:#a6a4a6" >'+GetDateString()+"</div></li> \n",console.log(a),document.getElementById("ph-breadcrumb").innerHTML=a}}function LoadCalendar(e,t){var a,n,o,r=new Date,s=localStorage.getItem("jwt");a=e||new Date(r.getFullYear(),r.getMonth(),1),n=t||new Date(r.getFullYear(),r.getMonth()+1,0);var i=JSON.stringify({jwt:s,dbschema:"Scadenze",dtInizio:GetDateFormat(a),dtFine:GetDateFormat(n)});$.ajax({type:"POST",url:cg_BaseUrl+"/api/eventi/read.php",async:!0,data:i,dataType:"json",success:function(e){let t,a,n=e;localStorage.setItem("jwt",n.jwt),o=n.eventi;var r=[];for(t in o)for(a in o[t].elnEventiDet){let e={ID:o[t].elnEventiDet[a].idRow,title:o[t].evento,start:o[t].elnEventiDet[a].dataOccorrenza,description:o[t].evento_esteso,className:o[t].classCSS};r.push(e)}var s=document.getElementById("calendar"),i=new FullCalendar.Calendar(s,{plugins:["dayGrid","list","timeGrid","interaction","bootstrap"],themeSystem:"bootstrap",timeZone:"UTC",dateAlignment:"month",buttonText:{today:"Oggi",month:"Mensile",week:"Settimanale",day:"Giornaliera",list:"lista"},eventTimeFormat:{hour:"numeric",minute:"2-digit",meridiem:"short"},navLinks:!0,header:{left:"prev,next today addEventButton",center:"title",right:"dayGridMonth,timeGridWeek,timeGridDay,listWeek"},footer:{left:"",center:"",right:""},customButtons:{addEventButton:{text:"+",click:function(){$("#sc-Evento").modal({backdrop:!1})}}},editable:!0,eventLimit:!0,events:r,viewSkeletonRender:function(){$(".fc-toolbar .btn-default").addClass("btn-sm"),$(".fc-header-toolbar h2").addClass("fs-md"),$("#calendar").addClass("fc-reset-order")}});i.on("dateClick",function(e){console.log("clicked on "+e.dateStr)}),i.render()},error:function(e){var t=JSON.parse(e.responseText),a=msgAlert(t.error,t.message);document.getElementById("response").innerHTML=a}})}function OnClickSelStruttura(){$(".btn-primary").click(function(e){let t=document.getElementById("idStruttura");this.value>-1?t.value=this.value:t.value=-1})}function OnClickbtnLogout(){$("#ph-btnLogout").click(function(e){localStorage.removeItem("jwt"),window.location.replace(cg_BaseUrl+"/page/page-login.php")})}function OnClicMenuPrimary(e){var t=e.name;ajaxpage(cg_BaseUrl+"/page/view/"+t+".tpl.php","ph-main",t)}function OnSubmitAjaxLogin(){$("#login_form").submit(function(e){var t=document.getElementById("txtUtente").value,a=document.getElementById("txtPass").value,n=document.getElementById("idStruttura").value,o=JSON.stringify({username:t,password:a,idStruttura:n});return $.ajax({type:"POST",url:"../api/login.php",data:o,context:document.body,async:!0,datatype:"json",success:function(e,t){try{console.log("ajax ok but: "+e),console.log(e);let t=e;""!==t.message_system&&(document.getElementById("message_system").innerHTML="<strong>"+t.message_system+"</strong>");var a=msgSuccess(t.message_title,t.message_body);document.getElementById("response").innerHTML=a,localStorage.setItem("jwt",t.jwt);var n={};n.jwt=t.jwt,n=JSON.stringify(n),$.redirectPost("page-home.php",JSON.parse(n))}catch(e){console.log(e),alert("Erroe ajax try"+e)}},error:function(e,t){var a="";console.log(e.responseText);var n=JSON.parse(e.responseText);a=0===e.status?"Not connect.\n Verify Network.":401==e.status?"Da rest api: "+n.message_body+" \n":404==e.status?"Requested page not found. [404]":500==e.status?"Internal Server Error [500].":"parsererror"===t?"Requested JSON parse failed.":"timeout"===t?"Time out error.":"abort"===t?"Ajax request aborted.":"Uncaught Error.\n"+n.message_body,""!==n.message_system&&(document.getElementById("message_system").innerHTML="<strong>"+n.message_system+"</strong>");var o=alertMsg(n.message_title,a);document.getElementById("response").innerHTML=o}}),e.preventDefault(),!1})}function Ping(e){null===localStorage.getItem("jwt")&&window.location.replace(cg_BaseUrl+"/page/page-login.php");var t,a,n=e,o=setInterval(function(){t=parseInt(n/60,10),a=parseInt(n%60,10),t=t<10?"0"+t:t,a=a<10?"0"+a:a,console.log("Controllo sessione: "+t+":"+a),--n;var e=location.protocol.toString()+"//"+location.hostname.toString(),r=localStorage.getItem("jwt"),s={};if(s.jwt=r,s=JSON.stringify(s),-1===e.indexOf("WebOasi")&&-1===e.indexOf("oasionlus.com")&&-1===e.indexOf("localhost")&&-1===e.indexOf("10.0.2.44"))return!0;-1!=e.indexOf("localhost")&&(e=cg_BaseUrl),""==r&&(clearInterval(o),window.location.replace(cg_BaseUrl+"/page/page-login.php")),$.ajax({type:"POST",url:cg_BaseUrl+"/api/validate_token.php",async:!0,data:s,dataType:"json",success:function(e,t,a){switch(a.status){case 200:console.log(e);break;case 401:console.log(e),alert("dentro if prima del redirect ");case 500:console.log(e);default:console.log(e),clearInterval(o),window.location.replace(cg_BaseUrl+"/page/page-login.php")}},error:function(e){console.log(e),clearInterval(o),window.location.replace(cg_BaseUrl+"/page/page-login.php")}})},cg_milliSecControlloSessione)}function Display(e,t,a){null===localStorage.getItem("jwt")&&window.location.replace(cg_BaseUrl+"/page/page-login.php");var n=localStorage.getItem("jwt"),o={};o.jwt=n,o=JSON.stringify(o),""===n&&window.location.replace(cg_BaseUrl+"/page/page-login.php");var r=document.getElementById(e),s=document.createElement("img"),i=document.createAttribute("src"),l=document.createAttribute("id"),c=document.createAttribute("class");i.value="img/ajax-loader.gif",l.value="wait",c.value="align-self: center, position: relative",s.setAttributeNode(i),s.setAttributeNode(l),s.setAttributeNode(c),r.appendChild(s),$.ajax({type:"POST",url:cg_BaseUrl+"//page//view//"+t+".tpl.php",async:!0,data:o,dataType:"html",beforeSend:function(){$("#wait").show()},success:function(t,a,n){switch(console.log(n),n.status){case 200:console.log(t),document.getElementById(e).innerHTML=t;break;case 401:console.log(t),alert("dentro if prima del redirect ");case 500:console.log(t);default:console.log(t),window.location.replace(cg_BaseUrl+"/page/page-login.php")}},error:function(e){alert("error ajax Display (javascript)"),console.log(e),window.location.replace(cg_BaseUrl+"/page/page-login.php")},complete:function(){$("#wait").hide()}})}