const imgElement = document.getElementById("dogImage");
const randomBtn = document.getElementById("randomBtn");
const breedInput = document.getElementById("breedInput");
const saveBreedBtn = document.getElementById("saveBreedBtn");
const clearBreedBtn = document.getElementById("clearBreedBtn");
const breedStatus = document.getElementById("breedStatus");




// display dat bih
const breedDisplay = document.createElement("p");
breedDisplay.id = "breedDisplay";
document.body.insertBefore(breedDisplay, document.querySelector("h2"));

// get a pic of the saved breed if there is one
const savedBreed = localStorage.getItem("favoriteBreed");
if (savedBreed) {
	breedInput.value = savedBreed;
	breedStatus.textContent = `Saved favorite breed: ${savedBreed}`;
} else {
	breedStatus.textContent = "No favorite breed set yet.";
}



// fetch dog pic haha get it
async function fetchDogImage() {
	const favoriteBreed = localStorage.getItem("favoriteBreed");
	let url = "https://dog.ceo/api/breeds/image/random";

	if (favoriteBreed) {
		url = `https://dog.ceo/api/breed/${favoriteBreed.toLowerCase()}/images/random`;
	}

	try {
		const res = await fetch(url);
		const data = await res.json();

		if (data.status === "success") {
			imgElement.src = data.message;

			// get the breed name from the url... used google to help with this one
			const parts = data.message.split("/");
			const breedPart = parts[parts.indexOf("breeds") + 1]; // ex. collie...
			const breedName = breedPart.replace("-", " ").split("/")[0];
			breedDisplay.textContent = `This good boy is a ${breedName}`;
		}
        else {
			imgElement.src = "";
			breedDisplay.textContent = "";
			alert("Could not find that breed. Try another one!");
		}
	} catch (error) {
		alert("Error fetching data. Please try again later.");
		console.error(error);
	}
}




// local save breed
saveBreedBtn.addEventListener("click", () => {
	const breed = breedInput.value.trim();
	if (breed) {
		localStorage.setItem("favoriteBreed", breed);
		breedStatus.textContent = `Saved favorite breed: ${breed}`;
	} else {
		alert("put in a breed name before saving");
	}
});

// clear local saved
clearBreedBtn.addEventListener("click", () => {
	localStorage.removeItem("favoriteBreed");
	breedInput.value = "";
	breedStatus.textContent = "Favorite breed cleared.";
});


randomBtn.addEventListener("click", fetchDogImage);

fetchDogImage();