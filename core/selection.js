import { state } from "./state.js";

export function bindSelection(){

  document.addEventListener("click",e=>{

    const block =
      e.target.closest("[data-canvas-block]");

    if(!block) return;

    document
      .querySelectorAll(".is-selected")
      .forEach(el=>el.classList.remove("is-selected"));

    block.classList.add("is-selected");
    state.selected = block;

  });

}
