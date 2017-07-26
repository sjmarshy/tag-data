const rawData = require('./data/2017-07-26-tictag.json')
const parse = require('date-fns/parse')
const fs = require('fs')

console.log(Object.keys(rawData[0]))
console.log(rawData[0]['tag-set'])
console.log(parse(rawData[0].ts).valueOf())

const data = rawData.map(r => ({ tags: r.tags, time: parse(r.ts).valueOf() }))

const csvRows = data
    .sort((a, b) => a.time - b.time)
    .reduce((rows, d) => rows.concat(`"${d.time}": "${d.tags}"`), [])

fs.writeFile(
    './data/2017-07-26-tictag-clean.json',
    `{\n${csvRows.join(',\n')}\n}`,
    err => {
        if (err) {
            console.error(err)
        } else {
            console.log('success!')
        }
    },
)
