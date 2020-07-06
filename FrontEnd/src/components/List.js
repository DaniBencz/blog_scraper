import React from 'react';

const List = ({ articles }) => {
	return (
		<div id="list">
			<ul>
				{articles.map((article, index) => {
					return <li key={index}><a href={article}>{article}</a></li>
				})}
			</ul>
		</div>
	)
}

export default List;