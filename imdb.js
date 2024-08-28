// Original API 
// const url = 'https://imdb188.p.rapidapi.com/api/v1/searchIMDB?query=';
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'x-rapidapi-key': '8679570c5emsh871f0fd3d68e512p131979jsnf9f75a04d014',
// 		'x-rapidapi-host': 'imdb188.p.rapidapi.com'
// 	}
// };

const url = 'https://imdb-com.p.rapidapi.com/auto-complete?query=';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '8679570c5emsh871f0fd3d68e512p131979jsnf9f75a04d014',
		'x-rapidapi-host': 'imdb-com.p.rapidapi.com'
	}
};

async function showMovieResult() {
  hideActorResult();
  document.querySelector("#search_phrase").style.setProperty("display", "inline");
  document.querySelector("#search_disp").style.setProperty("display", "block");
  const mr = document.querySelectorAll(".movie_result");
  mr.forEach(r => r.style.setProperty("display", ""));
} 

async function hideMovieResult() {
  const mr = document.querySelectorAll(".movie_result");
  mr.forEach(r => r.style.setProperty("display", "none"));
}

async function showActorResult() {
  hideMovieResult();
  document.querySelector("#search_phrase").style.setProperty("display", "inline");
  document.querySelector("#search_disp").style.setProperty("display", "block");
  const ar = document.querySelectorAll(".actor_result");
  ar.forEach(r => r.style.setProperty("display", ""));
}

async function hideActorResult() {
  const ar = document.querySelectorAll(".actor_result");
  ar.forEach(r => r.style.setProperty("display", "none"));
}

async function hideResult() {
  document.querySelector("#search_phrase").style.setProperty("display", "none");
  document.querySelector("#search_disp").style.setProperty("display", "none");
  hideMovieResult();
  hideActorResult();
  document.querySelector("#error").style.setProperty("display", "none");
}

async function showError(e) {
  hideResult();
  document.querySelector("#search_phrase").style.setProperty("display", "inline");
  document.querySelector("#search_disp").style.setProperty("display", "block");
  document.querySelector("#error").style.setProperty("display", "block");
  document.querySelector("#error").innerHTML = e;
}

async function searchOG(keyword) {
  try {
    let str = url + keyword;
    const response = await fetch(str, options);
    const result = await response.json();
    console.log(result);
    if(result.status ==  true) {
      document.querySelector("#title").innerHTML = result.data[0].title;
      document.querySelector("#cast").innerHTML = result.data[0].stars;
      document.querySelector("#year").innerHTML = result.data[0].year;
      showResult();
    } else {
      hideResult();
      showError(result.message);
    }
    
  } catch (error) {
    console.error(error);
  }
}

async function search(keyword) {
  try {
    let str = url + keyword;
    const response = await fetch(str, options);
    const result = await response.json();
    console.log(result);
    if(result.status ==  true) {
      let qid = result.data.d[0].id;
      if(qid.startsWith("tt")) {
        document.querySelector("#title").innerHTML = result.data.d[0].l;
        document.querySelector("#cast").innerHTML = result.data.d[0].s;
        document.querySelector("#year").innerHTML = result.data.d[0].y;
        showMovieResult();
      } else if(qid.startsWith("nm")) {
        document.querySelector("#actor").innerHTML = result.data.d[0].l;
        document.querySelector("#known").innerHTML = result.data.d[0].s;
        showActorResult();
      } else {
        showError("We couldn't find an answer. Try again!");
      }
    } else {
      showError(result.message);
    }
    
  } catch (error) {
    console.error(error);
  }
}

window.onload = function(){
  hideResult();
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const sp = data.get("movie");
    search(sp);
    document.querySelector("#search_phrase").innerHTML = sp;
    form.reset();
  });
}