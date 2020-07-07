import React, { useState, useRef } from 'react';
import './App.css';
import List from './components/List';
import axios from 'axios';
import github from './github_blue.png';
import loader from './straight-loader.gif'

function App() {
	let pages = useRef();
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(0);

	const updatePagesValue = (event) => {
		pages.current = Number(event.target.value);
	}

	const getArticles = () => {
		setLoading(1)
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
				setLoading(0)
			})
			.catch(resp => {
				setLoading(0)
				// Something went wrong
			})
	}

	return (
		<div id="app">
			<div id="repo">
				<a href="https://github.com/DaniBencz/blog_scraper" rel="noopener noreferrer" target="_blank">
					<img alt="gitHub repo" src={github} width="33" height="33"></img>
				</a>
			</div>
			<div id="form">
				<h2 id="instructions">Please type a number between 1 and 5, or leave empty!</h2>
				<input id="page_value" type="text" onChange={updatePagesValue}></input>
				<button id="get_articles" onClick={getArticles}>Get Articles</button>
			</div>
			{loading ? <div id="loader"><img alt="loader" src={loader} width="200" height="150"></img></div> : null}
			<List articles={articles}></List>
		</div>
	);
}

export default App;
