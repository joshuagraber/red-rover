const photoHeader = document.querySelector('.photo-heading');
const photoDiv = document.querySelector('.photo-container');
const button = document.querySelector('.btn');
const main = document.querySelector('main');

async function getJSON(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    throw error;
  }
}
function createHeading(data) {
  photoHeader.innerHTML = '';
  const randomNum = Math.floor(Math.random() * data.photos.length);
  photoHeader.innerHTML = `
    <div class="photo-heading">
      <h2>On Martian Sol ${data.photos[randomNum].sol}</h2>
      <p>(That's Earth Day ${data.photos[randomNum].earth_date})...</p>
    </div>
  `;
}
function createSection(data) {
  const randomNum = Math.floor(Math.random() * data.photos.length);
  if (data.photos.length < 0 ) {
    photoDiv.innerHTML += `
    <section>
    <div class="section-header">
        <h3>Oops!</h3>
        <p>Looks like this rover took a Soliday today!</p>
    </div>
    </section>
  `;
  } else {
    photoDiv.innerHTML += `
    <section>
    <div class="section-header">
        <h3>${data.photos[randomNum].rover.name}</h3>
        <p>took this photo...</p>
    </div>
        <img src="${data.photos[randomNum].img_src}" alt="Image from Mars Rover ${data.photos[randomNum].rover.name}">
    </section>
  `; 
  }
}

function changeRandomSol(){
  randomMarsSol = Math.floor(Math.random() * 3140);
}

button.addEventListener('click', (e) => {
  window.scrollTo(0,0);
  
  let randomMarsSol = Math.floor(Math.random() * 3140);
  let curiosityURL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${randomMarsSol}&page=1&api_key=GIOZrPPDzt8ZIzxFkWHWdC9MGdR9FLqwmRDeXKt4`;
  let opportunityURL = `https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=${randomMarsSol}&page=1&api_key=GIOZrPPDzt8ZIzxFkWHWdC9MGdR9FLqwmRDeXKt4`;
  let spiritURL = `https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?sol=${randomMarsSol}&page=1&api_key=GIOZrPPDzt8ZIzxFkWHWdC9MGdR9FLqwmRDeXKt4`;
  
  const sections = document.querySelectorAll('section');
  if (sections.length === 3) {
    photoDiv.innerHTML = '';
  }
  
  e.target.innerHTML = 'Loading...';

  getJSON(curiosityURL)
        .then(data => createHeading(data))
        .finally(changeRandomSol());
  getJSON(curiosityURL)
        .then(data => createSection(data))
        .catch( e => {
          photoDiv.innerHTML += '<section><h3 class="error-msg">Something went wrong with one of the rovers!</h3></section>'
        });
  getJSON(opportunityURL)
        .then(data => createSection(data))
        .catch( e => {
          photoDiv.innerHTML += '<section><h3 class="error-msg">Something went wrong with one of the rovers!</h3></section>'
        });
  getJSON(spiritURL)
        .then(data => createSection(data))
        .catch( e => {
          photoDiv.innerHTML += '<section><h3 class="error-msg">Something went wrong with one of the rovers!</h3></section>'
        })
        .finally( () => {
          e.target.innerHTML = 'Click For More Photos from Mars';
        });
});
