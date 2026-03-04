import { useState } from 'react'

const content = {
  residencies: [
    { title: "Artist in Residence", desc: "As part of the City of Munich's artist-in-residence initiative, artists, curators, and researchers from around the world are offered accommodation, workspace, financial support, and the opportunity to create, present their work, reflect, and engage in critical exchange.", link: "https://www.artistinresidence-munich.de/" },
    { title: "Halle 6", desc: "Since July 2023, HALLE 6 has offered guest studios and housing for international artists in Munich. Supported by the City of Munich and other institutions, it promotes artistic exchange through residencies, symposia, and the Artist at Risk program. Booking is semiannual.", link: "https://www.halle6.net/residenz" },
    { title: "Kunstverein München", desc: "The Writers Residency supports authors, critics, and artists whose work centers on writing. In partnership with Kunstverein München, it offers housing, a stipend, and public readings to foster exchange, reflection, and fiction beyond traditional exhibition spaces. The focus is time and space to write.", link: "https://www.kunstverein-muenchen.de/de/programm/writers-residency" },
    { title: "Schafhof", desc: "As part of the European Art Fellowship, Schafhof hosts artists from across Europe for one to three months. In exchange, artists from Upper Bavaria stay abroad. The program fosters European exchange and enriches regional cultural life.", link: "https://www.schafhof-kunstforum.de/Residenzprogramm/" },
  ],
  studios: [
    { title: "Atelierhaus Baumstraße", desc: "Around 50 artists from fields like visual arts, architecture, stage design, and jewelry work at Atelierhaus Baumstraße. Spaces are awarded every five years by jury selection. Located in Glockenbachviertel, the house opens annually for public studio visits.", link: "https://www.atelierhaus-baumstrasse.com/" },
    { title: "BBK - Atelierbörse", desc: "This page lists current studio offers. You can also publish your own offer or request. Ads are deleted after 3 months. Munich's Cultural Department supports artists with subsidized studios and rent grants every three years.", link: "https://bbk-muc-obb.de/aktuelles/atelierboerse/" },
    { title: "Eventlocation.com", desc: "eventlocations.com is an international platform for marketing event spaces and finding the perfect venue. Unlike others, it's commission-free, allowing direct contact between hosts and organizers. It's operated by Elbgoods GmbH, which also runs related platforms like eventcatering.com and eventbook.com.", link: "https://www.eventlocations.com/de/munchen-atelier" },
    { title: "Gabriele Space", desc: "GABRIELE SPACE is an IMAL project offering free studios, workshops, and exhibition space for young artists in Munich. It supports artistic production, skill-sharing, and community exchange through non-commercial, participatory use of vacant buildings. The focus lies on empowerment, experimentation, and neighborhood engagement.", link: "https://www.gabriele-space.de/gabi3/uber-uns/" },
    { title: "H.ALLE", desc: "The H.ALLE for ALL offers open workshops every Saturday from 14:00–18:00. Activities include a repair workshop with shared tools, rotating artistic workshops (e.g. printmaking, ceramics, upcycling), and an open studio space for collaborative or independent creative work. Some workshops are family-friendly.", link: "https://imalrepaircafe.wordpress.com/samstag/" },
    { title: "HALLE 6 ", desc: "HALLE 6 offers temporary workspaces for artists needing room for large-scale projects, rehearsals, or stage design. Available spaces include a multifunctional workshop and three studios with ground-level access, heating, Wi-Fi, and optional equipment. Spaces are flexible and can be adapted to individual project needs.", link: "https://www.halle6.net/studio-vermietung" },
    { title: "Haus2 e.V.", desc: "Haus2 e.V. is a collaborative initiative at KreativLabor, offering spaces (24–42 m²) for art, culture, and cultural education. Rooms are allocated through a jury process, with rents currently at commercial rates. The long-term goal is to create more affordable conditions for cultural workers.", link: "http://haus2.net/raumvergabe/" },
    { title: "ImmoScout24", desc: "Bru, you know what that is.", link: "https://www.immobilienscout24.de/gewerbe-flaechen/de/bayern/muenchen/atelier-mieten/" },
    { title: "Isar Atelier", desc: "Rent your own studio space and join the Isar Atelier community in Munich's Dreimühlenviertel. The 100 m² space includes two studios, a cozy kitchen, and bathroom. One flexible spot in the shared 40 m² room is currently available. Warm, well-equipped, and close to the Isar.", link: "https://www.farbraum-muenchen.de/dein-atelierplatz-1/" },
    { title: "Kleinanzeigenr", desc: "Kleinanzeigen with the appropriate filters to find places within the city limits of Munich.", link: "https://www.kleinanzeigen.de/s-immobilien/muenchen/anzeige:angebote/preis::750/atelier-/k0c195l6411r14" },
    { title: "KUNSTLABOR 2", desc: "KUNSTLABOR 2, in partnership with super+, offers 40 studios for creatives on a 1,300 m² floor in Munich's Dachauerstraße 90. Located above exhibition spaces, the studios support cross-genre collaboration and host Open Studios twice a year. Sizes range from 13–60 m².", link: "https://kunstlabor.org/kunst/atelier-mieten-muenchen/" },
    { title: "Leonrod-Haus", desc: "Since 2011, the Leonrod-Haus für Kunst und Film has united various art forms under one roof at Leonrodplatz. In 2024, artists founded an official association to promote artistic visibility. Open Studios will take place during the Kreativquartier Festival.", link: "https://www.leonrod-haus.de/kontakt/" },
    { title: "Otto-Steidle-Ateliers", desc: "The Otto-Steidle-Ateliers, located beneath the pedestrian bridge on Ganghoferstraße, offer 30 m² studio spaces on five-year terms. Founded in 2006, the project is supported by FONDARA, the City of Munich, and includes scholarships from local foundations. Named after architect Otto Steidle.", link: "https://akademieverein.de/steidle-ateliers/" },
    { title: "PLATFORM", desc: "The PLATFORM studios are located in a former industrial building in Munich-South, near Aidenbachstraße U-Bahn. On a 2,000 m² floor, 23 bright studios host 40 professional artists, selected through an application process. Managed by Münchner Arbeit gGmbH.", link: "https://www.platform-muenchen.de/ateliers/" },
    { title: "quoka", desc: "QUOKA is a free online classifieds platform for buying and selling locally or nationwide. Users can find everything from second-hand items to nearly new goods, and post their own ads easily and for free.", link: "https://www.quoka.de/anzeigen/immobilienmarkt/vermietungen/vermietung-ateliers-uebungsraeume/bayern/muenchen/?utm_source=chatgpt.com" },
    { title: "Stadt München", desc: "The City of Munich provides spaces for artists to create and present their work through its cultural funding programs.", link: "https://stadt.muenchen.de/infos/raeume-fuer-kultur.html" },
  ],
  locations: [
    { title: "Abraxas Musical Akademie", desc: "Offers hourly rentals of five studios for private lessons, courses, auditions, and rehearsals. Ideal for dance, singing, or acting, with spaces ranging from 72 m² to 170 m², equipped with mirrored walls.", link: "https://abraxas-musical-akademie.de/service#saalvermietung" },
    { title: "Atelierhaus Baumstraße", desc: "Located in a former factory, this 100 m² venue is ideal for seminars, dance, and creative workshops. Available for nonprofits, course leaders, and local groups. Equipped with a kitchenette. Private celebrations are not permitted.", link: "https://www.glockenbachwerkstatt.de/raeume-mieten/atelierhaus-baumstrasse/" },
    { title: "Einsatz Club", desc: "Versatile event space with two rooms and outdoor area, available for private parties, concerts, and workshops. Rental packages range from hourly to full-day options, with flexible pricing based on group size and event type.", link: "https://www.einsatz.club/" },
    { title: "Einstein Kultur", desc: "Einstein Kultur offers four fully equipped halls in central Munich, suitable for theater, concerts, workshops, and private events. Spaces accommodate up to 200 guests, available for rent from September to July with flexible arrangements and professional support.", link: "https://www.einsteinkultur.de/hallen/" },
    { title: "Fat Cat", desc: "Fat Cat offers a range of flexible spaces for concerts, readings, theater, and workshops. Venues include concert halls, seminar rooms, and a multipurpose space for up to 70 people. Booking inquiries via email.", link: "https://fatcat-muc.de/venues/" },
    { title: "Feierwerk", desc: "Feierwerk provides rental spaces at several locations across Munich, including Hansastraße, Funkstation, Südpolstation, and Trafixx. Suitable for events from private parties to corporate functions, with optional in-house catering and rehearsal rooms available.", link: "https://www.feierwerk.de/vermietung-catering" },
    { title: "Forum 2", desc: "Forum 2 offers a unique former cinema venue in Munich's Olympiadorf. Ideal for film screenings, concerts, and community events. Includes a 6×8 m stage, 88-seat hall, and gallery. Booking inquiries via email.", link: "https://www.kultur-forum2.de/vermietung/" },
    { title: "GABRIELE SPACE", desc: "GABRIELE SPACE offers free studios, workshops, and exhibition spaces for young artists in Munich. Locations are available temporarily through creative reuse of vacant buildings. Spaces support collaborative work, events, and public exhibitions.", link: "https://www.gabriele-space.de/gabi3/uber-uns/" },
    { title: "Giesinger Bahnhof", desc: "Centrally located venue offering flexible rooms for concerts, workshops, readings, and meetings. Equipped with stage, sound, video tech, and more. Catering is exclusively handled by the in-house Gleiswirtschaft restaurant. Booking via email or online form.", link: "https://giesinger-bahnhof.de/raum/" },
    { title: "Glockenbachwerkstatt Bürgerhaus", desc: "The Bürgerhaus provides centrally located rooms for cultural and volunteer events. Available Mondays and Tuesdays, 17:30–22:30, ideal for courses, meetings, and group activities. On-site food and drinks available at the Stadtteiltreff.", link: "https://www.glockenbachwerkstatt.de/raeume-mieten/" },
    { title: "Halle 6", desc: "HALLE 6 provides flexible studios and workspaces for artists and cultural workers. Spaces are available for workshops, rehearsals, large-format art, and events. Equipment, technical staff, and custom setups are available on request. Booking by email.", link: "https://www.halle6.net/studio-vermietung" },
    { title: "IMAL Musiktheater", desc: "IMAL Musiktheater offers a versatile stage for rehearsals, performances, and teaching. Artists can rent the space for short- or mid-term cultural projects. Booking inquiries via email are welcome for tailored use of the venue.", link: "https://imal-musiktheater.de/r-ume" },
    { title: "KÖŞK", desc: "KÖŞK is a 130 m² project-based art space run by Kreisjugendring München-Stadt. It offers temporary use for creative initiatives. Project proposals must be submitted by email for review and potential scheduling.", link: "https://www.koesk-muenchen.de/kontakt/" },
    { title: "Kulturhaus Milbertshofen", desc: "Kulturhaus Milbertshofen offers rooms for cultural projects, rehearsals, and meetings. Bookings must be submitted via the online form. Private events are only allowed in side rooms. Offers include music spaces, a main hall, and technical support.", link: "https://kulturhaus-milbertshofen.de/raeume-3/" },
    { title: "Kulturzentrum Trudering", desc: "Kulturzentrum Trudering invites visual artists to exhibit works for four-week periods. The venue provides exhibition support, PR, and installation assistance. Submissions with artwork samples can be emailed for consideration.", link: "https://www.kulturzentrum-trudering.de/kunst/ausstellungen-2/" },
    { title: "lieberscholli", desc: "Located in a repurposed paper factory, lieberscholli offers 600-capacity indoor and outdoor spaces for concerts, parties, and art events. Daily rentals include staff, cleaning, sound, and DJ equipment. Bookings via Eventlocations platform.", link: "https://www.eventlocations.com/de/venues/alte-papierfabrik-lieberscholli-space-for-art-club-and-culture-munich" },
    { title: "LIVE.EVIL", desc: "LIVE.EVIL is a 300-person live club with a bar, lounge, and stage. Also features a 300 m² terrace and 150-seat restaurant for events. Equipped with full AV tech and customizable rental options.", link: "https://www.eventlocations.com/de/venues/liveevil-munich" },
    { title: "Mucca", desc: "Mucca provides over 15 versatile rooms for artistic and cultural use, including studios, rehearsal spaces, music rooms, and the 150-capacity MUCCA Halle. Ideal for community-driven projects and creative group formats.", link: "https://www.mucca.org/rooms/" },
    { title: "Muffatwerk", desc: "Muffatwerk offers multiple spaces, including Muffathalle (642 m²), Ampere (340 m²), and studios for dance, theater, or workshops. Equipped with AV tech and ideal for concerts, readings, and multimedia events.", link: "https://www.muffatwerk.de/de/veranstalter_service/raume" },
    { title: "Pasinger Fabrik", desc: "Offers studios and event spaces for rehearsals, readings, and workshops. Studio 1 (120 m²) and Studio 2 (77.5 m²) are rentable. Event halls are available in rare cases due to internal programming.", link: "https://pasinger-fabrik.de/anmietung-von-raeumen/" },
    { title: "Pelkovenschlössl", desc: "This historic venue in Moosach offers barrier-free rooms for private events, theater, seminars, and readings. A separate hall and garden space at Hacklhaus is also rentable for up to 45 guests.", link: "https://www.pelkovenschloessl.de/feiern/" },
    { title: "Rossi's Glück", desc: "Located in Bahnwärter Atelierpark, this double-container venue with bar and outdoor area accommodates up to 80 guests. Offers full-service event packages and catering options for private gatherings.", link: "https://www.rossisglueck.org/" },
    { title: "Seidlvilla", desc: "Located in Werksviertel-Mitte, this venue includes whiteBOX (272 m²), Gastatelier (163 m²), and Flüsterkneipe (210 m²) for rehearsals, exhibitions, and workshops. Rooms offer industrial charm and flexible setups.", link: "https://www.seidlvilla.de/raeume" },
    { title: "Stadtteilkultur 2411", desc: "Located in Werksviertel-Mitte, this venue includes whiteBOX (272 m²), Gastatelier (163 m²), and Flüsterkneipe (210 m²) for rehearsals, exhibitions, and workshops. Rooms offer industrial charm and flexible setups.", link: "https://www.stadtteilkultur2411.de/" },
    { title: "Werksviertel-Mitte Kunst", desc: "Located in Werksviertel-Mitte, this venue includes whiteBOX (272 m²), Gastatelier (163 m²), and Flüsterkneipe (210 m²) for rehearsals, exhibitions, and workshops. Rooms offer industrial charm and flexible setups.", link: "https://werksviertel-kunst.de/raeume-und-vermietung/" },
    { title: "YOU Eventlocation", desc: "Club-style venue with 150 m² indoor & 30 m² outdoor space, ideal for birthdays, concerts & corporate events. Includes bar, stage, DJ booth, light/sound system, and various rental packages.", link: "https://www.you-muc.de/" },
    { title: "ZIRKA Studios", desc: "Creative venue with four units for production, events, or workshops. Located at Kreativquartier.", link: "https://www.eventlocations.com/de/venues/zirka-studios-munchen" },
  ]
}

