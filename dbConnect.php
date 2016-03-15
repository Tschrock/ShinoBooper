<?php

require_once './dbConfig.php';

$mysqlkv;

function setupDbCon() {
    global $mysqlkv, $dbserver, $dbuser, $dbpass, $dbname;
    $mysqlkv = new mysqli($dbserver, $dbuser, $dbpass, $dbname);
    if ($mysqlkv->connect_error) {
        die('Connect Error (' . $mysqlkv->connect_errno . ') '
                . $mysqlkv->connect_error);
    }
}

function doQuery($sql) {
    global $mysqlkv;
    return mysqli_query($mysqlkv, $sql);
}

function doQueryArr($sql) {
    for ($res = array(), $qRslt = doQuery($sql); $qRslt !== false && $tmp = $qRslt->fetch_assoc(); $res[] = $tmp);
    return $res;
}
