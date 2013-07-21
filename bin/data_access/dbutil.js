module.exports = (function(){
	function handleError(err) {
		if (err) {
			throw err;
		}
	}
	
	function safeCallback(callback) {
		if (callback) {
			callback();
		}
		else {
			console.log('No callback function provided.');
		}
	}
	
	return {
		handleError: handleError,
		safeCallback: safeCallback
	};
}());