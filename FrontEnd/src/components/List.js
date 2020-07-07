import React from 'react';

const List = ({ articles }) => {
	return (
		<div id="list">
			{/* conditionally render: Please be patient... */}
			<ul>
				{articles.map((article, index) => {
					return <li key={index}><a href={article} rel="noopener noreferrer" target="_blank">{article}</a></li>
				})}
			</ul>
		</div>
	);
}

export default List;