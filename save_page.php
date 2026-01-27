<?php

$page = $_POST['page'] ?? 'home';
$html = $_POST['html'] ?? '';
$json = $_POST['json'] ?? '';   // 🔹 builder editable html

$page = preg_replace("/[^a-zA-Z0-9_-]/","",$page);

$folder = __DIR__ . "/pages";

if(!is_dir($folder)){
  mkdir($folder,0777,true);
}

/* =========================
   SAVE EDITABLE STRUCTURE
========================= */

$jsonFile = $folder . "/" . $page . ".json";
file_put_contents($jsonFile, $json);



/* =========================
   SAVE LIVE HTML PAGE
========================= */

$file = $folder . "/" . $page . ".php";

$template_start = <<<HTML
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>$page</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body>

HTML;

$template_end = <<<HTML

</body>
</html>
HTML;

if(file_exists($file)){
  $existing = file_get_contents($file);

  $updated = str_replace(
    "</body>",
    $html . "\n</body>",
    $existing
  );

  file_put_contents($file,$updated);
}
else{
  file_put_contents(
    $file,
    $template_start . $html . $template_end
  );
}

echo "saved";
