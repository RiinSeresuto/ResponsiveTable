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
		const icon = '<i data-lucide="circle-plus"></i>';

		buttonCell.forEach((cell) => {
			const id = nanoid();
			var text = cell.innerHTML;
			var attribute = cell.getAttribute("data-toggle");

			if (!attribute) {
				cell.setAttribute("data-toggle", true);
				cell.innerHTML = `<span data-id="${id}">${icon}</span> ${text}`;

				this.addDetailsRow(cell, id);
			}

			this.generateIcon();

			const trigger = cell.querySelector(`span[data-id="${id}"]`);

			if (trigger) {
				trigger.style.cursor = "pointer";

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

		// get the span data-id here to replace the icon
		//const span = element.dataset.dataId;
	}

	generateIcon() {
		createIcons({ icons: { CirclePlus, CircleMinus } });
	}
}

window.ResponsiveTable = ResponsiveTable;
