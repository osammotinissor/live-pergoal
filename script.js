// ID del Google Sheet
const SHEET_ID = "1ytpQd1sg3aWR6fPmKds3uxFH6IzSr4Yhnax1zNp0ZiI";
const SHEET_NAME = "live";

// URL API Visualization (ritorna JSON mascherato)
const API_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

async function loadSheetData() {
    const response = await fetch(API_URL);
    const text = await response.text();

    // La risposta ha formati strani, togliamo il wrapper "google.visualization"
    const json = JSON.parse(text.substring(47, text.length - 2));

    // Estraggo colonne e righe
    const cols = json.table.cols.map(c => c.label);
    const rows = json.table.rows.map(r => r.c.map(c => c ? c.v : ""));

    // Popolo la tabella HTML
    renderTable(cols, rows);

    // Inizializzo DataTables
    $("#table").DataTable({
        pageLength: 25,
        scrollX: true,
        responsive: true
    });
}

function renderTable(cols, rows) {
    const thead = document.querySelector("#table thead tr");
    const tbody = document.querySelector("#table tbody");

    // Crea intestazioni
    thead.innerHTML = "";
    cols.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        thead.appendChild(th);
    });

    // Crea righe
    tbody.innerHTML = "";
    rows.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

// Carica i dati quando la pagina è pronta
document.addEventListener("DOMContentLoaded", loadSheetData);
