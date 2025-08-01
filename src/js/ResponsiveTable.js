import { nanoid } from "nanoid";
import { createIcons, CirclePlus, CircleMinus } from "lucide";

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
		window.addEventListener("resize", () => this.update());
	}

	update() {
		var setupToggleButton = false;

		const width = this.container.offsetWidth;

		const breakpoints = [320, 360, 480, 600, 768, 992, 1200, 1440];
		let visibleColumns =
			breakpoints.findIndex((bp) => width < bp) + 1 ||
			this.priorityMap.length;

		const hideCount = Math.max(this.priorityMap.length - visibleColumns, 0);

		this.priorityMap.forEach((col, i) => {
			const shouldHide =
				i >= this.priorityMap.length - hideCount && col.index !== 0;

			this.toggleColumn(col.index, shouldHide);

			setupToggleButton = shouldHide;
		});

		hideCount > 0 ? this.addButton() : this.removeButton();
	}

	addButton() {
		const buttonCell = document.querySelectorAll('td[tabindex="0"]');
		const icon =
			'<i data-lucide="circle-plus" class="responsive-table--icon"></i>';

		buttonCell.forEach((cell) => {
			const id = nanoid();
			var htmlContent = cell.innerHTML;
			var attribute = cell.getAttribute("data-toggle");

			if (!attribute) {
				cell.setAttribute("data-toggle", true);
				cell.innerHTML = `
					<div class='responsive-table--leadingcolumn-container'>
						<span data-id="${id}">${icon}</span>
						<div class="responsive-table--leadingcolumn-content">${htmlContent}</div>
					</div>`;
			}

			this.addDetailsRow(cell, id);

			this.generateIcon();

			const trigger = cell.querySelector(`span[data-id="${id}"]`);

			if (trigger) {
				trigger.style.cursor = "pointer";

				trigger.addEventListener("click", () => this.toggleDetails(id));
			}
		});
	}

	removeButton() {
		const buttonCell = document.querySelectorAll('td[tabindex="0"]');

		buttonCell.forEach((cell) => {
			if (cell.getAttribute("data-toggle")) {
				const attribute = cell.getAttribute("data-toggle");
				const id = cell.querySelector("span").getAttribute("data-id");

				if (attribute) {
					cell.removeAttribute("data-toggle");
					cell.innerHTML = cell.querySelector(
						".responsive-table--leadingcolumn-content"
					).innerHTML;

					this.removeDetailsRow(id);
				}
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
		newCell.innerHTML = "";
		newCell.innerHTML = this.detailsContent(row.children);

		var newRow = document.createElement("tr");
		newRow.appendChild(newCell);
		newRow.classList.add("hide");
		newRow.classList.add("detailRow");
		newRow.id = id;

		row.parentNode.insertBefore(newRow, row.nextSibling);
	}

	removeDetailsRow(id) {
		const row = document.getElementById(id);

		if (row) {
			row.remove();
		}
	}

	detailsContent(rowCells) {
		var contentLine = "";

		Array.from(rowCells).forEach((cell) => {
			if (cell.classList.contains("hide")) {
				var label = cell.getAttribute("data-label") || "";
				var content = cell.innerHTML;

				contentLine += `<div class="responsive-table__details--info"><div><strong>${label}</strong></div> <div>${content}</div></div>`;
			}
		});

		return `<div class="responsive-table__details--card">${contentLine}</div>`;
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

		const element = document.querySelector(`[data-id="${id}"]`);

		if (element.firstChild.dataset.lucide == "circle-plus") {
			element.removeChild(element.firstChild);

			element.innerHTML =
				'<i data-lucide="circle-minus" class="responsive-table--icon"></i>';

			this.generateIcon();
		} else {
			element.removeChild(element.firstChild);

			element.innerHTML =
				'<i data-lucide="circle-plus" class="responsive-table--icon"></i>';

			this.generateIcon();
		}
	}

	generateIcon() {
		createIcons({ icons: { CirclePlus, CircleMinus } });
	}
}

window.ResponsiveTable = ResponsiveTable;
