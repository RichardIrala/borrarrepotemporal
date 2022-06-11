import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "signup-page" },
  { path: "/select", component: "select-page" },
  { path: "/enter_room", component: "enterid-page" },
  { path: "/share_id", component: "shareid-page" },
  { path: "/instructions", component: "instructions-page" },
  { path: "/waiting", component: "waiting-page" },
  { path: "/game", component: "game-page" },
  { path: "/results", component: "results-page" },
]);
