<script lang="ts">
	import { HEROES, HEROES_STATS } from '$lib/tiDb';
	import type { Player } from '$lib/dota2Api';

	export let player: Player;

	let hero = HEROES.find((x) => x.id === player.hero_id);
	let heroStats = HEROES_STATS.find((x) => x.id === player.hero_id);

	let heroIcon = (heroStats: any) => 'https://cdn.cloudflare.steamstatic.com' + heroStats?.img;
</script>

<tr>
	<td>
		<div class="flex flex-col">
			<div class="flex flex-row">
				<img
					alt={hero?.name}
					src={heroIcon(heroStats)}
					height="30px"
					style="height:30px;"
					class="my-0"
				/>
				<div class="flex flex-col pl-2 flex-1" style="overflow: hidden;">
					<div class="font-bold text-base truncate" style="max-width: 75%;">{player.name}</div>
				</div>
			</div>
			<div class="font-medium">{hero?.localized_name}</div>
		</div>
	</td>
</tr>
