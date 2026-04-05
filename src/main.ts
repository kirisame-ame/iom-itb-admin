import { createApp } from "vue";
import VueApexCharts from "vue3-apexcharts";
import store from './store';
import ApiService from "./store/api.service";
import KeycloakService from "@/services/keycloak";
import { INIT_AUTH } from "@/store/auth.module";
import "./assets/tailwind.css";

import App from "./App.vue";
import router from "./router";

async function bootstrap() {
	ApiService.init();

	try {
		await KeycloakService.init();
	} catch (error) {
		console.error("Keycloak initialization failed", error);
	}

	try {
		await store.dispatch(INIT_AUTH);
	} catch (error) {
		console.error("Auth initialization failed", error);
	}

	const app = createApp(App);
	app.config.errorHandler = (error) => {
		console.error("Vue runtime error", error);
	};

	app.use(router).use(store).use(VueApexCharts).mount("#app");
}

bootstrap().catch((error) => {
	console.error("Application bootstrap failed", error);
});
