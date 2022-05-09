<script src="https://kit.fontawesome.com/4b81a205ee.js" crossorigin="anonymous" defer>
	import { Router, Route, Link, link } from "svelte-navigator";
	import Main from './subpages/main.svelte';
	import Articles from './subpages/articles.svelte';
	import Gallery from './subpages/gallery.svelte';
	import Comments from './subpages/comments.svelte';
	import Login from './subpages/login.svelte'
	import Register from './subpages/register.svelte'
	import Profile from './subpages/profile.svelte'
	import Admin from './subpages/admin.svelte'
	import BigArticle from "./subpages/main_elements/big_article.svelte";
    import BurgerMenu from 'svelte-burger-menu';
	import Admin_articles from "./subpages/admin_subpages/articles.svelte"
	import Admin_comments from "./subpages/admin_subpages/comments.svelte"
	import Admin_footer from "./subpages/admin_subpages/footer.svelte"
	import Admin_menu from "./subpages/admin_subpages/menu.svelte"
	import Admin_settings from "./subpages/admin_subpages/settings.svelte"
	import Admin_slider from "./subpages/admin_subpages/slider.svelte"
	import Admin_users from "./subpages/admin_subpages/users.svelte"
	import Admin_gallery from "./subpages/admin_subpages/gallery.svelte"

	let settings = {"setter":0,"allSettings":[],"slider":[],"comments":[],"burger_menu_show":10000,"headers":{"main_headers":[], "additional_headers":[]},"footer":{"main_footers":[],"social_media_footers":[],"contact_footer":"", "copyright":""},"main_elements":[], "articles":[],"gallery":[{"src":"","title":""}]}
	$: innerWidth = 0
  	async function getSettings() {
		
		fetch("http://127.0.0.1:5000/getSettings")
		.then(data => data.json())
		.then(data => 
	  		{
				console.log(data);
				settings = data	
	  		});
	    }
		
			getSettings();
	
	function sleep(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
	}
	async function color(){
		await sleep(200)
		let x = document.querySelector("#container")
		let y = document.querySelector(".svelte-hbdsxb")
		x.style.backgroundColor = settings.burger_menu_color
		y.style.color=settings.burger_menu_font_color
		console.log(x);
		console.log("sex");
	}
	function logout(){
		sessionStorage.setItem('logged', 'false');
		sessionStorage.setItem('admin', 'false')
		window.location.replace(`http://127.0.0.1:5000/`)
	}
	</script>
  
 
 <svelte:window bind:innerWidth />
  <Router>
 	<main style="font-family:{settings.main_font};background-color: {settings.bg_color}" class:fun-class-name-owo={settings.menu_version==1 && innerWidth > settings.burger_menu_show} class:fun-class-name-uwu={settings.menu_version==1 && innerWidth < settings.burger_menu_show}>
		
			{#if innerWidth >settings.burger_menu_show}
			<header style="background-color: {settings.menu_color}" class="main-menu" class:static-header={settings.menu_version==1}> 
				<nav class="menu">
					{#each settings.headers.main_headers as header}
						{#if header.show ==1}
							<Link to="{header.href}" class="menuBar" style="color:{settings.menu_font_color};font-size:{settings.menu_font_size}">{header.name}</Link>
						{/if}								
					{/each}
					{#each settings.headers.additional_headers as header}
						<a href="{header.href}" class="menuBar" style="color:{settings.menu_font_color};font-size:{settings.menu_font_size}">{header.name}</a>
					{/each}
				</nav>
			
			<nav class="profile">
			{#if sessionStorage.getItem('logged')=='true'}
				<Link to="profile" class="logger" style="color:{settings.loggers_font_color};background-color:{settings.loggers_bg_color};border:{settings.loggers_border_width} solid {settings.loggers_border_color}">{settings.profile_txt}</Link>
				<span on:click="{()=>{logout()}}" class="logger" style="color:{settings.loggers_font_color};background-color:{settings.loggers_bg_color};border:{settings.loggers_border_width} solid {settings.loggers_border_color}">{settings.logout_txt}</span>
			{:else}
				<Link to="login" class="logger" style="color:{settings.loggers_font_color};background-color:{settings.loggers_bg_color};border:{settings.loggers_border_width} solid {settings.loggers_border_color}">{settings.login_txt}</Link>
				<Link to="register" class="logger" style="color:{settings.loggers_font_color};background-color:{settings.loggers_bg_color};border:{settings.loggers_border_width} solid {settings.loggers_border_color}">{settings.register_txt}</Link>
			{/if}
			
			</nav>
			</header>
			{:else}
			<header style="background-color: {settings.menu_color}" class="burger-menu" class:static-header={settings.menu_version==1}>
				<BurgerMenu backgroundColor={settings.burger_menu_color} burgerColor={settings.menu_font_color}>
					<div class="burger"  on:load|once={color()} >
						{#each settings.headers.main_headers as header}
							{#if header.show == 1}
								<Link to="{header.href}" class="menuBar" style="color:{settings.burger_menu_font_color};font-size:{settings.burger_menu_font_size}">{header.name}</Link>
							{/if}	
						{/each}
						{#each settings.headers.additional_headers as header}
							<a href="{header.href}" class="menuBar" style="color:{settings.burger_menu_font_color};font-size:{settings.burger_menu_font_size}">{header.name}</a>
						{/each}
						{#if sessionStorage.getItem('logged')=='true'}
							<Link to="profile" class="menuBar" style="color:{settings.burger_menu_font_color};font-size:{settings.burger_menu_font_size}">{settings.profile_txt}</Link>
							<span on:click="{()=>{logout}}" class="menuBar" style="color:{settings.burger_menu_font_color};font-size:{settings.burger_menu_font_size}">{settings.logout_txt}</span>
						{:else}
							<Link to="login" class="menuBar" style="color:{settings.burger_menu_font_color};font-size:{settings.burger_menu_font_size}">{settings.login_txt}</Link>
							<Link to="register" class="menuBar" style="color:{settings.burger_menu_font_color};font-size:{settings.burger_menu_font_size}">{settings.register_txt}</Link>
						{/if}
					</div>
				</BurgerMenu>
			</header>
			{/if}
		<Route path="/"><Main settings = {settings}/></Route>
		<Route path="articles"><Articles settings = {settings}/></Route>
		<Route path="gallery"><Gallery settings = {settings}/></Route>
		<Route path="comments"><Comments settings = {settings}/></Route>
		<Route path="login"><Login settings = {settings} /></Route>
		<Route path="register"><Register settings = {settings}/></Route>
		{#if sessionStorage.getItem('logged')=='true'}
			<Route path="profile"> 
				{#if sessionStorage.getItem('admin')=='true'}
				<Admin settings = {settings}/>
				{:else}
				<Profile settings = {settings}/>
				{/if}
			</Route>
			{#if sessionStorage.getItem('admin')=='true'}
			
			<Route path="profile/settings"><Admin_settings settings={settings} /></Route>
			<Route path="profile/users"><Admin_users /></Route>
			<Route path="profile/comments"><Admin_comments settings={settings} /></Route>
			<Route path="profile/gallery"><Admin_gallery settings={settings} /></Route>
			<Route path="profile/articles"><Admin_articles settings={settings} /></Route>
			<Route path="profile/slider"><Admin_slider settings={settings} /></Route>
			<Route path="profile/header"><Admin_menu settings={settings} /></Route>
			<Route path="profile/footer"><Admin_footer settings={settings} /></Route>
			{/if}
		{/if}
		{#each settings.articles as article}
		<Route path="{'articles/'+article.id.toString()}"><BigArticle settings = {settings} article = {article}/></Route>
		{/each}
		<footer style="background-color: {settings.footer_bg_color};color:{settings.footer_font_color}">
			<div class="links">
				<div>
					{#each settings.footer.main_footers as link}
						{#if link.show == 1}
							<Link to="{link.href}" style="color:{settings.footer_font_color}">{link.name}</Link>
						{/if}	
					{/each}
				</div>
				<div>
					{#each settings.footer.social_media_footers as link}
						{#if link.show == 1}
							<a href="{link.href}" style="color:{settings.footer_font_color}"><i class="fa-brands fa-{link.name}"></i></a>
						{/if}	
					{/each}
				</div>
			</div>
			<div class="contact">
				{settings.footer.contact_footer}
			</div>
			<div class="copyright">{settings.footer.copyright}</div>
		</footer>
	</main>
	

  </Router>