<?php

//parte dallo script page-home.php
include_once '..//api//config//core.php';

/*
 * @param string $mode
 * @return string
 */
function getGitVersion($mode = 'mini')
{
    return "verTemp_20211019_1";


/*    $version = Array();
    exec('git describe --always', $version_mini_hash);
    exec('git rev-list HEAD', $version_number);
    exec('git log -1', $line);
    exec('git log --pretty="%ci" -n1 HEAD', $data);
    exec('git log --pretty="%s" -n1 HEAD', $message);

    $version['short'] = trim($version_number[0]) . "." . $version_mini_hash[0];
    $version['full'] = trim($version_number[0]) . ".$version_mini_hash[0] (" . str_replace('commit ', '', $line[0]) . ")";

    switch ($mode) {
        case "short":
            return $version['short'];
        case "mini":
            return trim(str_replace('commit ', '', $line[0]));
        default:
            return $version['full'] . " - " . $data[0] . " - " . $message[0];
    }*/

};


$ver =  getGitVersion('mini');

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
<script src="http://cdn.datatables.net/plug-ins/1.10.15/dataRender/datetime.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>
<script src="js/statistics/sparkline/sparkline.bundle.js"></script>
<script src="js/statistics/chartjs/chartjs.bundle.js"></script>

<script src="<?=$home_url?>/page/js/myJs/dist/main-min.js" version="<?=$ver?>"></script>

<script>

    $(document).ready(function()
    {

        var jsdisplay = $('#js-display');
        var url = "media/data/plugin-reference.json";

        $.getJSON(url, function(data)
        {
            $.each(data, function(index, value)
            {
                $('.js-plugins').append('<option value="' + value.plugin + '" data-description="' + value.description + '" data-url="' + value.url + '" data-license="' + value.license + '">' + value.plugin + '</option>');
            });
        });

        // SHOW SELECTED VALUE.

        $('.js-plugins').change(function()
        {
            var plugin = this.options[this.selectedIndex].text;
            var url = $('select.js-plugins').find(':selected').data('url');
            var license = $('select.js-plugins').find(':selected').data('license');
            var description = $('select.js-plugins').find(':selected').data('description');

            jsdisplay.removeClass().addClass('d-block')

            $('.js-plugin-name').text(plugin);
            $('.js-plugin-url').text(url);
            $('.js-plugin-url').attr('href', url);
            $('.js-plugin-license').text(license);
            $('.js-plugin-description').text(description);

        });

        /*
     * draw the little mouse speed animated graph this just attaches a handler to the mousemove event to see
     * (roughly) how far the mouse has moved and then updates the display a couple of times a second via
     * setTimeout()
     */
        var drawMouseSpeedDemo = function()
        {
            var mrefreshinterval = 500, // update display every 500ms
                lastmousex = -1,
                lastmousey = -1,
                lastmousetime,
                mousetravel = 0,
                mpoints = [],
                mpoints_max = 30;

            $('html').mousemove(function(e)
            {
                var mousex = e.pageX,
                    mousey = e.pageY;

                if (lastmousex > -1)
                {
                    mousetravel += Math.max(Math.abs(mousex - lastmousex), Math.abs(mousey - lastmousey));
                }
                lastmousex = mousex;
                lastmousey = mousey;
            });

            var mdraw = function()
            {
                var md = new Date();
                var timenow = md.getTime();
                if (lastmousetime && lastmousetime != timenow)
                {
                    var pps = Math.round(mousetravel / (timenow - lastmousetime) * 1000);
                    mpoints.push(pps);
                    if (mpoints.length > mpoints_max)
                        mpoints.splice(0, 1);
                    mousetravel = 0;
                    $('#mousespeed-line').sparkline(mpoints,
                        {
                            type: 'line',
                            width: 210,
                            height: 40,
                            lineColor: color.info._500,
                            fillColor: color.info._50,
                            tooltipSuffix: ' pixels per second'
                        });
                    $('#mousespeed-bar').sparkline(mpoints,
                        {
                            type: 'bar',
                            height: 40,
                            tooltipSuffix: ' pixels per second'
                        });
                }
                lastmousetime = timenow;
                setTimeout(mdraw, mrefreshinterval);
            }
            // we could use setInterval instead, but I prefer to do it this way
            setTimeout(mdraw, mrefreshinterval);
        };

        $(document).ready(function()
        {
            //start refresh chart
            drawMouseSpeedDemo();
        });

        $(function() {
            /** This code runs when everything has been loaded on the page */
            /* Inline sparklines take their values from the contents of the tag */
            $('.inlinesparkline').sparkline();

            /* Sparklines can also take their values from the first argument
            passed to the sparkline() function */
            var myvalues = [10,8,5,7,4,4,1];
            $('.dynamicsparkline').sparkline(myvalues);

            /* The second argument gives options such as chart type */
            $('.dynamicbar').sparkline(myvalues, {type: 'bar', barColor: 'green'} );

            /* Use 'html' instead of an array of values to pass options
            to a sparkline with data in the tag */
            $('.inlinebar').sparkline('html', {type: 'bar', barColor: 'red'} );
        });


    });




</script>