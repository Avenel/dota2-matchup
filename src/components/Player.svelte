<script lang="ts">
	import { HEROES, HEROES_STATS } from '$lib/tiDb';
	import type { Player } from '$lib/dota2Api';

	export let player: Player;
	export let rtl: boolean;

	let hero = HEROES.find((x) => x.id === player.hero_id);
	let heroStats = HEROES_STATS.find((x) => x.id === player.hero_id);

	let heroIcon = (heroStats: any) => 'https://cdn.cloudflare.steamstatic.com' + heroStats?.icon;
</script>

<tr>
	<td>
		<div class="flex flex-col">
			<div class="flex items-center {rtl ? 'flex-row-reverse' : 'flex-row'}">
				<img
					alt={hero?.name}
					src={heroIcon(heroStats)}
					height="30px"
					style="height:30px;"
					class="my-0"
				/>
				<div class="text-base truncate mx-2" style="max-width: 75%;">{player.name}</div>
			</div>
		</div>
	</td>
</tr>
