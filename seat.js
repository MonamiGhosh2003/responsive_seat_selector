// seatMap.js

// Configuration for the venue's areas
const areasConfig = [
  {
    name: "Main Floor",
    rows: ["A", "B", "C", "D", "E"],
    seatsPerRow: 10,
    isVip: false
  },
  {
    name: "Left Balcony",
    rows: ["AA", "BB"],
    seatsPerRow: 5,
    isVip: true
  },
  {
    name: "Right Balcony",
    rows: ["AA", "BB"],
    seatsPerRow: 5,
    isVip: true
  }
];

// Generate the seat map JSON structure
function generateSeatMap(config) {
  const seatMap = [];

  for (const area of config) {
    const areaData = {
      name: area.name,
      rows: [],
      isVip: area.isVip
    };

    for (const rowId of area.rows) {
      const rowData = {
        rowId: rowId,
        seats: []
      };

      for (let seatNumber = 1; seatNumber <= area.seatsPerRow; seatNumber++) {
        const seatId = `${area.name.replace(/\s+/g, '-')}-${rowId}-${seatNumber}`;
        const occupied = Math.random() < 0.3;

        rowData.seats.push({
          id: seatId,
          area: area.name,
          row: rowId,
          seatNumber: seatNumber,
          occupied: occupied,
          isVip: area.isVip
        });
      }

      areaData.rows.push(rowData);
    }

    seatMap.push(areaData);
  }

  return seatMap;
}

// Render the full seat map for desktop
function renderDesktopSeatMap(seatMap) {
  const $container = $('.cinema-layout');
  $container.empty();

  seatMap.forEach(area => {
    const $area = $('<div>')
      .addClass('area')
      .attr('data-area', area.name.replace(/\s+/g, '-'))
      .append(`<h2>${area.name}</h2>`);

    area.rows.forEach(row => {
      const $row = $('<div>').addClass('row');
      $row.append(`<span class="row-label">${row.rowId}</span>`);

      row.seats.forEach(seat => {
        const $seat = $('<div>')
          .addClass('seat')
          .text(seat.seatNumber)
          .attr('data-id', seat.id);

        if (seat.occupied) {
          $seat.addClass('reserved').attr('title', 'Reserved');
        } else if (seat.isVip) {
          $seat.addClass('vip').attr('title', 'VIP');
        } else {
          $seat.addClass('available').attr('title', 'Available');
        }

        $row.append($seat);
      });

      $area.append($row);
    });

    $container.append($area);
  });
}

// Render the sector-based layout for mobile
function renderMobileSeatMap(seatMap) {
  seatMap.forEach(area => {
    const sectorId = area.name.replace(/\s+/g, '-');
    const $sector = $(`#${sectorId}`);
    $sector.empty();

    area.rows.forEach(row => {
      const $row = $('<div>').addClass('row');
      $row.append(`<span class="row-label">${row.rowId}</span>`);

      row.seats.forEach(seat => {
        const $seat = $('<div>')
          .addClass('seat')
          .text(seat.seatNumber)
          .attr('data-id', seat.id);

        if (seat.occupied) {
          $seat.addClass('reserved').attr('title', 'Reserved');
        } else if (seat.isVip) {
          $seat.addClass('vip').attr('title', 'VIP');
        } else {
          $seat.addClass('available').attr('title', 'Available');
        }

        $row.append($seat);
      });

      $sector.append($row);
    });
  });
}

// Render a single area for zoomed-in view (desktop)
function renderAreaDetail(area) {
  const $container = $('.area-content');
  $container.empty();

  const $area = $('<div>').addClass('area').append(`<h2>${area.name}</h2>`);

  area.rows.forEach(row => {
    const $row = $('<div>').addClass('row');
    $row.append(`<span class="row-label">${row.rowId}</span>`);

    row.seats.forEach(seat => {
      const $seat = $('<div>')
        .addClass('seat')
        .text(seat.seatNumber)
        .attr('data-id', seat.id);

      if (seat.occupied) {
        $seat.addClass('reserved').attr('title', 'Reserved');
      } else if (seat.isVip) {
        $seat.addClass('vip').attr('title', 'VIP');
      } else {
        $seat.addClass('available').attr('title', 'Available');
      }

      $row.append($seat);
    });

    $area.append($row);
  });

  $container.append($area);
}