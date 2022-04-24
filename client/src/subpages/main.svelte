<script>
	import Slider from "./main_elements/slider.svelte"
  import Articles from "./main_elements/articles_mini.svelte"
  import Comments from "./main_elements/Comments.svelte"
	export let settings;
	
	
	
  </script>
  <article class="main_page">
    
    {#each settings.main_elements as elem}
      {#if elem == 1}
        <Slider settings = {settings}/>
      {/if}
      {#if elem == 2}
        <h2 style="color:{settings.headers_color};font-size:{settings.headers_size}">{settings.articles_module_text}</h2>
        <Articles settings = {settings}/>
      {/if}
      {#if elem == 3}
      <h2 style="color:{settings.headers_color};font-size:{settings.headers_size}">{settings.comments_module_text}</h2>
        <Comments  settings = {settings}/>
      {/if}
    {/each}
    </article>
  
 
	
	
  
 