const fs = require('fs')
const path = require('path')
const marked = require('marked')

marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value
  }
})

const data = fs.readFileSync(path.resolve(__dirname, '../README.MD'), 'utf-8')
const sections = data.split(/^(?=#+)/mg)
const result = marked(sections[0]) + sections.slice(1).map((section) => {
  const matched = /^##\s+([^\n]+)(\n+)([\w\W]*)/.exec(section)
  const title = matched[1]
  const content = matched[3].split('* React')
  const vue = marked(content[0].substring(5).trim())
  const react = marked(content[1].trim())
  return `
  <div class="section">
    <h2 class="title">${title}</h2>
    <div class="content">
      <div class="left">
        <h3 class="title">Vue</h3>
        <div class="content">${vue}</div>
      </div>
      <div class="right">
        <h3 class="title">React</h3>
        <div class="content">${react}</div>
      </div>
    </div>
  </div>
  `
}).join('')

const html =
`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>React和Vue特性和书写差异</title>
  <link rel="stylesheet" href="./theme.css"/>
  <link rel="stylesheet" href="./style.css"/>
</head>
<body>
  <div class="main">
    ${result}
  </div>
  <div class="footer">
    <a href="https://github.com/ecfexorg/difference-between-vue-and-react">Github</a>
  </div>
</body>
</html>
`

fs.writeFileSync(path.resolve(__dirname, '../index.html'), html, 'utf-8')
