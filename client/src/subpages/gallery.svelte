<script>
    export let settings
    let i =0
</script>
<article class="gallery">
    <div class="mainImg">
        <h2 style="color:{settings.gallery_title_color};font-size:{settings.gallery_title_size}">{settings.gallery[i].title}</h2>
        <div class="galleryContainer">
            <div on:click="{()=>{if(i>0)i-=1}}" class="arrow arrow-left" style="border-right-color:{settings.gallery_arrow_color}"></div>
            
                <img src={settings.gallery[i].src} alt="{settings.gallery[i].title}" title="{settings.gallery[i].title}"  >
           
            <div on:click="{()=>{if(i<settings.gallery.length-1)i+=1}}" class="arrow arrow-right" style="border-left-color:{settings.gallery_arrow_color}"></div>
        </div>
    </div>
    <div class="galleryImgs">
    {#each settings.gallery as gallery, index}
        {#if i>=(Math.floor(settings.gallery_minis_amount/2)) && i<settings.gallery.length-(Math.floor(settings.gallery_minis_amount/2))}
            {#if index <= i+(Math.floor(settings.gallery_minis_amount/2)) && index >=i-(Math.floor(settings.gallery_minis_amount/2)) }
                <div class:border={i==index}>
                    <img src={gallery.src} alt="{gallery.title}" title="{gallery.title}" on:click="{()=>{i=index}}">  
                </div>
            {/if}
        {:else if i<(Math.floor(settings.gallery_minis_amount/2))}
            {#if index < settings.gallery_minis_amount}
            <div class:border={i==index}>
                <img src={gallery.src} alt="{gallery.title}" title="{gallery.title}" on:click="{()=>{i=index}}">  
            </div>
            {/if}
        {:else if i>=settings.gallery.length-(Math.floor(settings.gallery_minis_amount/2))}
            {#if index >= settings.gallery.length-settings.gallery_minis_amount}
            <div class:border={i==index}>
                <img src={gallery.src} alt="{gallery.title}" title="{gallery.title}" on:click="{()=>{i=index}}">  
            </div>
            {/if}
        {/if}

    {/each}
    </div>
</article>
