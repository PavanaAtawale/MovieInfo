const url = 'https://imdb188.p.rapidapi.com/api/v1/searchIMDB?query=';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '8679570c5emsh871f0fd3d68e512p131979jsnf9f75a04d014',
		'x-rapidapi-host': 'imdb188.p.rapidapi.com'
	}
};

async function showResult() {
  document.querySelector("#search_phrase").style.setProperty("display", "block");
  const results = document.querySelectorAll(".result");
  results.forEach(r => r.style.setProperty("display", "block"));
} 

async function hideResult() {
  document.querySelector("#search_phrase").style.setProperty("display", "none");
  const results = document.querySelectorAll(".result");
  results.forEach(r => r.style.setProperty("display", "none"));
  document.querySelector("#error").style.setProperty("display", "none");
}

async function showError(e) {
  document.querySelector("#search_phrase").style.setProperty("display", "block");
  document.querySelector("#error").style.setProperty("display", "block");
  document.querySelector("#error").innerHTML = e;
}

async function search(keyword) {
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


window.onload = function(){
  hideResult();
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const sp = data.get("movie");
    search(sp);
    document.querySelector("#search_phrase").innerHTML = "You searched for <strong>'" + sp + "'</strong>";
    form.reset();
  });
}