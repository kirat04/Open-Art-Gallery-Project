let openReview = document.getElementById("leaveReview");
let likeButton = document.getElementById("likebutton");
let reviewButton = document.getElementById("submitreview");
if(openReview)
openReview.onclick = (event)=>{
    if(document.getElementById("reviewContainer").classList.contains("hide"))
    document.getElementById("reviewContainer").classList.remove("hide");
else
document.getElementById("reviewContainer").classList.add("hide")
}

if(likeButton)
likeButton.onclick = (event)=>{
    console.log(window.location.href.substring(26));
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            location.reload();
            
        }
    };

    xhttp.open("PUT", "/like/"+window.location.href.substring(26), true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}

if(reviewButton)
reviewButton.onclick = (event)=>{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            location.reload();
        }
    };

    xhttp.open("PUT", "/review/"+window.location.href.substring(26), true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({"text":document.getElementById("reviewdata").value}));
}