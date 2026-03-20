async function loadLatestInstagramEmbed() {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/MunichInArtsandCulture/newInstaPost/main/shortcode.txt",
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Could not load shortcode.txt");
      }

      const shortcode = (await response.text()).trim();

      if (!shortcode) {
        throw new Error("shortcode.txt is empty");
      }

      const embedUrl = `https://www.instagram.com/p/${shortcode}/embed`;

      document.getElementById("latest-instagram-post").src = embedUrl;
    } catch (error) {
      console.error("Instagram embed could not be loaded:", error);
    }
  }

  loadLatestInstagramEmbed();
