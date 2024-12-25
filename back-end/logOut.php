<?php


foreach ($_COOKIE as $name => $value) {
    unset($_COOKIE[$name]);
    setcookie($name, null, -1, "/");
}

if (!isset($_COOKIE["id"])) {
    echo json_encode([
       "status" => "success",
       "message" => "User logged out successfully!"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "User hasn't logged out!"
    ]);
}



