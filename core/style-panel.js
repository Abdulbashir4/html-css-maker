import { state } from "./state.js";

/* ============================
   STYLE PANEL (WORKING CORE)
============================ */

export function bindStylePanel(){

  const keys = [
    "bg","pad","margin","align",
    "radius","font","width",
    "height","textColor",
    "display","flexDir",
    "justify","items","wrap","gap"
  ];

  const controls = {};

  keys.forEach(k=>{
    controls[k] = {
      input: document.getElementById(k+"Input"),
      select: document.getElementById(k+"Select")
    };
  });

  /* ---------- hybrid bind ---------- */
  keys.forEach(k=>{
    const c = controls[k];

    if(c.input){
      c.input.addEventListener("input",()=>{
        if(c.select) c.select.value="";
        applyStyles();
      });
    }

    if(c.select){
      c.select.addEventListener("change",()=>{
        if(c.input) c.input.value=c.select.value;
        applyStyles();
      });
    }
  });

  /* ---------- load on select ---------- */
  document.addEventListener("click",()=>{
    if(!state.selected) return;

    const map = getMap(state.selected);

    keys.forEach(k=>{
      if(controls[k].input)
        controls[k].input.value = map[k] || "";
      if(controls[k].select)
        controls[k].select.value = "";
    });
  });
}

/* ============================
   APPLY STYLES
============================ */

function applyStyles(){

  if(!state.selected) return;

  const keys = [
    "bg","pad","margin","align",
    "radius","font","width",
    "height","textColor",
    "display","flexDir",
    "justify","items","wrap","gap"
  ];

  const map = {};

  keys.forEach(k=>{
    const el = document.getElementById(k+"Input");
    map[k] = el ? el.value.trim() : "";
  });

  state.selected.dataset.twMap = JSON.stringify(map);
  state.selected.dataset.tw =
    Object.values(map).filter(Boolean).join(" ");

  applyTailwind(state.selected);
}

/* ============================
   APPLY TAILWIND (CORE)
============================ */

function applyTailwind(el){

  const keep = [];

  if(el.classList.contains("block-wrapper")) keep.push("block-wrapper");
  if(el.classList.contains("el-section")) keep.push("el-section");
  if(el.classList.contains("el-column")) keep.push("el-column");
  if(el.classList.contains("el-column-inner")) keep.push("el-column-inner");
  if(el.classList.contains("is-selected")) keep.push("is-selected");

  el.className = keep.join(" ");

  if(el.dataset.tw){
    el.dataset.tw.split(/\s+/).forEach(cls=>{
      if(cls) el.classList.add(cls);
    });
  }
}

/* ============================
   READ MAP
============================ */

function getMap(el){
  try{
    return JSON.parse(el.dataset.twMap||"{}");
  }catch{
    return {};
  }
}
