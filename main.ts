import fs from "fs"
import puppeteer from "puppeteer"
import iconv from "iconv-lite"
import * as readline from "node:readline/promises"

async function convertHtmlToPdf(
  htmlFilePath: string,
  outputPdfPath: string
): Promise<void> {
  // Read the HTML file content with ISO-8859-2 encoding
  const htmlBuffer = fs.readFileSync(htmlFilePath) // Read as a buffer
  const htmlContent = iconv.decode(htmlBuffer, "ISO-8859-2") // Decode to the correct encoding

  // Launch a headless browser
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Set the content of the page to the decoded HTML file
  await page.setContent(htmlContent, { waitUntil: "networkidle0" })

  // Generate PDF from the page content
  await page.pdf({
    path: outputPdfPath, // Save the PDF to this path
    format: "A4", // Set the PDF format
    printBackground: true, // Print the background of the page (CSS styles)
  })

  // Close the browser
  await browser.close()

  console.log(`PDF generated successfully at: ${outputPdfPath}`)
}

async function main() {
  // get dir from user:
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const dir = await rl.question("Enter the directory: ")

  const info = fs.readdirSync(dir).filter((file) => file.endsWith(".html"))
  console.log(info.length, "files found")
  if (info.length === 0) {
    console.log("No .html files found")
    return
  }

  fs.mkdirSync(dir + "/pdf", { recursive: true })

  for (const file of info) {
    const htmlFilePath: string = dir + "/" + file // Path to the HTML file
    const outputPdfPath: string = dir + "/pdf/" + file.replace(".html", ".pdf") // Path where the PDF will be saved
    await convertHtmlToPdf(htmlFilePath, outputPdfPath)
  }

  return
}

main()
// Example usage:
const htmlFilePath: string = "./W20240802_276376001001.html" // Path to the HTML file
const outputPdfPath: string = "output.pdf" // Path where the PDF will be saved
// convertHtmlToPdf(htmlFilePath, outputPdfPath)
