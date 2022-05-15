<script>
    export let settings
   function changeheader(id,value){
    fetch('http://127.0.0.1:5000/changeMainHeader', {
            headers : {
                'Content-Type' : 'application/json'
            },
            method : 'POST',
            body : JSON.stringify( {
                'id':id,
                'name':value,             
            })
    }).then(window.location.reload(true))
   }
   function changeShowheader(id,value){
       console.log(value)
       let i = 0
       if(value=="on") i=1
    fetch('http://127.0.0.1:5000/showMainHeader', {
            headers : {
                'Content-Type' : 'application/json'
            },
            method : 'POST',
            body : JSON.stringify( {
                'id':id,
                'show':i,             
            })
    }).then(window.location.reload(true))
   }
   
</script>

    <article class="settingsBox">
        <table>
            <tr><th>Id</th><th>Nazwa</th><th>Link</th><th>Wyświetlaj</th></tr>
            {#each settings.headers.main_headers as header}
                <tr>
                    <td>{header.id}</td>
                    <td><input type="text" value="{header.name}" on:change="{e =>{console.log(e.target.value);changeheader(header.id, e.target.value)}}"></td>
                    <td>{header.href}</td>
                    <td>
                        {#if header.show == 1}
                        <input type="checkbox" checked on:change="{e =>{console.log(e.target.value);changeShowheader(header.id, e.target)}}">
                        {:else }
                        <input type="checkbox" on:change="{e =>{console.log(e.target.value);changeShowheader(header.id, e.target.value)}}">
                        {/if}
                    </td>
                </tr>
            {/each}
        </table>
       
    </article>