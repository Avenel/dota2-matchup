<script lang="ts">
	import MatchInfo from '../components/MatchInfo.svelte';

	export let data;
</script>

<div class="mx-auto">
	{#if data.matches.length > 0}
		{#each data.matches as match}
			<MatchInfo matchSelected={match}></MatchInfo>
		{/each}
	{/if}
</div>
