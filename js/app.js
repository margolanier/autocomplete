// user search
let mode = 'default';
let query = '';

// autocomplete options
let wordbank = [];

// filters
let continents = [];
let nato = null;



function init() {
	
	// Update autocomplete list on user input
	let searchbox = document.querySelector('#searchbox');
	searchbox.addEventListener('input', function(e) {
		query = e.target.value;
		autocomplete();
	});
	
	// Get search mode to determine which dataset to use
	let getMode = document.querySelectorAll('input[name=search-mode]');
	for (let i=0; i<getMode.length; i++) {
		getMode[i].addEventListener('click', function() {
			mode = getMode[i].value;
			let filters = document.querySelector('#filters');
			if (mode === 'other') {
				filters.classList.remove('hidden');
				getFilters();
			} else {
				filters.classList.add('hidden');
			}
			getDataSet();
		});
	}
	
	getDataSet();
	autocomplete();
}


function getDataSet() {
	// default mode uses api data
	if (mode === 'default') {
		let request = new XMLHttpRequest();
		request.open('GET','http://api.queencityiron.com/autocomplete');
		
		request.addEventListener('load', function() {
			wordbank = JSON.parse(request.responseText);
		});
		request.send();
	} else {
		// other mode uses local data (array of objects)
		getAltData();
	}
}


function autocomplete() {
	let suggestions = []; // list of options that contain query
	let suggestions_b = []; // same as above list, but with <b> tags around query
	
	// Run list of autocomplete options against search query for matches
	for (let i=0; i<wordbank.length; i++) {
		let option = (mode === 'default') ? wordbank[i] : wordbank[i].name;
		
		let test = true;
		
		// Run additional filters on word before determining a match
		filter(wordbank[i]);
		
		// filter returns boolean, must be true to continue
		if (filter(wordbank[i])) {
			
			// Add matches to list of suggestions
			// Highlight the letters that match the query
			let match = option.toLowerCase().indexOf(query.toLowerCase());
			
			if ( option.toLowerCase().includes(query.toLowerCase()) ) {
				suggestions.push(wordbank[i]);
				
				let seg1 = option.slice(0, match);
				let seg2 = option.slice(match, match + query.length);
				let seg3 = option.slice(match + query.length);
				let segmented = seg1 + '<b>' + seg2 + '</b>' + seg3;
				suggestions_b.push(segmented);
			}
		}
	}
	
	// Display updated list
	let dropdown = document.querySelector('#options');
	dropdown.innerHTML = Mustache.render('<ul>{{#.}}<li>{{{.}}}</li>{{/.}}</ul>', suggestions_b);
	
	// Set active styles
	if (query.length > 0 && suggestions.length > 0) {
		dropdown.classList.add('active');
	} else {
		dropdown.classList.remove('active');
	}
	
	// Replace input value when user clicks an autocomplete option
	let userSelect = document.querySelectorAll('li');
	
	for (let i=0; i<userSelect.length; i++) {
		userSelect[i].addEventListener('click', function() {
			
			// Get suggestion without <b> tags
			// Words in suggestions[] and suggestions_b[] share same index
			let index = suggestions_b.indexOf(userSelect[i].innerHTML);
			
			searchbox.value = (mode === 'default') ? suggestions[index] : suggestions[index].name;
			
			dropdown.classList.remove('active');
			
		});
	}
}


function getFilters() {
	
	let getContinents = document.querySelectorAll('input[name=continent]');
	for (let i=0; i<getContinents.length; i++) {
		getContinents[i].addEventListener('click', function() {
			if (getContinents[i].checked) {
				continents.push(getContinents[i].value);
			} else if (continents.indexOf(getContinents[i].value) !== -1) {
				let index = continents.indexOf(getContinents[i].value);
				continents.splice(index, 1);
			}
			autocomplete();
		});
	}
	
	let getNato = document.querySelectorAll('input[name=nato]');
	for (let i=0; i<getNato.length; i++) {
		getNato[i].addEventListener('click', function() {
			if (getNato[i].checked) {
				nato = (getNato[i].value === 'true');
			} else {
				nato = null;
			}
			autocomplete();
		});
	}
}


function filter(word) {
	// returns 'true' if word passes all tests (user filters)
	
	if (mode === 'default') {
		return true;
	}
	
	if (continents.length > 0) {
		if (continents.indexOf(word.continent.toLowerCase()) === -1) {
			return false;
		}
	}
	
	if (nato !== null) {
		if (word.nato_member !== nato) {
		   return false;
		}
	}
	
	return true;
}


function getAltData() {
	wordbank = [
		{
			name: "United States",
			continent: "North America",
			nato_member: true
		},
		{
			name: "Canada",
			continent: "North America",
			nato_member: true
		},
		{
			name: "Greece",
			continent: "Europe",
			nato_member: true
		},
		{
			name: "China",
			continent: "Asia",
			nato_member: false
		}
	]
}

window.addEventListener('load', init);