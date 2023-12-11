let addButton = document.getElementById("addArt");
let submitButton =  document.getElementById("submit");
let submitWorkshop = document.getElementById("submitWorkshop");

addButton.onclick = (event)=>{
    if(document.getElementById("artsubmit").classList.contains("hide"))
    document.getElementById("artsubmit").classList.remove("hide");
else
document.getElementById("artsubmit").classList.add("hide")
}

if(submitButton != null){
submitButton.onclick = (event)=>{
    console.log(window.location.href.substring(21));

    let artBundle = {
        title: document.getElementById('title').value,
        year: document.getElementById('year').value,
        category: document.getElementById('category').value,
        medium: document.getElementById('medium').value,
        desc: document.getElementById('desc').value,
        poster: document.getElementById('poster').value,
    }

    if( document.getElementById('title').value != ""&&
document.getElementById('year').value != "" &&
document.getElementById('category').value != "" &&
document.getElementById('medium').value != ""&&
document.getElementById('poster').value != ""){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            location.reload();
            
        }
        if (this.readyState == 4 && this.status == 400) {
            alert("Art title already exists, please input a unique art title");
            
        }
    };

    xhttp.open("POST", '/addArt', true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(artBundle));
}
else
alert("Please fill all fields to add a new piece of art.")
}
}
else
submitWorkshop.onclick = (event)=>{
    console.log(document.getElementById('descWorkshop'));

    let workshopBundle = {
        title: document.getElementById('titleWorkshop').value,
        desc: document.getElementById('descWorkshop').value,
    }

    if( document.getElementById('titleWorkshop').value != ""){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            location.reload();
            
        }
        if (this.readyState == 4 && this.status == 400) {
            alert("Workshop title already exists, please input a unique art title");
            
        }
    };

    xhttp.open("POST", '/addWorkshop', true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(workshopBundle));
}
else
alert("Please fill specify a title to add a workshop.")
}