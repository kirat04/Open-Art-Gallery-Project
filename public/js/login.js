let loginButton = document.getElementById("loginbutton");

//if the login button is clicked, send a post request to the server with the username and password
loginButton.onclick = (event)=>{
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let loginBundle = {user: username, pass:password};

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("logged in");
            console.log(this.response);
            window.location = '/user/homepage';
            
        }
        if (this.readyState == 4 && this.status == 400) {
            alert("User doesn't exist");
            console.log(this.response);
            
            
        }
    };

    xhttp.open("POST", "/user/login", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(loginBundle));
}