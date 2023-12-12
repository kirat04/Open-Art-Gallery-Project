let openReview = document.getElementById("leaveReview");
let likeButton = document.getElementById("likebutton");
let reviewButton = document.getElementById("submitreview");

//if the open review button exists (it might not exist if the user is lookng at their own art) open the review creation box when it is clicked
if(openReview)
openReview.onclick = (event)=>{
    if(document.getElementById("reviewContainer").classList.contains("hide"))
    document.getElementById("reviewContainer").classList.remove("hide");
else
document.getElementById("reviewContainer").classList.add("hide")
}

//if the like button exists and is clicked, send a put response to like or unlike the art
if(likeButton)
likeButton.onclick = (event)=>{
    console.log(window.location.href.substring(26));
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            location.reload();
            
        }
    };

    xhttp.open("PUT", "/review/like/"+window.location.href.substring(26), true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}

//if the review button exists and is clicked send a put request with the specified review text data
if(reviewButton)
reviewButton.onclick = (event)=>{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            location.reload();
        }
    };

    xhttp.open("PUT", "/review/review/"+window.location.href.substring(26), true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({"text":document.getElementById("reviewdata").value}));
}