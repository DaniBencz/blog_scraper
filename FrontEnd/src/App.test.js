import React from 'react'
import { render, fireEvent, queryByAttribute, wait, findByText } from '@testing-library/react'
import App from './App'
import axios from 'axios'
import renderer from 'react-test-renderer'

jest.mock('axios')
const getById = queryByAttribute.bind(null, 'id')	// handy custom function

describe('playing with describe', () => {

	test('renders App', () => {
		const { getByText } = render(<App />)
		const welcome = getByText('Please type a number between 1 and 5, or leave empty!')
		expect(welcome).toBeInTheDocument()
	})


	it('renders api response', async (/* done */) => {

		let { container, getByText } = render(<App test={true} />)
		let resp = {
			data: {
				articles: ['hello']
			}
		}
		// axios.post.mockResolvedValue(resp)	// keeps returning undefined
		// axios.post.mockImplementation(() => Promise.resolve(resp))	// keeps returning undefined
		axios.mockReturnValue(Promise.resolve(resp))

		const input = getById(container, 'page_value')
		fireEvent.change(input, { target: { value: 1 } })

		const submit = getById(container, 'get_articles')
		fireEvent.click(submit)

		await wait(() => expect(axios).toHaveBeenCalledTimes(1))	// need to await async method getArticles
		await wait(() => expect(axios).toBeCalledWith({
			url: `${window.location.origin}/articles`,
			method: 'post',
			data: {
				pages: 1
			}
		}))

		// expectations bellow do the same thing, with different error messege, if failing
		await wait(() => expect(getByText('hello')).toBeInTheDocument())
			// if fails, will complain for Timeout
		expect(await findByText(container, 'hello')).toBeInTheDocument()
			// if fails, will give the right reason: unable to find element

		// done()
	})
})

test('basic snapshot test', () => {
	const component = renderer.create(<App test={true} />)
	let tree = component.toJSON()
	expect(tree).toMatchSnapshot()
	// jest -u to update snapshots
})

// coverage-report: $ npm test -- --coverage