// script.js

// Initialize the seat map based on screen size
function initializeSeatMap() {
  const seatMap = generateSeatMap(areasConfig);
  const mediaQuery = window.matchMedia('(max-width: 480px)');

  function updateReserveButton() {
    const $reserveButton = $('.reserve-button');
    const isMobile = mediaQuery.matches;
    const isDesktopFullMap = $('.cinema-layout').is(':visible');
    const isDesktopAreaDetail = $('.area-detail').is(':visible');
    const hasSelectedSeats = $('.seat.selected').length > 0;

    // Show button if seats are visible (desktop full map, desktop area detail, or mobile sector)
    if (isMobile && $('.sector.active').length > 0) {
      $reserveButton.show();
    } else if (!isMobile && (isDesktopFullMap || isDesktopAreaDetail)) {
      $reserveButton.show();
    } else {
      $reserveButton.hide();
    }

    // Enable button only if seats are selected
    $reserveButton.prop('disabled', !hasSelectedSeats);
  }

  function handleScreenSizeChange(e) {
    if (e.matches) {
      // Mobile: Render sector-based layout
      renderMobileSeatMap(seatMap);
      // Show first sector by default
      showSector('Main-Floor');
      // Hide area detail
      $('.area-detail').hide();
    } else {
      // Desktop: Render full seat map
      renderDesktopSeatMap(seatMap);
      // Hide all sectors and area detail
      $('.sector').removeClass('active');
      $('.area-detail').hide();
      $('.cinema-layout').show();
    }
    updateReserveButton();
  }

  // Initial render
  handleScreenSizeChange(mediaQuery);

  // Listen for screen size changes
  mediaQuery.addEventListener('change', handleScreenSizeChange);

  // Listen for area clicks (desktop only)
  $(document).on('click', '.cinema-layout .area', function() {
    const areaName = $(this).attr('data-area');
    const area = seatMap.find(a => a.name.replace(/\s+/g, '-') === areaName);
    if (area) {
      $('.cinema-layout').hide();
      $('.area-detail').show();
      renderAreaDetail(area);
      updateReserveButton();
    }
  });

  // Handle back button
  $('.back-button').on('click', function() {
    $('.area-detail').hide();
    $('.cinema-layout').show();
    updateReserveButton();
  });

  return seatMap;
}

// Handle sector display for mobile
function showSector(sectorId) {
  $('.sector').removeClass('active');
  $(`#${sectorId}`).addClass('active');
  $('.reserve-button').show(); // Show reserve button when sector is active
  updateReserveButton();
}

// Handle seat selection
function initializeSeatInteractions(seatMap) {
  $(document).on('click', '.seat', function(e) {
    e.stopPropagation();
    const $seat = $(this);
    if ($seat.hasClass('reserved')) {
      alert('This seat is already reserved.');
      return;
    }

    $seat.toggleClass('selected available');
    $seat.attr('title', $seat.hasClass('selected') ? 'Selected' : 'Available');
    updateReserveButton();
  });

  // Handle reserve button click
  $('.reserve-button').on('click', function() {
    const selectedSeats = $('.seat.selected').map(function() {
      const seatId = $(this).attr('data-id'); // e.g., Main-Floor-A-1
      const [area, row, seatNumber] = seatId.split('-').slice(-3); // Parse ID
      return {
        area: seatMap.find(a => a.name.replace(/\s+/g, '-') === `${area}-${row}`)?.name || area,
        row,
        seatNumber: parseInt(seatNumber)
      };
    }).get();

    if (selectedSeats.length === 0) return;

    // Simulate server response by displaying booking details
    const $confirmation = $('.booking-confirmation');
    $confirmation.empty().show();
    $confirmation.append('<h3>Booking Confirmed</h3>');
    const $list = $('<ul>');
    selectedSeats.forEach(seat => {
      $list.append(`<li>${seat.area}, Row ${seat.row}, Seat ${seat.seatNumber}</li>`);
    });
    $confirmation.append($list);

    // Mark seats as reserved
    $('.seat.selected').removeClass('selected available').addClass('reserved').attr('title', 'Reserved');

    // Update button state
    updateReserveButton();
  });
}

// Initialize on page load
$(document).ready(() => {
  const seatMap = initializeSeatMap();
  initializeSeatInteractions(seatMap);
});