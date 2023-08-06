<script>
  import { onMount } from 'svelte'; //importataan onMount funktio Svelte-kirjastosta
  export let raceResults = []; // näin raceResults -muuttujaa voi käsitellä muuallakin kuin tässä komponentissa
  export let proppi;
  let raceName = '';
  let raceYear = '';

  fetch(proppi)
    .then((response) => response.json())
    .then(
      ({
        MRData: {
          RaceTable: { Races },
        },
      }) => {
        const {
          Circuit: {
            Location: { country, locality },
            circuitName,
          },
          date,
        } = Races[0];

        // otetaan noudetusta datasta radan tiedot
        document.getElementById('raceCountry').textContent = country;
        document.getElementById('raceLocality').textContent = locality;
        document.getElementById('raceDate').textContent = date;
        document.getElementById('circuitName').textContent = circuitName;
      }
    )
    .catch((error) => {
      console.error('Error:', error);
    });

  async function fetchRaceResults() {
    // funktio, jolla noudetaan kisatulokset
    try {
      const response = await fetch(proppi);
      const data = await response.json();
      raceResults = data.MRData.RaceTable.Races[0].Results;
      raceName = data.MRData.RaceTable.Races[0].raceName;
      raceYear = data.MRData.RaceTable.Races[0].season;
    } catch (error) {
      console.error(error);
    }
  }

  onMount(fetchRaceResults);

  function getGradientColor(teamName) {
    //teamName -datan perusteella määritellään kuskikortteihin oikeat värit
    switch (teamName) {
      case 'Mercedes':
        return 'linear-gradient(45deg, #000000, #000000, #00BFFF)';
      case 'Ferrari':
        return 'linear-gradient(45deg, #000000, #000000, #D40000)';
      case 'Red Bull':
        return 'linear-gradient(45deg, #000000, #000000, #151366)';
      case 'Aston Martin':
        return 'linear-gradient(45deg, #000000, #000000, #115c40';
      case 'Alpine F1 Team':
        return 'linear-gradient(45deg, #000000, #000000, #113373, #ff00ae';
      case 'Haas F1 Team':
        return 'linear-gradient(45deg, #000000, #000000, #404040, #ff0000';
      case 'AlphaTauri':
        return 'linear-gradient(45deg, #ffffff, #14134d, #ffffff';
      case 'Alfa Romeo':
        return 'linear-gradient(45deg, #3b0b0b, #3b0b0b, #000000';
      case 'Williams':
        return 'linear-gradient(45deg, #020f36, #020f36, #002fba';
      case 'McLaren':
        return 'linear-gradient(45deg, #000000, #000000, #ff9500';
      default:
        return 'linear-gradient(45deg, #000000, #000000, #ffffff)';
    }
  }

  function getGradientColor2(teamName) {
    // sama kuin ylempi mutta ei-voittavaan kuskikorttiin.
    switch (teamName) {
      case 'Mercedes':
        return 'linear-gradient(135deg, #000000, #000000, #00BFFF)';
      case 'Ferrari':
        return 'linear-gradient(135deg, #000000, #000000, #D40000)';
      case 'Red Bull':
        return 'linear-gradient(135deg, #000000, #000000, #151366)';
      case 'Aston Martin':
        return 'linear-gradient(135deg, #000000, #000000, #115c40';
      case 'Alpine F1 Team':
        return 'linear-gradient(135deg, #000000, #000000, #113373, #ff00ae';
      case 'Haas F1 Team':
        return 'linear-gradient(135deg, #000000, #000000, #404040, #ff0000';
      case 'AlphaTauri':
        return 'linear-gradient(135deg, #ffffff, #14134d, #ffffff';
      case 'Alfa Romeo':
        return 'linear-gradient(135deg, #3b0b0b, #3b0b0b, #000000';
      case 'Williams':
        return 'linear-gradient(135deg, #020f36, #020f36, #002fba';
      case 'McLaren':
        return 'linear-gradient(135deg, #000000, #000000, #ff9500';
      default:
        return 'linear-gradient(135deg, #000000, #000000, #ffffff)';
    }
  }
</script>

