<script>
  import { onMount } from 'svelte';
  import Tulokset from './Tulokset.svelte'; // Importataan Tulokset Tulokset.svelte -komponentista

  // Alustetaan tarvittavat muuttujat
  let seasons = [];
  let selectedSeason;
  let races = [];
  let selectedRace;
  let proppi;

  let kisatulos = false;

  // exportataan funktio toggle, joka ohjaa sitä, näytetäänkö kisatuloksia vai ei.
  export const toggle = () => (kisatulos = !kisatulos);

  // Noudetaan kaikki mahdolliset F1-kaudet API:n kautta
  const fetchSeasons = async () => {
    const response = await fetch(
      'https://ergast.com/api/f1/seasons.json?limit=100'
    );
    const data = await response.json();
    seasons = data.MRData.SeasonTable.Seasons.reverse(); //käännetään kausien järjestys listaan, uusin ensin
    selectedSeason = seasons[0].season; // Valittu kausi on defaulttina uusin
  };

  // Samanlainen dunktio kuin ylempi mutta kisoille
  const fetchRaces = async () => {
    const response = await fetch(
      `https://ergast.com/api/f1/${selectedSeason}/results.json?limit=1000`
    );
    const data = await response.json();
    races = data.MRData.RaceTable.Races; // ei reversata, jotta ensimmäinen kisa on myös ensimmäinen listassa
    selectedRace = races[0].raceName;
  };

  // Odotetaan käyttäjän valitsevan kausi ja kisa valikosta
  onMount(async () => {
    await fetchSeasons();
    await fetchRaces();
  });

  // Näyttää oikeat kisat, kun tietty kausi valittu
  const handleSeasonChange = async () => {
    await fetchRaces();
  };

  // Käsittelee tarvittavat tiedot valitun kisan pohjalta
  const handleRaceChange = async () => {
    const selectedRaceObj = races.find(
      (race) => race.raceName === selectedRace
    );

    const selectedRound = selectedRaceObj ? selectedRaceObj.round : null;

    proppi = `https://ergast.com/api/f1/${selectedSeason}/${selectedRound}/results.json`;
  };
</script>

<main>
  <div class="menu">
    {#if !kisatulos}
      <select
        class="dropdown"
        on:click={handleSeasonChange}
        on:change={handleRaceChange}
        bind:value={selectedSeason}
      >
        {#each seasons as season}
          <option class="option" placeholder="Season" value={season.season}
            >{season.season}</option
          >
        {/each}
      </select>

      <select class="dropdown" bind:value={selectedRace}>
        {#each races as race}
          <option class="option" value={race.raceName}>{race.raceName}</option>
        {/each}
      </select>
    {/if}
    <button
      class="button"
      on:click={handleSeasonChange}
      on:click={handleRaceChange}
      on:click={toggle}>{kisatulos ? 'Clear' : 'Search'} Results</button
    >
  </div>
  {#if !kisatulos}
    <h2 class="menu">WELCOME TO F1 RACE RESULTS</h2>
    <p class="menu">
      With this application you can examine results from any Formula 1 season or
      race through history. This application uses the Ergast Developer API as a
      source for all the results. Documentation to the API can be found below.
    </p>
    <p class="menu">
      <a href="http://ergast.com/mrd/">Ergast Developer API</a>
    </p>
    <p class="menu">
      PLEASE NOTE: The media content may appear incorrectly regarding driver
      changes and team restructuring. All media is currently optimised for the
      latest season of Formula 1 and should be complete from 2020 to 2023. Older
      results display correctly too, but media might be absent or incorrect.
      Updates to older seasons are coming soon!
    </p>
  {/if}
  {#if kisatulos}
    <Tulokset {proppi} />
  {/if}
</main>

<style>
  .button {
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    color: #ffffff;
    filter: drop-shadow(1px 1px 3px #ffffff);
    background: linear-gradient(#000000, #2d2d2d, #000000);
    padding: 1em;
  }

  .menu {
    width: 60%;
    word-break: keep-all;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-left: 20%;
    margin-top: 2em;
    margin-bottom: 2em;
  }

  .dropdown {
    justify-content: center;
    align-items: center;
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    color: #ffffff;
    filter: drop-shadow(1px 1px 3px #ffffff);
    background: linear-gradient(#000000, #2d2d2d, #000000);
    padding: 1em;
    margin-right: 10px;
  }

  .option {
    background-color: #000000;
    color: #ffffff;
  }
</style>
