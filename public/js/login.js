let loginButton = document.getElementById("loginbutton");

loginButton.onclick = (event)=>{
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let loginBundle = {user: username, pass:password};

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("logged in");
            console.log(this.response);
            window.location = '/homepage';
            
        }
    };

    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(loginBundle));
}