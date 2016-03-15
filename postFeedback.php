<?php

require_once './dbConnect.php';

if (isset($_POST['fbType']) && isset($_POST['fbName']) && isset($_POST['fbMsg'])) {

    if (is_numeric($_POST['fbType']) && trim($_POST['fbName']) !== "" && trim($_POST['fbMsg']) !== "") {
        $typeNum = intval($_POST['fbType']);
        $type = $typeNum == 1 ? "Feedback" : ($typeNum == 2 ? "Feature" : ($typeNum == 3 ? "Bug" : "Why you do this to me!?!?!?"));
        setupDbCon();
        $stmt = $mysqlkv->prepare('INSERT INTO  `shinobooper`.`Feedback` (`Id` ,`From` ,`Message` ,`Type` ,`Likes` ,`SubmitDate`) VALUES (NULL, ?, ?, ?,  0,  NOW());');
        $stmt->bind_param('sss', htmlentities(trim($_POST['fbName'])), htmlentities(trim($_POST['fbMsg'])), $type
        );

        $stmt->execute();
        echo '{"status": "OK", "newId": ' . $mysqlkv->insert_id . '}';
    } else {
        echo '{"status": "ERROR", "error": "incomplete"}';
    }
} else {
    echo '{"status": "ERROR", "error": "Invalid Request"}';
}