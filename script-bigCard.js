let ctx;  //in der globalen variable ctx ist das canvas welches mit chartjs befüllt werden soll fesetgelegt
let data = [];  // daten die in das canvas ctx befüllt werden, werden hier gespeichert


// versteckt die große pokemon karte wenn man neben sie klickt wieder, sodass man alle kleinen karten sieht
function hide() {
  document.getElementById('hidePokemonCard').classList.add('d-none');
}


// verhindert dass, wenn man auf die große pokemonkarte klickt dieses fenster geschlossen wird
function doNotHide(event) {
  event.stopPropagation();
}


// Soll die große Karte öffnen und Werte übergeben, um auch dort alles anzeigen zu können
async function openBigCard(url, i) {
  let response = await fetch(url);  // die url wird zur variablen response
  let currentBigPokemon = await response.json(); // die variable response wird hier ausgelesen und heißt nun currentbigpokemon
  document.getElementById('hidePokemonCard').classList.remove('d-none'); // zeigt die karte an, die vorher versteckt war
  let type = currentBigPokemon['types'][0]['type']['name']; // Hole den Typ des Pokémons
  let secondType = ''; // setzt den 2ten typ auf leer
  if (currentBigPokemon['types'][1]) { // wenn es einen zweiten typ gibt wird dieser wert gezogen und angezeigt
    secondType = ` / ${currentBigPokemon['types'][1]['type']['name']}`;
  }
  document.getElementById('bigPokedexBg').innerHTML = bigPokemonCardHTML(currentBigPokemon, i, type, secondType);// lagert das htlm in eine funktion aus, dafür werden einige parameter übergeben

  document.getElementById(`top-info-container-border${i}`).style.border = `3px solid ${borderTypeColor(type)}`; //erstellt den border der karte in der farbe des 1 typs
  document.getElementById(`bigImage${i}`).style.background = typeColor(type); // gibt dem bildhintergrund die farbe des ersten typs

  pushDataToArray(currentBigPokemon);  // ruft die funktion auf, in dieser werden einige daten zu constanten und dann in das array data gepusht
  ctx = document.getElementById(`pokemonChart${i}`);  //in der globalen variable ctx ist das canvas welches mit chartjs befüllt werden soll fesetgelegt
  openChart();  //lädt das chart zum anzeigen der werte des pokemons
}


function pushDataToArray(currentBigPokemon) {
  const dataPoint1 = currentBigPokemon['stats']['0']['base_stat']; // legt die stats der pokemons als constante fest
  const dataPoint2 = currentBigPokemon['stats']['1']['base_stat'];
  const dataPoint3 = currentBigPokemon['stats']['2']['base_stat'];
  const dataPoint4 = currentBigPokemon['stats']['3']['base_stat'];
  const dataPoint5 = currentBigPokemon['stats']['4']['base_stat'];
  const dataPoint6 = currentBigPokemon['stats']['5']['base_stat'];

  data = [];  // leer das array data bevor es erneut gefüllt wird damit immer die aktuellen infos angezeigt werden
  data.push(dataPoint1); // pusht die datapoints in das array data
  data.push(dataPoint2);
  data.push(dataPoint3);
  data.push(dataPoint4);
  data.push(dataPoint5);
  data.push(dataPoint6);
}


function bigPokemonCardHTML(currentBigPokemon, i, type, secondType) {
  let name = bigFirstLetter(currentBigPokemon['name']); // zum Namen groß schreiben

  return /*html*/ `
    <div id="hideLeft" class="left-right-click"><img onclick="doNotHide(event); clickLeft(${i})" src="./img/left-button.png" alt=""></div> 
      <div onclick="doNotHide(event)">
        <div id="top-info-container-border${i}" class="top-info-container">
          <p class="number-margin"># ${i}</p>
          <h1 class="textCenter no-margin">Name: ${name}</h1>
          <div id="bigImage${i}" class="backgroundImage centerImg bigImageHover"><div class="centerImg"><img src="${currentBigPokemon['sprites']['other']['dream_world']['front_default']}" alt="pokemon-img"></div></div>
          <h3 class="bigTypesMargin">Type: ${type}${secondType}</h3>
        </div>
        <div class="info-container">
          <canvas class="chartPositioning" id="pokemonChart${i}"></canvas> 
        </div>
      </div>
      <div class="responseButtons">
        <div id="showLeft" class="left-right-click"><img onclick="doNotHide(event); clickLeft(${i})" src="./img/left-button.png" alt=""></div>
        <div class="left-right-click"><img onclick="doNotHide(event); clickRight(${i})" src="./img/right-button.png" alt=""></div>
      </div>
      `;
}


function openChart() {
  new Chart(ctx, {  //hier wird ein neues chart angelegt in der variablen ctx ist die ID hinterlegt in welcher es entstehen soll
    type: 'bar',
    data: {
      labels: ['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed'],  //namen für die werte die angezeigt werden sollen
      datasets: [{
        label: '',
        data: data,  //hier im array data (global definiert) sind die werte die zu den labels angezeigt werden sollen hinterlegt
        borderWidth: 3,
        borderColor: ['rgb(223,5,59)', 'rgb(255,255,0)', 'rgb(244,164,96)', 'rgb(255,255,0)', 'rgb(244,164,96)', 'skyblue'],
        backgroundColor: ["rgba(223,5,59, 0.6)", "rgba(255,255,0, 0.2)", "rgba(244,164,96, 0.2)", "rgba(255,255,0, 0.6)", "rgba(244,164,96, 0.6)", "rgba(135,206,235, 0.4)"],
        hoverBackgroundColor: ["rgb(223,5,59)", "rgb(255,255,0)", "rgb(244,164,96)", "rgb(255,255,0)", "rgb(244,164,96)", "rgb(135,206,235)"],
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false, // entfernt die legende, da ich diese als störend empfand
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


function clickRight(i) {
  let currentData = i;
  currentData++;  // wenn man rechts klickt wird übergeben an welcher stelle man sich befindet und diese +1 erhöht
  if (currentData == 650) { // wenn man auf stelle 650 ist fängt man bei 1 an (maximale menge der pokemons die geladen werden können)
    currentData = 1;
  }
  let updatedUrl = `https://pokeapi.co/api/v2/pokemon/${currentData}/`;  // hier wird die url um +1 zurückgegeben , somit wird die nächste karte geöffnet
  openBigCard(updatedUrl, currentData);  //startet das rendern der nächsten karte
}


function clickLeft(i) {
  let currentData = i;
  currentData--; // wenn man links klickt wird i übergeben und -1 gerechnet
  if (currentData == 0) { // kommt man bei 0 an wird der wert auf 649 gesetzt da das die maximale anzahl an pokemon ist
    currentData = 649;
  }
  let updatedUrl = `https://pokeapi.co/api/v2/pokemon/${currentData}/`; // die url wird geupdatet mit dem neuen wert und
  openBigCard(updatedUrl, currentData) // hier wird das rendern der vorherigen karte gestartet
}