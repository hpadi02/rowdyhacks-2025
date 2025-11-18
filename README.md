# GoLoanMe



**Note:** This is a demo and uses a simulated ledger with **fake currency (GLM credits)**. It does not process real money.

## What It Does

* **Fundraising:** Users can create posts to raise funds for goals like "Medical," "Education," or "Community Projects".
* **AI Contracts:** Users can generate simple, plain-language contract templates using an AI (Gemini via OpenRouter) for pledges.
* **Simulated Wallet:** All users have a wallet to send and receive simulated GLM credits, with all transactions tracked on an immutable ledger.
* **Bilingual:** The interface supports English and Spanish.

## Tech Stack

* **Framework:** Next.js (App Router)
* **UI:** React & Tailwind CSS
* **Database:** MongoDB Atlas
* **ORM:** Prisma
* **Auth:** Auth0
* **AI:** OpenRouter
* **File Storage:** Cloudinary

## 🏁 How to Run

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Set Up Environment:**
    * Copy `.env` to a new file named `.env.local`.
    * Fill in the values for your accounts (Auth0, MongoDB, OpenRouter, Cloudinary).

3.  **Run the Database Seed:**
    * This creates the necessary Prisma client and adds demo data.
    ```bash
    npx prisma generate
    npm run db:seed 
    ```
   

4.  **Run the Project:**
    ```bash
    npm run dev
    ```
   

The app will be running at `http://localhost:3000`.
