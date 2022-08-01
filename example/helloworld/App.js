import { h } from "../../lib/mini-vue.esm.js";
export const App = {
  render() {
    return h(
      "div",
      {
        id: "root",
      },
      [h("div", { class: "blue" }, this.msg), h("div", { class: "red" }, "jzsp2")]
    );
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
