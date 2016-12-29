let possible = ['red', 'orange', 'green', 'black', 'blue'];
let filtered = [];

function init() {
	console.log(possible);
	
	let searchbox = document.querySelector('#searchbox');
	
	// On user input
	searchbox.addEventListener('input', function(e) {
		
		query = e.target.value;
		
		// Check possible options for matches
		for (let i=0; i<possible.length; i++) {
			
			if (possible[i].includes(query)) {
				filtered.push(possible[i]);
			}
		}
		
		// Display updated list
		let options = document.querySelector('#options');
		options.innerHTML = Mustache.render(
			'<ul>{{#.}}<li>{{.}}</li>{{/.}}</ul>',
			filtered
		)
		
		
	});
	
}

window.addEventListener('load', init);