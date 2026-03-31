export default function Home() {
  return (
    <>
      <div className="home-flex-container">
        <div id="tagline">
          <p style={{ textAlign: 'center', marginBottom: '20px' }}>
            <a href="https://ko-fi.com/munichinartsandculture" target="_blank" rel="noopener noreferrer" style={{ color: '#7b415f', fontSize: '40px', textDecoration: 'none', fontWeight: 260 }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>Support the project</a>
          </p>
          <p>
            Munich in Arts and Culture (MIAAC) is an <strong>independent platform</strong> showcasing Munich’s <strong>creative scene</strong>, including <strong>events, art, jobs, spaces, and resources</strong>, with a focus on alternative culture.
          </p>
          <p>
            It collaborates with local artists to <strong>increase visibility</strong> and support cultural exchange and networking.
          </p>
          <p>
            MIAAC is <strong>privately run</strong> and not affiliated with any organizations. Content is provided <strong>without guarantee</strong> and may contain errors or subjective descriptions.
          </p>
          <p>
            No liability is assumed for listings or external links. Responsibility lies with organizers or third parties. AI-generated content may be inaccurate. Content can be removed upon request.
          </p>
        </div>
        <img src="./images/MIAAC_Logo.png" alt="MIAAC Artwork" className="figure hide-on-mobile" />
        <img src="./images/MIAAC_Logo_mobile.png" alt="MIAAC Artwork Mobile" className="figure show-on-mobile" />
      </div>
    </>
  );
}
