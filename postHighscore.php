<?php

require_once './dbConnect.php';

if (isset($_POST['hsName']) && isset($_POST['Boops']) && isset($_POST['HBoops']) && isset($_POST['Bps'])) {

    if (trim($_POST['hsName']) !== "" && is_numeric($_POST['Boops']) && is_numeric($_POST['HBoops']) && is_numeric($_POST['Bps'])) {
        setupDbCon();
        $stmt = $mysqlkv->prepare('INSERT INTO `shinobooper`.`Highscores` (`Id` ,`Name` ,`Boops` ,`Hboops` ,`Bps` ,`Date`) VALUES (NULL, ?, ?, ?,  ?,  NOW());');
        $stmt->bind_param('siii', htmlentities(trim($_POST['hsName'])), intval($_POST['Boops']), intval($_POST['HBoops']), intval($_POST['Bps']));

        $stmt->execute();
        echo '{"status": "OK", "newId": ' . $mysqlkv->insert_id . '}';
    } else {
        echo '{"status": "ERROR", "error": "incomplete"}';
    }
} else {
    echo '{"status": "ERROR", "error": "Invalid Request"}';
}