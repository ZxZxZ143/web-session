<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if ($data) {
    $conn = new mysqli("localhost", "root", "", "expense_tracker");

    $sql = "SELECT login, id, name, password FROM users WHERE login = '" . $data["login"] . "' LIMIT 1";

    $result = $conn->query($sql)->fetch_assoc();
    if ($result == null || $result["password"] != $data["password"]) {
        echo json_encode([
            "status" => "error",
            "message" => "wrong data"
        ]);
        return;
    }

    echo json_encode([
        "status" => "success",
        "message" => "success",
        "data" => $data
    ]);

    setcookie('login', $result['login'], time() + (3600), "/");
    setcookie('name', $result['name'], time() + (3600), "/");
    setcookie('id', $result['id'], time() + (3600), "/");

    $conn->close();
} else {
    echo json_encode([
        "status" => "error",
        "message" => "no data"
    ]);
}
