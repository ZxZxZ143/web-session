<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "expense_tracker");

if (!isset($_COOKIE['id'])) {
    echo json_encode("error");
    return;
}

$sql = "SELECT category_id, category, icon FROM categories WHERE user_id = " . $_COOKIE['id'] . " ORDER BY category_id ASC";
$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$conn->close();

