import "regenerator-runtime";

import "./style.css";
import "./script/components/index.js";
import HomeView from "./script/view/home.js";

document.addEventListener("DOMContentLoaded", () => {
  new HomeView();
});
