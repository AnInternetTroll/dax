/// <reference lib="dom" />

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
