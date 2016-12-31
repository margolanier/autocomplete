let possible = ['red', 'orange', 'green', 'black', 'blue', 'multi word value'];

function init() {
	
	let searchbox = document.querySelector('#searchbox');
	
	// On user input
	searchbox.addEventListener('input', function(e) {
		
		let query = e.target.value;
		let filtered = [];
		
		// Check possible options against search query for matches
		for (let i=0; i<possible.length; i++) {
			let match = possible[i].indexOf(query);
			
			if (possible[i].includes(query)) {
				
				let seg1 = possible[i].slice(0, match);
				let seg2 = possible[i].slice(match, match + query.length);
				let seg3 = possible[i].slice(match + query.length);
				
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
		
	});
	
}

window.addEventListener('load', init);