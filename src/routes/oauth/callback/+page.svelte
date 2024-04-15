<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		window.opener.location.reload();
		window.close();
	});
</script>
