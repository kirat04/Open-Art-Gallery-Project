let searchArtists = document.getElementById("searchartists");
let searchArt = document.getElementById("searchart");
let filterBut = document.getElementById("filters");
let searchFilteredArt = document.getElementById("filteredart");

//send a get response to the server to update filters and then when response is recieved update the filters to match response
var x = new XMLHttpRequest();
x.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let incomingResults = JSON.parse(this.response);
;
        
        let categories = document.getElementById("categories");
        let mediums = document.getElementById("medium");
        
        //loop through the categories and mediums to add them to their respective selector
        for(let i = 0; i<incomingResults.categories.length; i++){
            let newSelection = document.createElement("option");
            newSelection.id = incomingResults.categories[i];
            newSelection.value = incomingResults.categories[i];
            newSelection.innerText = incomingResults.categories[i];
            categories.appendChild(newSelection);
        }

        for(let i = 0; i<incomingResults.mediums.length; i++){
            let newSelection = document.createElement("option");
            newSelection.id = incomingResults.mediums[i];
            newSelection.value = incomingResults.mediums[i];
            newSelection.innerText = incomingResults.mediums[i];
            mediums.appendChild(newSelection);
        }
    }
};
x.open("GET", "/user/homepage/filters", true);
x.send();

//when the search artist button is clicked, get the value of the search bar and send a post request for the artists then display this neatly
searchArtists.onclick = (event)=>{
    //search bar
    let search = document.getElementById("searchtext").value;

    let container = document.getElementById('searchcontainer');
    container.classList.add("hide");
    let searchBundle = {search:search};

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            let container = document.getElementById('searchcontainer');
            container.classList.remove("homesearchcontainerart");
            container.classList.add("homesearchcontainer");
            
            let list = document.getElementById('searchresults')
            list.innerHTML = '';
            let incomingResults = JSON.parse(this.response);

            //loop through the response and display the name and link neatly on the page
            for(let i = 0; i<incomingResults.length;i++){
                let newResult = document.createElement('li');
                let resultLink = document.createElement('a');
                resultLink.href = "/user/user/" + incomingResults[i]._id;
                resultLink.innerText = incomingResults[i].name;
                newResult.classList.add("artistfollowers");
                newResult.classList.add("oddlist");
                newResult.classList.add("highlight");
                resultLink.classList.add("artistlink");
                newResult.appendChild(resultLink);

                list.appendChild(newResult);

            }
            
            //nav bar that finds the amount of pages by dividing the length of the whole response by ten
            let pageNums = document.getElementById("pageNum");
            pageNums.innerHTML = "";
            let items = list.querySelectorAll("li");
            let amountPages = Math.ceil(items.length/10);
            //if an item is in the range of the initial page (1) display it, otherwise hide it 
            items.forEach((item,index)=>{
                item.classList.add("hide");
                if(index >= 0 && index < 10)
                item.classList.remove("hide");
            })
            //if an item is in the range of the selected page display it, otherwise hide it 
            for(let i =0; i<amountPages;i++){
                const pageNumber = document.createElement("button");
                pageNumber.className = "pagination-number";
                pageNumber.innerHTML = i+1;
                pageNumber.onclick = (event)=>{
                    let page = pageNumber.innerHTML;
                    let gt = (page-1)*10;
                    let lt = page*10;
                    items.forEach((item,index)=>{
                        item.classList.add("hide");
                        if(index >= gt && index < lt)
                        item.classList.remove("hide");
                    })
                }
                pageNums.appendChild(pageNumber);
                
            }
           
            container.classList.remove('hide');
        }
    };

    xhttp.open("POST", "/user/homepage/search/artists", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(searchBundle));
}

