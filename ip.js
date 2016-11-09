(function(loading, success) {
  var xhr = XMLHttpRequest !== undefined ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                    loading.apply(null, []);
                    xhr.open('get', 'https://api.ipify.org/?format=json', true);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            success.call(null, JSON.parse(xhr.responseText));
                        }
                    }
                    xhr.send();
                }(function() {
                    document.getElementById('my-ip').innerHTML = 'Loading...';
                }, function(response) {
                    document.getElementById('my-ip').innerHTML = response.ip;
                }));
