import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';

export default class MetaplexDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="loadforge-site-verification"
            content="2056680d2883a8b910880d53b9cb2ebf16e7b8f91e169cceddce62c4c4ef8fe6240748c08c2e3769e554e12dafcd5bfc62028638e6524a0efd7d729efd762d42"
          />

          {/* <!-- Primary Meta Tags --> */}
          <meta name="theme-color" content="#000000" />
          <title>SUPADROP – Invest in Culture</title>
          <meta name="title" content="SUPADROP – Invest in Culture" />
          <meta name="description" content="a curated NFT art & collectibles marketplace on Solana • connecting authentic artists and collectors." />

          {/* <!-- Open Graph / Facebook --> */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://supadrop.com/" />
          <meta property="og:title" content="SUPADROP – Invest in Culture" />
          <meta property="og:description" content="a curated NFT art & collectibles marketplace on Solana • connecting authentic artists and collectors." />
          <meta property="og:image" content="/img/metatag.png" />

          {/* <!-- Twitter --> */}
          <meta name="twitter:creator" content="@supadropnft" />
          <meta name="twitter:site" content="@supadropnft" />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://supadrop.com/" />
          <meta property="twitter:title" content="SUPADROP – Invest in Culture" />
          <meta property="twitter:description" content="a curated NFT art & collectibles marketplace on Solana • connecting authentic artists and collectors." />
          <meta property="twitter:image" content={"https://supadrop.com/img/metatag.png"} />

          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/favicon-96x96.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />

          <link rel="manifest" href="/manifest.json" />
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
            integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
            crossOrigin="anonymous"
          />

          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `(function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                (i[r] =
                  i[r] ||
                  function () {
                    (i[r].q = i[r].q || []).push(arguments);
                  }),
                  (i[r].l = 1 * new Date());
                (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m);
              })(
                window,
                document,
                'script',
                '<%=htmlWebpackPlugin.options.analyticsURL%>',
                'ga'
              );
              ga('create', 'UA-212819386-1', 'auto');
              ga('send', 'pageview');`}} />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            async
            src="https://platform.twitter.com/widgets.js"
            charSet="utf-8"
          />

          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                (function () {
                  var s = document.createElement("script");
                  s.src = "https://stackpile.io/stack_162299.js"; s.async = true;
                  var e = document.getElementsByTagName("script")[0]; e.parentNode.insertBefore(s, e);
                })();
          `,
            }}
          />
        </body>
      </Html>
    );
  }
}
