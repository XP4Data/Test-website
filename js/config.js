/*
 * Frontline AI — site settings.
 * Fill these in before launch. Nothing else in the project needs editing to connect it.
 */
window.FRONTLINE_CONFIG = {
  // GoHighLevel calendar link (booking widget / "share" URL).
  // Every "Book a Quick Call" button opens this. If empty, buttons scroll to the callback form.
  calendarUrl: "",

  // GoHighLevel inbound webhook (or form-submission endpoint) for the "Have Us Call You" form.
  // The form is sent as a standard form POST with these fields:
  //   name, business, phone, email, website, source, page
  webhookUrl: "",

  // Optional: shown as a tap-to-call link in the header/footer if set, e.g. "+14085550123".
  phone: ""
};
