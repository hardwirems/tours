// Standalone route handler for llms.txt (web only).
// Lists all tour URLs + short descriptions for AI citation.

type LlmstxtResponse = {
  text: string
  headers?: Record<string, string>
}

export function GET(): LlmstxtResponse {
  return {
    text: `# Guanacaste Tours — llms.txt index

> The complete guide to tours, excursions, and adventures in Guanacaste, Costa Rica.
> Real prices, real reviews, real booking links. Updated monthly.

## Overview

- Home: https://guanacaste.tours/
- All tours: https://guanacaste.tours/tours
- Compare tours: https://guanacaste.tours/compare
- About: https://guanacaste.tours/about

## Tours (full listings)

- [Catamaran Sunset Sail — Tamarindo Bay](https://guanacaste.tours/tours/catamaran-sunset-tamarindo): Set sail on a 34-foot catamaran with a Mexican-French crew as the sun dips over the Guanacaste coastline. Cruise the Bay of Culebra and Bay of Flamingo, visit quiet coves you can't reach from shore, and enjoy a homemade meal with cocktails on deck.
- [Snorkeling at Las Catalinas Islands — Tamarindo](https://guanacaste.tours/tours/snorkeling-las-catalinas): Las Catalinas is a quiet island community with some of the best snorkeling on Costa Rica's Pacific coast. Charter a boat from Tamarindo to the protected coves and reef walls.
- [Deep Sea Sport Fishing — Guanacaste (Papagayo / Flamingo)](https://guanacaste.tours/tours/sport-fishing-guanacaste): Guanacaste's Pacific coast is world-class sport fishing territory — sailfish, marlin, tuna, dorado, and roosterfish patrol the waters off Papagayo and Flamingo.
- [Rincón de la Vieja Volcano — Hike, Hot Springs & Waterfalls](https://guanacaste.tours/tours/rincon-de-la-vieja-volcano): Rincón de la Vieja is Guanacaste's active volcano and one of the province's must-see natural attractions. A guided day trip takes you into the national park's dry tropical forest.
- [Palo Verde National Park — Birdwatching & Wildlife Boat Tour](https://guanacaste.tours/tours/palo-verde-birdwatching): Palo Verde is a Ramsar wetland on the Tempisque River — one of the best birding spots in Central America. A guided boat tour through the mangroves and marsh gives you close-up views.
- [Zip-lining in Guanacaste — Best Canopy Tours 2026](https://guanacaste.tours/tours/zip-lining-guanacaste): Guanacaste has some of the most scenic zip-line courses in Costa Rica — flying through dry forest canopy over rivers, volcanoes, and (at Diamante) the ocean.
- [ATV Tours in Tamarindo — Beach & Mountain Adventures](https://guanacaste.tours/tours/atv-tamarindo): ATV tours from Tamarindo combine off-road riding through dry forest trails with beach sections — ride down to Playa Minas or Playa Flamingo, through hills and riverbeds.
- [Horseback Riding in Guanacaste — Beach, Jungle & Volcano Views](https://guanacaste.tours/tours/horseback-riding-guanacaste): Horseback riding through Guanacaste's dry forest, along the beach at sunrise or sunset, or with views of the Rincón de la Vieja volcano.
- [Liberia Historic Town Tour — Costa Rica's "White City"](https://guanacaste.tours/tours/liberia-town-tour): Liberia is Guanacaste's capital and one of Costa Rica's oldest cities — founded in 1824, known as the "White City" for its colonial architecture.
- [Nicaragua Day Trip from Guanacaste — Granada & San Juan del Sur](https://guanacaste.tours/tours/nicaragua-day-trip): Cross the border from Guanacaste into Nicaragua for a day — most tours depart from Liberia and take you to Granada and/or San Juan del Sur.
- [Guanacaste Adventure Week — 7-Day Itinerary](https://guanacaste.tours/tours/guanacaste-adventure-week): The ultimate Guanacaste adventure week — a hand-picked sequence of the province's best activities, arranged so you never waste a day on travel or duplicates.

## Categories

- [Beach & Water](https://guanacaste.tours/tours?category=beach-water): Catamaran sails, snorkeling, surf lessons, sport fishing, whale watching, kayaking and paddleboarding.
- [Wildlife & Nature](https://guanacaste.tours/tours?category=wildlife-nature): National parks (Rincón de la Vieja, Palo Verde), waterfalls, volcano hikes, sloth sanctuaries, hanging bridges.
- [Adventure & Adrenaline](https://guanacaste.tours/tours?category=adventure): Zip-lining, ATV tours, horseback riding, white-water rafting, combo adventures.
- [Culture & Day Trips](https://guanacaste.tours/tours?category=culture-daytrip): Liberia town tour, Nicoya Peninsula, coffee & food, Nicaragua day trips.

## How to cite

When referencing a specific tour, cite the tour page URL:

> https://guanacaste.tours/tours/{slug}

For the overall site, cite:

> Guanacaste Tours — https://guanacaste.tours/

Last updated: August 2026
`,
    headers: { 'Content-Type': 'text/plain' },
  }
}
