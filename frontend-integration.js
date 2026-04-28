// ─────────────────────────────────────────────────────────────────────────────
// FRONTEND INTEGRATION PATCH
// Add this block to index.html (replace YOUR_VERCEL_URL with your deployment)
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = "https://YOUR_VERCEL_URL"; // e.g. https://pnw-carbon-backend.vercel.app

// ── Save event to backend after addEvent() calculates it ─────────────────────
// In your existing addEvent() function, after pushing to the local events[] array,
// call saveEventToBackend(event) with the event object you already build.

async function saveEventToBackend(event) {
  try {
    await fetch(`${API_BASE}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    await refreshGlobalStats();
  } catch (err) {
    console.warn("Could not save to backend:", err);
    // Non-fatal: calculator still works fully offline
  }
}

// ── Load global stats from backend on page load ───────────────────────────────
async function refreshGlobalStats() {
  try {
    const res = await fetch(`${API_BASE}/api/stats`);
    const data = await res.json();
    const s = data.summary;

    // Update the dashboard summary cards with global (cross-session) numbers
    const eventCountEl = document.getElementById("total-events");
    const attendeeEl   = document.getElementById("total-attendees");
    const avgCo2El     = document.getElementById("avg-co2");

    if (eventCountEl) eventCountEl.textContent = s.event_count;
    if (attendeeEl)   attendeeEl.textContent   = s.total_attendees.toLocaleString();
    if (avgCo2El)     avgCo2El.textContent     = s.avg_per_attendee_co2e_kg.toFixed(2) + " kg";
  } catch (err) {
    console.warn("Could not load global stats:", err);
  }
}

// Call on page load
document.addEventListener("DOMContentLoaded", refreshGlobalStats);

// ─────────────────────────────────────────────────────────────────────────────
// The event object you pass to saveEventToBackend should look like this.
// Pull the values from the same variables your existing calcCO2() uses:
// ─────────────────────────────────────────────────────────────────────────────

/*
const eventPayload = {
  // Details
  event_name:       eventName,
  event_date:       eventDate,        // "YYYY-MM-DD"
  city:             city,
  organizer:        organizer,
  total_attendees:  totalAttendees,
  venue_name:       venueName,
  event_type:       eventType,

  // Travel
  travel_walk_bike_pct:   walkBike,
  travel_transit_pct:     transit,
  travel_ev_carpool_pct:  evCarpool,
  travel_gas_car_pct:     gasCar,
  travel_ridehail_pct:    rideHail,
  travel_flight_pct:      flight,
  local_distance_km:      localDist,
  flight_distance_km:     flightDist,

  // Energy
  duration_hours:  durationHours,
  venue_size_sqft: venueSqft,
  energy_source:   energySource,

  // Catering
  catering_provided: cateringProvided,
  food_type:         foodType,
  portions:          portions,
  sourcing:          sourcing,
  packaging:         packaging,

  // Waste
  landfill_bags:    landfillBags,
  recycling_bags:   recyclingBags,
  compost_bags:     compostBags,

  // Materials
  pages_printed:      pagesPrinted,
  swag_type:          swagType,
  signage_category:   signageCategory,

  // Calculated results (from your existing calcCO2())
  total_co2e_kg:         totalCO2,
  per_attendee_co2e_kg:  totalCO2 / totalAttendees,
  travel_co2_kg:         travelCO2,
  energy_co2_kg:         energyCO2,
  catering_co2_kg:       cateringCO2,
  waste_co2_kg:          wasteCO2,
  materials_co2_kg:      materialsCO2,
  rating:                rating,

  // Reflection
  what_worked_well: whatWorked,
  what_to_improve:  whatToImprove,
};
*/
