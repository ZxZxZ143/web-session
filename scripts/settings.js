function logOut() {
    fetch("http://localhost/web_session/back-end/logOut.php")
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.status === "success") {
                redirectToIndex();
                window.location.reload();
            }
        })
}
