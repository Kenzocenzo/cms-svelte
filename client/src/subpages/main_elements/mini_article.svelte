<script>
    import { Router, Route, Link } from "svelte-navigator";

   
    export let settings
    export let article
    export let page
   
</script><Router>
<Link to="{page + article.id}">
<div class="article" style="border-color:{settings.article_miniature_border_color}">
    <div class="articleMini" style="background-image:url({article.img});"></div>
    <div class="articleDesc" style="background-color:{settings.article_miniature_bg_color}">
        <h3 style="color:{settings.article_miniature_header_color}">{article.title}</h3>
        <p style="color:{settings.article_miniature_content_color}">{article.intro}</p>
        <p style="color:{settings.article_miniature_content_color}; font-size:11px">Kategoria: {article.category} {article.id}</p>
        <p style="color:{settings.article_miniature_content_color}; font-size:11px">{article.date}</p>
    </div>
</div>
</Link>


</Router>