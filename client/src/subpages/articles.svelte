<script>
import Article from "./main_elements/mini_article.svelte"

	export let settings;
  let articles = []
  fetch("http://127.0.0.1:5000/getArticles")
		.then(data => data.json())
		.then(data => 
	  		{
				console.log(data);
				articles = data	
	  		});
  let finder=""
  let filter="a"
  function find(){
  if(finder*1 <= articles.length) window.location.replace(`http://127.0.0.1:5000/articles/${finder}`);
  }
  function sorter(value){
      switch(value){
        case "a": articles = articles.sort((a,b)=>{
          return a.id - b.id
        })
        break;
        case "b": articles =articles.sort((a,b)=>{
          return b.id - a.id
        })
        break;
        case "c": articles =articles.sort((a,b)=>{
          if(a.category > b.category) return 1
          if(a.category < b.category) return -1
          return 0
        })
        break;
        case "d": articles =articles.sort((a,b)=>{
          if(a.title > b.title) return 1
          if(a.title < b.title) return -1
          return 0
        })
        break;
      }
  }
  sorter("a")
  </script>
  <article>
  <article class="searchers">
    <div>
      <input type="text" id="finder" list="lista" bind:value={finder} placeholder="Szukaj artykułu">
      <datalist id="lista">
        {#each articles as article}
        <option value="{article.id}">{article.title}</option>
          
        {/each}
      </datalist>
      <button on:click="{()=>{find()}}">Szukaj</button>
    </div>
    <div>
      <select id="filter" bind:value={filter} on:change="{(value)=>{
        sorter(filter)
        console.log(articles);
      }}">
        <option value="a">Najstarsze</option>
        <option value="b">Najnowsze</option>
        <option value="c">Kategoria</option>
        <option value="d">Alfabetycznie</option>
      </select>
    </div>
  </article>
  <article class="articles art_sub">
    {#each articles as article}
    <Article settings = {settings} article={article} page="b"/>
      
    {/each}
  </article>
</article>
 
	
	
  
 