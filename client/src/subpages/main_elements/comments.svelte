<script>
    
    export let settings;
      
    settings.comments= settings.comments.sort((a,b)=>{
        return a.id - b.id
    })
        
</script>
<article class="articlesComments">
    {#each Array(settings.comments_module_amount*1) as _,i}
        <div class="comment_UwU" style="background-color:{settings.comment_bg_color};color:{settings.comment_font_color}">
            <span><b>{settings.comments.slice().reverse()[i].username}</b> {settings.comment_writes}</span>
            <i>"{settings.comments.slice().reverse()[i].content}"</i>
        </div>
    {/each}
      </article>
     
     
        
        
      
     