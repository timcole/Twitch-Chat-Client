<template>
	<div id="ChannelList">
		<ul>
			<li v-for="channel in Channels" v-bind:key="channel.id" v-on:click="switchChat" :id="channel.name">{{ channel.name }}</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'ChannelList',
	data () {
		return { }
	},
	computed: {
		Channels () { return this.$store.state.Channels },
		Active () { return this.$store.state.Active },
		name () { return this.Channels[this.Active]; }
	},
	created () { },
	methods: {
		switchChat (data) {
			this.$store.dispatch('Active', Array.prototype.indexOf.call(data.target.parentNode.children, data.target));
		}
	}
}
</script>

<style scoped lang="scss">
	#ChannelList {
		width: 300px;
		background: #000000;
	}
</style>
