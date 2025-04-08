<script>
    export let settings
    let user = sessionStorage.getItem('username')
    let password = sessionStorage.getItem('password')
    let wrong=""
    function changeUser(type){
        
            fetch('http://127.0.0.1:5000/changeUser', {
            headers : {
                'Content-Type' : 'application/json'
            },
            method : 'POST',
            body : JSON.stringify( {
                'login' : user,
                'password':password,
                'id':sessionStorage.getItem('id')
            })
    })
    .then(data => data.json())
		.then(data => 
	  		{
                  switch(data.x){
                    case 1:
                        wrong="Taki nick już istnieje"
                        break;
                    case 2:
                        wrong="Poprawnie zaktualizowano dane"
                        sessionStorage.setItem('username', user)
                        sessionStorage.setItem('password', password)
                        break;
                  }
              })
    

        }
        
        
    
</script>
<article class="loginContainer">
    <div class="profile-menu" style="background-color:{settings.profile_bg_color};border-color:{settings.profile_border_color};color:{settings.profile_font_color}">
        <h1>Witaj {sessionStorage.getItem('username')}</h1>
        <span>{wrong}</span>
        <div>
            <span>Zmiana nicku</span>
            <input type="text" bind:value={user}>
        </div>
        <div>
            <span>Zmiana hasła</span>
            <input type="text" bind:value={password}>
        </div>
        <button on:click="{()=>{changeUser()}}">Zapisz</button>
    </div>
</article>