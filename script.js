(function () {
  "use strict";

  var config = window.ALEORA_CONFIG || {
    links: [],
    social: {},
    tracking: {},
  };
  var list = document.getElementById("link-list");
  var socialList = document.getElementById("social-links");

  function createEventId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return Date.now() + "-" + Math.random().toString(36).slice(2, 12);
  }

  function getDeviceType() {
    var userAgent = navigator.userAgent || "";
    var isIPad = /iPad/i.test(userAgent) ||
      (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1);

    if (isIPad || /Tablet/i.test(userAgent)) {
      return "tablet";
    }

    if (/Mobi|Android|iPhone|iPod/i.test(userAgent)) {
      return "mobile";
    }

    return "desktop";
  }

  function getTrackingPayload(item) {
    var params = new URLSearchParams(window.location.search);

    return {
      eventId: createEventId(),
      linkId: item.id,
      linkTitle: item.title,
      utmSource: params.get("utm_source") || "direto",
      utmMedium: params.get("utm_medium") || "",
      utmCampaign: params.get("utm_campaign") || "",
      utmContent: params.get("utm_content") || "",
      referrer: document.referrer || "",
      pageUrl: window.location.href,
      device: getDeviceType(),
    };
  }

  function trackClick(item) {
    var tracking = config.tracking || {};

    if (!tracking.enabled || !tracking.endpoint) {
      return;
    }

    var body = JSON.stringify(getTrackingPayload(item));

    if (typeof window.fetch === "function") {
      fetch(tracking.endpoint, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: body,
      }).catch(function () {
        // O clique continua abrindo o destino mesmo se o registro falhar.
      });
      return;
    }

    if (navigator.sendBeacon) {
      var data = new Blob([body], { type: "text/plain;charset=UTF-8" });
      navigator.sendBeacon(tracking.endpoint, data);
    }
  }

  function createCard(item) {
    var card = document.createElement("a");
    card.className = "action-card" + (item.featured ? " featured" : "");
    card.href = item.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer nofollow";
    card.dataset.linkId = item.id;
    card.setAttribute("aria-label", item.title + ". " + item.cta + ".");
    card.addEventListener("click", function () {
      trackClick(item);
    });

    var index = document.createElement("span");
    index.className = "card-index";
    index.setAttribute("aria-hidden", "true");
    index.textContent = item.order;

    var content = document.createElement("span");
    content.className = "card-content";

    var meta = document.createElement("span");
    meta.className = "card-meta";
    meta.textContent = item.meta;

    var title = document.createElement("span");
    title.className = "card-title";
    title.textContent = item.title;

    var description = document.createElement("span");
    description.className = "card-description";
    description.textContent = item.description;

    var cta = document.createElement("span");
    cta.className = "card-cta";
    cta.textContent = item.cta;

    var arrow = document.createElement("span");
    arrow.className = "card-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";

    content.append(meta, title, description, cta);
    card.append(index, content, arrow);

    return card;
  }

  config.links.forEach(function (item) {
    list.appendChild(createCard(item));
  });

  if (config.social && config.social.instagramUrl) {
    var instagram = document.createElement("a");
    instagram.className = "social-link";
    instagram.href = config.social.instagramUrl;
    instagram.target = "_blank";
    instagram.rel = "noopener noreferrer";
    instagram.textContent = config.social.instagramLabel || "Instagram";
    socialList.appendChild(instagram);
  } else {
    socialList.hidden = true;
  }
})();
