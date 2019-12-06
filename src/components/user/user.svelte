<script>
    import Avatar from '../../elements/avatar/avatar.svelte';

    export let login;
    export let html_url;
    export let avatar_url;
</script>

<a href="{html_url}" target="_blank" rel="noopener">
    <Avatar login={login} avatar_url={avatar_url} />
    <h2>{login}</h2>
</a>