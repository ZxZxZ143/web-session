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

$expense_id = intval($data["id"]);

$stmt = $conn->prepare("SELECT t2.bank FROM expenses t1 INNER JOIN bank t2 ON t1.user_id = t2.user_id WHERE t1.expence_id = ?");
$stmt->bind_param("i", $expense_id);
$stmt->execute();

$result = $stmt->get_result()->fetch_assoc();
$bank = $result["bank"];

$stmt = $conn->prepare("SELECT price FROM expenses WHERE expence_id = ?");
$stmt->bind_param("i", $expense_id);
$stmt->execute();

$result = $stmt->get_result()->fetch_assoc();

$newBalance = $result["price"] + $bank;

$stmt = $conn->prepare("UPDATE bank SET bank = ? WHERE user_id = ?");

$stmt->bind_param("ii", $newBalance, $_COOKIE['id']);
$stmt->execute();

$stmt = $conn->prepare("DELETE FROM expenses WHERE expence_id = ?");

$stmt->bind_param("i", $expense_id);

if ($stmt->execute()) {
    echo json_encode("success");
} else {
    echo json_encode("error");
}

$conn->close();

