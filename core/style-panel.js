import { state } from "./state.js";

/* =========================
   BIND STYLE PANEL
========================= */
export function bindStylePanel(){

  const keys = [
    "bg",
    "pad",
    "margin",
    "align",
    "radius",
    "font",
    "width",
    "height",
    "textColor",
    "display",
  "flexDir",
  "justify",
  "items",
  "wrap",
  "gap"
  ];

  const controls = {};

  keys.forEach(k=>{
    controls[k] = {
      input: document.getElementById(k+"Input"),
      select: document.getElementById(k+"Select")
    };
  });

  /* ===== HYBRID BIND ===== */
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
        if(c.input) c.input.value = c.select.value;
        applyStyles();
      });
    }
  });

  /* ===== LOAD VALUES ON SELECT ===== */
  document.addEventListener("click",()=>{

    if(!state.selected) return;

    const map = getStyleMap(state.selected);

    keys.forEach(k=>{
      if(controls[k].input){
        controls[k].input.value = map[k] || "";
      }
      if(controls[k].select){
        controls[k].select.value = "";
      }
    });

  });

}

/* =========================
   APPLY STYLES
========================= */
function applyStyles(){

  if(!state.selected) return;

  const keys = [
    "bg","pad","margin","align",
    "radius","font","width",
    "height","textColor", "display",
  "flexDir",
  "justify",
  "items",
  "wrap",
  "gap"
  ];

  const map = {};

  keys.forEach(k=>{
    const input = document.getElementById(k+"Input");
    map[k] = input ? input.value : "";
  });

  state.selected.dataset.twMap = JSON.stringify(map);

  state.selected.dataset.tw =
    Object.values(map).filter(Boolean).join(" ");

  applyTailwind(state.selected);
}

function applyTailwind(el){

              /* =========================
                KEEP ONLY SYSTEM CLASSES
              ========================= */

              const system = [];

              if(el.classList.contains("block-wrapper"))
                system.push("block-wrapper");

              if(el.classList.contains("el-section"))
                system.push("el-section");

              if(el.classList.contains("el-column"))
                system.push("el-column");

              if(el.classList.contains("el-column-inner"))
                system.push("el-column-inner");

              if(el.classList.contains("is-selected"))
                system.push("is-selected");

              // 🔥 wipe everything else
              el.className = system.join(" ");

            /* =========================
              REMOVE OLD PADDING CLASSES
            ========================= */
            [
              "p-","px-","py-",
              "pt-","pr-","pb-","pl-"
            ].forEach(prefix=>{

              [...el.classList].forEach(cls=>{
                if(cls.startsWith(prefix)){
                  el.classList.remove(cls);
                }
              });

            });




            /* =========================
              APPLY NEW USER CLASSES
            ========================= */

            if(el.dataset.tw){

              el.dataset.tw
                .split(/\s+/)
                .forEach(cls=>{
                  if(cls.trim()){
                    el.classList.add(cls);
                  }
                });

            }



                          /* =========================
              FIX BACKGROUND OVERLAY
            ========================= */
            if(
              el.classList.contains("el-section") ||
              el.classList.contains("el-column")
            ){
              const inner = el.querySelector(".el-column-inner");

              if(inner && el.dataset.tw){

                const hasBg =
                  el.dataset.tw.split(/\s+/)
                    .some(c => c.startsWith("bg-"));

                if(hasBg){
                  inner.classList.remove("bg-white");
                  inner.classList.remove("bg-gray-100");
                }

              }
            }



          /* =========================
            REMOVE INNER BG IF PARENT HAS BG
          ========================= */
          if(
            el.classList.contains("el-section") ||
            el.classList.contains("el-column")
          ){

            const inner = el.querySelector(".el-column-inner");

            if(inner && el.dataset.tw){

              const hasBg =
                el.dataset.tw.split(/\s+/)
                  .some(c => c.startsWith("bg-"));

              if(hasBg){

                [...inner.classList].forEach(cls=>{
                  if(cls.startsWith("bg-")){
                    inner.classList.remove(cls);
                  }
                });

              }

            }

          }


}


/* =========================
   READ STORED MAP
========================= */
function getStyleMap(el){
  try{
    return JSON.parse(el.dataset.twMap || "{}");
  }catch{
    return {};
  }
}
