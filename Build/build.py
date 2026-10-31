"""Assemble each src/<page>.html body into a self-contained Wix Embed HTML page in pages/."""
import pathlib, re
root = pathlib.Path(__file__).parent
base = (root / "pages/_base.css").read_text().strip()
HEAD = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>{title}</title>\n'
        '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600'
        '&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap" rel="stylesheet">\n<style>\n{css}\n</style>\n</head>\n<body>\n')
BRIDGE = '<script>document.addEventListener("click",function(e){var a=e.target.closest?e.target.closest("a"):null;if(!a)return;var h=a.getAttribute("href")||"";if(a.target!=="_top"||h.charAt(0)!=="/")return;e.preventDefault();parent.postMessage({bvaGo:h},"*")},true)</script>\n'
TAIL = ('<script>\n(function(){var r=document.documentElement;if(!("IntersectionObserver" in window))return;'
        'r.classList.add("js");var io=new IntersectionObserver(function(es){es.forEach(function(e){'
        'if(e.isIntersecting){e.target.classList.add("is-in");io.unobserve(e.target);}});},'
        '{threshold:.15,rootMargin:"0px 0px -6% 0px"});'
        'document.querySelectorAll(".rv,.mk").forEach(function(el){io.observe(el);});'
        'var n=0,ko=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add(e.target.dataset.kb);ko.unobserve(e.target);}});},{threshold:.2});'
        'document.querySelectorAll("img").forEach(function(im){if(im.closest(".no-kb"))return;im.dataset.kb=(n++%2?"kb-out":"kb-in");ko.observe(im);});})();\n</script>\n'
        '{script}'+BRIDGE+'</body>\n</html>\n')
for src in sorted((root / "src").glob("*.html")):
    s = src.read_text()
    title = re.search(r"<!--title:(.*?)-->", s).group(1).strip()
    css = re.search(r"<style>(.*?)</style>", s, re.S)
    js = re.search(r"<script>(.*?)</script>", s, re.S)
    body = re.sub(r"<!--title:.*?-->\n?|<style>.*?</style>\n?|<script>.*?</script>\n?", "", s, flags=re.S).strip()
    full = (HEAD.replace("{title}", title).replace("{css}", base + ("\n" + css.group(1).strip() if css else ""))
            + body + "\n" + TAIL.replace("{script}", ("<script>\n" + js.group(1).strip() + "\n</script>\n") if js else ""))
    (root / "pages" / src.name).write_text(full)
    print(src.name, len(full))
