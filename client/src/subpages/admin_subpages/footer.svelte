<script>
    import Header from "./header.svelte"
    import Main from "./footer_pieces/main_footers.svelte"
    import Social from "./footer_pieces/social_media.svelte"
    import Rest from "./footer_pieces/rest.svelte"
    export let settings
</script>

    <Header />
    <article class="settingsBox">
        <Main settings = {settings} />
        <Social settings = {settings} />
        <Rest settings = {settings} />
    </article>