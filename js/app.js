let possible = [];
let mode = 'simple';
let query = '';
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
			getDataSet();
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
	
	
	getDataSet();
	autoComplete();
	
}


function getDataSet() {
	// simple mode uses string array from api
	if (mode === 'simple') {
		let request = new XMLHttpRequest();
		request.open('GET', 'http://api.queencityiron.com/autocomplete');
		
		request.addEventListener('load', function() {
			possible = JSON.parse(request.responseText);
		});
		request.send();
		
	} else {
		// complex mode uses custom object array
		possible = [
			{	name: 'United States',
				nato_member: true,
				continent: 'North America'
			},
			{	name: 'Canada',
				nato_member: true,
				continent: 'North America'
			},
			{	name: 'Greece',
				nato_member: true,
				continent: 'Europe'
			},
			{	name: 'China',
				nato_member: false,
				continent: 'Asia'
			}
		];
	}
}


function autoComplete() {
	let filtered = [];
	let selected = [];
	
	// Check possible options against search query for matches
	for (let i=0; i<possible.length; i++) {
		
		// Adjust for mode
		let p = '';
		if (mode === 'simple') {
			p = possible[i];
		} else {
			p = possible[i].name;
			
			// Filter list by user selected categories
			filter(possible[i]);
		}
		
		if (Continue) {
			let match = p.toLowerCase().indexOf(query.toLowerCase());
			
			if ( p.toLowerCase().includes(query.toLowerCase()) ) {
				let seg1 = p.slice(0, match);
				let seg2 = p.slice(match, match + query.length);
				let seg3 = p.slice(match + query.length);
				
				let segmented = seg1 + '<b>' + seg2 + '</b>' + seg3;
				filtered.push(segmented);
				selected.push(possible[i]);
			}
		}
		Continue = true;
		
	}
	
	// Display updated list
	let options = document.querySelector('#options');
	options.innerHTML = Mustache.render('<ul>{{#.}}<li>{{{.}}}</li>{{/.}}</ul>', filtered);
	
	// Set active styles
	if (query.length > 0 && filtered.length > 0) {
		options.classList.add('active');
	} else {
		options.classList.remove('active');
	}
	
	// Replace input value when user clicks an autocomplete option
	let userSelect = document.querySelectorAll('li');
	
	for (let i=0; i<userSelect.length; i++) {
		userSelect[i].addEventListener('click', function() {
			
			// Get value of original option without <b> tags
			let index = filtered.indexOf(userSelect[i].innerHTML);
			if (mode === 'simple') {
				searchbox.value = selected[index];
			} else {
				searchbox.value = selected[index].name;
			}
			options.classList.remove('active');
			
		});
	}
}


function filter(term) {
	// If the search object (word) matches the use filter,
	// keep it in the autocomplete options (continue)
	// else, reject it
	if (continents.length > 0) {
		if (continents.indexOf(term.continent.toLowerCase()) === -1) {
			Continue = false;
		}
	}
	
	/*if nato !== null {
		if (term.nato_member !== nato) {
		   Continue = false;
		}
	}*/
}

window.addEventListener('load', init);