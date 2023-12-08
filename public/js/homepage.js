let searchArtists = document.getElementById("searchartists");
let searchArt = document.getElementById("searchart");
let filterBut = document.getElementById("filters");
let searchFilteredArt = document.getElementById("filteredart");


var x = new XMLHttpRequest();
x.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let incomingResults = JSON.parse(this.response);
        console.log(incomingResults);
        
        let categories = document.getElementById("categories");
        let mediums = document.getElementById("medium");

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
x.open("GET", "/homepage/filters", true);
x.send();

searchArtists.onclick = (event)=>{
    let search = document.getElementById("searchtext").value;
    let container = document.getElementById('searchcontainer');
    container.classList.add("hide");
    let searchBundle = {search:search};

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            let container = document.getElementById('searchcontainer');
            
            
            let list = document.getElementById('searchresults')
            list.innerHTML = '';
            let incomingResults = JSON.parse(this.response);
            console.log(incomingResults);
            for(let i = 0; i<incomingResults.length;i++){
                let newResult = document.createElement('li');
                let resultLink = document.createElement('a');
                resultLink.href = "/user/" + incomingResults[i]._id;
                resultLink.innerText = incomingResults[i].name;
                newResult.classList.add("artistfollowers");
                newResult.classList.add("oddlist");
                newResult.appendChild(resultLink);

                list.appendChild(newResult);

            }
            
            let pageNums = document.getElementById("pageNum");
            pageNums.innerHTML = "";
            let items = list.querySelectorAll("li");
            let amountPages = Math.ceil(items.length/10); 
            items.forEach((item,index)=>{
                item.classList.add("hide");
                if(index >= 0 && index < 10)
                item.classList.remove("hide");
            })

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

    xhttp.open("POST", "/homepage/search/artists", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(searchBundle));
}

searchArt.onclick = (event)=>{
    let search = document.getElementById("searchtext").value;
    let container = document.getElementById('searchcontainer');
    container.classList.add("hide");
    let searchBundle = {search:search};

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            let container = document.getElementById('searchcontainer');
            
            
            let list = document.getElementById('searchresults')
            list.innerHTML = '';
            let incomingResults = JSON.parse(this.response);
            console.log(incomingResults);
            for(let i = 0; i<incomingResults.length;i++){
                let newResult = document.createElement('li');
                let resultLink = document.createElement('a');
                resultLink.href = "/art/" + incomingResults[i]._id;
                resultLink.innerText = incomingResults[i].title;
                let image = document.createElement('img');
                image.src = incomingResults[i].poster;
                image.width = 150;
                image.height = 150;
                newResult.appendChild(image);
                newResult.appendChild(document.createElement('br'));
                newResult.appendChild(document.createElement('br'));
                newResult.appendChild(resultLink);
                newResult.classList.add("homepagesearchimage");

                list.appendChild(newResult);

            }

            
            let pageNums = document.getElementById("pageNum");
            pageNums.innerHTML = "";
            let items = list.querySelectorAll("li");
            let amountPages = Math.ceil(items.length/10); 
            items.forEach((item,index)=>{
                item.classList.remove('homepagesearchimage');
                item.classList.add("hide");
                if(index >= 0 && index < 10){
                item.classList.remove("hide");
                item.classList.add('homepagesearchimage');
                }
            })

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

    xhttp.open("POST", "/homepage/search/art", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(searchBundle));
}
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

searchFilteredArt.onclick = (event)=>{
    let search = document.getElementById("searchtext").value;
    let minYear = document.getElementById("yearlower").value;
    let maxYear = document.getElementById("yearhigher").value;
    let category = document.getElementById("categories").value;
    let medium = document.getElementById("medium").value;


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            let container = document.getElementById('searchcontainer');
            
            
            let list = document.getElementById('searchresults')
            list.innerHTML = '';
            let incomingResults = JSON.parse(this.response);
            console.log(incomingResults);
            for(let i = 0; i<incomingResults.length;i++){
                let newResult = document.createElement('li');
                let resultLink = document.createElement('a');
                resultLink.href = "/art/" + incomingResults[i]._id;
                resultLink.innerText = incomingResults[i].title;
                let image = document.createElement('img');
                image.src = incomingResults[i].poster;
                image.width = 150;
                image.height = 150;
                newResult.appendChild(image);
                newResult.appendChild(document.createElement('br'));
                newResult.appendChild(document.createElement('br'));
                newResult.appendChild(resultLink);
                newResult.classList.add("homepagesearchimage");

                list.appendChild(newResult);

            }

            
            let pageNums = document.getElementById("pageNum");
            pageNums.innerHTML = "";
            let items = list.querySelectorAll("li");
            let amountPages = Math.ceil(items.length/10); 
            items.forEach((item,index)=>{
                item.classList.remove('homepagesearchimage');
                item.classList.add("hide");
                if(index >= 0 && index < 10){
                item.classList.remove("hide");
                item.classList.add('homepagesearchimage');
                }
            })

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

    xhttp.open("GET", "/homepage/search/art?search="+search+"&category="+category+"&minYear="+minYear+"&maxYear="+maxYear+"&medium="+medium, true);

    xhttp.send();
}

