<script>
    import Header from "./header.svelte"
    import Main from "./header_pieces/main_headers.svelte"
    import Other from "./header_pieces/additional_headers.svelte"
    export let settings
</script>

    <Header />
    <article class="settingsBox">
        <Main settings = {settings} />
        <Other settings = {settings} />
    </article>