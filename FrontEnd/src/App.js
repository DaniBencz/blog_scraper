import React, { useState, useRef } from 'react';
import './App.css';
import List from './components/List';
import axios from 'axios';

function App() {
	let pages = useRef();
	const [articles, setArticles] = useState([]);

	const updatePages = (event) => {
		pages.current = Number(event.target.value);
	}

	const getArticles = () => {
		axios({
			//url: `${window.location.origin}/articles`,
			url: 'http://localhost:4000/articles',
			method: 'post',
			data: {
				pages: pages.current
			}
		})
			.then(resp => {
				setArticles(resp.data.articles)
			})
			.catch(resp => {
				//
			})
	}

	return (
		<div id="app">
			{/* link to Repo */}
			<div id="form">
				<h4>Please type a number between 1 and 5 (or leave empty)</h4>
				<input id="page" type="text" onChange={updatePages}></input>
				<button id="get_articles" onClick={getArticles}>Get Articles</button>
			</div>
			<List articles={articles}></List>
		</div>
	);
}

export default App;
