let possible = ['red', 'orange', 'green', 'black', 'blue'];
let filtered = [];

function init() {
	//console.log(possible);
	
	let searchbox = document.querySelector('#searchbox');
	
	// On user input
	searchbox.addEventListener('input', function(e) {
		
		query = e.target.value;
		
		// Check possible options against search query for matches
		for (let i=0; i<possible.length; i++) {
			let match = filtered.indexOf(possible[i]);
			
			if (possible[i].includes(query)) {
				
				// Only push new options to array
				if (match === -1) {
					filtered.push(possible[i]);
				}
				
			} else {
				
				// Remove options that no longer match
				if (match !== -1) {
					filtered.splice(match, 1);
				}
			}
		}
		
		// Display updated list
		let options = document.querySelector('#options');
		options.innerHTML = Mustache.render(
			'<ul>{{#.}}<li>{{.}}</li>{{/.}}</ul>',
			filtered
		)
		
		//console.log(filtered);
		
	});
	
}

window.addEventListener('load', init);