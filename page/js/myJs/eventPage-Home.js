function OnClickbtnLogout() {
    //Luke 05/05/2020
    let btnClick = $('#ph-btnLogout');
    btnClick.click(function (ev) {
        localStorage.removeItem('jwt');
        window.location.replace(cg_BaseUrl + '/page/page-login.php'); //spedisco alla pagina di login...
    });
}

function OnClicMenuPrimary(object) {
    //Luke 06/07/2020
    let app = object.name;
    ajaxpage(cg_BaseUrl + '/page/view/' + app + '.tpl.php', 'ph-main', app);
}