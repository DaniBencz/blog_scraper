'use strict'

const request = require('request-promise');
const cheerio = require('cheerio');
const mysql = require('mysql');

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true
});

const scrapeArticlesByPage = (articles, useDB) => {
	return new Promise((resolve, reject) => {
		let articles_without_image = [];
		let article_index = 0;

		const scarpeArticle = () => {
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
						scarpeArticle();
					})
					.catch(err => {
						console.log('request error: ', err);
					});
			}
			else {
				console.log('done scraping');
				if (useDB) saveArticlesInDB(articles_without_image);
				resolve(articles_without_image);
			}
		}
		scarpeArticle();
	});
}

const filterArticlesByPage = (page_num, useDB) => {
	return new Promise((resolve, reject) => {
		const path = page_num > 1 ? '/page/' + page_num : '';
		const options = {
			method: 'GET',
			uri: `https://blog.risingstack.com${path}`,
			transform: body => cheerio.load(body),
		}

		request(options)
			.then(($) => {
				let articles = [];
				$(".main-inner article .post-title a").each((i, el) => {
					articles.push($(el).attr("href"));
				});
				resolve(scrapeArticlesByPage(articles, useDB));
			})
			.catch(err => {
				console.log('request error: ', err);
				reject('request error');
			});
	})
}

const getArticlesByPage = (page_num, useDB) => {
	return new Promise((resolve, reject) => {

		if (useDB) {
			conn.query('SELECT page FROM articles_by_page LIMIT 1;', (err, rows) => {
				if (err) {
					console.error(err);
					//resolve(filterArticlesByPage(page_num, useDB));
				}
				else console.log("cool")
				// lookup data in db
					// if found
						// resolve data
					// else resolve(filterArticlesByPage(page_num));
			});
		}
		else resolve(filterArticlesByPage(page_num, useDB));
	});
}

const getAllArticles = (useDB = false, pages = 1) => {
	return new Promise((resolve, reject) => {
		let articles_per_page_promises = [];
		for (let i = 1; i <= pages; i++) {
			articles_per_page_promises.push(getArticlesByPage(i, useDB));
		}
		Promise.all(articles_per_page_promises)
			.then((articles_per_page) => {
				let all_articles = articles_per_page.reduce((acc, cur) => {
					return acc.concat(cur);
				});
				resolve(all_articles);
			})
			.catch(err => console.log(err))
	})
}

//getAllArticles(1, 1).then(list => console.log(list));

module.exports = { getAllArticles };
