let createButton = document.getElementById("createbutton");

//send a post request for a new user with the specified username and password
createButton.onclick = (event)=>{
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let createBundle = {user: username, pass:password};

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Account created");
            window.location.href = "/user/login";
        }
        else if(this.readyState == 4 && this.status == 400) {
            //if user name already exists, show an alert that user creation failed
            alert("Username already exists, please input a different username");
        }
    }

    xhttp.open("POST", "/user/user", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(createBundle));
}