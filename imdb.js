// const lodash = require('lodash');
const search_url = 'https://imdb-com.p.rapidapi.com/auto-complete?query=';
const actor_knowfor_url = 'https://imdb-com.p.rapidapi.com/actor/get-know-for?nconst=';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '8679570c5emsh871f0fd3d68e512p131979jsnf9f75a04d014',
		'x-rapidapi-host': 'imdb-com.p.rapidapi.com'
	}
};

let doneLookup = false;

async function showMovieResult() {
  hideActorResult();
  hideError();
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
  hideError();
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

async function hideError() {
  document.querySelector("#search_phrase").style.setProperty("display", "none");
  document.querySelector("#search_disp").style.setProperty("display", "none");
  document.querySelector("#error").style.setProperty("display", "none");
}

async function search(keyword) {
  try {
    let str = search_url + keyword;
    const response = await fetch(str, options);
    const result = await response.json();
    console.log(result);
    if(result.status ==  true) {
      let i = 0;
      let qid = result.data.d[i].id;
      lookup(qid, i, result);
      console.log(doneLookup + " " + qid);
      while(!doneLookup && i < result.data.d.length) {
        showError("We couldn't find an answer. Try again!");
        i++;
        qid = result.data.d[i].id;
        lookup(qid, i, result);
        console.log(doneLookup + " " + qid);
      }
    } else {
      showError(result.message);
    }
    
  } catch (error) {
    console.error(error);
  }
}

async function lookup(qid, i, result) {
  if(qid.startsWith("tt")) {
    document.querySelector("#title").innerHTML = result.data.d[i].l;
    document.querySelector("#cast").innerHTML = result.data.d[i].s;
    document.querySelector("#year").innerHTML = result.data.d[i].y;
    showMovieResult();
    doneLookup = true;
  } else if(qid.startsWith("nm")) {
    document.querySelector("#actor").innerHTML = result.data.d[i].l;
    actor_deets(qid);
    showActorResult();
    doneLookup = true;
  }else doneLookup = false;
}

async function actor_deets(aid) {
  try {
    let str = actor_knowfor_url + aid;
    const response = await fetch(str, options);
    const result = await response.json();
    console.log(result);
    if(result.status ==  true) {
      let roles = new Map();
      let years = new Map();
      // let list = "<br><ul>";
      for(let i = 0; i < result.data.name.knownFor.edges.length; i++) {
        // list += "<li>";
        // list += result.data.name.knownFor.edges[i].node.title.titleText.text;
        // list += "</li>";
        if(result.data.name.knownFor.edges[i].node.credit.__typename == "Cast") {
          let year = result.data.name.knownFor.edges[i].node.title.releaseYear;
          if(year != null) year = year.year;
          else year = 3000;
          let film = result.data.name.knownFor.edges[i].node.title.titleText.text;
          let role = "";
          let characters = result.data.name.knownFor.edges[i].node.credit.characters;
          if(characters == null) role = "Unknown";
          else {
            for(let j = 0; j < characters.length; j++) {
              role += characters[j].name;
              role += ", ";
            }
            role = role.substring(0, role.length-2);
          }
          roles.set(film, role);
          years.set(film, year);
        }
        years = new Map(Array.from(years).sort((a, b) => a[1] - b[1]));
        // years = new Map(lodash.sortBy(Array.from(years), [(entry) => entry[1]]));
      }
      // list += "</ul>"
      // document.querySelector("#known").innerHTML = list;
      updateActorResult(roles, years);
      showActorResult();
    } else {
      showError(result.message);
    }
  } catch (error) {
    showError("Something went wrong, try again");
    console.error(error);
  }
}

function updateActorResult(roles, years) {
  let str = "<th>Year</th><th>Film</th><th>Role</th>";
  years.forEach((value, key) => {
    str += "<tr>";
    if(value == 3000) str += "<td>" + "Unknown" + "</td>";
    else str += "<td>" + value + "</td>";
    str += "<td>" + key + "</td>";
    str += "<td>" + roles.get(key) + "</td>";
    str += "</tr>";
  })
  document.querySelector("#known").innerHTML = str;
}

window.onload = function(){
  hideResult();
  hideError();
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

// Original API 
// const url = 'https://imdb188.p.rapidapi.com/api/v1/searchIMDB?query=';
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'x-rapidapi-key': '8679570c5emsh871f0fd3d68e512p131979jsnf9f75a04d014',
// 		'x-rapidapi-host': 'imdb188.p.rapidapi.com'
// 	}
// };

// async function searchOG(keyword) {
//   try {
//     let str = url + keyword;
//     const response = await fetch(str, options);
//     const result = await response.json();
//     console.log(result);
//     if(result.status ==  true) {
//       document.querySelector("#title").innerHTML = result.data[0].title;
//       document.querySelector("#cast").innerHTML = result.data[0].stars;
//       document.querySelector("#year").innerHTML = result.data[0].year;
//       showResult();
//     } else {
//       hideResult();
//       showError(result.message);
//     }
    
//   } catch (error) {
//     console.error(error);
//   }
// }