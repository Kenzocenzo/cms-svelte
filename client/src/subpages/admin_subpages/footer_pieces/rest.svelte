<script>
    export let settings
    let contact
    let copyright
    function save(){
        console.log(contact.value)
        console.log(copyright.value)
        let x = {contact_footer:contact.value, copyright:copyright.value}
        fetch('http://127.0.0.1:5000/changeFooter', {
            headers : {
                'Content-Type' : 'application/json'
            },
            method : 'POST',
            body : JSON.stringify(x)
    }).then(window.location.reload(true))
    }
    
</script>
   
    <article class="settingsBox">
        Kontakt:
        <textarea cols="30" rows="10" style="max-width:90%" bind:this="{contact}">{settings.footer.contact_footer.trim()}</textarea>
        Copyright:
        <textarea cols="30" rows="10" style="max-width:90%" bind:this="{copyright}">{settings.footer.copyright}</textarea>
        <button on:click="{()=>save()}">Zapisz</button>
    </article>