const form=document.getElementById("search-form");
const input=document.getElementById("search-input");
const history=document.getElementById("search-history");

const dates=JSON.parse(localStorage.getItem("dates"))||[];
const API_KEY="RWseoSWa2qYwV9lIPHZA5hwWTmggW1h5a9vEuX5G";
const API_URL="https://api.nasa.gov/planetary/apod";

//load history from localstorage
function loadHistory(){
    history.innerHTML="";
    for(let i=dates.length-1;i>=0;i--){
        const li=document.createElement("li");
        li.textContent=dates[i];
        history.appendChild(li);
    }
}

//display the image
function displayImage(data){
    const imageContainer=document.getElementById("current-image-container");

    imageContainer.innerHTML="";
    const title=document.createElement("h2");
    title.textContent=data.title;

    imageContainer.appendChild(title);
    if(data.media_type==="image"){
        const img=document.createElement("img");
        img.src=data.url;
        img.alt=data.title;
        img.width=500;

        imageContainer.appendChild(img);
    } else{
        const msg=document.createElement("p");
        msg.textContent="Media is a video for this date.";
        imageContainer.appendChild(msg);
    }

}

//show currentimage on page load
async function getCurrentImageOfTheDay(){
    try{
        const response= await fetch(
            `${API_URL}?api_key=${API_KEY}`
        );
        if(!response.ok){
            throw new Error(`HTTP error ${response.status}`);
        }
        const data=await response.json();
        displayImage(data);
    }catch(error){
        console.error("Failed to fetch",error);
    }
}

loadHistory();
getCurrentImageOfTheDay();


//get image of the date submitted
async function getImageOfTheDay(date){
    try{
        const response= await fetch(
            `${API_URL}?api_key=${API_KEY}&date=${date}`
        );
        if(!response.ok){
            throw new Error(`HTTP error ${response.status}`);
        }
        const data=await response.json();
        displayImage(data);
    }catch(error){
        console.error("Failed to fetch",error);
    }
    
}

//add Search to History
function addSearchToHistory(date){
    const li=document.createElement("li")
    li.textContent=date;
    history.prepend(li);

}

//save search to localstorage
function saveSearch(date){
    dates.push(date);
    localStorage.setItem("dates",JSON.stringify(dates));
    addSearchToHistory(date);
}

//add eventlistener to form
form.addEventListener("submit",function(e){
    e.preventDefault();
    const date=input.value;
    if(!date) return;
    saveSearch(date);
    input.value="";
    getImageOfTheDay(date);
});

//add eventlistener to ul elements
history.addEventListener("click",function(e){
    if(e.target.tagName==="LI"){
        const date=e.target.textContent;
        getImageOfTheDay(date);
    }
});