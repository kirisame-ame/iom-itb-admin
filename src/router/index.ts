import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AppSelectorView from "../views/AppSelectorView.vue";
import Dashboard from "../views/AppDashboard.vue";
import Forms from "../views/AppForms.vue";
import Tables from "../views/AppTables.vue";
import UIElements from "../views/UIElements.vue";
import Merchandises from "../views/MerchandiseView.vue";
import Activities from "../views/ActivityView.vue";
import Transactions from "../views/TransactionView.vue";
import Users from "../views/UserView.vue";
import Members from "../views/MemberView.vue";
import Donasi from "../views/DonasiView.vue";
import PendataanAnggota from "../views/PendataanAnggotaView.vue";
import Login from "../views/AppLogin.vue";
import Modal from "../views/AppModal.vue";
import Chart from "../views/ChartView.vue";
import Card from "../views/CardView.vue";
import NotFound from "../views/NotFound.vue";
import store from "@/store";
import { FETCH_JWT, INIT_AUTH, LOGIN, LOGOUT } from "@/store/auth.module";
import { FETCH_APPS, SET_SELECTED_APP, SET_SELECTED_ROLE } from "@/store/appSelector.module";
import KeycloakService from "@/services/keycloak";
import DanaBantuan from "@/views/DanaBantuan.vue";
import PengajuanBantuan from "@/views/PengajuanBantuanView.vue";
import OrangtuaAsuh from "@/views/OrangtuaAsuhView.vue";
import Kemitraan from "@/views/KemitraanView.vue";
import KegiatanKemitraan from "@/views/KegiatanKemitraanView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { layout: "empty" },
  },
  {
  path: "/select",
  name: "AppSelector",
  component: AppSelectorView,
  meta: { layout: "empty" },
},
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/forms",
    name: "Forms",
    component: Forms,
  },
  {
    path: "/cards",
    name: "Cards",
    component: Card,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/ui-elements",
    name: "UIElements",
    component: UIElements,
  },
  {
    path: "/merchandise",
    name: "Merchandise",
    component: Merchandises,
  },
  {
    path: "/kegiatan",
    name: "Kegiatan",
    component: Activities,
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
  },
  {
    path: "/members",
    name: "Members",
    component: Members,
  },
  // {
  //   path: "/10-donasi-terakhir",
  //   name: "Donasi Trakhir",
  //   component: DonasiTerakhir,
  // },
  {
    path: "/donasi",
    name: "Donasi",
    component: Donasi,
  },
  {
    path: "/dana-bantuan",
    name: "Dana Bantuan",
    component: DanaBantuan,
  },
  {
    path: "/orangtua-asuh",
    name: "Orangtua Asuh",
    component: OrangtuaAsuh,
  },
  {
    path: "/pengajuan-bantuan",
    name: "Pengajuan Bantuan",
    component: PengajuanBantuan,
  },
  {
    path: "/pendataan-anggota",
    name: "Pendataan Anggota",
    component: PendataanAnggota,
  },
  {
    path: "/kemitraan",
    name: "Kemitraan",
    component: Kemitraan,
  },
  {
    path: "/kegiatan-kemitraan",
    name: "Kegiatan Kemitraan",
    component: KegiatanKemitraan,
  },
  {
    path: "/transactions",
    name: "Transactions",
    component: Transactions,
  },
  {
    path: "/modal",
    name: "Modal",
    component: Modal,
  },
  {
    path: "/charts",
    name: "Chart",
    component: Chart,
  },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isLoginRoute = to.name === "Login";
  const isSelectorRoute = to.name === "AppSelector";

  if (!KeycloakService.isAuthenticated()) {
    if (isLoginRoute) {
      next();
      return;
    }

    try {
      await store.dispatch(LOGIN);
    } catch (loginError) {
      console.error("SSO login redirect failed", loginError);
      next({ name: "Login" });
    }
    return;
  }

  try {
    await store.dispatch(INIT_AUTH);
    await store.dispatch(FETCH_JWT);

    if (isLoginRoute) {
      next({ name: "AppSelector" });
      return;
    }

    if (!isSelectorRoute) {
      await store.dispatch(`appSelector/${FETCH_APPS}`);
      const apps = store.getters["appSelector/allApps"] || [];
      const selectedApp = store.getters["appSelector/selectedApp"];
      const selectedRole = store.getters["appSelector/selectedRole"];
      const webApp = apps.find((app: any) => app.id === "web");

      if (!webApp) {
        next({ name: "AppSelector", query: { reason: "no-web-access" } });
        return;
      }

      if (!selectedApp || selectedApp.id !== "web") {
        await store.dispatch(`appSelector/${SET_SELECTED_APP}`, webApp);

        if (webApp.roles.length === 1) {
          await store.dispatch(`appSelector/${SET_SELECTED_ROLE}`, webApp.roles[0]);
          next();
          return;
        }

        next({ name: "AppSelector", query: { from: "web" } });
        return;
      }

      if (!selectedRole) {
        if (selectedApp.roles.length === 1) {
          await store.dispatch(`appSelector/${SET_SELECTED_ROLE}`, selectedApp.roles[0]);
          next();
          return;
        }

        next({ name: "AppSelector" });
        return;
      }
    }

    next();
  } catch (error) {
    try {
      await store.dispatch(LOGOUT);
    } catch (logoutError) {
      console.error("Logout failed after auth guard error", logoutError);
    }
    next({ name: "Login" });
  }
});

export default router;
