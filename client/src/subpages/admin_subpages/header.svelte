<script>
    import { Router, Route, Link } from "svelte-navigator";
</script>
<div class="adminHeader">
    <Link to="/profile">Profil</Link>
    <Link to="/profile/settings">Główne ustawienia</Link>
    <Link to="/profile/users">Użytkownicy</Link>
    <Link to="/profile/comments">Komentarze</Link>
    <Link to="/profile/comms">Komentarze pod artykułami</Link>
    <Link to="/profile/gallery">Galeria</Link>
    <Link to="/profile/articles">Artykuły</Link>
    <Link to="/profile/slider">Slajder</Link>
    <Link to="/profile/header">Menu</Link>
    <Link to="/profile/footer">Stopka</Link>
</div>