/* =====================================
   PURE HTML EXPORT
===================================== */

export function exportPureHTML(){

  const canvas = document.getElementById("canvas");
  const clone = canvas.cloneNode(true);

  cleanBuilder(clone);

  const html = formatHTML(clone.innerHTML.trim());

  document.getElementById("codeOutput").value = html;
  document.getElementById("codeModal")
    .classList.remove("hidden");
}



/* =====================================
   FOR LIVE PAGE
===================================== */

export function getPureHTMLForView(){

  const canvas=document.getElementById("canvas");
  const clone=canvas.cloneNode(true);

  // apply tw
  clone.querySelectorAll("[data-tw]").forEach(el=>{
    el.className = el.dataset.tw || "";
  });

  // remove attributes
  clone.querySelectorAll("*").forEach(el=>{
    [...el.attributes].forEach(a=>{
      if(
        a.name.startsWith("data-") ||
        a.name==="contenteditable" ||
        a.name==="draggable"
      ){
        el.removeAttribute(a.name);
      }
    });
  });

  // remove builder classes
  clone.querySelectorAll("*").forEach(el=>{
    el.classList.remove(
      "el-section","el-column",
      "el-column-inner","block-wrapper",
      "is-selected"
    );
  });

  return clone.innerHTML.trim();
}



/* =====================================
   MASTER CLEANER
===================================== */

function cleanBuilder(root){

  /* 1) REMOVE TOOLBARS & REMOVE BTNS */
  root.querySelectorAll(
    ".el-section-toolbar,.el-column-toolbar,.el-remove-btn"
  ).forEach(el=>el.remove());

  /* 2) APPLY data-tw → class */
  root.querySelectorAll("[data-tw]").forEach(el=>{
    el.className = el.dataset.tw || "";
  });

  /* 3) REMOVE ATTRIBUTES */
  root.querySelectorAll("*").forEach(el=>{
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

  /* 4) REMOVE BUILDER CLASSES */
  root.querySelectorAll("*").forEach(el=>{
    el.classList.remove(
  "el-section",
  "el-column",
  "el-section-inner",
  "el-column-inner",
  "block-wrapper",
  "is-selected",
  "border",
  "border-dashed",
  "relative",
  "min-h-[120px]",
  "p-4",
  "bg-white",
  "shadow"
);

  });

  /* 5) UNWRAP INNER WRAPPERS */
  root.querySelectorAll(
    ".el-section-inner,.el-column-inner"
  ).forEach(el=>{
    el.replaceWith(...el.childNodes);
  });

  /* 6) MERGE SINGLE CHILD DIVS */
  mergeDivs(root);

  /* 7) CLEAN DUPLICATES */
  cleanupClasses(root);
}



/* =====================================
   MERGE SINGLE CHILD DIV
===================================== */

function mergeDivs(root){

  let again = true;

  while(again){
    again = false;

    root.querySelectorAll("div").forEach(parent=>{

      if(parent.children.length !== 1) return;

      const child = parent.children[0];
      if(child.tagName !== "DIV") return;

      parent.className =
        (parent.className + " " + child.className).trim();

      parent.innerHTML = child.innerHTML;

      again = true;
    });
  }
}



/* =====================================
   REMOVE DUPLICATE TAILWIND
===================================== */

function cleanupClasses(root){

  root.querySelectorAll("*").forEach(el=>{

    const seen = new Set();
    [...el.classList].forEach(cls=>{
      if(seen.has(cls)){
        el.classList.remove(cls);
      }else{
        seen.add(cls);
      }
    });

  });
}



/* =====================================
   FORMAT HTML
===================================== */

export function formatHTML(html){

  let out="";
  let indent=0;

  html.replace(/></g,">\n<")
    .split("\n")
    .forEach(line=>{

      if(line.match(/^<\/\w/)){
        indent=Math.max(indent-1,0);
      }

      out += "  ".repeat(indent)+line+"\n";

      if(
        line.match(/^<\w[^>]*[^\/]>$/) &&
        !line.includes("</")
      ){
        indent++;
      }

    });

  return out.trim();
}


export function generateCleanHTML() {
  const canvas = document.getElementById("canvas").cloneNode(true);

  cleanBuilder(canvas); // 🔥 MUST

  return formatHTML(canvas.innerHTML);
}