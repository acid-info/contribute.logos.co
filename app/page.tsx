export default function Page() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: "location.replace('/en/')",
        }}
      />
      <noscript>
        <a href="/en/">Continue to /en/</a>
      </noscript>
    </>
  )
}
