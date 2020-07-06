import React, { useState, useRef } from 'react';
//import logo from './logo.svg';
import './App.css';
import List from './components/List';
import axios from 'axios';

function App() {
	let pages = useRef(0);
	const [articles, setArticles] = useState([]);

	const updatePages = (event) => {
		pages = Number(event.target.value);
	}

	const getArticles = () => {
		axios({
			//url: `${window.location.origin}/articles`,
			url: 'http://localhost:4000/articles',
			method: 'post',
			data: {
				pages: pages
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
		<div>
			<input id="page" type="text" placeholder="type a number between 1 and 5" onChange={updatePages}></input>
			<button id="get_articles" onClick={getArticles}>Get Articles</button>
			<List articles={articles}></List>
		</div>
	);
}

export default App;
