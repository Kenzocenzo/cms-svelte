<script>
    export let settings
    import Carousel from 'svelte-carousel'

let carousel; // for calling methods of the carousel instance

  </script>
<article>
    <Carousel
    bind:this={carousel}
    autoplay="true"
    duration={settings.slide_duration}
    let:showPrevPage
    let:showNextPage
  >
  <div slot="prev">
    <div on:click={()=>{carousel.goToPrev()}} class="sc-carousel-arrow__circle svelte-9ztt4p left"><i class="sc-carousel-arrow__arrow svelte-9ztt4p sc-carousel-arrow__arrow-prev"></i></div>
  </div>
  <div slot="next">
    <div on:click={()=>{carousel.goToNext()}} class="sc-carousel-arrow__circle svelte-9ztt4p right"><i class="sc-carousel-arrow__arrow svelte-9ztt4p sc-carousel-arrow__arrow-next"></i></div>
  </div>
  <!-- -->
    {#each settings.slider as slide}
        <div class="slide" style="background-image: url({slide.src})">
        
        <span style="color:{settings.slider_font_color}">{slide.name}</span>
    </div>
    {/each}
  </Carousel>
  

</article>