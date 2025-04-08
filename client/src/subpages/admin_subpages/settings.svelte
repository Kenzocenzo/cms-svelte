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
				mainSettings = data.settings
                select = data.select
	  		});
	
    function saveSettings()
    {
        fetch('http://127.0.0.1:5000/saveSettings', {
        headers : {
            'Content-Type' : 'application/json'
        },
        method : 'POST',
        body : JSON.stringify({
            'setting': JSON.stringify(mainSettings)
        })
    })
    .then(window.location.reload(true))
    }

    function changeSelect(){
        settings.setter = select
        fetch('http://127.0.0.1:5000/changeSelect', {
            method: 'POST',
            body: JSON.stringify({'select': select}),
            headers: {
                'Content-Type': 'application/json'
            }
            }).then(window.location.reload(true))
    }
    

    function exportToJsonFile() {
        let dataStr = JSON.stringify(mainSettings[select]);
        let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        let exportFileDefaultName = 'settings.json';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    function importJsonFile(e) {
    let files = document.getElementById('file').files;
    let f = files[0];
    
    let reader = new FileReader();
    reader.onload = ()=>{
        console.log(reader)
        let json = JSON.parse(reader.result)
        
        mainSettings.push(json)
        mainSettings[mainSettings.length-1].id = mainSettings.length-1
        saveSettings()
    }
    reader.readAsText(f)
  }
</script>

    <Header />
    <article class="settingsBox">
        <select bind:value={select} on:change="{()=>{
            console.log(select)
            changeSelect()
        }}">
            {#each mainSettings as set}
                <option value="{set.id}">{set.name}</option>
            {/each}
        </select>
        <table>
            <tr><th>Nazwa parametru</th><th>Parametr</th></tr>
            {#each Object.entries(mainSettings[select]) as [setting, value]}
            {#if setting.includes("color")}
            <tr><td>{setting}</td><td><input type="color"value={value} on:input={e => { console.log(value);console.log(e.target.value);mainSettings[select][setting] = e.target.value}}></td></tr>
            {:else if setting=='id'}
            <tr><td>{setting}</td><td>{value}</td></tr>
            {:else if setting=="articles_module_amount"}
            <tr><td>{setting}</td><td><input type="range" value={value} min="1" max="{settings.articles.length}" on:input={e => { console.log(value);console.log(e.target.value);mainSettings[select][setting] = e.target.value}}>{value}</td></tr>
            {:else if setting=="gallery_minis_amount"}
            <tr><td>{setting}</td><td><input type="range" value={value} min="1" step="2" max="{settings.gallery.length}" on:input={e => { console.log(value);console.log(e.target.value);mainSettings[select][setting] = e.target.value}}>{value}</td></tr>
            {:else if setting=="comments_module_amount"}
            <tr><td>{setting}</td><td><input type="range" value={value} min="1" max="{settings.comments.length}" on:input={e => { console.log(value);console.log(e.target.value);mainSettings[select][setting] = e.target.value}}>{value}</td></tr>
            {:else if setting=="burger_menu_show" || setting=="slide_duration"}
            <tr><td>{setting}</td><td><input type="number"value={value} min="0" on:input={e => { console.log(value);console.log(e.target.value);mainSettings[select][setting] = e.target.value}}></td></tr>
            {:else if setting=="menu_version"}
            <tr><td>{setting}</td><td><input type="number"value={value} min="0" max="1" on:input={e => { console.log(value);console.log(e.target.value);mainSettings[select][setting] = e.target.value}}></td></tr>
            {:else}
            <tr><td>{setting}</td><td><input type="text"value={value} on:input={e => { console.log(value);console.log(e.target.value);mainSettings[select][setting] = e.target.value}}></td></tr>
            {/if}
            
            {/each}
        </table>
        <button on:click="{()=>{saveSettings()}}">Zapisz</button>
        <input id="file" type="file">
        <button  on:click="{importJsonFile}">Import</button>
        <button on:click="{()=>{exportToJsonFile()}}">Eksport</button>
    </article>