// import React, { useRef, useEffect, useState } from 'react';
// import Search from './Search';
// import { Link } from "react-router-dom";
// import "./CanvasComponent.css";

// function CanvasComponent() {
// 	const canvasRef = useRef(null);
// 	let context = null;
// 	let draw = false;

// 	// Handles mousedown event
// 	const startDrawing = (event) => {
// 		draw = true;
// 		drawLine(event.clientX - event.target.offsetLeft, event.clientY - event.target.offsetTop, false);
// 	};

// 	// Handles mouseup and mouseout events
// 	const stopDrawing = () => {
// 		draw = false;
// 		context.beginPath();
// 	};

// 	// Handles mousemove event
// 	const drawLine = (x, y, isDrawing) => { 
// 		if (!draw) return;
// 		context.lineWidth = 2;
// 		context.lineCap = 'round';
// 		context.strokeStyle = '#000';

// 		context.lineTo(x, y);
// 		if (isDrawing) {
// 			context.stroke();
// 		}
// 		context.beginPath();
// 		context.moveTo(x, y);
// 	};

// 	const [translation, setTranslation] = useState('');

// 	const saveDrawing = () => {
// 		const dataUrl = canvasRef.current.toDataURL();

// 		fetch('/api/save', {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json'
// 			},
// 			body: JSON.stringify({ base64String: dataUrl, translation })
// 		}).then(response => {
// 			if (!response.ok) {
// 				throw new Error('Network response was not ok');
// 			}
// 			return response.json();
// 		}).then(data => {
// 		// The save was successful
// 		}).catch(error => {
// 			console.error('There was a problem with the fetch operation:', error);
// 		});
// 		// Clear the canvas
// 		const context = canvasRef.current.getContext('2d');
// 		context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
// 	};

// 	useEffect(() => {
// 		const canvas = canvasRef.current;
// 		context = canvas.getContext('2d');

// 		// Event listeners
// 		canvas.addEventListener('mousedown', startDrawing);
// 		canvas.addEventListener('mouseup', stopDrawing);
// 		canvas.addEventListener('mouseout', stopDrawing);
// 		canvas.addEventListener('mousemove', (event) =>
// 			drawLine(event.clientX - event.target.offsetLeft, event.clientY - event.target.offsetTop, true)
// 		);

// 		return () => {
// 			// Clean up
// 			canvas.removeEventListener('mousedown', startDrawing);
// 			canvas.removeEventListener('mouseup', stopDrawing);
// 			canvas.removeEventListener('mouseout', stopDrawing);
// 			canvas.removeEventListener('mousemove', drawLine);
// 		};
// 	}, []);

// 	return (
// 		<div className="content">
// 			<Link to="/">Search</Link>
// 			<canvas ref={canvasRef} width={500} height={500} />
// 			<div className="form-wrapper">
// 				<input type="text" value={translation} onChange={e => setTranslation(e.target.value)} placeholder="English translation"/>
// 				<button onClick={saveDrawing}>Save Drawing</button>
// 			</div>
// 		</div>
// 	);
// }

// export default CanvasComponent;


import React, { useRef, useEffect } from 'react';
import "./CanvasComponent.css";

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const context = useRef(null);  // Here we are defining context.
  let isDrawing = false;

  function startDraw(e) {
    isDrawing = true;
    draw(e);
  }

  function endDraw() {
    isDrawing = false;
    context.current.beginPath();
  }

  function draw(e) {
    if (!isDrawing) return;
    const { clientX, clientY } = e.type.includes('touch') ? e.touches[0] : e;
    context.current.lineTo(clientX, clientY);
    context.current.stroke();
    context.current.beginPath();
    context.current.moveTo(clientX, clientY);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    context.current = canvas.getContext('2d');  // Now context is getting assigned here

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseout', endDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    return () => {
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', endDraw);
      canvas.removeEventListener('mouseout', endDraw);

      canvas.removeEventListener('touchstart', startDraw);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', endDraw);
    };
  }, []);

  return <canvas width="500" height="500" ref={canvasRef} />;
};

export default CanvasComponent;
