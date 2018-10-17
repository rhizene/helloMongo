module.exports = Object.freeze({
    MY_CONSTANT: 'some value',
    standardErr: (err, res)=>{
    	// console.log('from constants..');
    	res.type('html').status(500);
    	res.send('Error: '+err);
	}
});