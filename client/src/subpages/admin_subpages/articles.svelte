<script>
    import Header from "./header.svelte"
    export let settings
   
    let edit = false
    let article = {"title":"", "img":"", "intro":"", "content":"", "date":"", "category":"","content":""}
    let editing=-1
    let desintegrator = -1
    let wrong=""
    let dialog
    function edit_prepare(x,y,z,a,b,c,d){
        editing = x
        edit= true
        article.title = y
        article.img = z
        article.intro = a
        article.content = b
        console.log(c)
        article.date = c
        article.category = d
    }
    function remove(x){
        desintegrator = x
        dialog.showModal()
    }
    function desintegrate(){
        fetch("http://127.0.0.1:5000/deleteArticle", {
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
            fetch('http://127.0.0.1:5000/changeArticle', {
            headers : {
                'Content-Type' : 'application/json'
            },
            method : 'POST',
            body : JSON.stringify( {
                'id':editing.toString(),
                'title':article.title,
                'img' : article.img,
                'intro': article.intro,
                'content': document.getElementById('content').value,
                'date': article.date,
                'category': article.category                
            })
    })
    .then(data => data.json())
		.then(data => 
	  		{
                window.location.reload(true);  
              })
        }
        else{           
            fetch('http://127.0.0.1:5000/addArticle', {
        headers : {
            'Content-Type' : 'application/json'
        },
        method : 'POST',
        body : JSON.stringify( {
            'id':settings.articles[settings.articles.length-1].id + 1,
            'title':article.title,
            'img' : article.img,
            'intro': article.intro,
            'content': document.getElementById('content').value,
            'date': article.date,
            'category': article.category
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
        article = {"title":"", "img":"", "intro":"", "content":"", "date":"", "category":"","content":""}
    }
   console.log(settings.articles)
</script>

    <Header />
    <article class="settingsBox">
        <table>
            {#each settings.articles as article}
                <tr>
                    <td rowspan="3">{article.id}</td>
                    <td>{article.title}</td>
                    <td><img src="{article.img}" alt="{article.title}" width="{150}"></td>
                    <td rowspan="3"><button class="edit" on:click="{()=>{edit_prepare(article.id,article.title,article.img, article.intro, article.content, article.date, article.category)}}">Edytuj</button></td>
                    <td rowspan="3"><button class="edit" on:click="{()=>{remove(article.id)}}">Usuń</button></td>
                </tr>
                <tr>
                    <td>{article.intro}</td>
                    <td>{article.content}</td>
                </tr>
                <tr>
                    <td>{article.category}</td>
                    <td>{article.date}</td>
                </tr>
            {/each}
        </table>
        <div class="articlesSettingsBox">
            title<input type="text" bind:value="{article.title}">
            src<input type="text" bind:value="{article.img}">
            intro<input type="text" bind:value="{article.intro}">
            date<input type="date"  bind:value="{article.date}">
            category<input type="text" bind:value="{article.category}">
            content<textarea rows="10" id="content">{article.content}</textarea>
            <button on:click="{()=>save()}">Save</button>
        </div>
        <dialog bind:this="{dialog}">
            Czy na pewno usunąć?
            <button on:click="{()=>{desintegrate()}}">Tak</button>
            <button on:click="{()=>{dialog.close()}}">Nie</button>
        </dialog>
    </article>