<main>
  <html lang="en">
    <div class="ratakortti">
      <h2 id="kisaotsikko">{raceName} {raceYear}</h2>
      <img
        class="track-image"
        src="images/tracks/{raceName}.svg"
        alt="Track map not found"
      />
      <div class="track-info">
        <h2><span id="circuitName" style="font-weight: 800;" /></h2>
        <br />
        <h2>Country: <span id="raceCountry" /></h2>
        <h2>Locality: <span id="raceLocality" /></h2>
        <h2>Race Date: <span id="raceDate" /></h2>
      </div>
    </div>
    <div class="grid-container">
      {#each raceResults as result, i (result.Driver.driverId)}
        {#if i < 1}
          <div
            class="driver-card1"
            style="background: {getGradientColor(result.Constructor.name)}"
          >
            <h2>Position: {result.position}</h2>
            {#if result.status === 'Finished'}
              <p>{result.Time.time}</p>
            {:else}
              <p>{result.status}</p>{/if}
            <img
              class="driver-image"
              alt="..."
              src="images/drivers/{result.Driver.familyName}.png"
            />
            <img
              class="team-logo"
              alt="..."
              src="images/teams/{result.Constructor.name}.png"
            />
            <div class="driver-info">
              <img
                class="flag-image"
                alt="..."
                src="images/flags/{result.Driver.nationality}.png"
              />
              <div class="driver-texts">
                <h2>{result.Driver.givenName} {result.Driver.familyName}</h2>
                <p>Team: {result.Constructor.name}</p>
              </div>
              <div
                class="overlay"
                style="background: {getGradientColor2(result.Constructor.name)}"
              >
                <div class="addinfo">
                  <img
                    class="driver-image"
                    alt="..."
                    src="images/drivers/{result.Driver.familyName}.png"
                  />
                  <h2>
                    {result.Driver.givenName}
                    {result.Driver.familyName}
                  </h2>
                  <p>Starting position: {result.grid}</p>
                  {#if result.FastestLap && result.FastestLap.Time}
                    <p>
                      Fastest Lap: {result.FastestLap.Time.time} &#40 lap {result
                        .FastestLap.lap} &#41
                    </p>
                  {/if}
                  <p>Points: {result.points}</p>
                  <img
                    class="team-logo"
                    alt="..."
                    src="images/teams/{result.Constructor.name}.png"
                  />
                </div>
              </div>
            </div>
          </div>
        {:else}
          <div
            class="driver-card2"
            style="background: {getGradientColor(result.Constructor.name)}"
          >
            <h2>Position: {result.position}</h2>
            {#if result.status === 'Finished'}
              <p>{result.Time.time}</p>
            {:else}
              <p>{result.status}</p>{/if}
            <img
              class="driver-image"
              alt="..."
              src="images/drivers/{result.Driver.familyName}.png"
            />
            <img
              class="team-logo"
              alt="..."
              src="images/teams/{result.Constructor.name}.png"
            />
            <div class="driver-info">
              <img
                class="flag-image"
                alt="..."
                src="images/flags/{result.Driver.nationality}.png"
              />
              <div class="driver-texts">
                <h2>{result.Driver.givenName} {result.Driver.familyName}</h2>
                <p>Team: {result.Constructor.name}</p>
              </div>
              <div
                class="overlay"
                style="background: {getGradientColor2(result.Constructor.name)}"
              >
                <div class="addinfo">
                  <img
                    class="driver-image"
                    alt="..."
                    src="images/drivers/{result.Driver.familyName}.png"
                  />
                  <h2>
                    {result.Driver.givenName}
                    {result.Driver.familyName}
                  </h2>
                  <p>Starting position: {result.grid}</p>

                  {#if result.FastestLap && result.FastestLap.Time}
                    <p>
                      Fastest Lap: {result.FastestLap.Time.time} &#40 lap {result
                        .FastestLap.lap} &#41
                    </p>
                  {/if}
                  <p>Points: {result.points}</p>
                  <img
                    class="team-logo"
                    alt="..."
                    src="images/teams/{result.Constructor.name}.png"
                  />
                </div>
              </div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </html>
</main>

<style>
  html {
    font-family: 'Montserrat', sans-serif;
    background-color: #000000;
    color: #ffffff;
  }

  .driver-info {
    margin-bottom: 3em;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: left;
    background: linear-gradient(90deg #3a3a3a, #000000);
  }

  #kisaotsikko {
    margin-top: 6em;
    font-size: 2em;
    transition: font-size 0.3s;
  }

  .ratakortti {
    height: 25em;
    width: 40%;
    background-color: #111111;
    filter: opacity(0.7);
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    filter: drop-shadow(1px 1px 4px #ffffff);
    transition-duration: 0.3s;
  }

  .ratakortti:hover {
    width: 60%;
    height: 35em;
    filter: drop-shadow(1px 1px 10px #ffffff);
    background: linear-gradient(#000000, #2d2d2d, #000000);
  }

  .ratakortti:hover #kisaotsikko {
    font-size: 3em;
    margin-top: 2.9em;
    margin-bottom: 1em;
  }

  .track-info {
    scale: 70%;
    position: relative;
    bottom: 16em;
    right: 17em;
    font-family: 'Montserrat', sans-serif;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .ratakortti:hover .track-info {
    scale: 70%;
    opacity: 1;
    position: relative;
    bottom: 16em;
    right: 17em;
  }

  .grid-container {
    margin: auto;
    max-width: 70%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    margin-bottom: 20px;
    margin-top: 2em;
  }

  .driver-card1 {
    grid-column: span 2;
    position: relative;
    border: 1px solid #ff0000;
    border-radius: 0px;
    filter: drop-shadow(1px 1px 8px #ff0000);
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .overlay {
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    transition: 0.5s ease;
  }

  .driver-card1:hover .overlay {
    opacity: 1;
  }

  .driver-card2:hover .overlay {
    opacity: 1;
  }

  .addinfo {
    margin-top: 1em;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .driver-card2 {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 0px;
    filter: drop-shadow(1px 1px 4px #ffffff);
    padding: 10px;
    background-color: #202020;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .driver-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: left;
  }

  .driver-texts {
    margin-left: 1em;
  }

  .flag-image {
    width: 80px;
  }

  .driver-image {
    border: solid 1px #ffffff;
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 10px;
    margin-top: 5px;
  }

  .track-image {
    position: relative;
    padding-top: 2em;
    padding-bottom: 2em;
    transition-duration: 0.3s;
    filter: drop-shadow(0px 0px 8px #ffffff);
    display: flex;
    margin: auto;
    justify-content: center;
    align-items: center;
    width: 62%;
    height: 350px;
    object-fit: contain;
    margin-bottom: 10px;
    margin-top: 5px;
    transition: transform 0.3s, margin 0.3s;
  }

  .ratakortti:hover .track-image {
    transform: scale(1.1);
    margin-right: 2em;
  }

  .team-logo {
    filter: drop-shadow(0px 0px 0.1px #ffffff);
    width: 120px;
    height: 80px;
    object-fit: contain;
    margin-bottom: 5px;
  }

  h2 {
    text-align: center;
    margin: 5px 0;
    font-size: 26px;
  }

  p {
    margin: 0;
  }
</style>
