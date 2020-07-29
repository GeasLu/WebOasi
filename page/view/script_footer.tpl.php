<?php

//parte dallo script page-home.php
include_once '..//api//config//core.php';

?>
<!-- script di SMART ADMIN togliere quello che non serve.... -->
<!-- base vendor bundle: 
                 DOC: if you remove pace.js from core please note on Internet Explorer some CSS animations may execute before a page is fully loaded, resulting 'jump' animations 
                                        + pace.js (recommended)
                                        + jquery.js (core)
                                        + jquery-ui-cust.js (core)
                                        + popper.js (core)
                                        + bootstrap.js (core)
                                        + slimscroll.js (extension)
                                        + app.navigation.js (core)
                                        + ba-throttle-debounce.js (core)
                                        + waves.js (extension)
                                        + smartpanels.js (extension)
                                        + src/../jquery-snippets.js (core) -->
<script src="http://code.jquery.com/jquery-1.6.4.min.js" type="text/javascript"></script>

<script id="__bs_script__">//<![CDATA[
    document.write("<script async src='http://HOST:3000/browser-sync/browser-sync-client.js?v=2.26.10'><\/script>".replace("HOST", location.hostname));
    //]]>
</script>

<script src="js/vendors.bundle.js"></script>
<script src="js/app.bundle.js"></script>
<script type="text/javascript">
    /* Activate smart panels */
    $('#js-page-content').smartPanel();
</script>
<!-- The order of scripts is irrelevant. Please check out the plugin pages for more details about these plugins below: -->
<script src="js/dependency/moment/moment.js"></script>
<script src="js/miscellaneous/fullcalendar/fullcalendar.bundle.js"></script>
<script src="js/statistics/easypiechart/easypiechart.bundle.js"></script>
<script src="js/miscellaneous/jqvmap/jqvmap.bundle.js"></script>
<script src="js/datagrid/datatables/datatables.bundle.js"></script>
<script src="js/datagrid/datatables/datatables.export.js"></script>

<script src="<?=$home_url?>/page/js/myJs/dist/main-min.js"></script>

