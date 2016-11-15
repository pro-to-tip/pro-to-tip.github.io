var duck = new Duck();

var searchForm = document.getElementById('search');
var searchButton = document.getElementById('search-button');
var searchInput = document.getElementById('search-input');
var resultsContainer = document.getElementById('result');

var resultsElements = {
	title: resultsContainer.querySelector('h1'),
	description: resultsContainer.querySelector('.result__description'),
	image: resultsContainer.querySelector('.result__image'),
	table: resultsContainer.querySelector('.result__table'),
	source: resultsContainer.querySelector('.result__source'),
	attribution: resultsContainer.querySelector('.result__attribution')
}

search.addEventListener('submit', function(e) {
	submit(searchInput.value);
	e.preventDefault();
});

function submit(query) {
	searchButton.classList.add('active');
	resultsContainer.classList.add('loading');
	duck.query(query, onSearchReturned);
}

function onSearchReturned(result, query, error) {
	var parsedResult = {
		query: query
	};
	
	if (!error && result.Type != '' && result.Type != 'N') {
		switch (result.Type) {
			case 'A':	// Articles
				parsedResult.title = result.Heading;
				parsedResult.text = result.Abstract;
				parsedResult.image = result.Image;
				parsedResult.source = result.AbstractSource;
				parsedResult.sourceUrl = result.AbstractURL;
				break;
				
			case 'D':	// Disambiguation
				parsedResult.title = result.Heading;
				parsedResult.text = 'No summary avaiable - try searching for something more specific, or hit the links below for more.';
				parsedResult.source = result.AbstractSource;
				parsedResult.sourceUrl = result.AbstractURL;
				break;
				
			case 'E':	// Answers and similar stuff
				parsedResult.title = (result.Heading ? result.Heading : query);
				parsedResult.source = result.AbstractSource;
				parsedResult.sourceUrl = result.AbstractURL;
				
				if (typeof result.Answer === 'object') {
					parsedResult.title = result.Answer.data.title;
					parsedResult.text = result.Answer.data.subtitle;
					parsedResult.image = result.Answer.data.image ? result.Answer.data.image : null;
				} else if (typeof result.Answer === 'string')  {
					parsedResult.text = result.Answer;
				}
				
				break;
		}
				
		if (result.Infobox && result.Infobox.content.length !== 0) {
			parsedResult.dataTable = result.Infobox.content;
		}
		
	} else {
		parsedResult.title = "We couldn't find any summary for that :(";
	}
	
	setResult(parsedResult);
}

function setResult(result) {
	var hiddenClass = 'hidden';
	
	resultsElements.title.textContent = (result.title ? result.title : 'Search Result');
	resultsElements.description.innerHTML = (result.text ? result.text : '');
	
	if (result.image) {
		resultsContainer.classList.remove('result--no-image');
		resultsElements.image.src = '';
		resultsElements.image.src = result.image;
	} else {
		resultsContainer.classList.add('result--no-image');
	}
	
	if (result.source) {
		resultsElements.source.classList.remove(hiddenClass);
		resultsElements.source.textContent = 'Read more on ' + result.source;
		resultsElements.source.href = result.sourceUrl;
	} else {
		resultsElements.source.classList.add(hiddenClass);
		resultsElements.source.href = '';
	}
	
	resultsElements.attribution.href = 'https://google.com/?q=' + encodeURIComponent(result.query);

	if (result.dataTable && result.dataTable.length !== 0) {
		resultsElements.table.classList.remove(hiddenClass);
		var tableFragment = document.createDocumentFragment();

		result.dataTable.forEach(function(item) {
			var row = document.createElement('tr');
			row.className = 'table__row';

			var nameCell = document.createElement('td');
			var valueCell = document.createElement('td');
			nameCell.className = valueCell.className = 'table__cell';
			nameCell.textContent = item.label;
			valueCell.textContent = item.value;

			row.appendChild(nameCell);
			row.appendChild(valueCell);
			tableFragment.appendChild(row);
		});

		resultsElements.table.innerHTML = '';
		resultsElements.table.appendChild(tableFragment);
	} else {
		resultsElements.table.classList.add(hiddenClass);
	}
	
	searchButton.classList.remove('active');
	resultsContainer.classList.remove('loading');
}

function clearResults() {
	resultsElements.title.textContent = 'Search result';
	resultsElements.description.innerHTML = '';
	resultsElements.image.src = '';
	resultsElements.table.innerHTML = '';
	resultsElements.source.textContent = '';
	resultsElements.source.href = result.AbstractURL;
	resultsElements.attribution.href = 'https://duckduckgo.com/';
}

function Duck() {
	this.activeJsonpElement;
}

Duck.prototype.query = function(query, callback) {
	if (this.activeJsonpElement && this.activeJsonpElement.parentNode) {
		// Remove any active script to prevent overlapping requests (and out-of-order responses)
		this.activeJsonpElement.parentNode.removeChild(this.activeJsonpElement);
	}
	
	this.activeJsonpElement = jsonp.send('//api.duckduckgo.com/?format=json&skip_disambig=1&no_redirect=1&t=codepenDemoByNw&callback=cb&q='  + encodeURIComponent(query), {
		callbackName: 'cb',
		onSuccess: function(result){
			callback(result, query, false);
		},
		onTimeout: function(){
			callback(null, query, true);
		},
		timeout: 5
	});
}

/* jsonp.js, (c) Przemek Sobstel 2012, License: MIT
   https://github.com/sobstel/jsonp.js */
var jsonp = (function(){
  var that = {};

  that.send = function(src, options) {
    var options = options || {},
      callback_name = options.callbackName || 'callback',
      on_success = options.onSuccess || function(){},
      on_timeout = options.onTimeout || function(){},
      timeout = options.timeout || 10;

    var timeout_trigger = window.setTimeout(function(){
      window[callback_name] = function(){};
		scriptTag.parentElement.removeChild(scriptTag);
      on_timeout();
    }, timeout * 1000);

    window[callback_name] = function(data){
      window.clearTimeout(timeout_trigger);
		scriptTag.parentElement.removeChild(scriptTag);
      on_success(data);
    };

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;

    var scriptTag = document.getElementsByTagName('head')[0].appendChild(script);
	 return scriptTag;
  };

  return that;
})();


// Loading a page as an example
var queries = ['JavaScript', 'duckduckgo', 'Source Sans Pro', 'Battles band', 'Blender software', 'android os', 'ios', 'Utopia (UK TV series)', 'Make Me A Sandwich', 'html div', 'qrcode Hello CodePen', 'House Hornwood', 'unicornify name@email.com'];
submit(queries[Math.round(Math.random() * (queries.length - 1))]);
