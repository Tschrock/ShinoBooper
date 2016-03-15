<?php

require_once './dbConnect.php';

if (isset($_POST["action"]) && isset($_POST["id"]) && is_numeric($_POST["id"])) {

    if ($_POST["action"] == "addLike") {
        setupDbCon();
        doQuery("UPDATE Feedback f SET f.Likes = f.Likes + 1 WHERE f.Id = " . intval($_POST["id"]));
        echo '{"status": "OK", "newCount": ' . mysqli_fetch_assoc(doQuery("SELECT Likes FROM Feedback WHERE Id = " . intval($_POST["id"])))["Likes"] . '}';
        
    } else if ($_POST["action"] == "removeLike") {
        setupDbCon();
        doQuery("UPDATE Feedback f SET f.Likes = f.Likes - 1 WHERE f.Id = " . intval($_POST["id"]));
        echo '{"status": "OK", "newCount": ' . mysqli_fetch_assoc(doQuery("SELECT Likes FROM Feedback WHERE Id = " . intval($_POST["id"])))["Likes"] . '}';
        
        
        
    } else {
        echo '{"status": "ERROR", "error": "Invalid ' . "'action'" . '"}';
    }
}
else {
    echo '{"status": "ERROR", "error": "Invalid Request"}';
}