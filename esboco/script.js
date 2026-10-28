/* ============================================================
   GM Pinturas Industriais — JavaScript
   ============================================================ */

/* ============================================================
   CONFIGURAÇÃO DE CONTATO
   ------------------------------------------------------------
   Preencha os dados abaixo com as informações reais da empresa.
   Enquanto os campos estiverem vazios, os botões de WhatsApp
   mostrarão uma orientação ao usuário em vez de abrir um chat.
   ============================================================ */
const CONFIG = {
  whatsapp: "", // Ex: "5511999999999" (somente números, com DDI)
  phone: "", // Ex: "+55 (11) 9999-9999"
  email: "", // Ex: "contato@gmpinturas.com.br"
  address: "", // Ex: "Rua Exemplo, 123 — São Paulo, SP"
};

/* ---------- Atalhos ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------- Inicialização ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initReveal();
  initWhatsApp();
  initForm();
  initYear();
  initContactInfo();
  initLucide();
});

/* ---------- Ícones Lucide ---------- */
function initLucide() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

/* ---------- Header scroll ---------- */
function initHeader() {
  const header = $("#header");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Menu mobile ---------- */
function initMobileMenu() {
  const toggle = $("#navToggle");
  const menu = $("#navMobile");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.classList.toggle("open", open);
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.hidden = !open;
  };

  toggle.addEventListener("click", () => {
    setOpen(!menu.classList.contains("open"));
  });

  $$("a", menu).forEach((link) =>
    link.addEventListener("click", () => setOpen(false))
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* ---------- Rolagem suave ---------- */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const items = $$(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------- WhatsApp ---------- */
function buildWhatsAppUrl(message) {
  if (!CONFIG.whatsapp) return null;
  const base = `https://wa.me/${CONFIG.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

function openWhatsApp(message) {
  const url = buildWhatsAppUrl(message);
  if (!url) {
    return false;
  }
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}

function initWhatsApp() {
  const ctaBtn = $("#ctaWhatsapp");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
      const ok = openWhatsApp(
        "Olá! Gostaria de solicitar um orçamento na GM Pinturas Industriais."
      );
      if (!ok) {
        alert(
          "O WhatsApp ainda não foi configurado. Por favor, entre em contato pelos canais disponíveis na seção de contato."
        );
      }
    });
  }

  const float = $("#whatsappFloat");
  if (float) {
    if (CONFIG.whatsapp) {
      float.href = buildWhatsAppUrl(
        "Olá! Gostaria de solicitar um orçamento na GM Pinturas Industriais."
      );
      float.target = "_blank";
      float.rel = "noopener noreferrer";
      float.hidden = false;
    }
  }
}

/* ---------- Informações de contato ---------- */
function initContactInfo() {
  const channels = {
    whatsapp: CONFIG.whatsapp
      ? formatPhone(CONFIG.whatsapp)
      : "Não configurado",
    phone: CONFIG.phone || "Não configurado",
    email: CONFIG.email || "Não configurado",
    address: CONFIG.address || "Não configurado",
  };

  $$("#contatoLista li").forEach((li) => {
    const channel = li.dataset.channel;
    const valEl = li.querySelector("[data-value]");
    if (valEl && channels[channel]) {
      valEl.textContent = channels[channel];
    }
  });

  $$("#footerContato li").forEach((li) => {
    const channel = li.dataset.channel;
    const valEl = li.querySelector("[data-value]");
    if (valEl && channels[channel]) {
      valEl.textContent = channels[channel];
    }
  });
}

function formatPhone(digits) {
  const d = digits.replace(/\D/g, "");
  if (d.length >= 12) {
    return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 9)}-${d.slice(9)}`;
  }
  if (d.length >= 10) {
    return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 9)}-${d.slice(9, 13)}`;
  }
  return digits;
}

/* ---------- Formulário ---------- */
function initForm() {
  const form = $("#formOrcamento");
  if (!form) return;

  const feedback = $("#formFeedback");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(form);

    const data = {
      nome: $("#f-nome").value.trim(),
      empresa: $("#f-empresa").value.trim(),
      telefone: $("#f-telefone").value.trim(),
      servico: $("#f-servico").value,
      descricao: $("#f-descricao").value.trim(),
    };

    let valid = true;

    if (!data.nome) {
      setError("f-nome", "Informe seu nome.");
      valid = false;
    }
    if (!data.telefone || data.telefone.replace(/\D/g, "").length < 8) {
      setError("f-telefone", "Informe um telefone válido.");
      valid = false;
    }
    if (!data.servico) {
      setError("f-servico", "Selecione um serviço.");
      valid = false;
    }
    if (data.descricao.length < 10) {
      setError("f-descricao", "Descreva sua necessidade com um pouco mais de detalhes.");
      valid = false;
    }

    if (!valid) {
      setFeedback("Por favor, corrija os campos destacados.", "error");
      return;
    }

    const message = buildQuoteMessage(data);

    if (CONFIG.whatsapp) {
      const ok = openWhatsApp(message);
      if (ok) {
        setFeedback(
          "Abrimos o WhatsApp com sua mensagem pronta. Confirme o envio por lá.",
          "success"
        );
        form.reset();
      } else {
        setFeedback(
          "Não foi possível abrir o WhatsApp. Tente novamente.",
          "error"
        );
      }
    } else {
      setFeedback(
        "O envio pelo WhatsApp depende da configuração de um número de contato. " +
          "Entre em contato diretamente pelos canais disponíveis ao lado.",
        "error"
      );
    }
  });
}

function buildQuoteMessage(d) {
  const lines = [
    "*Solicitação de orçamento — GM Pinturas Industriais*",
    "",
    `*Nome:* ${d.nome}`,
  ];
  if (d.empresa) lines.push(`*Empresa:* ${d.empresa}`);
  lines.push(`*Telefone:* ${d.telefone}`);
  lines.push(`*Serviço:* ${d.servico}`);
  lines.push(`*Descrição:* ${d.descricao}`);
  return lines.join("\n");
}

function setError(fieldId, msg) {
  const field = $(`#${fieldId}`).closest(".field");
  if (field) field.classList.add("invalid");
  const err = $(`[data-error-for="${fieldId}"]`);
  if (err) err.textContent = msg;
}

function clearErrors(form) {
  $$(".field.invalid", form).forEach((f) => f.classList.remove("invalid"));
  $$(".error", form).forEach((e) => (e.textContent = ""));
  setFeedback("", "");
}

function setFeedback(msg, type) {
  const fb = $("#formFeedback");
  if (!fb) return;
  fb.textContent = msg;
  fb.className = "form-feedback " + (type || "");
}

/* ---------- Ano no rodapé ---------- */
function initYear() {
  const el = $("#ano");
  if (el) el.textContent = new Date().getFullYear();
}
