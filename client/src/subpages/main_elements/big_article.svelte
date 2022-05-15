<script>
    export let settings
    export let article
    let text=""
    function addComment(){
        if(text!=""){
            let comment = {"id":settings.comms[settings.comms.length-1].id+1, "username":sessionStorage.getItem('username'),"content":text,"art_id":article.id}
            //settings.comments.push(comment)
            text=""
            console.log(settings.comments);
            fetch('http://127.0.0.1:5000/addComm', {
                headers : {
                    'Content-Type' : 'application/json'
                },
                method : 'POST',
                body : JSON.stringify( {
                    comment:comment
                })
    })
    .then(data => data.json())
		.then(data => 
	  		{
                window.location.reload(true)
        })}
       
    }
</script>

<article class="bigArticleContainer">
        <div class="bigArticle" style="color:{settings.article_page_font_color}">
            <h2 style="font-size:{settings.article_page_header_size}">{article.title}</h2>
            <div><span>{article.category} </span>| <span> {article.date}</span></div>
            <div style="font-size:{settings.article_page_intro_size}">{article.intro}</div>
            <img src={article.img} alt={article.title}>
            <div class="content" style="font-size:{settings.article_page_content_size}">{@html article.content}</div>
            <div class="commentsSite">
                <div class="container" >
                    <h1>{settings.article_comments_text}</h1>
                    <div class="adder" style="background-color:{settings.comments_section_adder_bg_color};color:{settings.comments_section_adder_font_color}">
                        {#if sessionStorage.getItem('logged')=='true'}
                        <textarea bind:value="{text}" ></textarea><button on:click="{()=>{addComment()}}" style="color:{settings.comments_section_adder_btn_font_color};background-color:{settings.comments_section_adder_btn_bg_color}">{settings.comment_add_comment}</button>
                        {:else}
                        <span>{settings.comments_loginfo_text} </span><a href="/login" style="color:{settings.comments_section_adder_font_color}">Login</a>
                        {/if}
                        
                    </div>
                    <div class="comments">
                        {#each settings.comms.slice().reverse() as comment}
                        {#if comment.art_id == article.id}
                            <div style="background-color:{settings.comment_bg_color};color:{settings.comment_font_color}">
                                <span><b>{comment.username}</b> {settings.comment_writes}</span>
                                <i>"{comment.content}"</i>
                            </div>
                        {/if}
                        {/each}
                    </div>
                </div>
            </div>
        </div>
        
</article>
