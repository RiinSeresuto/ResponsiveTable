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
        this.setupExpandButtons();
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
            var text = cell.innerHTML;
            var attribute = cell.getAttribute("data-toggle");

            if (!attribute) {
                cell.setAttribute("data-toggle", true);
                cell.innerHTML = `${icon} ${text}`;
            }
        });
    }

    toggleColumn(index, hide) {
        const allRows = this.table.querySelectorAll("tr");

        allRows.forEach((row) => {
            const cell = row.children[index];

            if (cell) {
                cell.classList.toggle("hidden-col", hide);
            }
        });
    }

    setupExpandButtons() {
        const bodyRows = Array.from(this.table.tBodies[0].rows);
        bodyRows.forEach((row, index) => {
            const btn = row.querySelector(".expand-btn");
            if (btn) {
                btn.addEventListener("click", () => this.toggleDetails(row));
            }
        });
    }

    toggleDetails(row) {
        const nextRow = row.nextElementSibling;
        if (nextRow && nextRow.classList.contains("details-row")) {
            nextRow.remove();
            return;
        }

        const detailRow = document.createElement("tr");
        detailRow.className = "details-row";
        const td = document.createElement("td");
        td.colSpan = this.headers.length;

        const hiddenData = [];
        const cells = row.children;
        this.priorityMap.forEach((col) => {
            const cell = cells[col.index];
            if (cell && cell.classList.contains("hidden-col")) {
                const label = this.headers[col.index].textContent.trim();
                const value = cell.textContent.trim();
                hiddenData.push(`<strong>${label}:</strong> ${value}`);
            }
        });

        td.innerHTML = hiddenData.length
            ? hiddenData.join("<br>")
            : "<em>No hidden data</em>";
        detailRow.appendChild(td);
        row.after(detailRow);
    }
}
