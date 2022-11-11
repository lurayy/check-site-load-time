function start() {
    button = document.getElementById('start-btn')
    button.style.display = "none";
    table = document.getElementById('main-table')
    table.style.display = "block";
    start_benchmark()
}

function start_benchmark() {
    sites = [
        "https://www.claranet.com",
        "https://www.claranet.de",
        "https://www.claranet.co.uk",
        "https://www.claranet.fr",
        "https://www.claranet.nl",
        "https://www.claranet.es",
        "https://www.claranet.pt",
        "https://www.python.org"
    ]
    table = document.getElementById('table-body')
    sites.forEach(site => {
        row = table.insertRow(-1);
        site_cell = row.insertCell(0);
        benchmark_msg_cell = row.insertCell(1);
        site_cell.innerHTML = site
        benchmark_and_update(site, benchmark_msg_cell);
    });

    button = document.getElementById('restart-btn')
    button.style.display = "block";

}

async function benchmark_and_update(site, benchmark_msg_cell) {
    data = { 'site': site }
    fetch("/api/benchmark_site/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        data = await (response.json());
        data = data['data']
        if (data['status']) {
            benchmark_msg_cell.innerHTML = data['time']
        } else {
            benchmark_msg_cell.innerHTML = data['msg']
        }
    }).catch((error) => {
        console.log(error)
    })
}

function redo() {
    tableBody = document.getElementById("table-body");
    var child = tableBody.lastElementChild;
    while (child) {
        tableBody.removeChild(child);
        child = tableBody.lastElementChild;
    }
    start_benchmark()
}