'use strict'

const request = require('request-promise');
const cheerio = require('cheerio');

const scrapeArticlesByPage = (articles) => {
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
				// maybe no need for promise?
				resolve(articles_without_image);
			}
		}
		scarpeArticle();
	});
}

const getArticlesByPage = (page_num = false) => {
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
				resolve(scrapeArticlesByPage(articles));
			})
			.catch(err => {
				console.log('request error: ', err);
				reject('request error');
			});
	});
}

const getAllArticles = (pages = 1) => {
	return new Promise((resolve, reject) => {
		let res = []
		for (let i = 1; i <= pages; i++) {
			res.push(getArticlesByPage(i))
		}
		Promise.all(res)
			.then((articles_per_page) => {
				let all_articles = articles_per_page.reduce((acc, cur) => {
					return acc.concat(cur)
				}, [])
				resolve(all_articles);
			})
			.catch(err => console.log(err))
	})

}

getAllArticles().then(list => console.log(list));

module.exports = { getAllArticles };
