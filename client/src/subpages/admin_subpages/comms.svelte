<script>
    import Header from "./header.svelte"
    export let settings
    let dialog
    let desintegrator
    function remove(x){
        desintegrator = x
        dialog.showModal()
    }
    function desintegrate(){
        fetch("http://127.0.0.1:5000/deleteComm", {
            headers : {
                'Content-Type' : 'application/json'
            },
            method : 'POST',
            body : JSON.stringify( {
                'id':desintegrator.toString()
            })
    }).then(()=>{dialog.close();window.location.reload(true);})
    }
</script>

    <Header />
    <article class="settingsBox">
        <table>
            <tr><th>Id</th><th>Nick</th><th>Treść</th><th>Id artykułu</th><th>Usuwanie</th></tr>
            {#each settings.comms as comment}
                <tr>
                    <td>{comment.id}</td>
                    <td>{comment.username}</td>
                    <td>{comment.content}</td>
                    <td>{comment.art_id}</td>
                
                    <td><button class="edit" on:click="{()=>{remove(comment.id)}}">Usuń</button></td>
                </tr>
            {/each}
        </table>
        
        <dialog bind:this="{dialog}">
            Czy na pewno usunąć?
            <button on:click="{()=>{desintegrate()}}">Tak</button>
            <button on:click="{()=>{dialog.close()}}">Nie</button>
        </dialog>
    </article>