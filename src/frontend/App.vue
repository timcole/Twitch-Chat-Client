<template>
	<div id="app">
		<ChannelList></ChannelList>
		<Chat></Chat>
		<Members></Members>
	</div>
</template>

<script>
import TwitchChat from 'tmi.js';
import io from 'socket.io-client';

export default {
	name: 'App',
	data () {
		return {
			server: null,
			socket: null,
			api: {
				client: null
			},
			settings: {
				chat: {
					options: { debug: false },
					connection: { reconnect: true },
					identity: {
						username: "justinfan12345",
						password: "Kappa"
					}
				}
			},
			badges: null,
			socialblade: [ "modesttim" ]
		}
	},
	async created () {
		this.server = new TwitchChat.client(this.settings.chat)
		this.server.connect();

		this.socket = io('http://localhost:8086');
		this.socket.on('connected', data => {});

		try {
			this.badges = await fetch('https://badges.twitch.tv/v1/badges/global/display?language=en').then((d) => { return d.json(); });
			// Custom badge for Social Blade Staff memebers
			this.badges.badge_sets.socialblade = {
				versions: {
					"1": {
						image_url_1x: "https://static-cdn.jtvnw.net/badges/v1/a84489ec-c41d-4fa8-9f97-a81bfb4ffc28/1",
						image_url_2x: "https://static-cdn.jtvnw.net/badges/v1/a84489ec-c41d-4fa8-9f97-a81bfb4ffc28/2",
						image_url_4x: "https://static-cdn.jtvnw.net/badges/v1/a84489ec-c41d-4fa8-9f97-a81bfb4ffc28/3",
						description: "Social Blade Staff",
						title: "Social Blade Staff",
						click_action: "visit_url",
						click_url: "https://socialblade.com/info/team"
					}
				}
			};
		} catch (err) { }
	}
}
</script>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css?family=Material+Icons|Roboto:100,500,700');

	html, body {
		font-family: 'Roboto', sans-serif;
		color: #eee;
		height: 100vh;
		width: 100vw;
		padding: 0;
		margin: 0;
	}

	div#app {
		height: 100vh;
		width: 100vw;
		display: flex;
	}

	.dp-1 {
		-webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
		-moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
		box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
	}

	::-webkit-scrollbar {
		width: 2px;
		height: 2px;
	}
	::-webkit-scrollbar-button {
		width: 0px;
		height: 0px;
	}
	::-webkit-scrollbar-thumb {
		background: #2D8CCE;
		border: 0px none #2D8CCE;
		border-radius: 0px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: #2D8CCE;
	}
	::-webkit-scrollbar-thumb:active {
		background: #2D8CCE;
	}
	::-webkit-scrollbar-track {
		background: #1d212b;
		border: 0px none #2D8CCE;
		border-radius: 0px;
	}
	::-webkit-scrollbar-track:hover {
		background: #1d212b;
	}
	::-webkit-scrollbar-track:active {
		background: #1d212b;
	}
	::-webkit-scrollbar-corner {
		background: transparent;
	}
</style>