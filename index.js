'use strict';

// import express from 'express';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Constants = require('./Constants.js');
const BookApi = require('./BookApi.js');

const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));


const logger = (req, res, next)=>{
	const url = req.url;
	debugger;
	const time = new Date();
	console.log('Received '+url+' at '+time);
	next();
}

const Person = require('./Person.js');
const insertNewPerson = (req, res, next)=>{
	console.log('handleForm body: ', req.body);
	const newPerson = new Person({
		name: req.body.name,
		age: req.body.age,
	})
	newPerson.save(err=>{
		if(!!err) {
			Constants.standardErr(err, res);
		} else {
			res.render('created', {person: newPerson});
		}
	})
}

const showAll = (req, res, next)=>{
	Person.find((err, people)=>{
		if(!!err) {
			Constants.standardErr(err, res);
		} else if (people.length === 0) {
			res.type('html').status(200);
			res.send('No People');
		} else {
			res.render('showAll', {people: people});
		}
	})
}

const search = (req, res, next)=>{
	const searchName = {name: req.query.name};
	Person.findOne(searchName, (err, person)=>{
		if(!!err) {
			Constants.standardErr(err, res);
		} else if(!person) {
			res.type('html').status(200);
			res.send('Person not found.');
		} else {
			res.render('show', {person: person});
		}
	})
}

const update = (req, res, next)=>{
	const username = req.body.username;
	const newAge = {age: req.body.age};
	Person.findOne({name: username}, (err, person)=>{
		if(!!err) {
			Constants.standardErr(err, res);
		} else if(!person) {
			res.type('html').status(200);
			res.send('Update failed.');
		} else {
			person.age = req.body.age;
			person.save(err=>{
				if (err) {

				} else {
					res.render('update', {person: person});
				}

			})
			
		}
	})
}


// const commonRoute = express.Router();
// commonRoute.use(header, greeter); //is equivalent to using both header and greeter in a route.

/*log every route events*/
app.use(logger);


app.use('/public', logger, express.static('public'));
app.use('/semantic', express.static('semantic'));
app.use('/create', insertNewPerson);
app.use('/person', search);
app.use('/update', update);
app.use('/all', showAll);
app.use('/createbook', BookApi.createBook);
app.use('/search', BookApi.searchBook);
app.use('/api', BookApi.API);
app.use('/', (req, res)=>{ res.redirect('/public/personForm.html'); });


app.listen(port, ()=>{
	console.log('Listening, port '+port);
})