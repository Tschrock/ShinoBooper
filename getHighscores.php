<?php
require_once './dbConnect.php';
setupDbCon();
echo json_encode(doQueryArr("SELECT h.*, @rownum := @rownum + 1 AS Rank FROM Highscores h, (SELECT @rownum := 0) r ORDER BY h.Bps DESC, h.Boops DESC LIMIT " . min([($tmp = intval($_GET["amount"])) === 0 ? 50 : $tmp, 100]) . " OFFSET " . (($tmp = intval($_GET["offset"])) === 0 ? 0 : $tmp)));