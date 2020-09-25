
function OnSubmitAjaxLogin() {
    //Luke 09/04/2020
    var frm = $('#login_form');
    frm.submit(function (ev)
    {
        // get data
        var username = document.getElementById('txtUtente').value;
        var password = document.getElementById('txtPass').value;
        var idStruttura = document.getElementById('idStruttura').value;

        var dataJson = JSON.stringify({'username': username, 'password': password, 'idStruttura': idStruttura})

        // send data
        $.ajax({
            type: "POST",
            url: "../api/login.php",
            data: dataJson,
            context: document.body,
            async: true,
            datatype: "json",
            success: function (res, stato)
            {
                try {
                    // da stringa a oggetto JSON...
                    console.log("ajax ok but: " + res);
                    console.log(res);
                    let jResponse = res;

                    if (jResponse.message_system !== "") {
                        document.getElementById('message_system').innerHTML = "<strong>" + jResponse.message_system + "</strong>";
                    }

                    var html = msgSuccess(jResponse.message_title, jResponse.message_body);
                    document.getElementById('response').innerHTML = html;

                    //memorizzo il token nello storage...
                    localStorage.setItem('jwt', jResponse.jwt);
                    //window.location.replace('page-home.php');

                    var paramSend = {};
                    paramSend['jwt'] = jResponse.jwt;
                    paramSend = JSON.stringify(paramSend);

                    $.redirectPost('page-home.php', JSON.parse(paramSend));

                } catch (e) {
                    console.log(e);
                    alert('Erroe ajax try' + e);
                }
            },
            error: function (jqXHR, exception)
            {
                var msg = '';
                console.log(jqXHR.responseText);

                var jResponse = JSON.parse(jqXHR.responseText);

                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 401) {
                    msg = 'Da rest api: ' + jResponse.message_body + ' \n';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jResponse.message_body;
                }
                // scrtivo messagi di sistema
                if (jResponse.message_system !== "") {
                    document.getElementById('message_system').innerHTML = "<strong>" + jResponse.message_system + "</strong>";
                }
                var html = alertMsg(jResponse.message_title, msg);
                document.getElementById('response').innerHTML = html;
            }
        });
        ev.preventDefault();
        return false;
    });
}


function OnClickSelStruttura() {
    //Luke 17/04/2020
    var btnClick = $('.btn-primary');
    btnClick.click(function (ev) {
        let hiddenIdStrutt = document.getElementById('idStruttura');
        if (this.value > -1) {
            hiddenIdStrutt.value = this.value;
        } else {
            hiddenIdStrutt.value = -1;
        }
    });
}

