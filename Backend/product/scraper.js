'use strict'

const request = require('request-promise');
const cheerio = require('cheerio');

const check_article_for_image = (article) => {
	return new Promise((resolve, reject) => {
		const options = {
			method: 'GET',
			uri: 'https://blog.risingstack.com' + article,
			transform: body => cheerio.load(body),
		}

		request(options)
			.then($ => {
				if ($(".post-content img")
					.not(".post-author img, .share-icon-container img, iframe")
					.length === 0) resolve(options.uri);
			})
			.catch(err => {
				console.log('request error: ', err);
			})
	});
}

const scrape = (page_num = false) => {
	const path = page_num ? '/page/' + page_num : '';
	const options = {
		method: 'GET',
		uri: `https://blog.risingstack.com${path}`,
		transform: body => cheerio.load(body),
	}

	let articles_without_image = [];
	request(options)
		.then($ => {
			$(".main-inner article .post-title a").each((i, el) => {
				//console.log($(el).attr("href"))

				check_article_for_image($(el).attr("href"))
					.then(result => {
						console.log("result: ", result);
						articles_without_image.push(result);
					})

			})

		})
		.catch(err => {
			console.log('request error: ', err);
			return 'request error';
		})

	//await for this...
	return articles_without_image;
}

console.log(scrape(2));

