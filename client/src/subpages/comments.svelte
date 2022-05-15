<script>
    export let settings
   
    let text=""
    function addComment(){
        if(text!=""){
            let comment = {"id":settings.comments[settings.comments.length-1].id+1, "username":sessionStorage.getItem('username'),"content":text}
            //settings.comments.push(comment)
            text=""
            console.log(settings.comments);
            fetch('http://127.0.0.1:5000/addComment', {
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
            window.location.replace(`http://127.0.0.1:5000/comments`)
        })}
       
    }
</script>
<article class="commentsSite">
    <div class="container" style="background-color:{settings.comments_section_bg_color};border-color:{settings.comments_section_border_color}">
        <div class="adder" style="background-color:{settings.comments_section_adder_bg_color};color:{settings.comments_section_adder_font_color}">
            {#if sessionStorage.getItem('logged')=='true'}
            <textarea bind:value="{text}" ></textarea><button on:click="{()=>{addComment()}}" style="color:{settings.comments_section_adder_btn_font_color};background-color:{settings.comments_section_adder_btn_bg_color}">{settings.comment_add_comment}</button>
            {:else}
            <span>{settings.comments_loginfo_text} </span><a href="/login" style="color:{settings.comments_section_adder_font_color}">Login</a>
            {/if}
            
        </div>
        <div class="comments">
            {#each settings.comments.slice().reverse() as comment}
                <div style="background-color:{settings.comment_bg_color};color:{settings.comment_font_color}">
                    <span><b>{comment.username}</b> {settings.comment_writes}</span>
                    <i>"{comment.content}"</i>
                </div>
            {/each}
        </div>
    </div>
</article>