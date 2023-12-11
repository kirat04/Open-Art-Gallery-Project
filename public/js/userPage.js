let followButton = document.getElementById("follow");

//send a put request to the server to update the follow value for this user
followButton.onclick = (event)=>{
    console.log(window.location.href.substring(21));
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            location.reload();
            
        }
    };

    xhttp.open("PUT", window.location.href.substring(21), true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}