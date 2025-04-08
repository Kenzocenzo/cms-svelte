<script>
    import Header from "./header.svelte"
    export let settings
   
    let edit = false
    let slide = {"src":"","name":""}
    let editing=-1
    let desintegrator = -1
    let wrong=""
    let dialog
    function edit_prepare(x,y,z){
        editing = x
        edit= true
        slide.src = y
        slide.name = z
    }
    function remove(x){
        desintegrator = x
        dialog.showModal()
    }
    function desintegrate(){
        fetch("http://127.0.0.1:5000/deleteSlide", {
            headers : {
                'Content-Type' : 'application/json'
            },
            method : 'POST',
            body : JSON.stringify( {
                'id':desintegrator.toString()
            })
    }).then(()=>{dialog.close();window.location.reload(true);})
    }
    function save(){
        if(edit){
            fetch('http://127.0.0.1:5000/changeSlide', {
            headers : {
                'Content-Type' : 'application/json'
            },
            method : 'POST',
            body : JSON.stringify( {
                'id':editing.toString(),
                'src' : slide.src,
                'name':slide.name,
                
            })
    })
    .then(data => data.json())
		.then(data => 
	  		{
                window.location.reload(true);  
              })
        }
        else{           
            fetch('http://127.0.0.1:5000/addSlide', {
        headers : {
            'Content-Type' : 'application/json'
        },
        method : 'POST',
        body : JSON.stringify( {
            'id':settings.slider[settings.slider.length-1].id + 1,
            'src' : slide.src,
                'name':slide.name,
                
        })
    })
    .then(data => data.json())
		.then(data => 
	  		{
                  console.log(data);
                 window.location.reload(true);
                                
	  		});
        }
        editing=false
        slide = {"src":"","name":""}
    }
   
</script>

    <Header />
    <article class="settingsBox">
        <table>
            <tr><th>Id</th><th>Zdjęcie</th><th>Tytuł</th><th>Edycja</th><th>Usuwanie</th></tr>
            {#each settings.slider as slide}
                <tr>
                    <td>{slide.id}</td>
                    <td><img src="{slide.src}" alt="{slide.name}" width="{150}"></td>
                    <td>{slide.name}</td>
                    <td><button class="edit" on:click="{()=>{edit_prepare(slide.id,slide.src,slide.name)}}">Edytuj</button></td>
                    <td><button class="edit" on:click="{()=>{remove(slide.id)}}">Usuń</button></td>
                </tr>
            {/each}
        </table>
        <div>
            src<input type="text" bind:value="{slide.src}">
            title<input type="text" bind:value="{slide.name}">
            <button on:click="{()=>save()}">Save</button>
        </div>
        <dialog bind:this="{dialog}">
            Czy na pewno usunąć?
            <button on:click="{()=>{desintegrate()}}">Tak</button>
            <button on:click="{()=>{dialog.close()}}">Nie</button>
        </dialog>
    </article>