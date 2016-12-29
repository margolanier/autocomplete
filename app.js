words = ['red', 'orange', 'green', 'black', 'blue'];

function init() {
	window.addEventListener('input', function() {
		console.log('key typed');
	});
	
}

window.addEventListener('load', init);