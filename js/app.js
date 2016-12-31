let possible = [];
let mode = 'simple';
let query = '';

function init() {
	
	// Update autocomplete list on user input
	let searchbox = document.querySelector('#searchbox');
	searchbox.addEventListener('input', function(e) {
		query = e.target.value;
		autoComplete();
	});
	
	// Get autocomplete options depending on search mode
	let getMode = document.querySelectorAll('input[name=search-mode]');
	
	for (let i=0; i<getMode.length; i++) {
		getMode[i].addEventListener('click', function() {
			mode = getMode[i].value;
			
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
			
			autoComplete();
		});
	}
}


function autoComplete() {
	let filtered = [];
	
	// Check possible options against search query for matches
	for (let i=0; i<possible.length; i++) {
		
		// Adjust for mode
		let p;
		if (mode === 'simple') {
			p = possible[i];
		} else {
			p = possible[i].name;
		}
		
		console.log(p);
		//console.log(query);
		let match = p.indexOf(query);
		
		if (p.includes(query)) {
			
			let seg1 = p.slice(0, match);
			let seg2 = p.slice(match, match + query.length);
			let seg3 = p.slice(match + query.length);
			
			let segmented = seg1 + '<b>' + seg2 + '</b>' + seg3;
			filtered.push(segmented);
		}
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
}

window.addEventListener('load', init);