//when the search art button is clicked, send a post request with the search bar input for art
searchArt.onclick = (event)=>{
    let search = document.getElementById("searchtext").value;
    let container = document.getElementById('searchcontainer');
    container.classList.add("hide");
    let searchBundle = {search:search};

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            let container = document.getElementById('searchcontainer');
            container.classList.remove("homesearchcontainer");
            container.classList.add("homesearchcontainerart");
            
            let list = document.getElementById('searchresults')
            list.innerHTML = '';
            let incomingResults = JSON.parse(this.response);
            console.log(incomingResults);
            //loop through the response and create a image and link and display these to the screen neatly
            for(let i = 0; i<incomingResults.length;i++){
                let newResult = document.createElement('li');
                let resultLink = document.createElement('a');
                resultLink.href = "/art/art/" + incomingResults[i]._id;
                resultLink.innerText = incomingResults[i].title;
                resultLink.classList.add("imagelink");
                let image = document.createElement('img');
                image.src = incomingResults[i].poster;
                image.classList.add("homepageartdim");
                newResult.onmouseover = (event) =>{
                    image.classList.add("centerimage");
                }
                newResult.onmouseleave = (event)=>{
                    image.classList.remove("centerimage");
                }
                newResult.appendChild(image);
                newResult.appendChild(document.createElement('br'));
                newResult.appendChild(document.createElement('br'));
                newResult.appendChild(resultLink);
                newResult.classList.add("homepagesearchimage");

                list.appendChild(newResult);

            }

            //nav bar that finds the amount of pages by dividing the length of the whole response by ten
            let pageNums = document.getElementById("pageNum");
            pageNums.innerHTML = "";
            let items = list.querySelectorAll("li");
            let amountPages = Math.ceil(items.length/10); 
            //if an item is in the range of the initial page (1) display it, otherwise hide it 
            items.forEach((item,index)=>{
                item.classList.remove('homepagesearchimage');
                item.classList.add("hide");
                if(index >= 0 && index < 10){
                item.classList.remove("hide");
                item.classList.add('homepagesearchimage');
                }
            })
//if an item is in the range of the selected page display it, otherwise hide it 
            for(let i = 0; i<amountPages;i++){
                const pageNumber = document.createElement("button");
                pageNumber.className = "pagination-number";
                pageNumber.innerHTML = i+1;
                pageNumber.onclick = (event)=>{
                    let page = pageNumber.innerHTML;
                    let gt = (page-1)*10;
                    let lt = page*10;
                    items.forEach((item,index)=>{
                        item.classList.remove('homepagesearchimage');
                        item.classList.add("hide");
                        if(index >= gt && index < lt){
                        item.classList.remove("hide");
                        item.classList.add('homepagesearchimage');
                        }
                    })
                }
                pageNums.appendChild(pageNumber);
                
            }
            
           
            container.classList.remove('hide');
        }
    };

    xhttp.open("POST", "/user/homepage/search/art", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(searchBundle));
}
//display the filter selection when filter button is clicked
filterBut.onclick = (event)=>{
    if(document.getElementById("searchart").classList.contains("hide")){
        document.getElementById("searchart").classList.remove("hide");
        document.getElementById("filterselection").classList.add("hide");
    }
    else{
        document.getElementById("searchart").classList.add("hide");
        document.getElementById("filterselection").classList.remove("hide");
    }
}

//when the search filter art button is clicked, send post request for art with the specified filters
searchFilteredArt.onclick = (event)=>{
    let search = document.getElementById("searchtext").value;
    let artist = document.getElementById("artist").value;
    let minYear = document.getElementById("yearlower").value;
    let maxYear = document.getElementById("yearhigher").value;
    let category = document.getElementById("categories").value;
    let medium = document.getElementById("medium").value;


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            let container = document.getElementById('searchcontainer');
            container.classList.remove("homesearchcontainer");
            container.classList.add("homesearchcontainerart");
            
            
            let list = document.getElementById('searchresults')
            list.innerHTML = '';
            let incomingResults = JSON.parse(this.response);
            console.log(incomingResults);
            //loop through the response and create a image and link and display these to the screen neatly
            for(let i = 0; i<incomingResults.length;i++){
                let newResult = document.createElement('li');
                let resultLink = document.createElement('a');
                resultLink.href = "/art/art/" + incomingResults[i]._id;
                resultLink.innerText = incomingResults[i].title;
                resultLink.classList.add("imagelink");
                let image = document.createElement('img');
                image.src = incomingResults[i].poster;
                image.classList.add("homepageartdim");  
                newResult.onmouseover = (event) =>{
                    image.classList.add("centerimage");
                }
                newResult.onmouseleave = (event)=>{
                    image.classList.remove("centerimage");
                }
                newResult.appendChild(image);
                newResult.appendChild(document.createElement('br'));
                newResult.appendChild(document.createElement('br'));
                newResult.appendChild(resultLink);
                newResult.classList.add("homepagesearchimage");

                list.appendChild(newResult);

            }

            //nav bar that finds the amount of pages by dividing the length of the whole response by ten
            let pageNums = document.getElementById("pageNum");
            pageNums.innerHTML = "";
            let items = list.querySelectorAll("li");
            let amountPages = Math.ceil(items.length/10); 
            //if an item is in the range of the initial page (1) display it, otherwise hide it 
            items.forEach((item,index)=>{
                item.classList.remove('homepagesearchimage');
                item.classList.add("hide");
                if(index >= 0 && index < 10){
                item.classList.remove("hide");
                item.classList.add('homepagesearchimage');
                }
            })
//if an item is in the range of the selected page display it, otherwise hide it 
            for(let i = 0; i<amountPages;i++){
                const pageNumber = document.createElement("button");
                pageNumber.className = "pagination-number";
                pageNumber.innerHTML = i+1;
                pageNumber.onclick = (event)=>{
                    let page = pageNumber.innerHTML;
                    let gt = (page-1)*10;
                    let lt = page*10;
                    items.forEach((item,index)=>{
                        item.classList.remove('homepagesearchimage');
                        item.classList.add("hide");
                        if(index >= gt && index < lt){
                        item.classList.remove("hide");
                        item.classList.add('homepagesearchimage');
                        }
                    })
                }
                pageNums.appendChild(pageNumber);
                
            }


           
            container.classList.remove('hide');
        }
    };

    xhttp.open("GET", "/user/homepage/search/art?search="+search+"&category="+category+"&minYear="+minYear+"&maxYear="+maxYear+"&medium="+medium+"&artist="+artist, true);

    xhttp.send();
}

