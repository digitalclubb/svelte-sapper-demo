<style src="./avatar.css"></style>

<script>
    export let login;
    export let avatar_url;
</script>

<figure>
    <img src={avatar_url} alt="{login}'s GitHub avatar'" loading="lazy" />
</figure>