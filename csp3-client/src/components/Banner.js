import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Banner({ data }) {
	const { title, content, destination, label } = data;

	return (
		<Row className="justify-content-center">
			<Col xs={12} md={8} lg={6}>
				<Card className="text-center my-4 py-4">
					<Card.Body>
						<h1>{title}</h1>
						<p id="motto">{content}</p>
						<Link className="btn btn-primary" to={destination}>
							{label}
						</Link>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	);
}