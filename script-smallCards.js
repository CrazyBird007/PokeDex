let startIndex = 0; // Startindex für das Laden der Pokémon um den startindex zu erhöhen muss man in der for-schleife und am ende der function startindex gleich erhöhen/verringern
const maxIndex = 649; //maximaler wert für geladene pokemon (beim jetzigen bild was ich nutze gibt es ab 649 keine bilder mehr, die anderen gefallen mir aber nicht)
let searchNames = []; // array in dem alle namen gespeichert werden zum suchen
let nextList = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
let loadedPokemons = [];
let currentStartIndex = 0;
// let currentPokemon;  // hilft mir in der console durchs array zu gehen und werte zu suchen, ansonsten kann es weg.


function init() { // wenn der body geladen wird wird diese funktion ausgeführt und läd somit alle pokemon
    renderMainPokedex(); // läd alle kleinen pokemon karten
    loadPokemonNamesForSearch() // lädt alle pokemonnamen für die suche
}


async function loadPokemonNamesForSearch() {  //lädt alle pokemon namen vor um durch alle pokemon zu suchen wenn man möchte
    let response = await fetch(nextList);  // dadurch das es alle lädt ist es beim ersten mal starten der seite sehr langsam
    let responseAsJson = await response.json();  // da muss ich noch dran feilen... die nextlist gibts auch das man nur
                                                 // immer die nächsten 20 pokemon lädt oder so
    for ( let i = 0; i < 649; i++) {
        let pokemonResponse = await fetch(responseAsJson.results[i].url);
        let pokemonAsJson = await pokemonResponse.json();
        let name = pokemonAsJson.name;
        searchNames.push(name);
    }
    // nextList = responseAsJson.next;  // wird nur gebraucht wenn man über die nextlist lädt
    // console.log(loadedPokemons);  //zeigt die pokemons in der console an
}


// Haupt-Rendern-Funktion für die kleinen Karten. Wenn man auf eine klickt, dann öffnet sich die große.
async function renderMainPokedex() {
    let content = document.getElementById('mainPokedex');

    for (let i = startIndex; i < startIndex + 20; i++) { // Rendert eine gewisse Anzahl an Karten (startindex +x (zurzeit 20) muss auch geändert werden wenn unten startindex x geändert wird)
        if (i >= maxIndex - 1) { // wenn mehr oder gleichviele als maxindex pokemon geladen sind wird der button entfernt
            document.getElementById('hideButton').classList.add('d-none'); // versteckt den button
        }
        let url = `https://pokeapi.co/api/v2/pokemon/${i + 1}/`; // i kann (max. 649, danach wird kein Bild gezeigt)
        let response = await fetch(url);
        currentPokemon = await response.json();

        // let name = currentPokemon.name; // wenn man nur durch die die geladen sind suchen möchte
        // searchNames.push(name); //pusht/speichert den namen jedes pokemon im array searchnames

        let type = currentPokemon['types'][0]['type']['name']; // Hole den Typ des Pokémons
        let secondType = ''; // der 2te typ des pokemon wird auf leer gesetzt
        if (currentPokemon['types'][1]) {  // wenn es einen zweiten txpen gibt wird dieser eingefügt
            secondType = ` / ${currentPokemon['types'][1]['type']['name']}`;
        }
        content.innerHTML += pokemonCardHTML(currentPokemon, type, i, secondType, url); // in der funktion befindet sich das ausgelagerte HTML
        addColors(type, i); // gibt dem rand und dem hintergrund der pokemonkarte seine farbe
    }
    startIndex += 20; //erhöhe den startindex um x, zurzeit 20
    showLoadedPokemon();
}


function addColors(type, i) {
    document.getElementById(`smallImage${i}`).style.background = typeColor(type); // ändert den hintergrund der bilder auf den jeweiligen typ
    document.getElementById(`pokemonCard${i}`).style.border = `1px solid ${borderTypeColor(type)}`;  //ändert den hintergrund des randes auf den jeweiligen typ
}


function bigFirstLetter(str) { //zum großschreiben des ersten buchstabens
    return str.charAt(0).toUpperCase() + str.slice(1);
}


function showLoadedPokemon() {
    document.getElementById('showLoadedPokemon').innerHTML = `${startIndex} von ${maxIndex} Pokemon geladen.`;
}


function pokemonCardHTML(currentPokemon, type, i, secondType, url) {
    let name = bigFirstLetter(currentPokemon['name']); // Namen groß schreiben

    return /*html*/ `
    <div id="pokemonCard${i}" class="pokemonCard" onclick="openBigCard('${url}', ${i + 1})"> <!-- öffnet die große karte onclick -->
      <div class="m12">#${i + 1}</div> 
      <!-- <div id="smallImage${i}" class="backgroundImage centerImg"><div class="centerImg"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${i + 1}.png" alt="pokemon-img"></div></div> hier nur bilder bis stelle 907 -->
      <div id="smallImage${i}" class="backgroundImage centerImg"><div class="centerImg"><img src="${currentPokemon['sprites']['other']['dream_world']['front_default']}" alt="pokemon-img"></div></div> <!--hier nur bilder bis stelle 649-->
      <div class="textCenter m12">Name: <b>${name}</b></div> 
      <div class="textCenter mt-auto mb12">Type: ${type}${secondType}</div> <!--zeigt beide typen an oder nur einen -->
    </div>
  `;
}


