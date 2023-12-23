<script lang="ts">
	export let audioUrl: string;
	export let volumeOn: boolean;
</script>

<audio autoplay loop muted={!volumeOn} src={audioUrl} />

<style>
	audio {
		display: none;
	}
</style>
