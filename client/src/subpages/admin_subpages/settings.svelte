<script>
    import Header from "./header.svelte"
    import { onMount } from 'svelte';
    export let settings
	let mainSettings = [{"set":"s","id":"boob"},{"set":"s","id":"boob"},{"set":"s","id":"boob"},{"set":"s","id":"boob"},{"set":"s","id":"boob"}];
    let select = settings.setter
	
       fetch("http://127.0.0.1:5000/getAllSettings")
		.then(data => data.json())
		.then(data => 
	  		{
				console.log(data);
				mainSettings = data	
	  		});
	
   
    
</script>

    <Header />
    <article class="settingsBox">
        <select bind:value={select}>
            {#each mainSettings as set}
                <option value="{set.id}">{set.name}</option>
            {/each}
        </select>
        <button on:click="{()=>{console.log(mainSettings)}}">tester- do usunięcia potem</button>
        <table>
            <tr><th>Nazwa parametru</th><th>Parametr</th></tr>
            {#each Object.entries(mainSettings[select]) as [setting, value]}
            {#if setting.includes("color")}
            <tr><td>{setting}</td><td><input type="color"bind:value={value}></td></tr>
            {:else}
            <tr><td>{setting}</td><td><input type="text"bind:value={value}></td></tr>
            {/if}
            
            {/each}
        </table>
        <button>Zapisz</button>
        <input type="file">
        <button>Import</button>
        <button>Eksport</button>
    </article>