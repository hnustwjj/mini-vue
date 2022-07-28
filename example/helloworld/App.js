import { h } from "../../lib/mini-vue.esm.js";
export const App = {
  render() {
    return h(
      "div",
      {
        id: "root",
      },
      [h("div", { class: "blue" }, "jzsp1"), h("div", { class: "red" }, "jzsp2")]
    );
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
