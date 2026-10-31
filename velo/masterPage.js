import wixLocation from 'wix-location';
// Embed HTML iframes are sandboxed, so links inside them post a message and we navigate here.
$w.onReady(function () {
  $w('HtmlComponent').onMessage(function (event) {
    var d = event.data;
    if (d && typeof d.bvaGo === 'string' && d.bvaGo.charAt(0) === '/') { wixLocation.to(d.bvaGo); }
  });
  // Home has its own menu in the video header; hide the site menu there.
  if (wixLocation.path.length === 0) { $w('#menu1').collapse(); }
  // The site header is redundant on Home (the video section carries its own logo and menu).
  if (wixLocation.path.length === 0) { $w('#section3').collapse(); }
});
