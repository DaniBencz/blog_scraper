import React, { useState, useRef } from 'react'
import './App.css'
import List from './components/List'
import axios from 'axios'
import github from './github_blue.png'
import loader from './straight-loader.gif'

function App () {
  const pages = useRef()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(0)

  const updatePagesValue = (event) => {
    pages.current = Number(event.target.value)
  }

  const validateInput = input => {
    return new Promise((resolve, reject) => {
      if (input === undefined) resolve(1)
      if (typeof (input) === 'number' && input >= 0 && input < 6) {
        if (input === 0) input = 1
        resolve(input)
      } else reject()
    })
  }

  const getArticles = () => {
    validateInput(pages.current)
      .then((input) => {
        setLoading(1)
        setArticles([])
        axios({
          url: `${window.location.origin}/articles`,
          method: 'post',
          data: {
            pages: input
          }
        })
          .then(resp => {
            setArticles(resp.data.articles)
            setLoading(0)
          })
          .catch(err => {
            setLoading(0)
            alert('Something went wrong, please try again later!')
          })
      })
      .catch(() => {
        console.log('Input must be a number between 1 and 5')
      })
  }

  return (
    <div id="app">
      <div id="repo">
        <a href="https://github.com/DaniBencz/blog_scraper" rel="noopener noreferrer" target="_blank">
          <img alt="gitHub repo" src={github} width="33" height="33"></img>
        </a>
      </div>
      <div id="description">
        <p>This is a practise project where <a target="_blank" href="https://blog.risingstack.com/">RisingStack blog</a> is
          being scraped for articles that contain no images (other than logos) or iFrames.</p>
			</div>
      <div id="form">
        <h2 id="instructions">Please type a number between 1 and 5, or leave empty!</h2>
        <input id="page_value" type="text" onChange={updatePagesValue}></input>
        <button id="get_articles" onClick={getArticles}>Get Articles</button>
      </div>
      {loading ? <div id="loader"><img alt="loader" src={loader} width="200" height="150"></img></div> : null}
      <List articles={articles}></List>
    </div>
  )
}

export default App
