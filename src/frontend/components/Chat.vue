<template>
	<div id="chat" :style="[defaults, settings]">
		<div class="buffer">
			<div class="message" v-for="msg in messages" v-bind:key="msg.id">
				<div v-if="!msg.server">
					<span class="time">{{ timeFormat(msg.time) }}</span>
					<div class="badges">
						<span class="badge tooltip" v-for="(version, badge) in msg.userstate.badges" v-bind:key="badge">
							<img :src="badges.badge_sets[badge].versions[version].image_url_4x" />
							<span class="tooltip-data" :style="{ backgroundColor: defaults.tooltip }" v-text="badges.badge_sets[badge].versions[version].title"></span>
						</span>
					</div>
					<span class="name" :style="{ color: msg.userstate.color || defaults.nick }">{{ msg.userstate['display-name'] || msg.userstate.username }}</span>
					<span class="msg" v-html="messageFormat(msg.message, msg.userstate.emotes)"></span>
				</div>
				<div v-if="msg.server">
					<span class="server" v-html="msg.message"></span>
				</div>
			</div>
		</div>
		<div class="footer" :style="[defaults, settings, { height: inputHeight }]">
			<input type="text" :style="[defaults, settings]" :placeholder="'Say something in #' + channel.name" />
			<Icon name="smile-o" label="Emotes" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'Chat',
	data () {
		return {
			defaults: {
				background: "#000",
				"border-color": "#333",
				color: "#fff",
				"font-family": "fira code",
				"font-size": "14px",
				nick: "#ffffff",
				tooltip: "#333333"
			},
			badges: {},
			settings: localStorage.getItem("styleSettings"),
			inputHeight: localStorage.getItem("inputHeight") || "50px",
			messages: []
		}
	},
	computed: {
		Channels () { return this.$store.state.Channels },
		Active () { return this.$store.state.Active },
		channel () { return this.Channels[this.Active]; }
	},
	created () {
		if (this.$parent.server.readyState() === "OPEN") {
			this.join();
			this.monitor();
			this.badges = JSON.parse(JSON.stringify(this.$parent.badges));
		} else {
			this.$parent.server.on("connected", (address, port) => {
				this.join();
				this.monitor();
				this.badges = JSON.parse(JSON.stringify(this.$parent.badges));
			});
		}
	},
	updated () {
		var container = this.$el.querySelector(".buffer");
		container.scrollTop = container.scrollHeight;
	},
	methods: {
		async join () {
			try {
				var badges = await fetch(`https://badges.twitch.tv/v1/badges/channels/${this.channel.id}/display?language=en`).then((d) => { return d.json(); });
				this.badges = JSON.parse(JSON.stringify(this.$parent.badges));
				if (badges.badge_sets.subscriber) this.badges.badge_sets.subscriber = badges.badge_sets.subscriber;
			} catch (err) { console.error(err) }

			this.messages.push({
				server: true,
				message: "Welcome to the chat room!"
			});

			if (this.$parent.server.getChannels().indexOf(`#${this.name}`) !== -1) return;
			this.$parent.server.join(`#${this.channel.name}`).then((data) => {
				// console.log(this.$parent.server.getChannels())
			}).catch(function(err) {
				// console.error(err)
			});
		},
		monitor () {
			this.$parent.server.on("message", (channel, userstate, message, self) => {
				if (this.badges.badge_sets.length <= 1 || channel !== `#${this.channel.name}`) return;

				if (this.$parent.socialblade.indexOf(userstate.username) !== -1) {
					userstate.badges.socialblade = "1";
				}

				var msg = {
					id: this.messages.length+1,
					time: new Date().getTime(),
					userstate,
					message: message
				}
				this.messages.push(msg)
			});
		},
		timeFormat (time) {
			return new Date(time).toTimeString().slice(0, 8);
		},
		messageFormat (text, emotes) {
			var text = text.split('');

			if (emotes) {
				Object.keys(emotes).forEach((prop) => {
					var values = emotes[prop];

					for (var v in values) {
						var splices = values[v].split("-");
						splices[1]++;

						var length =  splices[1] - splices[0];
						var empty = Array.apply(null, new Array(length + 1)).map(function() { return '' });
						text = text.slice(0, splices[0]).concat(empty).concat(text.slice(splices[1] + 1, text.length));
						text.splice(splices[0], 1, '<img src="http://static-cdn.jtvnw.net/emoticons/v1/' + prop + '/3.0">');
					}
				});
			}

			for (var h in text) {
				if (text[h].length !== 1) continue;
				text[h] = text[h].replace(/[&<>"']/g, function(m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]; });
			}

			return text.join('');
		}
	}
}
</script>

<style lang="scss">
	div#chat {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		max-height: 100%;
		max-width: 100%;
		overflow: hidden;
		box-sizing: border-box;
		border: 1px solid transparent;

		.buffer {
			flex: 3 0px;
			order: 1;
			overflow-y: auto;
			display: block;

			.message {
				padding: 5px 10px;
				word-wrap: break-word;
				
				* { vertical-align: middle; }

				// Emotes
				img { height: 1.75rem; }

				.badges {
					display: inline-block;

					.tooltip {
						position: relative;
						display: inline-block;

						.tooltip-data {
							visibility: hidden;
							width: auto;
							white-space: nowrap;
							color: #fff;
							text-align: center;
							border-radius: 2px;
							padding: 5px 10px;
							position: absolute;
							z-index: 1;
							margin-top: -3px;
						}

						&:hover .tooltip-data {
							visibility: visible;
						}
					}

					img {
						height: 1.25rem;
						padding: 2px;
						position: relative;
					}
				}

				.name:after {
					content: ":";
				}

				// &:hover { }
			}
		}

		.footer {
			order: 2;
			position: relative;
			display: block;
			border-top: 1px solid transparent;

			input {
				width: 100%;
				height: 100%;
				border: none;
				max-height: 100%;
				padding: 0 10px;
				margin: 0;
			}

			svg {
				position: absolute;
				top: 5px;
				right: 5px;
			}
		}
	}
</style>
