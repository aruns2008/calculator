(function() {
  // Create a div element where the React app will be rendered
  const rootDiv = document.createElement('div');
  rootDiv.id = 'calculator-root';
  rootDiv.style.width = '100%';
  rootDiv.style.height = '100%';
  document.body.appendChild(rootDiv);

  // Load the React app script
  const script = document.createElement('script');
  script.src = "https://aruns2008.github.io/calculator/static/js/main.3b640362.js"; // Adjust the path if necessary
  script.onload = function() {
    // Optional: Initialize your React app if needed
    // This step may not be necessary if your React app auto-initializes
  };
  document.head.appendChild(script);
})();
