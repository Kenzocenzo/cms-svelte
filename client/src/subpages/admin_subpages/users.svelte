<script>
    import Header from "./header.svelte"
    let users = []
  fetch("http://127.0.0.1:5000/getUsers")
		.then(data => data.json())
		.then(data => 
	  		{
				console.log(data);
				users = data	
                console.log(users)
	  		});
    let edit = false
    let user = {"login":"","password":""}
    let editing=-1
    let desintegrator = -1
    let wrong=""
    let dialog
    function edit_prepare(x,y,z){
        editing = x
        edit= true
        user.login = y
        user.password = z
    }
    function remove(x){
        desintegrator = x
        dialog.showModal()
    }
    function desintegrate(){
        fetch("http://127.0.0.1:5000/deleteUser", {
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
            fetch('http://127.0.0.1:5000/changeUser', {
            headers : {
                'Content-Type' : 'application/json'
            },
            method : 'POST',
            body : JSON.stringify( {
                'login' : user.login,
                'password':user.password,
                'id':editing.toString()
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
                        wrong=""
                        window.location.reload(true);
                        break;
                  }
              })
        }
        else{           
            fetch('http://127.0.0.1:5000/register', {
        headers : {
            'Content-Type' : 'application/json'
        },
        method : 'POST',
        body : JSON.stringify( {
            'login' : user.login,
            'password' : user.password,
            'passwordr' : user.password
        })
    })
    .then(data => data.json())
		.then(data => 
	  		{
                  console.log(data);
				switch(data.x){
                    case 1:
                        wrong = "Taka nazwa użytkownika już istnieje"                        
                        break;
                    case 2:
                        wrong=""
                        window.location.reload(true);
                        break;
                }
	  		});
        }
        editing=false
        user = {"login":"","password":""}
    }
   
</script>

    <Header />
    <article class="settingsBox">
        <table>
            <tr><th>Login</th><th>Password</th><th>isAdmin</th><th>Edycja</th><th>Usuwanie</th></tr>
            {#each users as user}
                <tr>
                    <td>{user.login}</td>
                    <td>{user.password}</td>
                    <td>{user.isAdmin}</td>
                    <td><button class="edit" on:click="{()=>{edit_prepare(user.rowid,user.login,user.password)}}">Edytuj</button></td>
                    <td>{#if user.isAdmin!=1}<button class="edit" on:click="{()=>{remove(user.rowid)}}">Usuń</button>{/if}</td>
                </tr>
            {/each}
        </table>
        <div>
            Login<input type="text" bind:value="{user.login}">
            Password<input type="text" bind:value="{user.password}">
            <button on:click="{()=>save()}">Save</button>
            <span>{wrong}</span>
        </div>
        <dialog bind:this="{dialog}">
            Czy na pewno usunąć?
            <button on:click="{()=>{desintegrate()}}">Tak</button>
            <button on:click="{()=>{dialog.close()}}">Nie</button>
        </dialog>
    </article>