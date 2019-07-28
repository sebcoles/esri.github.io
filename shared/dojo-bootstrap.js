let path;
if(location.pathname.indexOf("index.html") > -1)
  path = `${location.pathname.replace(/\/[^/]+$/, "")}/`
else
  path = `${location.pathname.replace(/\/[^/]+$/, "")}`

dojoConfig = {
  isDebug: false,
  parseOnLoad: true,
  paths: {
    app: `${path}app`,
    lib: `${path}../../lib`,
    shared: `${path}../../shared`,
  }
};