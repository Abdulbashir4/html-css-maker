import { state } from './state.js';
import { bindSidebar } from './sidebar.js';
import { bindSelection } from './selection.js';
import { setPreviewMode } from './preview.js';
import { exportPureHTML, formatHTML, getPureHTMLForView, generateCleanHTML } from './export.js';
import { bindStylePanel } from './style-panel.js';


/* =========================
   PAGE NAME REMEMBER
========================= */

const pageNameInput = document.getElementById("pageNameInput");

// load saved page name
const savedPage = localStorage.getItem("codgen_page_name");
if(savedPage){
  pageNameInput.value = savedPage;
}

// save when typing
pageNameInput.addEventListener("input",()=>{
  localStorage.setItem(
    "codgen_page_name",
    pageNameInput.value.trim()
  );
});



/* =========================
   PANEL LOADER
========================= */

function loadPanel(url, targetId, callback) {

  fetch(url)
    .then(r => r.text())
    .then(html => {
      document.getElementById(targetId).innerHTML = html;
      if (callback) callback();
    });

}



/* =========================
   TAB SWITCH
========================= */

function bindTabs() {

  const tabBlock = document.getElementById('tabBlock');
  const tabStyle = document.getElementById('tabStyle');

  const blockPanel = document.getElementById('blockPanel');
  const stylePanel = document.getElementById('stylePanel');

  tabBlock.onclick = () => {
    blockPanel.classList.remove('hidden');
    stylePanel.classList.add('hidden');
  };

  tabStyle.onclick = () => {
    stylePanel.classList.remove('hidden');
    blockPanel.classList.add('hidden');
  };

}



/* =========================
   BOOTSTRAP
========================= */

document.addEventListener('DOMContentLoaded', () => {

  state.canvas = document.getElementById('canvas');
  if (!state.canvas) return;

  // load panels
  loadPanel('panels/blocks.html','blockPanel',bindSidebar);
  loadPanel('panels/styles.html','stylePanel',bindStylePanel);

  bindSelection();
  bindTabs();

  // buttons
  document.getElementById("btnMobile")
    .onclick = () => setPreviewMode('mobile');

  document.getElementById("btnDesktop")
    .onclick = () => setPreviewMode('desktop');

  document.getElementById("btnCode")
    .onclick = exportPureHTML;

  document.getElementById("btnPublish")
    .onclick = publishPage;

  document.getElementById("btnViewLive")
    .onclick = viewLivePage;

  document.getElementById("btnLoadPage")
    .onclick = loadPageIntoBuilder;

});



/* =========================
   PUBLISH PAGE
========================= */

function publishPage(){

  const pageName = pageNameInput.value.trim();

  if(!pageName){
    alert("Enter page name");
    return;
  }

  // ✅ CLEAN HTML (FIXED)
  const cleanHTML = generateCleanHTML();

  // ✅ BUILDER JSON (edit করার জন্য)
  const builderHTML = state.canvas.innerHTML;

  fetch("save_page.php",{
    method:"POST",
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
    body:
      "page=" + encodeURIComponent(pageName) +
      "&html=" + encodeURIComponent(cleanHTML) +
      "&json=" + encodeURIComponent(builderHTML)
  })
  .then(r=>r.text())
  .then(t=>{
    alert("Server says: " + t);
  });

}


/* =========================
   VIEW LIVE PAGE
========================= */

function viewLivePage(){

  const page = pageNameInput.value.trim();
  if(!page){
    alert("Enter page name first");
    return;
  }

  window.open("pages/" + page + ".php","_blank");

}



/* =========================
   LOAD PAGE INTO BUILDER
========================= */

function loadPageIntoBuilder(){

  const page = pageNameInput.value.trim();
  if(!page){
    alert("Enter page name");
    return;
  }

  fetch("load_page.php?page=" + page)
    .then(r=>r.text())
    .then(html=>{

      if(!html){
        alert("Page not found");
        return;
      }

      state.canvas.innerHTML = html;

      bindSelection(); // 🔥 rebind
      alert("Page loaded into builder!");

    });

}