export default function ArtSpaces() {
  const [activeCategory, setActiveCategory] = useState('residencies')

  const entries = content[activeCategory] || []

  return (
    <div className="title-box">
      <div className="date-selector" style={{ marginBottom: '2rem' }}>
        <button
          className={`category-btn${activeCategory === 'residencies' ? ' active' : ''}`}
          onClick={() => setActiveCategory('residencies')}
        >
          <span className="hyphenated">Resi&shy;dencies</span>
        </button>
        <button
          className={`category-btn${activeCategory === 'studios' ? ' active' : ''}`}
          onClick={() => setActiveCategory('studios')}
        >
          Art Studios
        </button>
        <button
          className={`category-btn${activeCategory === 'locations' ? ' active' : ''}`}
          onClick={() => setActiveCategory('locations')}
        >
          Event Locations
        </button>
      </div>

      <div id="event-feed" style={{ fontFamily: 'sans-serif', padding: '0px' }}>
        {entries.length === 0 ? (
          <p>No content found.</p>
        ) : (
          entries.map((entry, i) => (
            <div className="event-card" key={i}>
              <h3><a href={entry.link} target="_blank" rel="noopener noreferrer">{entry.title}</a></h3>
              <p className="event-description">{entry.desc}</p>
            </div>
          ))
        )}
      </div>

      <div className="social-links">
        <a href="https://t.me/munichinartsandculture" target="_blank" rel="noopener noreferrer" className="tg-link">Telegram</a>
        <a href="https://www.instagram.com/munichartsandculture/" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </div>
  )
}
