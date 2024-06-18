(function() {
  console.log("called");
  // Create a div element where the React app will be rendered
  const rootDiv = document.createElement('div');
  rootDiv.id = 'calculator-root';
  rootDiv.style.width = '100%';
  rootDiv.style.height = '100%';
  document.getElementById('calculator-embed').appendChild(rootDiv);

  // Load the React app script
  const script = document.createElement('script');
  script.src = "https://aruns2008.github.io/calculator/static/js/main.cd431078.js"; // Adjust the path if necessary
  document.head.appendChild(script);
})();
