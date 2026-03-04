export default function Home() {
  return (
    <div className="title-box">
      <h1 className="page-title home">Munich in Arts and Culture</h1>
      <p className="paragraph">
        Munich in Arts and Culture is an <strong>independent, non-commercial</strong> project dedicated to <strong>showcasing Munich's creative scene</strong>.
        It features cultural events, artistic work, and creative expressions across music, visual arts, performance, and club culture — with an emphasis on alternative and experimental movements.
        <br /><br />
        By <strong>collaborating with local artists</strong>, the platform regularly showcases their work, increasing their visibility and audience reach.
        <br /><br />
        Additionally, it shares <strong>AI-assisted job listings</strong> in the creative and cultural sectors, along with information on <strong>available studio spaces</strong>, venues, and other valuable resources.
        <br /><br />
        The aim is to foster cultural exchange, artistic visibility, and grassroots networking — without any commercial or institutional affiliation.
      </p>

      <div className="social-links">
        <a className="tg-link" href="https://t.me/munichinartsandculture" target="_blank" rel="noopener noreferrer">Telegram</a>
        <a href="https://www.instagram.com/munichartsandculture/" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>

      <div style={{ display: 'flex', gap: '30px', fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#e3bbd97a', marginTop: '0px', marginBottom: '32px', lineHeight: 1.5, fontWeight: 155 }}>
        <div style={{ flex: 7 }}>
          <p><strong>Disclaimer</strong><br />
            Munich in Arts and Culture ist ein nicht-kommerzielles, künstlerisches Projekt zur Sichtbarmachung von urbaner Kunst, Kultur und Gesellschaft.<br />
            Die Inhalte dienen der Meinungsäußerung, kulturellen Bildung und Dokumentation.<br />
            Alle Angaben erfolgen ohne Gewähr auf Vollständigkeit oder Richtigkeit.<br />
            Veranstaltungshinweise und Jobangebote werden redaktionell ausgewählt und verlinken auf externe Quellen.<br />
            Es werden keine personenbezogenen Daten gespeichert oder ausgewertet.<br />
            Sollten Inhalte gegen Rechte Dritter verstoßen, bitten wir um einen formlosen Hinweis – sie werden umgehend entfernt.
          </p>
        </div>
        <div style={{ flex: 3 }}>
          <p><strong>Impressum (gemäß § 5 TMG)</strong><br />
            Verantwortlich für diese Website:<br />
            Jonathan Meyer<br />
            Munich in Arts and Culture<br />
            Helene-Mayer-Ring 10<br />
            80809 München<br />
            E-Mail: <a href="mailto:munichinartsandculture@gmail.com" style={{ color: '#e3bbd97a' }}>munichinartsandculture@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
