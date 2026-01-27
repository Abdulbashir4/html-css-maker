/* =====================================
   PURE HTML EXPORT (STABLE)
===================================== */

export function exportPureHTML(){

  const canvas = document.getElementById("canvas");
  const clone  = canvas.cloneNode(true);

  /* 1. REMOVE TOOLBARS */
  clone.querySelectorAll(
    ".el-section-toolbar,.el-column-toolbar,.el-remove-btn"
  ).forEach(el=>el.remove());

  /* 2. APPLY TAILWIND */
  clone.querySelectorAll("[data-tw]").forEach(el=>{
    el.className = el.dataset.tw || "";
  });

  /* 3. REMOVE ATTRIBUTES */
  clone.querySelectorAll("*").forEach(el=>{
    [...el.attributes].forEach(a=>{
      if(
        a.name.startsWith("data-") ||
        a.name==="contenteditable" ||
        a.name==="draggable" ||
        a.name==="style"
      ){
        el.removeAttribute(a.name);
      }
    });
  });

  /* 4. REMOVE BUILDER CLASSES */
  clone.querySelectorAll("*").forEach(el=>{
    el.classList.remove(
      "el-section",
      "el-section-inner",
      "el-column",
      "el-column-inner",
      "block-wrapper",
      "is-selected",
      "border",
      "border-dashed",
      "relative",
      "min-h-[120px]"
    );
  });

  /* 5. MERGE WRAPPERS */
  flatten(clone);

  /* 6. CLEAN HEIGHT (KEEP LAST h-*) */
  clone.querySelectorAll("*").forEach(el=>{

    const heights =
      [...el.classList].filter(c=>c.startsWith("h-"));

    if(heights.length > 1){
      const last = heights[heights.length-1];
      heights.forEach(h=>{
        if(h !== last) el.classList.remove(h);
      });
    }

  });

  /* 7. CLEAN PADDING (KEEP LAST p-*) */
  clone.querySelectorAll("*").forEach(el=>{

    const pads =
      [...el.classList].filter(c =>
        /^p[trblxy]?-\[?.+/.test(c)
      );

    if(pads.length > 1){

      const last = pads[pads.length-1];

      pads.forEach(p=>{
        if(p !== last){
          el.classList.remove(p);
        }
      });

    }

  });

  /* 8. OUTPUT */
  const html = formatHTML(clone.innerHTML.trim());

  document.getElementById("codeOutput").value = html;
  document.getElementById("codeModal")
    .classList.remove("hidden");
}


/* =====================================
   VIEW PAGE HTML
===================================== */

export function getPureHTMLForView(){

  const canvas = document.getElementById("canvas");
  const clone  = canvas.cloneNode(true);

  clone.querySelectorAll("[data-tw]").forEach(el=>{
    el.className = el.dataset.tw || "";
  });

  clone.querySelectorAll("*").forEach(el=>{
    [...el.attributes].forEach(a=>{
      if(
        a.name.startsWith("data-") ||
        a.name==="contenteditable" ||
        a.name==="draggable" ||
        a.name==="style"
      ){
        el.removeAttribute(a.name);
      }
    });
  });

  clone.querySelectorAll("*").forEach(el=>{
    el.classList.remove(
      "el-section",
      "el-column",
      "block-wrapper",
      "is-selected",
      "border",
      "border-dashed",
      "relative",
      "min-h-[120px]"
    );
  });

  flatten(clone);

  return clone.innerHTML.trim();
}


/* =====================================
   HELPERS
===================================== */

function flatten(root){

  let again=true;

  while(again){
    again=false;

    root.querySelectorAll("div").forEach(p=>{

      if(p.children.length!==1) return;

      const c=p.children[0];
      if(c.tagName!=="DIV") return;

      p.className =
        (p.className+" "+c.className).trim();

      p.innerHTML=c.innerHTML;
      again=true;

    });
  }
}


/* =====================================
   FORMAT HTML
===================================== */

export function formatHTML(html){

  let out = "";
  let indent = 0;

  html.replace(/></g, ">\n<")
    .split("\n")
    .forEach(line => {

      if(line.match(/^<\/\w/)){
        indent = Math.max(indent-1,0);
      }

      out += "  ".repeat(indent) + line + "\n";

      if(
        line.match(/^<\w[^>]*[^\/]>$/) &&
        !line.includes("</")
      ){
        indent++;
      }

    });

  return out.trim();
}

