let deleteNotifsButton = document.getElementById("delNotif");

deleteNotifsButton.onclick = (event)=>{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("cleared");
            
        }
    };

    xhttp.open("PUT", "/notif", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}