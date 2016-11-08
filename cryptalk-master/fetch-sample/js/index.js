document.addEventListener("DOMContentLoaded", init);

function init() {
    document.getElementById("buttonGetIP").addEventListener("click", serverData.getJSON);
}

let serverData = {
    url: "https://ip.jsontest.com",
    httpRequest: "GET",
    getJSON: function () {
        fetch(serverData.url, {
                method: serverData.httpRequest
            })
            .then(function (response) {

                console.log(response);
                
                //   You can also few individual response properties like this:
                //             console.log(response.status);
                //             console.log(response.statusText);
                //             console.log(response.type);
                //             console.log(response.url);

                return response.json();
            })
            .then(function (data) {
                console.log(data); // now we have JS data, let's display it

                let element = document.querySelector(".ip");
                element.textContent = data.ip;
                element.style.color = "#333";

            })
            .catch(function (err) {
                alert("Error: " + err.message);
            });
    }
};