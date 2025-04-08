<script>
    export let settings
    let login =""
    let password=""
    let wrong=""
    function logger(){
        fetch('http://127.0.0.1:5000/login', {
        headers : {
            'Content-Type' : 'application/json'
        },
        method : 'POST',
        body : JSON.stringify( {
            'login' : login,
            'password' : password
        })
    })
    .then(data => data.json())
		.then(data => 
	  		{
                  console.log(data);
				switch(data.x){
                    case 0:
                        wrong= "Błędny login lub hasło"
                        break;
                    case 1:
                        
                        sessionStorage.setItem('logged', 'true')
                        sessionStorage.setItem('admin', 'true')
                        sessionStorage.setItem('username', login)
                        sessionStorage.setItem('password', password)
                        sessionStorage.setItem('id', data.y)
                        window.location.replace(`http://127.0.0.1:5000/`)
                        break;
                    case 2:
                        sessionStorage.setItem('logged', 'true')
                        sessionStorage.setItem('admin', 'false')
                        sessionStorage.setItem('username', login)
                        sessionStorage.setItem('password', password)
                        sessionStorage.setItem('id', data.y)
                        window.location.replace(`http://127.0.0.1:5000/`)
                        break;
                }
	  		});

    }
</script>
<article class="loginContainer">
    <div class="login" style="background-color:{settings.login_bg_color};border-color:{settings.login_border_color};color:{settings.login_font_color}">
    <h1>{settings.login_title}</h1>
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

                <button on:click="{logger}" style="background-color:{settings.login_button_bg_color};color:{settings.login_button_font_color}">{settings.login_button_text}</button>
            </div>
            <a href="/register" style="color:{settings.login_register_font_color}">{settings.login_register_text}</a>
    </div>
</article>