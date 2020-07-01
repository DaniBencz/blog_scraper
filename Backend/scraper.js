'use strict'

const request = require('request-promise');
const cheerio = require('cheerio');

const simple_get = () => {
	const options = {
		method: 'GET',
		uri: 'https://blog.risingstack.com',
		transform: body => cheerio.load(body),
	}
	request(options)
		.then($ => {
			//console.log('length:', $(".main-inner article .post-title a").length)
			$(".main-inner article .post-title a").each((i, el) => {
				console.log($(el).attr("href"))
			})

			//console.log('header:', $(".site-header"))
		})
		.catch(err => {
			console.log('request error: ', err);
		})
}

simple_get();

