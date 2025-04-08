<script>
    export let settings
    import Header from "./admin_subpages/header.svelte"
    import Profile from "./profile.svelte"
</script>
<article>
    <Header /> 
    <Profile settings={settings} />

  
</article>