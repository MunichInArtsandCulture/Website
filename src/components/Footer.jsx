export default function Footer() {
  return (
    <div id="footer" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 0' }}>
      
      <div style={{ width: 'auto', float: 'none', flex: '1', minWidth: '220px' }}>
        <span>
          Impressum (gemäß § 5 TMG)<br />
          Verantwortlich für diese Website: <br />
          Jan-Luca Ahlemeyer <br />
          Munich in Arts and Culture <br />
          Dientzenhoferstraße 20 <br />
          80937 München <br />
          E-Mail: munichinartsandculture@gmail.com
        </span>
      </div>

      <div style={{ width: 'auto', float: 'none', flex: '2', minWidth: '280px' }}>
        <p style={{ margin: 0 }}>
          Disclaimer Munich in Arts and Culture ist ein nicht-kommerzielles, künstlerisches Projekt zur Sichtbarmachung von urbaner Kunst, Kultur und Gesellschaft. Die Inhalte dienen der Meinungsäußerung, kulturellen Bildung und Dokumentation. Alle Angaben erfolgen ohne Gewähr auf Vollständigkeit oder Richtigkeit. Veranstaltungshinweise und Jobangebote werden redaktionell ausgewählt und verlinken auf externe Quellen. Es werden keine personenbezogenen Daten gespeichert oder ausgewertet. Sollten Inhalte gegen Rechte Dritter verstoßen, bitten wir um einen formlosen Hinweis – sie werden umgehend entfernt.
        </p>
      </div>

      <div id="connect" style={{ width: 'auto', float: 'none', flex: '1', minWidth: '150px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <a href="https://www.instagram.com/munichartsandculture/" id="instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://t.me/munichinartsandculture" id="telegram" target="_blank" rel="noopener noreferrer">Telegram</a>
        <a href="https://ko-fi.com/munichinartsandculture" id="kofi_out" target="_blank" rel="noopener noreferrer"><div id="kofi_in"></div></a>
      </div>

    </div>
  );
}
