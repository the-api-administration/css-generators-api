/* =================================== */
/* Nav becomes transparent upon scroll */
/* =================================== */

// Get the navbar
let navbar = document.getElementById("navbar");

// When the user scrolls the page, execute myFunction
window.onscroll = (e) => {navbar.classList.add("sticky")}

/* =================================== */
/* Back to top button */
/* =================================== */

//Get the button:
mybutton = document.getElementById("backToTop");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


/* =================================== */
/* Search bar */
/* =================================== */


let form = document.getElementById("myForm");

/* Prevent refreshing the page when the form is submitted */
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);

/* When the user is focused on the input, and they press enter, run getMatches() */
let input = document.getElementById("input1");
   input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {  
      getMatches();
    }
  });


const btn = document.getElementById('keyword-btn');
btn.addEventListener('click', getMatches);

/**
 * Name: getMatches
 * Description: Find resources with keywords matching the user input
 */
async function getMatches() {
	//gets the input from the text box and trims white space and makes it lower case
	const keyword = document.querySelector('input').value.toLowerCase().trim();

    //have the "you searched for: h3 to appear
    document.getElementById('youSearchedFor').innerText = 'You searched for: ';

    //place the keyword into span
    document.getElementById('test-keyword').innerText = keyword;

	try {
		const res = await fetch('/api');
		const data = await res.json();
		// Filters array from the API for resources with keywords containing user value
		const matches = data.filter(resource => resource.keywords.some(str => str.toLowerCase().includes(keyword)));
		renderMatches(matches);
	} catch (err) {
		console.error(err);
	}
	//reset search bar to empty
	document.querySelector('input').value = ''
	//scroll back to the top
	scrollContainer.scrollTop = 0
}

/**
 * Name: renderMatches
 * Description: takes an array of matches, each match represents resources that had contained a resource's keyword and renders each match to the DOM.
 * @param {*} matches - accepts an array of objects had contained a resource's keyword.
 */
function renderMatches(matches) {
	const list = document.getElementById('result-list');
	list.innerHTML = '';

	// If matches exist, render each match to the DOM
	if(matches.length) {
		// For every match found, render the objects to the DOM in JSON format
		matches.forEach(match => {
			const li = document.createElement('li');

			// Create an element that looks like a JSON object for every match
			li.innerHTML = `
					<code>{
							<div class="indent">
								<img src="${match.image}">
                                <h4>name: ${match.name},</h4>
								<h5>url: '<a href=${match.url} target="_blank">${match.url}</a>',</h5>
								<h4>description: ${match.description},</h4>
								<h6 class="text-truncate">keywords: [${match.keywords.map(keyword => `'${keyword}'`).join(", ")}]</h6>
							</div>},
					</code>
			`;

			list.appendChild(li);
		});
	} else {
		// Display "No matches were found" in result-list <ul> in the DOM
		const li = document.createElement('li');
		li.innerText = 'No matches were found.';
		list.appendChild(li);
	}
}
