let wordbank = [];
let mode = 'default';
let query = '';

// for filters
let continents = [];
let nato = null;
let Continue = true;


function init() {
	
	// Update autocomplete list on user input
	let searchbox = document.querySelector('#searchbox');
	searchbox.addEventListener('input', function(e) {
		query = e.target.value;
		autoComplete();
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
	autoComplete();
	
}


function getDataSet() {
	let request = new XMLHttpRequest();
	
	// default mode uses api data
	// other mode uses local data (array of objects)
	let url = (mode === 'default') ? 'http://api.queencityiron.com/autocomplete' : 'data.json';
	
	request.open('GET', url);
	
	request.addEventListener('load', function() {
		wordbank = JSON.parse(request.responseText);
	});
	request.send();
}


function autoComplete() {
	let suggestions = []; // list of options that contain query
	let suggestions_b = []; // same as above list, but with <b> tags around query
	
	// Run list of autocomplete options against search query for matches
	for (let i=0; i<wordbank.length; i++) {
		let option = (mode === 'default') ? wordbank[i] : wordbank[i].name;
		
		if (mode === 'other') {
			// Run additional filters on word before determining if it qualifies
			filter(wordbank[i]);
		}
		
		// filter should return boolean; true to continue
		// if (filter(wordbank[i])) {
		
		// Add matches to list of suggestions
		// Highlight the letters that match the query
		//if (Continue) {
			let match = option.toLowerCase().indexOf(query.toLowerCase());
			
			if ( option.toLowerCase().includes(query.toLowerCase()) ) {
				suggestions.push(wordbank[i]);
				
				let seg1 = option.slice(0, match);
				let seg2 = option.slice(match, match + query.length);
				let seg3 = option.slice(match + query.length);
				let segmented = seg1 + '<b>' + seg2 + '</b>' + seg3;
				suggestions_b.push(segmented);
				
			}
			Continue = false;
		//}
		
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
			
			// Get value of original option without <b> tags
			// Words in suggestions[] and suggestions_b[] share same index
			let index = suggestions_b.indexOf(userSelect[i].innerHTML);
			if (mode === 'default') {
				searchbox.value = suggestions[index];
			} else {
				searchbox.value = suggestions[index].name;
			}
			dropdown.classList.remove('active');
			
		});
	}
}


function getFilters() {
	let getNato = document.querySelectorAll('input[name=nato]');
	for (let i=0; i<getNato.length; i++) {
		getNato[i].addEventListener('click', function() {
			if (getNato[i].checked) {
				nato.push(getNato[i].value);
			}
		});
	}
	
	let getContinents = document.querySelectorAll('input[name=continent]');
	for (let i=0; i<getContinents.length; i++) {
		getContinents[i].addEventListener('click', function() {
			if (getContinents[i].checked) {
				continents.push(getContinents[i].value);
			} else if (continents.indexOf(getContinents[i].value) !== -1) {
				let index = continents.indexOf(getContinents[i].value);
				continents.splice(index, 1);
			}
		});
	}
}


function filter(term) {
	// If the search object (word) matches the use filter,
	// keep it in the suggestions (continue)
	// else, reject it
	if (continents.length > 0) {
		if (continents.indexOf(term.continent.toLowerCase()) === -1) {
			//Continue = false;
			//break;
		}
	}
	
	/*if nato !== null {
		if (term.nato_member !== nato) {
		   Continue = false;
		}
	}*/
	
	return true; // continue
}

window.addEventListener('load', init);