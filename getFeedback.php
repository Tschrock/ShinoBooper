<?php
require_once './dbConnect.php';
setupDbCon();
echo json_encode(doQueryArr("SELECT f.*, @rownum := @rownum + 1 AS Rank FROM Feedback f, (SELECT @rownum := 0) r ORDER BY f.Likes DESC LIMIT " . min([($tmp = (isset($_GET["amount"]) ? intval($_GET["amount"]) : 0)) === 0 ? 50 : $tmp, 100]) . " OFFSET " . (($tmp = (isset($_GET["offset"]) ? intval($_GET["offset"]) : 0)) === 0 ? 0 : $tmp)));