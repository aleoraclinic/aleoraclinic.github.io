(function () {
  "use strict";

  var config = window.ALEORA_CONFIG || { links: [], social: {} };
  var list = document.getElementById("link-list");
  var socialList = document.getElementById("social-links");

  function createCard(item) {
    var card = document.createElement("a");
    card.className = "action-card" + (item.featured ? " featured" : "");
    card.href = item.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer nofollow";
    card.dataset.linkId = item.id;
    card.setAttribute("aria-label", item.title + ". " + item.cta + ".");

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
