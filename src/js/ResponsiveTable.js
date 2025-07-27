class ResponsiveTable {
    constructor(container) {
        this.container = container;

        if (!this.container) {
            alert(`Container with id '${containerId}' not found.`);
            return;
        }

        this.table = this.container.querySelector("table");

        if (!this.table) {
            console.error("No <table> found inside the container.");
            return;
        }

        this.headers = Array.from(this.table.querySelectorAll("thead th"));

        this.priorityMap = this.headers
            .map((th, index) => ({
                index,
                priority: parseInt(th.dataset.priority) || Infinity,
                isControl: "control" in th.dataset,
            }))
            .filter((h) => !h.isControl)
            .sort((a, b) => a.priority - b.priority);

        this.setup();
    }

    setup() {
        this.update();

        // this.setupExpandButtons();

        window.addEventListener("resize", () => this.update());
    }

    update() {
        var setupToggleButton = false;

        const width = this.container.offsetWidth;
        const hideCount =
            width > 900 ? 0 : width > 700 ? 1 : width > 500 ? 2 : 3;

        this.priorityMap.forEach((col, i) => {
            const shouldHide = i >= this.priorityMap.length - hideCount;

            this.toggleColumn(col.index, shouldHide);

            setupToggleButton = shouldHide;
        });

        if (hideCount > 0) {
            this.addButton();
        }
    }

    addButton() {
        const buttonCell = document.querySelectorAll('td[tabindex="0"]');
        const icon = `<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" transform="" id="injected-svg">
            <!-- Boxicons v3.0 https://boxicons.com | License  https://docs.boxicons.com/free -->
            <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z"/>
            <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"/>
        </svg>`;

        buttonCell.forEach((cell) => {
            const id = this.nanoid();
            var text = cell.innerHTML;
            var attribute = cell.getAttribute("data-toggle");

            if (!attribute) {
                cell.setAttribute("data-toggle", true);
                cell.innerHTML = `<span data-id="${id}">${icon}</span> ${text}`;

                this.addDetailsRow(cell, id);
            }

            const trigger = cell.querySelector(`span[data-id="${id}"]`);
            if (trigger) {
                trigger.addEventListener("click", () => this.toggleDetails(id));
            }
        });
    }

    addDetailsRow(cell, id) {
        const row = cell.closest("tr");

        var colSpan = 0;

        Array.from(row.children).forEach((cell) => {
            colSpan += cell.colSpan;
        });

        var newCell = document.createElement("td");
        newCell.setAttribute("colspan", colSpan);
        newCell.innerHTML = this.detailsContent(row.children);

        var newRow = document.createElement("tr");
        newRow.appendChild(newCell);
        newRow.classList.add("hide");
        newRow.classList.add("detailRow");
        newRow.id = id;

        row.parentNode.insertBefore(newRow, row.nextSibling);
    }

    detailsContent(rowCells) {
        const cells = Array.from(rowCells);

        var contentLine = "";

        cells.forEach((cell) => {
            if (cell.classList.contains("hide")) {
                var label = cell.getAttribute("data-label") || "";
                var content = cell.innerHTML;

                contentLine += `<div class="responsivetable__details--info"><div><strong>${label}</strong></div> <div>${content}</div></div>`;
            }
        });

        return `<div class="responsivetable__details--card">${contentLine}</div>`;
    }

    toggleColumn(index, hide) {
        const allRows = this.table.querySelectorAll("tr");

        allRows.forEach((row) => {
            const cell = row.children[index];

            if (cell) {
                cell.classList.toggle("hide", hide);
            }
        });
    }

    toggleDetails(id) {
        const tr = document.getElementById(id);

        tr.classList.toggle("hide");
    }

    nanoid(size = 21) {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
        let id = "";
        for (let i = 0; i < size; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
}
