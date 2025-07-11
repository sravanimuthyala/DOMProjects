 const time=document.getElementById("Time");
const today=document.getElementById("date");
let btn=document.querySelector("button");
let Is24hrs=false;

 function UpdateTime(){
    if(Is24hrs){
        time.innerText = new Date().toLocaleTimeString("en-IN",{hour12:false});
    }
    else{
time.innerText=new Date().toLocaleTimeString();
    }
}
function updateDate(){
today.innerText=new Date().toLocaleDateString("en-IN");
}


btn.addEventListener("click",()=>{
Is24hrs=!Is24hrs;
Is24hrs?btn.innerText="Switch to 12-hour format":btn.innerText="Switch to 24-hour format";
UpdateTime();
})

 updateDate();
setInterval(UpdateTime,1000);


