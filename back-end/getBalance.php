<?php

header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "expense_tracker");

if (!isset($_COOKIE['id'])) {
    echo json_encode("error");
    return;
}

$sql = "SELECT bank FROM bank WHERE user_id = " . $_COOKIE['id'];
$result = $conn->query($sql)->fetch_assoc();

echo json_encode($result);

$conn->close();