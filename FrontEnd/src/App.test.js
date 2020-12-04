import React from 'react'
import { render, fireEvent, queryByAttribute, wait, findByText } from '@testing-library/react'
import App from './App'
import axios from 'axios'

test('renders App', () => {
	const { getByText } = render(<App />)
	const welcome = getByText('Please type a number between 1 and 5, or leave empty!')
	expect(welcome).toBeInTheDocument()
})

jest.mock('axios')
const getById = queryByAttribute.bind(null, 'id')	// handy custom function
test('renders api response', async () => {

	let { container, getByText } = render(<App test={true}/>)
	let resp = {
		data: {
			articles: ['hello']
		}
	}
	// axios.post.mockResolvedValue(resp)
	// axios.post.mockImplementation(() => Promise.resolve(resp))
	axios.mockReturnValue(Promise.resolve(resp))

	const input = getById(container, 'page_value')
	fireEvent.change(input, { target: { value: 1 } })

	const submit = getById(container, 'get_articles')
	fireEvent.click(submit)
	
	let loader = getById(container, 'loader')	// expected DOM element has to be defined inside after async method is done 
	await wait(() => expect(getById(container, 'loader')).toBeInTheDocument())	// need to await async method getArticles

	// await wait(() => expect(getByText('hello')).toBeInTheDocument())	// need to await async method getArticles
	// await expect(findByText('hello')).toBeInTheDocument()
	// since none of the above fancy shit seems to work, here we go:
	setTimeout(expect(getByText('hello')).toBeInTheDocument(), 2000)
})
