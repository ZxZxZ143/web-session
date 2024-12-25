<?php


$conn = new mysqli("localhost", "root", "", "expense_tracker");
if ($_GET['full'] == "true") {
    echo file_get_contents('../assets/icons.json');
    return;
} else {
    $sql = "SELECT icon, COUNT(icon) AS count_icon FROM categories GROUP BY icon ORDER BY count_icon DESC LIMIT 10";
}


$result = $conn->query($sql);
$data = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);

$conn->close();

