<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


$inputJSON = file_get_contents('php://input');

$data = json_decode($inputJSON, true);
if (!isset($_COOKIE['id'])) {
    echo json_encode("error");
    return;
}

$conn = new mysqli("localhost", "root", "", "expense_tracker");
$income = intval($data['income']);

$sql = "SELECT bank FROM bank WHERE user_id = " . $_COOKIE['id'];

$result = $conn->query($sql)->fetch_assoc();

$newBalance = $result['bank'] + $income;

$sql = "UPDATE bank SET bank = ? WHERE user_id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("ii", $newBalance, $_COOKIE['id']);

if ($stmt->execute()) {
    echo json_encode([
    "status" => "success",
    "message" => $newBalance
    ]);
} else {
    echo json_encode("error");
}

$conn->close();