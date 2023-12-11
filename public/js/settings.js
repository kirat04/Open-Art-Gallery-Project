let upgrade = document.getElementById("upgradebutton");
let submitButton = document.getElementById("submit");
let submitnoart = document.getElementById("upgradebuttonnoart");

//if the user doesn't need to submit art, send a post request when it is clicked to change account
if(submitnoart)
submitnoart.onclick = (event)=>{
    let upgradeType = {upgrade: false};
        if(submitnoart.value == "Become a Patron"){
        if(confirm("Are you sure you want to switch to a PATRON account?")){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                alert("Account change successful");
                location.reload();
            }
        };
    
        xhttp.open("PUT", "/upgrade", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(upgradeType));
    }
        }
        else{
            upgradeType.upgrade = true;
            if(confirm("Are you sure you want to switch to an ARTIST account?")){
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        alert("Account change successful");
                        location.reload();
                    }
                };
            
                xhttp.open("PUT", "/upgrade", true);
                xhttp.setRequestHeader("Content-Type", "application/json");
                xhttp.send(JSON.stringify(upgradeType));
            }
        }
    }
    //if the upgrade button exists, you will have to provide a new artwork if upgrading to artist, otherwise changing to patron is the same
if(upgrade)
upgrade.onclick = (event)=>{
    let upgradeType = {upgrade: false};
        if(upgrade.value == "Become a Patron"){
        if(confirm("Are you sure you want to switch to a PATRON account?")){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                alert("Account change successful");
                location.reload();
            }
        };
    
        xhttp.open("PUT", "/upgrade", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(upgradeType));
    }
        }
        else{
           
                if(document.getElementById("artsubmit").classList.contains("hide"))
                document.getElementById("artsubmit").classList.remove("hide");
            else
            document.getElementById("artsubmit").classList.add("hide");
            upgradeType.upgrade = true;
            submitButton.onclick = (event)=>{
                console.log(window.location.href.substring(21));
                if(confirm("Are you sure you want to switch to an ARTIST account?")){
                upgradeType["newArt"] = {
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
                        alert("Art added and account switched to ARTIST");
                        location.reload();
                    }
                    if (this.readyState == 4 && this.status == 400) {
                        alert("Art title already exists, please input a unique art title");
                        
                    }
                };
            
        
                xhttp.open("PUT", "/upgrade", true);
                xhttp.setRequestHeader("Content-Type", "application/json");
                xhttp.send(JSON.stringify(upgradeType));
            }
            else
            alert("Please fill all fields to add a new piece of art.")
                }
            }
            
            


        }


}