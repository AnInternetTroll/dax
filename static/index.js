/// <reference lib="dom" />

// Names form
const formEl = document.querySelector("#namesForm");
const nameEl = document.querySelector("#user-name");
const namesEl = document.querySelector("#names");
// Greeting
const greetingEl = document.querySelector("#greeting");
// Lucky number
const luckyNumberGuessInputEl = document.querySelector("#lucky-number-guess");
const luckyNumberEl = document.querySelector("#luckynumber");
// Not a constant so we can easily replace it from whatever the server might give us at some other point
let names = await fetch("/names")
	.then((a) => a.json())
	.then((a) => {
		namesEl.textContent = a.join("\n");
		return a;
	});

/**
 * Set a greeting and save it in session storage
 * @param {string} name The name of the vistor
 */
function setGreeting(name) {
	// If no name was submitted just don't do anything
	if (!name || !name.length) return;
	greetingEl.innerHTML = `Welcome, we wish you all well, <b>${name}</b>`;
	sessionStorage.setItem("name", name);
}

/**
 * Add a name to the database on a server
 * @param {string} name The name you want to get added
 */
function addName(name) {
	// If no name was submitted just don't do anything
	if (!name || !name.length) return;
	// Add name to external database in parallel
	fetch("/names", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({
			name,
		}),
	})
		.then((response) => response.json())
		.then((namesFromServer) => {
			names = namesFromServer;
			namesEl.textContent = names.join("\n");
		});

	// Add to the list on screen
	names.push(name);
	names.textContent = names.join("\n");

	setGreeting(name);
}

function randomiseLuckyNumber() {
	luckyNumberEl.textContent = Math.round(Math.random() * 1000);
	if (luckyNumberGuessInputEl.value == luckyNumberEl.textContent) {
		document.body.classList.add("lucky");
		setTimeout(() => document.body.classList.remove("lucky"), 10 * 1000);
	}
}

// Initial setup
formEl.addEventListener("submit", (e) => {
	e.preventDefault();
	addName(nameEl.value);
});

setGreeting(sessionStorage.getItem("name"));

// First lucky number
randomiseLuckyNumber();

// Generate lucky numbers
// This better not start a gambling addiction
setTimeout(
	() => {
		randomiseLuckyNumber();
		setInterval(() => {
			randomiseLuckyNumber();
		}, 60 * 1000 // A minute
		);
	},
	(60 - new Date().getSeconds()) * // How many seconds until the next minute
		1000,
);
