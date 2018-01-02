<template>
	<div id="ChannelList">
		<ul v-if="chatters[this.Active]">
			<h4 v-if="chatters[this.Active].moderators.length > 0" class="moderators">Moderators</h4>
			<li v-for="user in chatters[this.Active].moderators" v-bind:key="user">{{ user }}</li>
			<h4 v-if="chatters[this.Active].staff.length > 0" class="staff">Staff</h4>
			<li v-for="user in chatters[this.Active].staff" v-bind:key="user">{{ user }}</li>
			<h4 v-if="chatters[this.Active].admins.length > 0" class="admins">Admins</h4>
			<li v-for="user in chatters.admins" v-bind:key="user">{{ user }}</li>
			<h4 v-if="chatters[this.Active].global_mods.length > 0" class="globalMods">Global Moderators</h4>
			<li v-for="user in chatters[this.Active].global_mods" v-bind:key="user">{{ user }}</li>
			<h4 v-if="chatters[this.Active].viewers.length > 0" class="viewers">Viewers</h4>
			<li v-for="user in chatters[this.Active].viewers" v-bind:key="user">{{ user }}</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'Members',
	data () {
		return { chatters: [] }
	},
	computed: {
		Channels () { return this.$store.state.Channels },
		Active () { return this.$store.state.Active },
		name () { return this.Channels[this.Active].name }
	},
	created () {
		this.updateChatters(true);
	},
	watch: {
		Active () { if (!this.chatters[this.Active]) this.updateChatters(false); }
	},
	methods: {
		updateChatters (poll) {
			this.$parent.socket.emit("chatters", { channel: this.name })
			this.$parent.socket.on("chatters", data => {
				if (!data.chatters) return;
				this.chatters[this.Active] = data.chatters;
				console.log(`Updated Chatters`, data)
			});
			if (poll) setTimeout(this.updateChatters, 60000);
		}
	}
}
</script>

<style scoped lang="scss">
	#ChannelList {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 400px;
		max-height: 100%;
		max-width: 100%;
		overflow: hidden;
		box-sizing: border-box;
		border: 1px solid #333333;

		background: #000000;
		color: #ffffff;

		h4 {
			margin: 10px 0;
			font-size: 1.25em;
			padding-bottom: 5px;
			text-align: center;
			border-bottom: 1px solid transparent;

			&.moderators { color: #b3382c; border-color: currentColor; }
			&.staff { color: #25728c; border-color: currentColor; }
			&.admins { color: #f4ce42; border-color: currentColor; }
			&.globalMods { color: #094c0d; border-color: currentColor; }
			&.viewers { color: #ededed; border-color: currentColor; }
		}

		ul {
			flex: 3 0px;
			order: 1;
			overflow-y: auto;
			display: block;
			margin: 0;
			list-style: none;
			padding: 0;

			li {
				padding: 0 0 0 15px;
			}
		}
	}
</style>
