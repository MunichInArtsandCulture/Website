import React, { useState } from 'react';

export default function HowToArt() {
  const [lang, setLang] = useState('en');

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="how-to-art">
      <h1 className="how-to-art-title">
        HOW TO <span className="art-italic">ART</span>
      </h1>

      <div className="date-selector" style={{ marginBottom: '0px', display: 'flex', gap: '6px', alignItems: 'center', paddingBottom: '2rem' }}>
        <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>English</button>
        <button type="button" className={lang === 'de' ? 'active' : ''} onClick={() => setLang('de')}>German</button>
      </div>

      {lang === 'de' ? (
        <>
          <p className="intro-text">
            Ich habe diesen Guide geschrieben, um die wichtigsten Basics für angehende Künstler*innen und Kulturschaffende kompakt und verständlich zusammenzufassen. Ein einsteigerfreundlicher Überblick ohne unnötige Komplexität.
          </p>

          <ol className="table-of-contents">
            <li><a href="#section-1" onClick={(e) => scrollToSection(e, 'section-1')}>Solo vs. Kollektiv – Welche Rechtsform passt zu mir?</a></li>
            <li><a href="#section-2" onClick={(e) => scrollToSection(e, 'section-2')}>Welche Förderprogramme gibt es?</a></li>
            <li><a href="#section-3" onClick={(e) => scrollToSection(e, 'section-3')}>Welche Locations kann ich für welche Events anmieten?</a></li>
            <li><a href="#section-4" onClick={(e) => scrollToSection(e, 'section-4')}>Welche Gagen sind normal?</a></li>
            <li><a href="#section-5" onClick={(e) => scrollToSection(e, 'section-5')}>Wann macht Werbung für mich Sinn?</a></li>
            <li><a href="#section-6" onClick={(e) => scrollToSection(e, 'section-6')}>Kunstverkauf, Merch und Spendenplattformen</a></li>
          </ol>

          <div id="section-1" className="guide-section">
            <h2>1. Solo vs Kollektiv? – Welche Rechtsform passt zu mir?</h2>
            <p>
              Der Start in die berufliche kreative Laufbahn wirft oft formelle Fragen auf. Grundsätzlich wird unterschieden zwischen Freien Berufen (z. B. Künstler, Schriftsteller, Unterrichtende) und Gewerbetreibenden (z. B. Händler).
            </p>
            <ul>
              <li>
                <strong>Selbstständigkeit vs. Gewerbe:</strong> Als Freiberufler*in meldest du dich in der Regel nur beim Finanzamt an und bist von der Gewerbesteuer befreit. Verkaufst du hingegen primär Waren (z. B. als Onlinehändler), musst du ein Gewerbe anmelden.
              </li>
              <li>
                <strong>Solo oder Kollektiv:</strong> Bist du alleine tätig, bist du Einzelunternehmer*in. Schließt ihr euch als Gruppe oder Band zusammen, gründet ihr automatisch eine Personengesellschaft, meist eine GbR (Gesellschaft bürgerlichen Rechts).
              </li>
              <li>
                <strong>Steuerliche Abgaben & Kleinunternehmerregelung:</strong> Um dir am Anfang viel Bürokratie zu ersparen, kannst du die Kleinunternehmerregelung nutzen. Wenn dein Umsatz im Vorjahr unter 25.000 € lag, musst du keine Umsatzsteuer (Mehrwertsteuer) ausweisen und abführen. Wichtig: Diese Grenze gilt nur für deine selbstständigen Einnahmen; ein eventueller Nebenjob (z. B. Minijob) zählt hier nicht mit rein.
              </li>
            </ul>
          </div>

          <div id="section-2" className="guide-section">
            <h2>2. Welche Förderprogramme gibt es?</h2>
            <p>
              Finanzieller Support ist essenziell, aber der Einstieg kann überfordernd sein. Erfahrungsgemäß ist es ratsam, erst mit kleineren Fördersummen zu üben, bevor man sich an große, komplexe Anträge wie den Musikfonds (bis zu 50.000 €) wagt.
            </p>
            <ul>
              <li>
                <strong>Wo gibt es Geld?</strong> Für unkommerzielle Indoor-Veranstaltungen (bis 800 Besucher) gibt es z. B. den Popmusik Veranstaltungszuschuss, der oft zwischen 1.500 € und 5.000 € liegt (bei großen Projekten im Folgejahr auch 10.000 € bis 20.000 €). Für junge Kreative (bis 27) in München gibt es kleine Einstiegsförderungen wie eduart K. (500 €). Lokale Projekte werden sehr gut durch das Stadtbezirksbudget (Bezirksausschüsse) finanziert.
              </li>
              <li>
                <strong>Tipps für den Antrag:</strong> Arbeite das Alleinstellungsmerkmal deines Projekts klar heraus. Ein wichtiger Erfahrungswert: "Schmiere den Entscheidern etwas Honig um den Bart" – mache deutlich, warum genau die Stadt München von deinem Projekt profitiert.
              </li>
              <li>
                <strong>Auszahlung & Nutzung:</strong> Förderungen (wie die Pop-Förderung) eignen sich hervorragend, um gezielt Musiker*innen-Gagen zu decken, während andere Kosten anderweitig refinanziert werden. Die Gelder werden oft in zwei Raten gezahlt: die Hälfte vorab, die Hälfte danach.
              </li>
            </ul>
          </div>

          <div id="section-3" className="guide-section">
            <h2>3. Welche Locations kann ich für welches Event anmieten?</h2>
            <p>
              München bietet von teuren Event-Lofts bis hin zu kostenfreien Freiräumen alles.
            </p>
            <ul>
              <li>
                <strong>Kostenlose / Kuratierte Räume:</strong> Es gibt unkommerzielle, kuratierte Räume wie das Köşk, für die keine Miete anfällt, die aber einen Bewerbungsprozess voraussetzen und für alle offen sein müssen (Eintritt frei bzw. Spende).
              </li>
              <li>
                <strong>Günstige Stadtteilkultur:</strong> Orte wie das Kulturhaus Milbertshofen oder das SBZ am Hart bieten sehr günstige Tarife. Die durchschnittlichen Mietkosten für Gruppenräume oder kleine Ateliers (z. B. Yarko, FABINESA) liegen meist zwischen 4 € und 60 € pro Stunde.
              </li>
            </ul>
            <p>
              Bei größeren kommerziellen Locations (Tagesmieten) bist du schnell bei mehreren Hundert bis Tausend Euro.
            </p>
          </div>

          <div id="section-4" className="guide-section">
            <h2>4. Event mit Gastkünstlern – Welche Gagen muss ich einplanen?</h2>
            <p>
              Im Subkulturbetrieb sind durchschnittliche Bezahlungen (wie man sie etwa auf Glassdoor findet) nicht repräsentativ. Für performative Künstler*innen sollte in der Regel ein Budget von mindestens 250 € bis 500 € pro Act eingeplant werden, ggf. zuzüglich Anfahrtskosten. Es gibt hier jedoch keine genauen Regeln. Oft schließen sich Künstlerinnen deinem Projekt an, wenn sie es für unterstützenswert halten – eine informelle Kontaktaufnahme ist hier häufig der beste Weg. Bei <strong>bildnerischen Künstlerinnen</strong> ist es wichtig zu wissen, dass Galerien bei Verkäufen häufig mit einer Provision von mindestens 10 % arbeiten. MIAAC rät dringend davon ab, an Veranstaltungen teilzunehmen, bei denen Künstler*innen alles auf Selbstkosten machen und Ausstellungsgebühren zahlen müssen – es sei denn, man ist bereits etabliert genug, dass fest mit rentablen Verkaufszahlen zu rechnen ist.
            </p>
          </div>

          <div id="section-5" className="guide-section">
            <h2>5. Wann macht Werbung für mich Sinn und was kostet sie?</h2>
            <p>
              Allgemein gilt: Bevor du viel Geld für klassische Werbung ausgibst, setze auf Community-Building und informelle Netzwerke. Die Erfahrung zeigt, dass direkte Kontaktaufnahmen und gut strukturierte Kooperationen in der Subkultur oft wertvoller sind als teure Anzeigenkampagnen.
            </p>
          </div>

          <div id="section-6" className="guide-section">
            <h2>6. Wie vertreibe ich meine Kunst, Merch oder Spendenplattformen?</h2>
            <ul>
              <li>
                <strong>Spenden & Support:</strong> Wenn du deine Community um Support bitten willst, sind Plattformen wie Ko-Fi oder Buy Me a Coffee ideal für einmalige Spenden, da Nutzer*innen nicht zwingend einen Account anlegen müssen, was die Hürde senkt. Patreon ist extrem beliebt und etabliert für monatliche Abos, schreckt aber manche durch den Account-Zwang ab.
              </li>
              <li>
                <strong>Merch-Vertrieb:</strong> Bandcamp eignet sich gut, allerdings musst du hier Verpackung und Versand komplett selbst übernehmen. Wenn du Print-on-Demand nutzen willst, ist Shopify extrem stark, da es sich direkt in dein Spotify-Künstlerprofil integrieren lässt und du dich nicht um das Lagern von Boxen kümmern musst. Alternativ bietet sich Amazon Merch on Demand an (keine monatlichen Gebühren).
              </li>
              <li>
                <strong>Druckmethoden für eigenen Merch:</strong>
                <ul className="nested-list">
                  <li><strong>Siebdruck:</strong> Super für hohe Stückzahlen und langlebige Qualität (z. B. in offenen Werkstätten wie der Silberfabrik umsetzbar).</li>
                  <li><strong>DTF (Direct-to-Film):</strong> Funktioniert auf fast allen Stoffen (auch Polyester), ist schnell in der Produktion, das Motiv kann sich aber etwas schwerer/dicker anfühlen.</li>
                  <li><strong>DTG (Direct-to-Garment):</strong> Ideal für 100 % Baumwolle und sehr detailreiche Designs. Fühlt sich weicher an, da die Tinte in den Stoff eindringt.</li>
                </ul>
              </li>
            </ul>
            <p>Weitere Details und Anlaufstellen findest du in der Kategorie “Merch manufacturing” im Reiter “Resources”.</p>
          </div>
        </>
      ) : (
        <>
          <p className="intro-text">
            I wrote this guide to compactly and understandably summarize the most important basics for aspiring artists and cultural workers. A beginner-friendly overview without unnecessary complexity.
          </p>

          <ol className="table-of-contents">
            <li><a href="#section-1" onClick={(e) => scrollToSection(e, 'section-1')}>Solo vs. Collective – Which legal form is right for me?</a></li>
            <li><a href="#section-2" onClick={(e) => scrollToSection(e, 'section-2')}>What funding programs are there?</a></li>
            <li><a href="#section-3" onClick={(e) => scrollToSection(e, 'section-3')}>Which locations can I rent for which events?</a></li>
            <li><a href="#section-4" onClick={(e) => scrollToSection(e, 'section-4')}>What fees are normal?</a></li>
            <li><a href="#section-5" onClick={(e) => scrollToSection(e, 'section-5')}>When does advertising make sense for me?</a></li>
            <li><a href="#section-6" onClick={(e) => scrollToSection(e, 'section-6')}>Art sales, merch and donation platforms</a></li>
          </ol>

          <div id="section-1" className="guide-section">
            <h2>1. Solo vs Collective? – Which legal form is right for me?</h2>
            <p>
              Starting a professional creative career often raises formal questions. Basically, a distinction is made between liberal professions (e.g. artists, writers, teachers) and tradespeople (e.g. merchants).
            </p>
            <ul>
              <li>
                <strong>Self-employment vs. Trade:</strong> As a freelancer, you usually only register with the tax office and are exempt from trade tax. However, if you primarily sell goods (e.g. as an online retailer), you must register a trade.
              </li>
              <li>
                <strong>Solo or Collective:</strong> If you work alone, you are a sole proprietor. If you join together as a group or band, you automatically form a partnership, usually a GbR (civil law partnership).
              </li>
              <li>
                <strong>Taxes & Small business regulation:</strong> To save yourself a lot of bureaucracy at the beginning, you can use the small business regulation. If your revenue in the previous year was under €25,000, you do not have to show or pay value added tax (VAT). Important: This limit only applies to your self-employed income; any part-time job (e.g. mini-job) does not count towards this.
              </li>
            </ul>
          </div>

          <div id="section-2" className="guide-section">
            <h2>2. What funding programs are there?</h2>
            <p>
              Financial support is essential, but getting started can be overwhelming. Experience shows it is advisable to practice with smaller funding amounts before tackling large, complex applications like the Musikfonds (up to €50,000).
            </p>
            <ul>
              <li>
                <strong>Where is the money?</strong> For non-commercial indoor events (up to 800 visitors), there is the pop music event grant, which often ranges between €1,500 and €5,000 (for large projects in the following year also €10,000 to €20,000). For young creatives (up to 27) in Munich, there are small entry-level grants like eduart K. (€500). Local projects are very well funded through the district committee budget (Bezirksausschüsse).
              </li>
              <li>
                <strong>Tips for the application:</strong> Clearly highlight the unique selling point of your project. An important piece of experience: "Butter up the decision-makers a bit" – make it clear exactly why the city of Munich benefits from your project.
              </li>
              <li>
                <strong>Payout & Usage:</strong> Funding (such as the Pop funding) is excellent for specifically covering musicians' fees, while other costs are refinanced elsewhere. The funds are often paid in two installments: half in advance, half afterwards.
              </li>
            </ul>
          </div>

          <div id="section-3" className="guide-section">
            <h2>3. Which locations can I rent for which events?</h2>
            <p>
              Munich offers everything from expensive event lofts to free open spaces.
            </p>
            <ul>
              <li>
                <strong>Free / Curated spaces:</strong> There are non-commercial, curated spaces like the Köşk, which are rent-free but require an application process and must be open to everyone (free entry or donation).
              </li>
              <li>
                <strong>Affordable district culture:</strong> Places like the Kulturhaus Milbertshofen or the SBZ am Hart offer very cheap rates. The average rental costs for group rooms or small studios (e.g. Yarko, FABINESA) are mostly between 4 € and 60 € per hour.
              </li>
            </ul>
            <p>
              For larger commercial locations (daily rentals) you can easily reach several hundred to thousands of euros.
            </p>
          </div>

          <div id="section-4" className="guide-section">
            <h2>4. Event with guest artists – What fees do I need to plan for?</h2>
            <p>
              In the subculture sector, average payments (as found on Glassdoor, for example) are not representative. For performative artists, a budget of at least €250 to €500 per act should usually be planned, possibly plus travel expenses. However, there are no exact rules here. Often artists join your project if they think it is worth supporting – an informal contact is often the best way here. For <strong>visual artists</strong>, it is important to know that galleries often work with a commission of at least 10% on sales. MIAAC strongly advises against participating in events where artists do everything at their own expense and have to pay exhibition fees – unless you are already established enough to confidently expect profitable sales figures.
            </p>
          </div>

          <div id="section-5" className="guide-section">
            <h2>5. When does advertising make sense for me?</h2>
            <p>
              As a general rule: Before you spend a lot of money on classic advertising, focus on community building and informal networks. Experience shows that direct contact and well-structured collaborations in the subculture are often more valuable than expensive ad campaigns.
            </p>
          </div>

          <div id="section-6" className="guide-section">
            <h2>6. How do I distribute my art, merch or donation platforms?</h2>
            <ul>
              <li>
                <strong>Donations & Support:</strong> If you want to ask your community for support, platforms like Ko-Fi or Buy Me a Coffee are ideal for one-off donations because users don't necessarily have to create an account, which lowers the hurdle. Patreon is extremely popular and established for monthly subscriptions, but deters some people because of the account requirement.
              </li>
              <li>
                <strong>Merch Distribution:</strong> Bandcamp is suitable, but you have to handle packaging and shipping completely yourself here. If you want to use print-on-demand, Shopify is extremely powerful because it can be integrated directly into your Spotify artist profile and you don't have to worry about storing boxes. Alternatively, Amazon Merch on Demand is an option (no monthly fees).
              </li>
              <li>
                <strong>Printing methods for own merch:</strong>
                <ul className="nested-list">
                  <li><strong>Screen printing:</strong> Great for high volumes and long-lasting quality (e.g. feasible in open workshops like the Silberfabrik).</li>
                  <li><strong>DTF (Direct-to-Film):</strong> Works on almost all fabrics (including polyester), is fast in production, but the motif can feel a bit heavier/thicker.</li>
                  <li><strong>DTG (Direct-to-Garment):</strong> Ideal for 100% cotton and very detailed designs. Feels softer as the ink penetrates the fabric.</li>
                </ul>
              </li>
            </ul>
            <p>You can find more details and contact points in the “Merch manufacturing” category in the “Resources” tab.</p>
          </div>
        </>
      )}
    </div>
  );
}
