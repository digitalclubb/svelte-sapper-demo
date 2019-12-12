<svelte:head>
	<title>GitHub user list powered by Svelte and Sapper</title>
	<meta name="description" content="A GitHub user list powered by Svelte and Sapper"/>
</svelte:head>

<script>
	import { onMount } from 'svelte';
	import User from '../components/user/user.svelte';

	let users;

	onMount(async () => {
		const query = await fetch( 'https://api.github.com/users' );
		const data = await query.json();
		users = data;
  	});
</script>

<h1>GitHub Users</h1>
<p>A basic Svelte project with Sapper that will list GitHub users. Find out more <a href="/about">about this project</a>.</p>

{#if users}
	<ul>
		{#each users as { login, html_url, avatar_url } }
			<li>
				<User login={login} html_url={html_url} avatar_url={avatar_url} />
			</li>
		{/each}
	</ul>
{:else}

	<p>Loading...</p>
{/if}