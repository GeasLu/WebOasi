<?php


function d($what, $die = 0)//v1.3
//arriva Alberto Cabra
{
  echo "<pre>";
  print_r($what);
  echo "</pre>";
  if ( $die ) {
    die("Thanks for using WEBOASI - Debug procedura bloccata");
  }
}


function redirect_post($url, array $data) {
  ?>
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <script>function inviamodulo() { document.forms["redirectpost"].submit(); }
        </script>
    </head>
    <body onload="inviamodulo();">
      <form name="redirectpost" method="post" action="<?php echo $url; ?>">
          <?php
              if (!is_null($data)) {
                foreach ($data as $k => $v) {
                  echo '<input type="hidden" name="' . $k . '" value="' . $v . '">';
                }
              }
          ?>
      </form>
    </body>
  </html>
  <?php
  exit;
}
