(() => {
  const params = new URLSearchParams(window.location.search);
  const success = document.querySelector("[data-form-success]");
  const form = document.querySelector("[data-contact-form]");
  const service = form?.querySelector("select[name='Serviço de interesse']");

  if (params.get("enviado") === "1" && success) {
    success.classList.add("is-visible");
    success.removeAttribute("hidden");
    success.focus();

    const cleanUrl = `${window.location.pathname}${window.location.hash || "#formulario"}`;
    window.history.replaceState({}, "", cleanUrl);
  }

  const requestedService = params.get("servico");
  if (requestedService && service) {
    const match = [...service.options].find(
      (option) => option.value.toLowerCase() === requestedService.toLowerCase(),
    );
    if (match) service.value = match.value;
  }

  form?.addEventListener("submit", () => {
    const button = form.querySelector("button[type='submit']");
    if (!button) return;

    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = "Enviando mensagem…";
  });
})();
