const url = 'https://imdb188.p.rapidapi.com/api/v1/searchIMDB?query=';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '8679570c5emsh871f0fd3d68e512p131979jsnf9f75a04d014',
		'x-rapidapi-host': 'imdb188.p.rapidapi.com'
	}
};

async function search(keyword) {
  try {
    let str = url + keyword;
    const response = await fetch(str, options);
    const result = await response.json();
    console.log(result);
    const results = document.querySelectorAll(".result");
    results.forEach(r => r.style.setProperty("display", "block"));
    document.querySelector("#title").innerHTML = result.data[0].title;
    document.querySelector("#cast").innerHTML = result.data[0].stars;
    document.querySelector("#year").innerHTML = result.data[0].year;
  } catch (error) {
    console.error(error);
  }
}




window.onload = function(){
    console.log("hello");
    const results = document.querySelectorAll(".result");
    results.forEach(r => r.style.setProperty("display", "none"));
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        console.log(data.get("movie"));
        search(data.get("movie"));
      });
}