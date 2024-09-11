<script lang="ts">
	import type { MatchInfoView } from '$lib/stratzApi';
	import Player from './Player.svelte';
	import SvelteMarkdown from 'svelte-markdown';

	export let matchSelected: MatchInfoView;

	const formatGameTime = (gameTime: number) => {
		const minutes = Math.floor(gameTime / 60);
		const seconds = gameTime % 60;

		return `${minutes}min:${seconds}s`;
	};
</script>

<div class="card bg-base-100 min-w-full lg:min-w-80 shadow-xl my-2">
	<div class="card-body">
		<div class="flex flex-row items-center text-center bg-content">
			<div class="flex flex-col w-1/4 bg-content text-content items-center">
				<div class="avatar">
					<div class="rounded-xl bg-base-300 p-1">
						<img
							alt={matchSelected.radiantTeam?.name ?? 'PUG'}
							src={matchSelected.radiantTeam?.logo}
							class="my-0"
							style="object-fit:contain; width: 50px;"
						/>
					</div>
				</div>
				<div class="font-bold text-xl">{matchSelected.radiantTeam?.tag ?? '-'}</div>

				<div class="text-xs">
					{matchSelected.radiantTeam?.name ?? 'PUG'}
				</div>
			</div>
			<div class="flex-1">
				<div class="font-bold text-center text-3xl bg-content text-content">
					{matchSelected.radiantScore} : {matchSelected.direScore}
				</div>
				<div>
					{formatGameTime(matchSelected.gameTime ?? 0)}
				</div>
				{#if matchSelected.completed}
					<div class="font-bold">
						{matchSelected.didRadiantWin ? 'Radiant won' : 'Dire won'}
					</div>
				{:else}
					<progress class="progress w-1/3 progress-primary"></progress>
				{/if}
			</div>
			<div class="flex flex-col w-1/4 bg-content text-content items-center">
				<div class="avatar">
					<div class="rounded-xl bg-base-300 p-1">
						<img
							alt={matchSelected.direTeam?.name ?? 'PUG'}
							src={matchSelected.direTeam?.logo}
							class="my-0"
							style="object-fit:contain; width: 50px;"
						/>
					</div>
				</div>
				<div class="font-bold text-xl">
					{matchSelected.direTeam?.tag ?? '-'}
				</div>
				<div class="text-xs">
					{matchSelected.direTeam?.name ?? 'PUG'}
				</div>
			</div>
		</div>

		<div class="flex">
			<table class="table table-md w-1/2" style="table-layout: fixed;">
				<tbody>
					{#each matchSelected.players.filter((x) => x.isRadiant) as player}
						<Player rtl={false} playerLiveInfo={player}></Player>
					{/each}
				</tbody>
			</table>

			<table class="table table-md w-1/2" style="table-layout: fixed;">
				<tbody>
					{#each matchSelected.players.filter((x) => !x.isRadiant) as player}
						<Player rtl={true} playerLiveInfo={player}></Player>
					{/each}
				</tbody>
			</table>
		</div>

		<div tabindex="-1" class="collapse collapse-arrow bg-base-200 text-base-content">
			<input type="checkbox" />
			<div class="collapse-title text-xl font-medium">Draft Analysis</div>
			<div class="collapse-content prose">
				<SvelteMarkdown source={matchSelected.draftAnalysis} />
			</div>
		</div>

		<div class="flex my-3" style="justify-content: center;">
			<a
				href={'https://stratz.com/matches/' +
					matchSelected.matchId +
					(matchSelected.completed ? '' : '/live')}
				target="_blank"
				class="btn btn-sm btn-primary btn-outline btn-wide">Watch on stratz.com</a
			>
		</div>
	</div>
</div>
