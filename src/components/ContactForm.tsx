export function ContactForm() {
  return (
    <div className="contact-wrapper">
      <div className="contact-channels">
        <div className="channel-card messaging-card">
          <div className="channel-icon">💬</div>
          <div>
            <h3>Ask Anything</h3>
            <p>
              Connect with our team directly on WhatsApp for real-time sizing advice, custom orders, or order updates.
            </p>
            <a
              href="https://wa.me/8801763572148?text=Hi%20SportsDive%2C%20I%20have%20a%20question"
              target="_blank"
              rel="noopener noreferrer"
              className="button button-chat"
            >
              CHAT ON WHATSAPP ↗
            </a>
          </div>
        </div>

        <div className="channel-card email-card">
          <div className="channel-icon">✉</div>
          <div>
            <h3>Email Us</h3>
            <p>Prefer to reach out by email? Write to our team anytime.</p>
            <a href="mailto:sportsdivebd@gmail.com" className="contact-link">
              sportsdivebd@gmail.com ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
