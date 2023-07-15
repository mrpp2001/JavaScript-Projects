
const form = document.querySelector("form");
const resultDiv = document.querySelector(".result");

form.addEventListener("submit", handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();
  const word = form.elements[0].value;
  try {
    resultDiv.innerHTML = "Fetching Data...";
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const data = await response.json();

    displayWordInfo(data);
  } catch (error) {
    displayErrorMessage();
  }
}

function displayWordInfo(data) {
  const word = data[0].word;
  const partOfSpeech = data[0].meanings[0].partOfSpeech;
  const definitions = data[0].meanings[0].definitions;
  const synonyms = data[0].meanings[0].synonyms;
  const antonyms = data[0].meanings[0].antonyms;
  const sourceUrls = data[0].sourceUrls;
  const phonetics = data[0].phonetics;
  
  let definitionsHTML = "";
  definitionsHTML += `<h2><strong>Word: </strong>${word}</h2>`;
  definitionsHTML += `<p class="partOfSpeech">${partOfSpeech}</p>`;

  if (definitions.length > 0) {
    definitionsHTML += `<p><strong>Meaning: </strong>${definitions[0].definition || "Not Found"}</p>`;
    definitionsHTML += `<p><strong>Example: </strong>${definitions[0].example || "Not Found"}</p>`;
  } else {
    definitionsHTML += `<p><strong>Meaning: </strong>Not Found</p>`;
  }

  if (antonyms && antonyms.length > 0) {
    definitionsHTML += `<p><strong>Antonyms: </strong><ul>${antonyms.map(antonym => `<li>${antonym}</li>`).join("")}</ul></p>`;
  } else {
    definitionsHTML += `<p><strong>Antonyms: </strong>Not Found</p>`;
  }

  if (synonyms && synonyms.length > 0) {
    definitionsHTML += `<p><strong>Synonyms: </strong><ul>${synonyms.map(synonym => `<li>${synonym}</li>`).join("")}</ul></p>`;
  } else {
    definitionsHTML += `<p><strong>Synonyms: </strong>Not Found</p>`;
  }

  definitionsHTML += `<div><a href="${sourceUrls}" target="_blank">Read More</a></div>`;

  if (phonetics && phonetics.length > 0) {
    definitionsHTML += `<div><strong>Pronunciations: </strong>`;
    phonetics.forEach(phonetic => {
      definitionsHTML += `<button class="playButton" data-audio="${phonetic.audio}"><i class="fa-solid fa-volume-high"></i></button>`;
    });
    definitionsHTML += `</div>`;
  }

  resultDiv.innerHTML = definitionsHTML;

  const playButtons = document.querySelectorAll(".playButton");
  playButtons.forEach(button => {
    button.addEventListener("click", () => {
      const audioUrl = button.getAttribute("data-audio");
      const audio = new Audio(audioUrl);
      audio.play();
    });
  });

}

function displayErrorMessage() {
  resultDiv.innerHTML = `<p>Sorry, the word could not be found</p>`;
}


