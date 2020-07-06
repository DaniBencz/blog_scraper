import React from 'react';
//import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {

	const getArticles = () => {
		axios({
			url: 'http://localhost:3000/articles',
			method: 'get',
			// mode: 'no-cors',
			// headers: {
			// 	'Access-Control-Allow-Origin': '*',
			// 	Accept: 'application/json',
			// 	'Content-Type': 'application/json',
			// },
			data: {
				pages: 2
			}
		})
			.then(resp => {
				resp.data.articles.forEach(element => {
					console.log(element)
				});
			})
	}

	return (
		<div>
			<input id="page" type="text" placeholder="type a number between 1 and 5"></input>
			<button id="get_articles" onClick={getArticles}>Get Articles</button>
		</div>
	);
}

export default App;
