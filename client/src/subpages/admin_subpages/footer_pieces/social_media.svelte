<script>
    export let settings
   function changeFooter(id,value){
    fetch('http://127.0.0.1:5000/changeSocialFooter', {
            headers : {
                'Content-Type' : 'application/json'
            },
            method : 'POST',
            body : JSON.stringify( {
                'id':id,
                'href':value,             
            })
    }).then(window.location.reload(true))
   }
   function changeShowFooter(id,value){
       console.log(value)
       let i = 0
       if(value=="on") i=1
    fetch('http://127.0.0.1:5000/showSocialFooter', {
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
            {#each settings.footer.social_media_footers as footer}
                <tr>
                    <td>{footer.id}</td>
                    <td>{footer.name}</td>
                    <td><input type="text" value="{footer.href}" on:change="{e =>{console.log(e.target.value);changeFooter(footer.id, e.target.value)}}"></td>
                    <td>
                        {#if footer.show == 1}
                        <input type="checkbox" checked on:change="{e =>{console.log(e.target.value);changeShowFooter(footer.id, e.target)}}">
                        {:else }
                        <input type="checkbox" on:change="{e =>{console.log(e.target.value);changeShowFooter(footer.id, e.target.value)}}">
                        {/if}
                    </td>
                </tr>
            {/each}
        </table>
       
    </article>