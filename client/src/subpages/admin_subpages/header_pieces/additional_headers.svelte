<script>
    export let settings
   
    let edit = false
    let header = {"name":"","href":""}
    let editing=-1
    let desintegrator = -1
    let dialog
    function edit_prepare(x,y,z){
        editing = x
        edit= true
        header.name = y
        header.href = z
    }
    function remove(x){
        desintegrator = x
        dialog.showModal()
    }
    function desintegrate(){
        fetch("http://127.0.0.1:5000/deleteHeader", {
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
            fetch('http://127.0.0.1:5000/changeHeader', {
            headers : {
                'Content-Type' : 'application/json'
            },
            method : 'POST',
            body : JSON.stringify( {
                'id':editing.toString(),
                'name':header.name,
                'href' : header.href,                
            })
    })
    .then(data => data.json())
		.then(data => 
	  		{
                window.location.reload(true);  
              })
        }
        else{       
            console.log(header)    
            fetch('http://127.0.0.1:5000/addHeader', {
        headers : {
            'Content-Type' : 'application/json'
        },
        method : 'POST',
        body : JSON.stringify( {
            'id':settings.headers.additional_headers[settings.headers.additional_headers.length-1].id + 1,
            'name':header.name,
            'href' : header.href,
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
        header = {"name":"","href":""}
    }
   
</script>

    <article class="settingsBox">
        <table>
            <tr><th>Id</th><th>Tytuł</th><th>Link</th><th>Edycja</th><th>Usuwanie</th></tr>
            {#each settings.headers.additional_headers as header}
                <tr>
                    <td>{header.id}</td>
                    <td>{header.name}</td>
                    <td>{header.href}</td>
                    <td><button class="edit" on:click="{()=>{edit_prepare(header.id,header.name,header.href)}}">Edytuj</button></td>
                    <td><button class="edit" on:click="{()=>{remove(header.id)}}">Usuń</button></td>
                </tr>
            {/each}
        </table>
        <div>
            name<input type="text" bind:value="{header.name}">
            href<input type="text" bind:value="{header.href}">
            <button on:click="{()=>save()}">Save</button>
        </div>
        <dialog bind:this="{dialog}">
            Czy na pewno usunąć?
            <button on:click="{()=>{desintegrate()}}">Tak</button>
            <button on:click="{()=>{dialog.close()}}">Nie</button>
        </dialog>
    </article>