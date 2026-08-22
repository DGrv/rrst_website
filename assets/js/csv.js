// --------------------
// Minimal RFC 4180 CSV parser.
//
// The data files under assets/data/ are hand-edited, so fields get quoted as
// soon as they contain a comma:
//
//   Hanno Maier,hm.png,"Co-CEO - ... good tips, ask this legend !",Our wise old man
//
// A plain line.split(",") splits inside that quoted field, which truncates the
// text, leaves a stray " in the output and shifts every later column by one.
//
// Handles: quoted fields, commas and newlines inside quotes, "" as an escaped
// quote, CRLF or LF line endings, and trailing commas.
// --------------------
function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    let hasField = false; // distinguishes a real empty last field from EOF

    for (let i = 0; i < text.length; i++) {
        const c = text[i];

        if (inQuotes) {
            if (c === '"') {
                if (text[i + 1] === '"') { // "" -> literal quote
                    field += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                field += c;
            }
            continue;
        }

        if (c === '"') {
            inQuotes = true;
            hasField = true;
        } else if (c === ",") {
            row.push(field);
            field = "";
            hasField = false;
        } else if (c === "\n" || c === "\r") {
            if (c === "\r" && text[i + 1] === "\n") i++; // CRLF
            row.push(field);
            rows.push(row);
            row = [];
            field = "";
            hasField = false;
        } else {
            field += c;
            hasField = true;
        }
    }

    // Flush whatever is left over at end of input.
    if (hasField || field !== "" || row.length) {
        row.push(field);
        rows.push(row);
    }

    // Drop blank lines (including the trailing newline at end of file).
    return rows.filter(r => r.some(f => f.trim() !== ""));
}


// --------------------
// Parse a CSV into objects keyed by the header row.
// Empty header names (produced by a trailing comma in the header) are skipped.
// --------------------
function parseCSVObjects(text) {
    const rows = parseCSV(text);
    if (!rows.length) return [];

    const headers = rows.shift().map(h => h.trim());

    return rows.map(cols => {
        const obj = {};
        headers.forEach((h, i) => {
            if (!h) return; // trailing-comma column
            obj[h] = (cols[i] === undefined ? "" : cols[i]).trim();
        });
        return obj;
    });
}
