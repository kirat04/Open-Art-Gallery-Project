let createButton = document.getElementById("createbutton");

createButton.onclick = (event)=>{
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let createBundle = {user: username, pass:password};

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Account created");
        }
        else if(this.readyState == 4 && this.status == 400) {
            alert("Username already exists, please input a different username");
        }
    }

    xhttp.open("POST", "/user", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(createBundle));
}