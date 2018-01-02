import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(Vuex);

import 'vue-awesome/icons';

import Icon from 'vue-awesome/components/Icon';
import ChannelList from './components/ChannelList.vue';
import Chat from './components/Chat.vue';
import Members from './components/Members.vue';

Vue.component("ChannelList", ChannelList);
Vue.component("Chat", Chat);
Vue.component("Members", Members);
Vue.component("Icon", Icon);

const store = new Vuex.Store({
	state: {
		Channels: [
			{ name: "modesttim", id: 51684790 },
			{ name: "weetbot", id: 88560344 },
		],
		Active: 0
	},
	mutations: {
		Channels (state, options) {
			if (!options.action || !options.action) return;
			state.Channels
		},
		Active (state, index) {
			state.Active = index;
		}
	},
	actions: {
		Active (context, index) {
			context.commit('Active', index)
		}
	}
})

new Vue({
	el: '#app',
	store,
	render: h => h(App)
});