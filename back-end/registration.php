<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if ($data) {
    $conn = new mysqli("localhost", "root", "", "expense_tracker");

    $sql = "SELECT login FROM users WHERE login = '" . $data["login"] . "' LIMIT 1";

    $result = $conn->query($sql)->fetch_assoc();
    if ($result != null) {
        echo json_encode([
            "status" => "error",
            "message" => "login already exists"
        ]);
        return;
    }

    $sql = "INSERT INTO users (login, password, name) VALUES (?, ?, ?)";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("sss", $data["login"], $data["password"], $data["name"]);

    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "success",
            "data" => $data
        ]);



        setcookie('login', $data['login'], time() + (3600), "/");
        setcookie('name', $data['name'], time() + (3600), "/");

        $sql = "SELECT id FROM users WHERE login = '" . $data["login"] . "' LIMIT 1";
        $result = $conn->query($sql)->fetch_assoc();

        setcookie('id', $result['id'], time() + (3600), "/");

        $sql = "INSERT INTO bank (user_id, bank) VALUES (?, ?)";

        $stmt = $conn->prepare($sql);

        $balance = 0;
        $stmt->bind_param("ii", $result['id'], $balance);
        $stmt->execute();
        $conn->close();
    } else {
        echo json_encode([
            "status" => "error",
            "message" => $stmt->error
        ]);
        return;
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "no data"
    ]);
}
