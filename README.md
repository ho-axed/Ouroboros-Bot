
# Ouroboros

### 📖 **Description**

This is a Discord bot designed to manage and log team work schedules. It tracks the start of work shifts, breaks, and end times, storing the data seamlessly in a Google Spreadsheet using a custom API.

### 🚀 **Features**

-   🎯 Tracks **start and end of work shifts**.
    
-   ☕ Logs **breaks** and resumption of work.
    
-   🕒 Calculates total work hours for each session.
    
-   📋 Stores all the data in a Google Spreadsheet for future analysis.
    

### 🛠️ **Prerequisites**

1.  **Node.js** (v16 or higher recommended).
    
2.  **Discord Developer Portal**: A bot registered with its token.
    
3.  **Google Apps Script API**:
    
    -   Publish your custom Google Apps Script as a web app.
        
    -   Set up a Google Sheet with the columns `Users`, `Date`, and `HoursWorked`.
        

### 📦 **Dependencies**

This project uses the following libraries:

-   `discord.js` – For interacting with the Discord API.
    
-   `node-fetch` – For making HTTP requests to the API.
    

To install them:

bash

```
npm install discord.js node-fetch

```

### ⚙️ **Setup**

1.  Clone the repository:
    
    bash
    
    ```
    git clone https://github.com/ho-axed/Ouroboros-Bot
    cd Ouroboros-Bot
    
    ```
    
2.  Create a `.env` file (if you're using dotenv with Node.js or Bun):
    
    env
    
    ```
    DISCORD_BOT_TOKEN=your_discord_bot_token
    API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
    
    ```
    
3.  Run the bot:
    
    -   With Node.js:
        
        bash
        
        ```
        node src/index.ts
        
        ```
        
    -   With Bun (if applicable):
        
        bash
        
        ```
        bun run src/index.ts
        
        ```
        

### 📝 **Available Commands**

**Command**

**Action**

`Inicio Trabajo`

Starts tracking work time.

`Empiezo Descanso`

Pauses the work tracking for a break.

`Termino Descanso`

Resumes work tracking after a break.

`Terminar Trabajo`

Ends the session, calculates hours worked, and saves the data to the API.

### 🌐 **API Integration**

The bot communicates with a custom Google Apps Script API to log data in a Google Spreadsheet. The API accepts the following parameters:

-   `action` (`write` or `read`)
    
-   `path` (sheet name, e.g., `Sheet1`)
    
-   `Users` (username)
    
-   `HoursWorked` (work hours in decimal format)
    

Sample request sent by the bot:

```
GET https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=write&path=Sheet1&Users=JohnDoe&HoursWorked=8

```

### 🌟 **Future Enhancements**

-   ✅ Support for multiple spreadsheets.
    
-   ✅ Advanced data analysis with automatic reports and charts.
    
-   ✅ Integration with additional tools like Slack or Notion.
    

### 🛡️ **License**

This project is licensed under the MIT License. Feel free to use and modify it as needed!