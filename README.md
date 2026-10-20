# Rev Julius Spiritual Growth - Ministry CMS

A full-stack web application built for **Rev Julius Mwangi** to share daily Bible verses, inspirational graphics, and receive prayer requests. 

![Website Preview](public/preview.png)

## 🌟 Features

*   **Dynamic Daily Verse**: Randomly displays strong Bible verses from the database every time the page is refreshed.
*   **Inspiration Gallery**: Displays uploaded quote graphics and images.
*   **Prayer Requests**: A form for visitors to submit prayer requests (currently uses a `mailto:` fallback) and a direct WhatsApp contact button.
*   **Admin Dashboard**: A secure backend where the Pastor can log in to:
    *   Add/Delete Bible verses.
    *   Upload/Delete Gallery images.
    *   Add/Delete WhatsApp numbers and Email addresses.

## 🛠️ Tech Stack

*   **Frontend**: HTML5, CSS3, Vanilla JavaScript
*   **Backend**: Node.js, Express.js
*   **Database**: SQLite (via `sqlite3`)
*   **Authentication**: Express-Session & Bcryptjs
*   **File Uploads**: Multer
*   **Templating**: EJS (for Admin views)

## 🚀 Local Development Setup

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/redirect-param/rev-julius-ministry.git
   cd rev-julius-backend
   npm install
   node server.js

## Development link
   ```bash
   http://localhost:3000/
