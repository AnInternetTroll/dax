/// <reference lib="dom" />

// Names
const formEl = document.querySelector("form");
const nameEl = document.querySelector("input");
const namesEl = document.querySelector("#names");

let names = await fetch("/names")
	.then((a) => a.json())
	.then((a) => {
		namesEl.textContent = a.join("\n");
		return a;
	});

/**
 * Add a name to the database on a server
 * @param {string} name The name you want to get added
 */
function addName(name) {
	fetch("/names", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({
			name,
		}),
	})
		.then((a) => a.json())
		.then((a) => {
			names = a;
			namesEl.textContent = names.join("\n");
		});
	names.push(name);
	names.textContent = names.join("\n");
}
formEl.addEventListener("submit", (e) => {
	e.preventDefault();
	addName(nameEl.value);
});

// Lucky number
const luckyNumberGuessInputEl = document.querySelector("#lucky-number-guess");
const luckyNumberEl = document.querySelector("#luckynumber");
// First lucky number
luckyNumberEl.textContent = Math.round(Math.random() * 1000);

setTimeout(
	() => {
		setInterval(() => {
			luckyNumberEl.textContent = Math.round(Math.random() * 1000);
			if (luckyNumberGuessInputEl.value == luckyNumberEl.textContent) {
				document.body.classList.add("lucky");
				setTimeout(() => document.body.classList.remove("lucky"), 10 * 1000);
			}
		}, 60 * 1000 // A minute
		);
	},
	(60 - new Date().getSeconds()) * // How many seconds until the next minute
		1000,
);
