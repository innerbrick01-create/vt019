(() => {
  const properties = Array.isArray(window.VANSHIT_PROPERTIES) ? window.VANSHIT_PROPERTIES : [];
  const config = window.VANSHIT_CONFIG || {};
  const grid = document.getElementById("propertyGrid");
  const count = document.getElementById("resultCount");
  const empty = document.getElementById("emptyState");
  const typeFilter = document.getElementById("typeFilter");
  const budgetFilter = document.getElementById("budgetFilter");
  const furnishingFilter = document.getElementById("furnishingFilter");
  const sortSelect = document.getElementById("sortSelect");
  const chips = [...document.querySelectorAll("[data-locality]")];
  let locality = "";
  let selectedProperty = null;
  const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
  const safe = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function card(p) {
    const specs = [];
    if (p.beds) specs.push(`<span>⌂ ${p.beds} bed${p.beds>1?"s":""}</span>`);
    if (p.area) specs.push(`<span>↔ ${p.area} sq ft</span>`);
    specs.push(`<span>◷ ${safe(p.furnishing)}</span>`);
    return `<article class="property-card">
      <div class="property-photo"><img src="${safe(p.image)}" alt="${safe(p.title)}" loading="lazy" onerror="this.onerror=null;this.src='assets/property-placeholder.svg'"><span class="property-tag">${safe(p.type)}</span><span class="property-id">${safe(p.id)}</span></div>
      <div class="property-info"><div class="property-location">⌖ ${safe(p.locality)}, Delhi</div><h3 class="property-title">${safe(p.title)}</h3><div class="property-specs">${specs.join("")}</div>
      <div class="property-bottom"><div class="property-price">${money(p.rent)}<small> / month</small></div><button class="details-button" data-property="${safe(p.id)}">Request details <span>→</span></button></div></div>
    </article>`;
  }
  function filtered() {
    let list = properties.filter(p => (!locality || p.locality === locality)
      && (!typeFilter.value || p.type === typeFilter.value || (typeFilter.value === "Apartment" && p.type.includes("BHK")))
      && (!budgetFilter.value || p.rent <= Number(budgetFilter.value))
      && (!furnishingFilter.value || p.furnishing === furnishingFilter.value));
    if (sortSelect.value === "low") list.sort((a,b)=>a.rent-b.rent);
    if (sortSelect.value === "high") list.sort((a,b)=>b.rent-a.rent);
    if (sortSelect.value === "newest") list.sort((a,b)=>new Date(b.added)-new Date(a.added));
    return list;
  }
  function render() {
    const list = filtered();
    grid.innerHTML = list.map(card).join("");
    count.textContent = `${list.length} ${list.length === 1 ? "property" : "properties"}`;
    empty.classList.toggle("hidden", list.length !== 0);
    grid.classList.toggle("hidden", list.length === 0);
    chips.forEach(c=>c.classList.toggle("selected",c.dataset.locality===locality));
  }
  function resetFilters() { locality=""; typeFilter.value=""; budgetFilter.value=""; furnishingFilter.value=""; sortSelect.value="newest"; document.getElementById("heroLocality").value=""; document.getElementById("heroType").value=""; document.getElementById("heroBudget").value=""; render(); }
  function jumpToRentals() { document.getElementById("rentals").scrollIntoView({behavior:"smooth"}); }
  chips.forEach(c=>c.addEventListener("click",()=>{locality=c.dataset.locality;render()}));
  document.querySelectorAll("[data-jump-locality]").forEach(b=>b.addEventListener("click",()=>{locality=b.dataset.jumpLocality;render();jumpToRentals()}));
  [typeFilter,budgetFilter,furnishingFilter,sortSelect].forEach(el=>el.addEventListener("change",render));
  document.getElementById("clearFilters").addEventListener("click",resetFilters);
  document.getElementById("emptyClear").addEventListener("click",resetFilters);
  document.getElementById("heroSearch").addEventListener("submit",e=>{e.preventDefault();locality=document.getElementById("heroLocality").value;typeFilter.value=document.getElementById("heroType").value;budgetFilter.value=document.getElementById("heroBudget").value;render();jumpToRentals()});
  const dialog = document.getElementById("inquiryDialog");
  function openInquiry(property=null) {
    selectedProperty=property;
    const msg = document.querySelector('[name="message"]');
    if(property) msg.value=`I'm interested in ${property.title} (${property.id}) in ${property.locality}. Please share more details.`;
    document.getElementById("formFeedback").textContent="";
    if(typeof dialog.showModal==="function") dialog.showModal(); else alert("Please use a modern browser to open the inquiry form.");
  }
  grid.addEventListener("click",e=>{const b=e.target.closest("[data-property]");if(!b)return;const p=properties.find(x=>x.id===b.dataset.property);openInquiry(p)});
  document.getElementById("openInquiry").addEventListener("click",()=>openInquiry());
  document.getElementById("contactCardLink").addEventListener("click",e=>{e.preventDefault();openInquiry()});
  document.getElementById("closeInquiry").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
  document.getElementById("inquiryForm").addEventListener("submit",e=>{
    e.preventDefault();
    const form=e.currentTarget;
    if(!form.reportValidity())return;
    const data=new FormData(form);
    const msg=[
      `Hello ${config.brandName || "Vanshit Infra"}, I'd like to make a rental inquiry.`,
      `Name: ${data.get("name")}`,`Phone: ${data.get("phone")}`,`Locality: ${data.get("locality")}`,
      `Budget: ${data.get("budget")}`,`Request: ${data.get("purpose")}`,
      selectedProperty?`Property: ${selectedProperty.title} (${selectedProperty.id}), ${selectedProperty.locality}, rent ${money(selectedProperty.rent)}/month`:"",
      `Message: ${data.get("message") || "No additional message"}`
    ].filter(Boolean).join("\n");
    const feedback=document.getElementById("formFeedback");
    if(config.whatsapp && /^\d{10,15}$/.test(config.whatsapp)) {
      feedback.textContent="Opening WhatsApp with your message. Please review and press Send there.";
      window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(msg)}`,"_blank","noopener,noreferrer");
    } else if(config.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)) {
      feedback.textContent="Opening your email app with the inquiry prepared.";
      window.location.href=`mailto:${config.email}?subject=${encodeURIComponent("Rental inquiry — Vanshit Infra")}&body=${encodeURIComponent(msg)}`;
    } else {
      feedback.textContent="Contact setup is incomplete. The business owner must add a WhatsApp number or email in config.js before inquiries can be sent.";
    }
  });
  const nav=document.getElementById("mainNav"), menu=document.getElementById("menuToggle");
  menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));menu.textContent=open?"×":"☰"});
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false");menu.textContent="☰"}));
  document.getElementById("year").textContent=new Date().getFullYear();
  render();
})();