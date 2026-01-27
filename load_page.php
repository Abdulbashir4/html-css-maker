<?php

$page = $_GET['page'] ?? '';

$page = preg_replace("/[^a-zA-Z0-9_-]/","",$page);


/* =========================
   LOAD EDITABLE JSON FIRST
========================= */

$jsonFile = __DIR__ . "/pages/" . $page . ".json";

if(file_exists($jsonFile)){
  echo file_get_contents($jsonFile);
  exit;
}


/* =========================
   FALLBACK TO PHP PAGE
========================= */

$file = __DIR__ . "/pages/" . $page . ".php";

if(!file_exists($file)){
  echo "";
  exit;
}

$html = file_get_contents($file);

// extract body content
if(preg_match("/<body[^>]*>(.*?)<\/body>/s",$html,$match)){
  echo trim($match[1]);
} else {
  echo "";
}
