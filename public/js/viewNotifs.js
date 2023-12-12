let deleteNotifsButton = document.getElementById("delNotif");
//if delete notif button is clicked, make sure to confirm with user and send a put request to the server to remove all notifications for this user
deleteNotifsButton.onclick = (event)=>{
    if(confirm("Delete all notifications?"))
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            location.reload();
        }
    };

    xhttp.open("PUT", "/user/notif", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}