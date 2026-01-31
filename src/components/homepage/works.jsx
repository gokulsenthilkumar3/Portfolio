import React from "react";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";

import Card from "../common/card";

import "./styles/works.css";

const Works = () => {
	return (
		<div className="works">
			<Card
				icon={faBriefcase}
				title="Intership"
				body={
					<div className="works-body">
						<div className="work">
							
							<div className="work-title">Emgiltz Technologies</div>
							<div className="work-subtitle">
								Full Stack Intern
							</div>
							<div className="work-duration">06/2023 - 09/2023</div>
						</div>

						
					</div>
				}
			/>
		</div>
	);
};

export default Works;
