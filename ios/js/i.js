var mySites =  [
    "https://appvk.github.io/index.html",
    "https://pro-to-tip.github.io/siri/index.html"
    ];

var count = 0;

document.getElementById('ios').onclick = function() {
     
    var myFrame = document.getElementById("myFrame");
    
    myFrame.src = mySites[count];
    
    count++;
    
    if(count > 1) {
         count = 0;   
    }
    
}