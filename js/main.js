/* Frontline AI — page behavior. No dependencies. */
(function () {
  "use strict";

  var cfg = window.FRONTLINE_CONFIG || {};
  var calendarUrl = (cfg.calendarUrl || "").trim();
  var webhookUrl = (cfg.webhookUrl || "").trim();
  var phone = (cfg.phone || "").trim();

  /* ---- Booking buttons -> GHL calendar (falls back to the callback form) ---- */
  if (calendarUrl) {
    document.querySelectorAll('[data-cta="book"]').forEach(function (a) {
      a.setAttribute("href", calendarUrl);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
  }

  /* ---- Optional phone number ---- */
  if (phone) {
    var digits = phone.replace(/[^\d+]/g, "");
    document.querySelectorAll("[data-phone]").forEach(function (el) {
      var a = document.createElement("a");
      a.href = "tel:" + digits;
      a.textContent = phone;
      el.appendChild(a);
      el.hidden = false;
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Mobile sticky bar: show after the hero, hide while the form is on screen ---- */
  var sticky = document.getElementById("sticky-cta");
  var hero = document.getElementById("top");
  var formSection = document.getElementById("callback");
  if (sticky && hero && formSection && "IntersectionObserver" in window) {
    var heroGone = false, formVisible = false;
    var update = function () { sticky.classList.toggle("is-visible", heroGone && !formVisible); };
    new IntersectionObserver(function (en) { heroGone = !en[0].isIntersecting; update(); }).observe(hero);
    new IntersectionObserver(function (en) { formVisible = en[0].isIntersecting; update(); }, { threshold: 0.2 }).observe(formSection);
  }

  /* ---- Callback form ---- */
  var form = document.getElementById("callback-form");
  if (!form) return;
  var status = document.getElementById("form-status");

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.className = "form__status" + (kind ? " is-" + kind : "");
  }

  function fieldError(input, msg) {
    input.setAttribute("aria-invalid", "true");
    var id = input.id + "-err";
    var err = document.getElementById(id);
    if (!err) {
      err = document.createElement("span");
      err.id = id;
      err.className = "field__error";
      input.parentNode.appendChild(err);
      input.setAttribute("aria-describedby", id);
    }
    err.textContent = msg;
  }

  function clearError(input) {
    input.removeAttribute("aria-invalid");
    var err = document.getElementById(input.id + "-err");
    if (err) err.remove();
    input.removeAttribute("aria-describedby");
  }

  function validate() {
    var ok = true, firstBad = null;
    var f = form.elements;
    ["name", "business", "phone", "email"].forEach(function (n) {
      var el = f[n]; clearError(el);
      var v = el.value.trim(), msg = "";
      if (!v) msg = "Please fill this in.";
      else if (n === "phone" && v.replace(/\D/g, "").length < 10) msg = "Enter a phone number with area code.";
      else if (n === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = "Enter a valid email address.";
      if (msg) { fieldError(el, msg); ok = false; firstBad = firstBad || el; }
    });
    if (firstBad) firstBad.focus();
    return ok;
  }

  form.addEventListener("input", function (e) { if (e.target.hasAttribute("aria-invalid")) clearError(e.target); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setStatus("", "");
    if (form.elements.company_url.value) return; // honeypot tripped: silently drop
    if (!validate()) { setStatus("Please fix the highlighted fields.", "error"); return; }

    if (!webhookUrl) {
      // Not connected yet (development): keep the data visible instead of pretending it was sent.
      console.warn("[Frontline] No webhookUrl set in js/config.js — form was not sent.");
      setStatus("This form isn’t connected yet. Add the GoHighLevel webhook URL in js/config.js.", "error");
      return;
    }

    var data = new FormData();
    ["name", "business", "phone", "email", "website"].forEach(function (n) { data.append(n, form.elements[n].value.trim()); });
    data.append("source", "landing-page-callback-form");
    data.append("page", location.href);

    form.classList.add("is-sending");
    setStatus("Sending…", "");

    fetch(webhookUrl, { method: "POST", body: data })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        setStatus("Thanks — we got it. We’ll reach out shortly.", "ok");
      })
      .catch(function () {
        setStatus("Something went wrong sending that. Please try again" + (phone ? " or call " + phone : "") + ".", "error");
      })
      .finally(function () { form.classList.remove("is-sending"); });
  });
})();
