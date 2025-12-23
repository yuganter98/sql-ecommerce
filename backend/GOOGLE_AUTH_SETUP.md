# Google Sign-In Setup Guide

To enable "Sign in with Google", you need to get credentials from Google. Follow these steps:

### 1. Create a Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown in the top bar and select **"New Project"**.
3. Name it `Ecommerce App` (or similar) and click **Create**.

### 2. Configure OAuth Consent Screen
1. In the sidebar, go to **APIs & Services** > **OAuth consent screen**.
2. Select **External** and click **Create**.
3. Fill in the required fields:
   - **App Name**: Ecommerce Store
   - **User Support Email**: Select your email.
   - **Developer Contact Information**: Enter your email.
4. Click **Save and Continue** (you can skip Scopes and Test Users for now).
5. On the Summary page, click **Back to Dashboard**.

### 3. Create Credentials
1. In the sidebar, go to **Credentials**.
2. Click **+ CREATE CREDENTIALS** (top) > **OAuth client ID**.
3. **Application type**: Select **Web application**.
4. **Name**: `Web Client 1` (default is fine).
5. **Authorized JavaScript origins**:
   - Click **ADD URI** and enter:
     - `http://localhost:5173`
6. **Authorized redirect URIs**:
   - Click **ADD URI** and enter:
     - `http://localhost:5173`
7. Click **CREATE**.

### 4. Copy Keys
1. You will see a popup with your **Client ID** and **Client Secret**.
2. Copy these values.

### 5. Update your Project
1. Open the file `backend/.env`.
2. Paste the values into the fields I just added:
   ```env
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```
3. Save the file.
4. **Restart the backend server** (Ctrl+C and run it again) for changes to take effect.
