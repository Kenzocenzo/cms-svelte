<script>
    import Article from "./mini_article.svelte"
    
        export let settings;
      
        settings.articles = settings.articles.sort((a,b)=>{
          return a.id - b.id
        })
        
      </script>
      <article class="articles">
        {#each Array(settings.articles_module_amount*1) as _,i}
          <Article settings = {settings} article={settings.articles.slice().reverse()[i]} page="articles/"/>
        {/each}
      </article>
     
     
        
        
      
     