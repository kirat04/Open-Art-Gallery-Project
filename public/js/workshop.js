let enrollButton = document.getElementById('enrollbutton');
//send a put request to either enroll or unenroll from the workshop
enrollButton.onclick = (event) =>{
    console.log(window.location.href.substring(32));
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            location.reload();
            
        }
    };

    xhttp.open("PUT", "/workshop/workshops/"+window.location.href.substring(32), true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}