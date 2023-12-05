/* eslint-disable no-unused-vars */
const { googleFormsToJson } = require('react-google-forms-hooks')
const fs = require('fs')
const path = require('path')
const prettier = require('prettier')

// Close Event Form direct link
const SatisfactionFormEn = 'https://forms.gle/iSSQex7xkiWUeKsT7'
const SatisfactionFormEs = 'https://forms.gle/w9vVFPaxKgwfLYKZ8'
const SatisfactionFormPt = 'https://forms.gle/dBwncUPfkhXrWcF49'

// Set active form name
const ACTIVE_FORM_NAME = 'SatisfactionForm'
// Select active form language
const ACTIVE_FORM_LANG = 'Es'

const activeForm = {
  En: SatisfactionFormEn,
  Es: SatisfactionFormEs,
  Pt: SatisfactionFormPt,
}[ACTIVE_FORM_LANG]

// Save JSON to file
const saveJsonToFile = (filename, json) => {
  console.log('\x1b[33m%s\x1b[0m', `Saving ${filename} file...`)
  const formated = prettier.format(JSON.stringify(json), { semi: false, parser: 'json' })
  const filePath = path.resolve(__dirname, filename)
  fs.writeFile(filePath, formated, 'utf8', function (err) {
    if (err) throw err
    console.log('\x1b[32m%s\x1b[0m', `${filename} file saved successfully!`)
  })
}

// Create JSON from Google Form
const run = async () => {
  try {
    const result = await googleFormsToJson(activeForm)
    console.log('\x1b[36m%s\x1b[0m', 'Google Forms converted to JSON!')
    saveJsonToFile(`${ACTIVE_FORM_NAME}${ACTIVE_FORM_LANG}.json`, result)
    console.log('\x1b[32m%s\x1b[0m', 'Google Form saved to file!')
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err)
  }
}

run()
