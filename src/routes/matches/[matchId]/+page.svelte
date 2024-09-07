<script lang="ts">
	import PlayerDetail from '../../../components/PlayerDetail.svelte';

	export let data;
</script>

{#if data.match}
	<div class="prose mx-auto">
		<div class="flex flex-row items-center text-center">
			<img
				alt={data.match.radiant_name}
				src={data.match.radiant_team.logo_url}
				width="50px"
				class="ml-4 mr-3 my-0"
			/>
			<div class="flex flex-1">
				<div class="flex flex-col w-1/2">
					<div class="font-bold text-3xl">{data.match.radiant_team.tag}</div>
					<div class="text-xs">{data.match.radiant_team.name}</div>
				</div>
				<div class="flex-1">:</div>
				<div class="flex flex-col w-1/2">
					<div class="font-bold text-3xl">{data.match.dire_team.tag}</div>
					<div class="text-xs">{data.match.dire_team.name}</div>
				</div>
			</div>
			<img
				alt={data.match.dire_name}
				src={data.match.dire_team.logo_url}
				width="50px"
				class="mr-4 ml-3 my-0"
			/>
		</div>
		<div class="font-bold text-center text-4xl mt-5">
			{data.match.radiant_score} : {data.match.dire_score}
		</div>

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

		<div class="flex mt-3 mb-5" style="justify-content: center;">
			<a
				href={'https://www.opendota.com/matches/' + data.match.match_id}
				class="btn btn-sm btn-primary btn-wide">Watch on opendota.com</a
			>
		</div>
	</div>
{/if}
