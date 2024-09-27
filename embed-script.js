// (function() {
//   // Create a div element where the React app will be rendered
//   const rootDiv = document.createElement('div');
//   rootDiv.id = 'calculator-root';
//   rootDiv.style.width = '100%';
//   rootDiv.style.height = '100%';
//   document.getElementById('calculator-embed').appendChild(rootDiv);

//   // Load the custom CSS file
//   const link = document.createElement('link');
//   link.rel = 'stylesheet';
//   link.href = "https://aruns2008.github.io/calculator/style.css";
//   document.head.appendChild(link);

//   // Load the custom JS file
//   const script = document.createElement('script');
//   customScript.src = "https://aruns2008.github.io/calculator/script.js";
//   document.head.appendChild(script);
//   // Load the React app script
//   // const script = document.createElement('script');
//   // script.src = "https://aruns2008.github.io/calculator/static/js/main.68fde99c.js"; // Ensure this path is correct
//   // document.head.appendChild(script);
// })();

// Create a div element where the React app will be mounted
var div = document.createElement('div');
div.id = 'root'; // Ensure this ID matches the one used in your React app

// Load the CSS file
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://aruns2008.github.io/calculator/style.css';

// Load the JavaScript file 
var script = document.createElement('script');
script.src = 'https://aruns2008.github.io/calculator/script.js';
script.async = true;

document.addEventListener('DOMContentLoaded', function() {
    document.body.appendChild(div);
    document.head.appendChild(link);
    document.body.appendChild(script);
});
