<script>
    export let settings
    export let article
</script>

<article class="bigArticleContainer">
        <div class="bigArticle" style="color:{settings.article_page_font_color}">
        <h2 style="font-size:{settings.article_page_header_size}">{article.title}</h2>
        <div><span>{article.category} </span>| <span> {article.date}</span></div>
        <div style="font-size:{settings.article_page_intro_size}">{article.intro}</div>
        <img src={article.img} alt={article.title}>
        <div class="content" style="font-size:{settings.article_page_content_size}">{@html article.content}</div>
    </div>
</article>
