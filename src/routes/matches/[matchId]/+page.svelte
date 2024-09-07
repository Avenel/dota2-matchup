<script lang="ts">
	import PlayerDetail from '../../../components/PlayerDetail.svelte';

	export let data;
</script>

{#if data.match}
	<div class="prose">
		<h4 class=" text-center">
			{data.match.radiant_name} : {data.match.dire_name}
		</h4>
		<h2 class="font-bold text-center">
			{data.match.radiant_score} : {data.match.dire_score}
		</h2>

		<div class="flex">
			<table class="table">
				<tbody>
					{#each data.match.players.filter((x) => x.team_number === 0) as player}
						<PlayerDetail {player}></PlayerDetail>
					{/each}
				</tbody>
			</table>

			<table class="table">
				<tbody>
					{#each data.match.players.filter((x) => x.team_number === 1) as player}
						<PlayerDetail {player}></PlayerDetail>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
