<script>
    export let settings
    let login =""
    let password=""
    let passwordr=""
    let wrong=""
    function register(){
        fetch('http://127.0.0.1:5000/register', {
        headers : {
            'Content-Type' : 'application/json'
        },
        method : 'POST',
        body : JSON.stringify( {
            'login' : login,
            'password' : password,
            'passwordr' : passwordr
        })
    })
    .then(data => data.json())
		.then(data => 
	  		{
                  console.log(data);
				switch(data.x){
                    case 0:
                        wrong= "Hasła się różnią"
                        break;
                    case 1:
                        wrong = "Taka nazwa użytkownika już istnieje"                        
                        break;
                    case 2:
                    window.location.replace(`http://127.0.0.1:5000/login`)
                        break;
                }
	  		});

    }
</script>
<article class="loginContainer">
    <div class="login" style="background-color:{settings.login_bg_color};border-color:{settings.login_border_color};color:{settings.login_font_color}">
    <h1>{settings.register_title}</h1>
            <span id="wrong">{wrong}</span>
            <div class="form">
                <div>
                    <h2>Login</h2>
                    <input type="text" name="login" id="login" bind:value={login}/>
                </div>
                <div>
                    <h2>Password</h2>
                    <input type="password" name="password" id="password" bind:value={password}/>
                </div>
                <div>
                    <h2>Repeat password</h2>
                    <input type="password" name="password-r" id="password-r" bind:value={passwordr} />
                </div>

                <button on:click="{register}" class="reg" style="background-color:{settings.login_button_bg_color};color:{settings.login_button_font_color}">{settings.register_button_text}</button>
            </div>
    </div>
</article>