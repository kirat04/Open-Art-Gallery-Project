let enrollButton = document.getElementById('enrollbutton');

enrollButton.onclick = (event) =>{
    console.log(window.location.href.substring(32));
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("cleared");
            location.reload();
            
        }
    };

    xhttp.open("PUT", "/workshops/"+window.location.href.substring(32), true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}