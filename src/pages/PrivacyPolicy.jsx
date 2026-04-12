import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="home-flex-container" style={{ padding: '2rem 1rem' }}>
      <div id="tagline" style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Privacy Policy for MUC Creative Bot</h1>
        
        <p><strong>Context</strong><br/>
          MUC Creative Bot is a content automation tool designed for the creative scene in Munich. Our platform shares public information—such as events, art spaces, and resources—via the LinkedIn API to help increase visibility and support cultural exchange.
        </p>

        <p><strong>Data Usage</strong><br/>
          We take your privacy seriously. <strong>NO personal data</strong> of LinkedIn users is stored by our application. The only information saved in our backend are LinkedIn OAuth Access Tokens, which are required strictly for the technical purpose of publishing posts on your behalf.
        </p>

        <p><strong>AI & Sourcing</strong><br/>
          The content we process is gathered from publicly available sources and carefully summarized using Artificial Intelligence. This process is designed to respect intellectual property and ensures that no copyrights are violated.
        </p>

        <p><strong>Revocation of Access</strong><br/>
          You are always in control of your account connection. Users can revoke our application's access at any time directly through their own LinkedIn security and privacy settings.
        </p>

        <p><strong>Contact</strong><br/>
          If you have any questions or concerns about this Privacy Policy, please contact us at:<br/>
          <a href="mailto:munichinartsandculture@gmail.com" style={{ color: '#7b415f', textDecoration: 'none', fontWeight: 'bold' }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>munichinartsandculture@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
