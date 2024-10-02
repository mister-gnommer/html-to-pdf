"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const readline = __importStar(require("node:readline/promises"));
function convertHtmlToPdf(htmlFilePath, outputPdfPath) {
    return __awaiter(this, void 0, void 0, function* () {
        // Read the HTML file content with ISO-8859-2 encoding
        const htmlBuffer = fs_1.default.readFileSync(htmlFilePath); // Read as a buffer
        const htmlContent = iconv_lite_1.default.decode(htmlBuffer, "ISO-8859-2"); // Decode to the correct encoding
        // Launch a headless browser
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        // Set the content of the page to the decoded HTML file
        yield page.setContent(htmlContent, { waitUntil: "networkidle0" });
        // Generate PDF from the page content
        yield page.pdf({
            path: outputPdfPath, // Save the PDF to this path
            format: "A4", // Set the PDF format
            printBackground: true, // Print the background of the page (CSS styles)
        });
        // Close the browser
        yield browser.close();
        console.log(`PDF generated successfully at: ${outputPdfPath}`);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // get dir from user:
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const dir = yield rl.question("Enter the directory: ");
        const info = fs_1.default.readdirSync(dir).filter((file) => file.endsWith(".html"));
        console.log(info.length, "files found");
        if (info.length === 0) {
            console.log("No .html files found");
            return;
        }
        fs_1.default.mkdirSync(dir + "/pdf", { recursive: true });
        for (const file of info) {
            const htmlFilePath = dir + "/" + file; // Path to the HTML file
            const outputPdfPath = dir + "/pdf/" + file.replace(".html", ".pdf"); // Path where the PDF will be saved
            yield convertHtmlToPdf(htmlFilePath, outputPdfPath);
        }
        return;
    });
}
main();
// Example usage:
const htmlFilePath = "./W20240802_276376001001.html"; // Path to the HTML file
const outputPdfPath = "output.pdf"; // Path where the PDF will be saved
// convertHtmlToPdf(htmlFilePath, outputPdfPath)
