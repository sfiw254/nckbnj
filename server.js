const fs = require("fs")
const path = require("path")
const express = require("express")
const app = express()

app.use("/", express.static(__dirname))

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font-family: sans-serif; font-size: 15px; margin: 10px; }
      ul { padding-left: 18px; margin: 4px 0; }
      li { margin: 4px 0; }
      a { text-decoration: none; }
      @media (max-width: 600px) {
        body { font-size: 17px; }
        li { margin: 8px 0; }
      }
    </style>
  </head>
  <body><b>root/</b>${getTree(__dirname)}</body>
</html>`)
})

app.listen(3000, () => {
  console.log("Server is running on port 3000...")
})

function getTree(dir) {
  const ignored = ["node_modules", ".git", "index.html", "public"]
  const items = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((item) => !ignored.includes(item.name))
    .map((item) => {
      const fullPath = path.join(dir, item.name)
      if (item.isDirectory()) {
        const subTree = getTree(fullPath)
        return subTree ? `<li><b>${item.name}/</b>${subTree}</li>` : null
      }
      if (item.name.toLowerCase().endsWith(".html")) {
        const url = path.relative(__dirname, fullPath).replace(/\\/g, "/")
        return `<li><a href="./${encodeURI(url)}">${item.name}</a></li>`
      }
      return null
    })
    .filter(Boolean)

  return items.length > 0 ? `<ul>${items.join("")}</ul>` : ""
}
