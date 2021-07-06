///////// GLOBAL VARIABLES /////////

const photoHeader = document.querySelector('.photo-heading');
const photoDiv = document.querySelector('.photo-container');
const button = document.querySelector('.btn');
const main = document.querySelector('main');
let sections = document.querySelectorAll('section');

///////// FUNCTIONS /////////

// Handles API requests and parses JSON
async function getJSON(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Iterates over url list and sends data to getJSON function
async function getPhotoData(urlList){
  let roverData = await [];
  for (let i = 0; i<urlList.length; i++) { 
    roverData.push(await getJSON(urlList[i]));
  }
  return Promise.allSettled(roverData);
}

// creates new photo heading
function createHeading(data) {
  const randomNum = Math.floor(Math.random() * data.photos.length);
  
  photoHeader.innerHTML = `
    <div class="photo-heading">
      <h2>On Martian Sol ${data.photos[randomNum].sol}</h2>
      <p>(That's Earth Day ${data.photos[randomNum].earth_date})...</p>
    </div>
  `;
}

// creates new section for each rover's photoset
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

// passes parsed data from the API into createHeading and createSection functions
function generateHTML(photoObjectArray) {
  // console.log(photoObjectArray);
  photoObjectArray.forEach(photoObject => {
      createHeading(photoObject.value);
      createSection(photoObject.value);
  });
}


///////// EVENT LISTENER /////////
button.addEventListener('click', (e) => {
  e.target.innerHTML = 'Loading...';

  //Sections are re-examined each time on button press... random sol and urlList also updated each time, so need them locally
  sections = document.querySelectorAll('section');
  let randomMarsSol = Math.floor(Math.random() * 3140);
  let urlList = [
    //Curiosity Rover API url
    `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${randomMarsSol}&page=1&api_key=GIOZrPPDzt8ZIzxFkWHWdC9MGdR9FLqwmRDeXKt4`,
    //Opportunity Rover API url
    `https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=${randomMarsSol}&page=1&api_key=GIOZrPPDzt8ZIzxFkWHWdC9MGdR9FLqwmRDeXKt4`,
    //Spirit Rover API url
    `https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?sol=${randomMarsSol}&page=1&api_key=GIOZrPPDzt8ZIzxFkWHWdC9MGdR9FLqwmRDeXKt4`
  ]

  window.scrollTo(0,0);
  
  if (sections.length >= 3) {  //clears div if already full
    photoDiv.innerHTML = '';
  }


  getPhotoData(urlList)
    .then(generateHTML)
    .catch( err => {
        photoDiv.innerHTML += '<section><h3 class="error-msg">Houston, we have a problem! <br> Something went wrong with one of the rovers!</h3></section>'
      })
    .finally( () => {
      e.target.innerHTML = 'Click For More Photos from Mars';
    });
});