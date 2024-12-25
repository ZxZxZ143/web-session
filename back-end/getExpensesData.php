<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "expense_tracker");

$sql = "SELECT t1.expence_id, t1.price, t1.teg, t1.comment, t1.date, t2.category, t2.icon FROM expenses t1 INNER JOIN categories t2 ON t1.category_id = t2.category_id WHERE t1.user_id = " . $_COOKIE['id'] . " ORDER BY t1.date DESC";
$result = $conn->query($sql);
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$conn->close();
