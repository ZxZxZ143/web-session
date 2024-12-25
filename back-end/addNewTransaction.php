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
$user_id = intval($_COOKIE['id']);
$price = intval($data['price']);
$category_id = intval($data['category']);
$date = new DateTime($conn->real_escape_string($data['date']));
$date = $date->format('Y-m-d H:i:s');
$teg = $conn->real_escape_string($data['teg']);
$comment = $conn->real_escape_string($data['comment']);

$stmt = $conn->prepare("INSERT INTO expenses (user_id, category_id, price, teg, comment, date) VALUES (?, ?, ?, ?, ?, ?)");

$stmt->bind_param("iiisss", $user_id, $category_id, $price, $teg, $comment, $date);

if ($stmt->execute()) {
    echo json_encode("success");
} else {
    echo json_encode("error");
}

$sql = "SELECT bank FROM bank WHERE user_id = " . $_COOKIE['id'];
$result = $conn->query($sql)->fetch_assoc();

$balance = intval($result['bank']);
$balance = $balance - $price;

$stmt = $conn->prepare("UPDATE bank SET bank = ? WHERE user_id = ?");

$stmt->bind_param("ii", $balance, $_COOKIE['id']);
$stmt->execute();

$conn->close();