function borderTypeColor(type) {  // stellt die farben für den bordertyp des ersten typs bereit
    if (type === 'fire') {
        return 'red';
    } else if (type === 'water') {
        return 'blue';
    } else if (type === 'normal') {
        return '#A8A77A';
    } else if (type === 'grass') {
        return 'green';
    } else if (type === 'electric') {
        return 'yellow';
    } else if (type === 'ice') {
        return 'lightblue';
    } else if (type === 'fighting') {
        return 'brown';
    } else if (type === 'poison') {
        return 'purple';
    } else if (type === 'ground') {
        return 'sandybrown';
    } else if (type === 'flying') {
        return 'skyblue';
    } else if (type === 'psychic') {
        return 'pink';
    } else if (type === 'bug') {
        return 'limegreen';
    } else if (type === 'rock') {
        return 'gray';
    } else if (type === 'ghost') {
        return 'indigo';
    } else if (type === 'dark') {
        return 'darkgray';
    } else if (type === 'dragon') {
        return 'darkviolet';
    } else if (type === 'steel') {
        return 'steelblue';
    } else if (type === 'fairy') {
        return 'lightpink';
    } else {
        return 'gray'; //falls es unbekannte typen gibt
    }
}


function typeColor(type) { // stellt die farben für den ersten typen bereit der hinterm bild angezeigt wird
    if (type === 'fire') {
        return 'linear-gradient(rgb(249 0 62) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'water') {
        return 'linear-gradient(rgb(0 31 255) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'normal') {
        return 'linear-gradient(rgb(168,167,122) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'grass') {
        return 'linear-gradient(rgb(48 193 66) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'electric') {
        return 'linear-gradient(rgb(255,255,0) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'ice') {
        return 'linear-gradient(rgb(173,216,230) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'fighting') {
        return 'linear-gradient(rgb(165,42,42) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'poison') {
        return 'linear-gradient(rgb(128,0,128) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'ground') {
        return 'linear-gradient(rgb(244,164,96) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'flying') {
        return 'linear-gradient(skyblue 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'psychic') {
        return 'linear-gradient(rgb(255,192,203) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'bug') {
        return 'linear-gradient(rgb(142 253 85) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'rock') {
        return 'linear-gradient(rgb(128,128,128) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'ghost') {
        return 'linear-gradient(rgb(75,0,130) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'dark') {
        return 'linear-gradient(rgb(169,169,169) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'dragon') {
        return 'linear-gradient(rgb(148,0,211) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'steel') {
        return 'linear-gradient(rgb(70,130,180) 0%, rgb(42, 40, 41) 85%)';
    } else if (type === 'fairy') {
        return 'linear-gradient(rgb(255,182,193) 0%, rgb(42, 40, 41) 85%)';
    } else {
        return 'gray'; //falls es unbekannte typen gibt
    }
}


// search function:
async function filterNames() {
    let search = document.getElementById('search').value; // nimmt den wert aus dem inputfeld
    search = search.toLowerCase();  // verringert den wert des inputfgelds zu kleinen buchstaben
    let content = document.getElementById('mainPokedex');
    document.getElementById('hideButton').classList.add('d-none'); // versteckt den button da man nicht laden soll während man sucht
    document.getElementById('showLoadedPokemon').innerHTML = ``;
    content.innerHTML = '';   // befüllt den content erstmal mit leere
    if (search === '') { // wenn das suchfeld leer ist wird die seite auf 0 zurückgesetzt
        startIndex = 0;
        // currentStartIndex = currentStartIndex -20;
        // startIndex = currentStartIndex;
        // searchNames = []; // leert das array da es sich sonst immer weiter füllt und falsche anzeigen macht / nur wenn man nicht alles lädt
        document.getElementById('hideButton').classList.remove('d-none');
        document.getElementById('showLoadedPokemon').innerHTML = `${startIndex} von ${maxIndex} Pokemon geladen.`;
        renderMainPokedex();
        return;
    }
    let count = 0;
    for (let i = 0; i < searchNames.length; i++) {
        let name = searchNames[i];  // name wird hier in der forschleife definiert
        if (count >= 10) {  //wenn der count für richtige pokemon die auf die suche passen höher als 10 ist dann wird die schleife beendet zwecks resourcenschonung
            break; // Beenden der Schleife, wenn bereits 10 Pokémon angezeigt wurden
        }
        if (name.toLowerCase().includes(search)) {  // der name wird auch komplett klein gemacht und dann wird geguckt ob er
            // den wert aus dem inputfeld search hat, wenn ja wird er angezeigt
            let url = `https://pokeapi.co/api/v2/pokemon/${i + 1}/`;  //url wird an stelle i gesetzt und als variable gelegt
            let response = await fetch(url);
            let currentPokemon = await response.json();
            let type = currentPokemon['types'][0]['type']['name'];
            let secondType = '';
            if (currentPokemon['types'][1]) {
                secondType = ` / ${currentPokemon['types'][1]['type']['name']}`;
            }
            content.innerHTML += pokemonCardHTML(currentPokemon, type, i, secondType, url); //hier werden alle pokemon angezeigt 
            addColors(type, i);                                                             // die in die suchoption passen
            count++; // zählt den count der richtigen gesuchten pokemon hoch maximal können 10 angezeigt werden
        }
    }
}