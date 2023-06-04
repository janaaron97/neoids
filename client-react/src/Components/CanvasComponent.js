// import React, { useRef, useEffect, useState } from 'react';
// import "./CanvasComponent.css";
// import Search from './Search';
// import { Link } from "react-router-dom";

// const CanvasComponent = () => {
//   const canvasRef = useRef(null);
//   const context = useRef(null);  
//   let isDrawing = false;

//   function startDraw(e) {
//     isDrawing = true;
//     e.preventDefault();
//     draw(e);
//   }

//   function endDraw() {
//     isDrawing = false;
//     context.current.beginPath();
//   }

//   function draw(e) {
//     if (!isDrawing) return;
//     const { clientX, clientY } = e.type.includes('touch') ? e.touches[0] : e;

//     const canvasPos = canvasRef.current.getBoundingClientRect();
//     const scaleX = canvasRef.current.width / canvasPos.width;
//     const scaleY = canvasRef.current.height / canvasPos.height;

//     const scrollX = window.scrollX || window.pageXOffset;
//     const scrollY = window.scrollY || window.pageYOffset;

//     const xPos = (clientX - canvasPos.left + scrollX) * scaleX;
//     const yPos = (clientY - canvasPos.top + scrollY) * scaleY;

//     context.current.lineTo(xPos, yPos);
//     context.current.stroke();
//     context.current.beginPath();
//     context.current.moveTo(xPos, yPos);
//   }

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

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     context.current = canvas.getContext('2d');  

//     // Make the line thicker
//     context.current.lineWidth = 10;
// 	context.current.lineCap = 'round';
// 	context.current.lineJoin = 'round';

//     canvas.addEventListener('mousedown', startDraw);
//     canvas.addEventListener('mousemove', draw);
//     canvas.addEventListener('mouseup', endDraw);
//     canvas.addEventListener('mouseout', endDraw);

//     canvas.addEventListener('touchstart', startDraw, { passive: false });
//     canvas.addEventListener('touchmove', draw, { passive: false });
//     canvas.addEventListener('touchend', endDraw);

//     return () => {
//       canvas.removeEventListener('mousedown', startDraw);
//       canvas.removeEventListener('mousemove', draw);
//       canvas.removeEventListener('mouseup', endDraw);
//       canvas.removeEventListener('mouseout', endDraw);

//       canvas.removeEventListener('touchstart', startDraw);
//       canvas.removeEventListener('touchmove', draw);
//       canvas.removeEventListener('touchend', endDraw);
//     };
//   }, []);

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
// };

// export default CanvasComponent;


import React, { useRef, useEffect, useState } from 'react';
import "./CanvasComponent.css";
import Search from './Search';
import { Link } from "react-router-dom";

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const context = useRef(null);  
  let isDrawing = false;

  function startDraw(e) {
    isDrawing = true;
    e.preventDefault();
    isDrawing = true;
    const rect = canvasRef.current.getBoundingClientRect();
    lastX = (e.clientX || e.touches[0].clientX) - rect.left;
    lastY = (e.clientY || e.touches[0].clientY) - rect.top;
  }

  function endDraw() {
    isDrawing = false;
    context.current.beginPath();
  }

  let lastX = 0;
let lastY = 0;

  function draw(e) {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX - rect.left + window.scrollX : e.clientX - rect.left + window.scrollX;
    const y = e.touches ? e.touches[0].clientY - rect.top + window.scrollY : e.clientY - rect.top + window.scrollY;

    context.current.lineWidth = 10;
    context.current.lineCap = "round";
    context.current.strokeStyle = 'black';

    context.current.beginPath();
    // Start from the last point
    context.current.moveTo(lastX, lastY);
    // Draw a curve to the new point
    context.current.quadraticCurveTo(lastX, lastY, x, y);
    context.current.stroke();

    lastX = x;
    lastY = y;
  }

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
    context.current = canvas.getContext('2d');  

    // Make the line thicker
    context.current.lineWidth = 10;
	context.current.lineCap = 'round';
	context.current.lineJoin = 'round';

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

	return (
		<div className="content">
			<Link to="/">Search</Link>
			<canvas ref={canvasRef} width={300} height={300} />
			<div className="form-wrapper">
				<input type="text" value={translation} onChange={e => setTranslation(e.target.value)} placeholder="English translation"/>
				<button onClick={saveDrawing}>Save Drawing</button>
			</div>
		</div>
	);
};

export default CanvasComponent;

