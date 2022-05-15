<script>
    import Header from "./header.svelte"
    export let settings
   
    let edit = false
    let gallery = {"title":"","src":""}
    let editing=-1
    let desintegrator = -1
    let wrong=""
    let dialog
    function edit_prepare(x,y,z){
        editing = x
        edit= true
        gallery.title = y
        gallery.src = z
    }
    function remove(x){
        desintegrator = x
        dialog.showModal()
    }
    function desintegrate(){
        fetch("http://127.0.0.1:5000/deleteGallery", {
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
            fetch('http://127.0.0.1:5000/changeGallery', {
            headers : {
                'Content-Type' : 'application/json'
            },
            method : 'POST',
            body : JSON.stringify( {
                'id':editing.toString(),
                'title':gallery.title,
                'src' : gallery.src,                
            })
    })
    .then(data => data.json())
		.then(data => 
	  		{
                window.location.reload(true);  
              })
        }
        else{           
            fetch('http://127.0.0.1:5000/addGallery', {
        headers : {
            'Content-Type' : 'application/json'
        },
        method : 'POST',
        body : JSON.stringify( {
            'id':settings.gallery[settings.gallery.length-1].id + 1,
            'title':gallery.title,
            'src' : gallery.src,
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
        gallery = {"title":"","src":""}
    }
   
</script>

    <Header />
    <article class="settingsBox">
        <table>
            <tr><th>Id</th><th>Tytuł</th><th>Zdjęcie</th><th>Edycja</th><th>Usuwanie</th></tr>
            {#each settings.gallery as gallery}
                <tr>
                    <td>{gallery.id}</td>
                    <td>{gallery.title}</td>
                    <td><img src="{gallery.src}" alt="{gallery.title}" width="{150}"></td>
                    <td><button class="edit" on:click="{()=>{edit_prepare(gallery.id,gallery.title,gallery.src)}}">Edytuj</button></td>
                    <td><button class="edit" on:click="{()=>{remove(gallery.id)}}">Usuń</button></td>
                </tr>
            {/each}
        </table>
        <div>
            title<input type="text" bind:value="{gallery.title}">
            src<input type="text" bind:value="{gallery.src}">
            <button on:click="{()=>save()}">Save</button>
        </div>
        <dialog bind:this="{dialog}">
            Czy na pewno usunąć?
            <button on:click="{()=>{desintegrate()}}">Tak</button>
            <button on:click="{()=>{dialog.close()}}">Nie</button>
        </dialog>
    </article>
