'use strict';
const Book = require('./Book.js');
const Constants = require('./Constants.js');
const bAPI = {
    KEY: 'Value',
    createBook: (req, res, next)=>{
    	console.log(req.body);
    	const newBook = new Book(req.body);
		newBook.save(err=>{
			if(!!err) {
				Constants.standardErr(err, res);
			} else {
				res.send('New Book Created');
			}
		})
	},
	searchBook: (req, res, next)=>{
		if (req.body.which === 'all') {
			bAPI.searchAll(req, res,next);	;
		} else if (req.body.which === 'any') {
			bAPI.searchAny(req, res,next);
		} else {
			bAPI.searchAll(req, res,next);
		}
	},
	searchAll: (req, res, next)=>{
		let query = {};
    	
    	// if (req.body.title) { query.title = req.body.title }
    	if (req.body.title) { query.title= {$regex: req.body.title} }
    	if (req.body.year) { query.year = req.body.year }
    	if (req.body.name) { query['authors.name'] = req.body.name }

    	Book.find(query, (err, theBooks)=>{
    		if(err){
    			Constants.standardErr(err, res);
    		} else {
    			res.render('books', {books: theBooks});
    			/*or send the json*/
    			// res.status(200).type('json').send({books: theBooks});
    			// res.json({books: theBooks});
    		}
    	}).sort({title: 'asc'});
	},
	searchAny: (req, res, next)=>{
		let terms = [];
		
    	
    	if (req.body.title) {  terms.push ( { title: {$regex: req.body.title} } )  }
    	if (req.body.year)  {  terms.push ( { year: req.body.year} )  }
    	if (req.body.name)  {  terms.push ( { 'authors.name': req.body.name} )  }

    	let query = {$or: terms};	

    	Book.find(query, (err, theBooks)=>{
    		if(err){
    			Constants.standardErr(err, res);
    		} else {
    			res.render('books', {books: theBooks})
    		}
    	}).sort({title: 'asc'});
	},
	API: (req, res, next)=>{
		/*searchAll in GET form*/
		let query = {};
    
    	if (req.query.title) { query.title= {$regex: req.query.title} }
    	if (req.query.year) { query.year = req.query.year }
    	if (req.query.author) { query['authors.name'] = req.query.author }

    	if(Object.keys(query).length > 0){ 		
	    	Book.find(query, (err, theBooks)=>{
	    		if(err){
	    			Constants.standardErr(err, res);
	    		} else {
	    			/*or send the json*/
	    			// res.status(200).type('json').send({books: theBooks});
	    			res.json({books: theBooks});
	    		}
	    	}).sort({title: 'asc'});
    	} else {
    		res.json({});
    	}
	},

}

module.exports = Object.freeze(bAPI);