'use strict'

const request = require('request-promise');
const cheerio = require('cheerio');

const check_articles_for_image = (articles) => {
	return new Promise((resolve, reject) => {
		let articles_without_image = [];
		let article_index = 0;

		const next = () => {
			if (article_index < articles.length) {
				const options = {
					method: 'GET',
					uri: 'https://blog.risingstack.com' + articles[article_index],
					transform: body => cheerio.load(body),
				}

				request(options)
					.then($ => {
						process.stdout.write(`.`);
						if ($(".post-content img")
							.not(".post-author img, .share-icon-container img, iframe")
							.length === 0) articles_without_image.push(options.uri);
						article_index++;
						next();
					})
					.catch(err => {
						console.log('request error: ', err);
					});
			}
			else {
				process.stdout.write(`done`);
				resolve(articles_without_image);
			}
		}
		next();
	});
}

const scrape = (page_num = false) => {
	return new Promise((resolve, reject) => {
		const path = page_num ? '/page/' + page_num : '';
		const options = {
			method: 'GET',
			uri: `https://blog.risingstack.com${path}`,
			transform: body => cheerio.load(body),
		}

		request(options)
			.then(($) => {
				let articles = [];
				$(".main-inner article .post-title a").each((i, el) => {
					articles.push($(el).attr("href"))
				})
				resolve(check_articles_for_image(articles))
			})
			.catch(err => {
				console.log('request error: ', err);
				reject('request error');
			});
	});
}

console.log('scrape: ', scrape(2).then(val => console.log('val: ', val)));
