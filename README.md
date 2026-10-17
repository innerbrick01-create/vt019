# Vanshit Infra — Hyperlocal Rental Website

A responsive static website prototype for rental-property discovery in Wazirabad and Sangam Vihar, Delhi.

## What's included
- Premium, minimal responsive homepage
- Rental listings and functional locality, property-type, rent, furnishing and sorting filters
- Property-specific inquiry form
- WhatsApp/email inquiry preparation (requires configuration)
- Editable demo property data
- Responsive mobile navigation
- No database or backend required

## Run locally
The site uses plain HTML, CSS and JavaScript, so no build step is required.

1. Extract the project ZIP.
2. Open `index.html` in a modern browser.

For a more reliable local preview, open a terminal in this folder and run:
- Python: `python -m http.server 8000`
- Then visit `http://localhost:8000`

## Customize the business
Open `config.js` and update:
- `phone`
- `whatsapp` (digits only, include country code, e.g. 91XXXXXXXXXX)
- `email`
- `officeAddress`
- `officeHours`
- `mapsUrl`

The contact number and office address are intentionally blank. Add only real business details. Note that a phone number placed in a static frontend is public and cannot be kept secret.

## Update property listings
Edit `properties.js`. Each property includes an ID, title, locality, type, monthly rent, optional deposit, bedroom/bathroom counts, area, furnishing, image, description and demo flag.

Replace demo listings with real, current inventory and set `demo: false` only after verifying the details. Update the demo disclaimer in `index.html` when the website is ready to publish. Do not claim that listings are verified unless they have been verified.

## Images
Demo listing photos currently use remote Unsplash image URLs and therefore require an internet connection. You can replace them with licensed local images in the `assets` folder and update the `image` fields in `properties.js`. A simple fallback SVG is included for broken listing images.

## Contact form limitations
This is a static website. It does not store submissions or send them to a business automatically. The form prepares a WhatsApp message or email only after a visitor explicitly submits the form, and the visitor must send the message in the target app. Configure a real WhatsApp number or email in `config.js` first.

## Publish
Upload the static project files to any static hosting provider that supports HTML/CSS/JS. No server-side runtime is required.

## Pre-launch checklist
- [ ] Add actual business contact details and verified office address.
- [ ] Replace every sample listing with real inventory.
- [ ] Replace demo imagery with appropriate licensed photos.
- [ ] Verify rental prices, deposits, property details and availability.
- [ ] Test WhatsApp/email inquiry links.
- [ ] Review privacy text and add any required business/legal information.
