import React, { useRef, useEffect, useState } from 'react';
import Search from './Search';
import { Link } from "react-router-dom";
import "./CanvasComponent.css";

function CanvasComponent() {
	const canvasRef = useRef(null);
	let context = null;
	let draw = false;

	// Handles mousedown event
	const startDrawing = (event) => {
		draw = true;
		drawLine(event.clientX - event.target.offsetLeft, event.clientY - event.target.offsetTop, false);
	};

	// Handles mouseup and mouseout events
	const stopDrawing = () => {
		draw = false;
		context.beginPath();
	};

	// Handles mousemove event
	const drawLine = (x, y, isDrawing) => { 
		if (!draw) return;
		context.lineWidth = 2;
		context.lineCap = 'round';
		context.strokeStyle = '#000';

		context.lineTo(x, y);
		if (isDrawing) {
			context.stroke();
		}
		context.beginPath();
		context.moveTo(x, y);
	};

	const [translation, setTranslation] = useState('');

	const saveDrawing = () => {
		const dataUrl = canvasRef.current.toDataURL();

		fetch('/api/save', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ base64String: dataUrl, translation })
		}).then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		}).then(data => {
		// The save was successful
		}).catch(error => {
			console.error('There was a problem with the fetch operation:', error);
		});
		// Clear the canvas
		const context = canvasRef.current.getContext('2d');
		context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		context = canvas.getContext('2d');

		// Event listeners
		canvas.addEventListener('mousedown', startDrawing);
		canvas.addEventListener('mouseup', stopDrawing);
		canvas.addEventListener('mouseout', stopDrawing);
		canvas.addEventListener('mousemove', (event) =>
			drawLine(event.clientX - event.target.offsetLeft, event.clientY - event.target.offsetTop, true)
		);

		canvas.addEventListener('touchstart', startDrawing, { passive: false });
		canvas.addEventListener('touchend', stopDrawing);
		canvas.addEventListener('touchmove', (event) =>
			drawLine(event.clientX - event.target.offsetLeft, event.clientY - event.target.offsetTop, true)
		);

		return () => {
			// Clean up
			canvas.removeEventListener('mousedown', startDrawing);
			canvas.removeEventListener('mouseup', stopDrawing);
			canvas.removeEventListener('mouseout', stopDrawing);
			canvas.removeEventListener('mousemove', drawLine);

			canvas.addEventListener('touchstart', startDrawing, { passive: false });
			canvas.addEventListener('touchend', stopDrawing);
			canvas.addEventListener('touchmove', (event) =>
				drawLine(event.clientX - event.target.offsetLeft, event.clientY - event.target.offsetTop, true)
			);
		};
	}, []);

	return (
		<div className="content">
			<Link to="/">Search</Link>
			<canvas ref={canvasRef} width={500} height={500} />
			<div className="form-wrapper">
				<input type="text" value={translation} onChange={e => setTranslation(e.target.value)} placeholder="English translation"/>
				<button onClick={saveDrawing}>Save Drawing</button>
			</div>
		</div>
	);
}

export default CanvasComponent;