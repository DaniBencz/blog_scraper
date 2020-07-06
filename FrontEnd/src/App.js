import React from 'react';
//import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {

	const getArticles = () => {
		axios({
			url: 'http://localhost:4000/articles',
			method: 'post',
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
