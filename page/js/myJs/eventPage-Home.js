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
    let schema = object.name;
    let view =   object.name;
    let liTmp = $(object.parentNode);
    let clsTmp = '';

    if(schema.indexOf("-") !== -1){
        schema = schema.substr(0,schema.indexOf("-"))
    }
    switch (true) {
        case (liTmp[0].id=='lv1') :
            clsTmp ='active open';
            break;
        case (liTmp[0].id=='lv2') :
            clsTmp ='active';
            break;
        default:
            clsTmp ='active open';
            break;
    }

    // tolgo lo stato active open da tutti...
    let ulTmp = $(object.parentNode.parentNode);
    $(ulTmp).find('li').each(function(){
        var current = $(this); // qui punto all'elemnto ciclato nel for each quindi LI puntato
        current.removeClass(clsTmp); //qua rimuovo la classe active open
    });
    // lo metto solo all'LI parent dell'elemento cliccato (perchè il click ce l'ho sul tag A del menu e non sull'LI)
    liTmp.last().addClass(clsTmp);

    ajaxpage(cg_BaseUrl + '/page/view/' + view + '.tpl.php', 'ph-main', view, schema);
}

