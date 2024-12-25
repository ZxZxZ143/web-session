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
$category = $conn->real_escape_string($data['name']);
$icon = $conn->real_escape_string($data['icon']);

$stmt = $conn->prepare("INSERT INTO categories (user_id, category, icon) VALUES (?, ?, ?)");

$stmt->bind_param("iss", $user_id, $category, $icon);

if ($stmt->execute()) {
    echo json_encode('New record created successfully');
} else {
    echo json_encode('Error');
}

$conn->close();
