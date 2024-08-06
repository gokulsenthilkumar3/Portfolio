import React from "react";

function paper1() {
	return {
		date: "NO",
		title: "",
		description:
			"",
		keywords: [
			"",
			"Gokul",
			"Gokul S",
			"Gokul Senthilkumar",
		],
		style: `
				.article-content {
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				.randImage {
					align-self: center;
					outline: 2px solid red;
				}
				`,
		body: (
			<React.Fragment>
				<div className="article-content">
					<div className="paragraph">Content of Paper</div>
					<img
						src=""
						alt="random"
						className="randImage"
					/>
				</div>
			</React.Fragment>
		),
	};
}



const myArticles = [paper1];

export default myArticles;
