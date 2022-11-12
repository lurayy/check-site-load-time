var global_data = [];
function start() {
    document.getElementById('start-btn').style.display = "none";
    document.getElementById('main-table').style.display = "block";
    start_benchmark()
}

function start_benchmark() {
    document.getElementById('loading').style.display = "block";
    document.getElementById('restart-btn').style.display = "none";

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
        benchmark_and_update(site, table);
    });
    check_loading(table);
}

function check_loading(table) {
    if (8 != table.childElementCount) {
        setTimeout(check_loading, 200, table);
    } else {
        document.getElementById('loading').style.display = "none";
        button = document.getElementById('restart-btn')
        button.style.display = "block";
    }
}

async function benchmark_and_update(site, table) {
    toggle = document.getElementById('toggle-benchmark')
    data = { 'site': site, 'include_assets': toggle.checked }
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
            global_data.push(data)
            insertRow(data, table)
        } else {
            insertRow(data, table)
        }
    }).catch((error) => {
        console.log(error)
    })
}

function redo() {
    global_data = []
    clearTable()
    start_benchmark()
}

function clearTable() {
    table = document.getElementById('table-body')
    var child = table.lastElementChild;
    while (child) {
        table.removeChild(child);
        child = table.lastElementChild;
    }
}

function insertRow(res, table) {
    if (res['status']) {
        row = table.insertRow(-1);
        row.insertCell(0).innerHTML = res['site'];
        row.insertCell(1).innerHTML = res['time'];
        row.insertCell(2).innerHTML = res['size'];
    } else {
        row = table.insertRow(-1);
        row.insertCell(0).innerHTML = res['site'];
        speed_cell = row.insertCell(1)
        speed_cell.setAttribute('colspan', 2);
        speed_cell.innerHTML = data['msg']
    }
}

function sortDict(isAsc, sortBy) {
    for (var i = 0; i < global_data.length; i++) {
        for (var j = 0; j < (global_data.length - i - 1); j++) {
            value = isAsc ? global_data[j][sortBy] > global_data[j + 1][sortBy] : global_data[j][sortBy] < global_data[j + 1][sortBy]
            if (value) {
                var temp = global_data[j]
                global_data[j] = global_data[j + 1]
                global_data[j + 1] = temp
            }
        }
    }
    table = document.getElementById('table-body')
    clearTable()
    global_data.forEach(ele => {
        insertRow(ele, table)
    })
}

function sort_by(sort) {
    column = document.getElementById(sort + '-column')
    isAsc = column.dataset.sortAscending === 'true' ? false : true
    column.dataset.sortAscending = isAsc
    sortDict(isAsc, sort)
}


