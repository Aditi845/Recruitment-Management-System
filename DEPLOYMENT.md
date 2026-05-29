# RMS Deployment Guide (AWS EC2 + PM2 + Nginx)

This guide covers the deployment of the MERN Stack Recruitment Management System (RMS) to a production environment on an AWS EC2 instance.

## 1. AWS EC2 Setup

1. **Launch an EC2 Instance:**
   - Go to the AWS EC2 Console.
   - Click "Launch Instance".
   - Choose **Ubuntu 24.04 LTS**.
   - Select an Instance Type (e.g., `t2.micro` or `t3.small`).
   - Create and download a Key Pair (`.pem` file) for SSH access.
   - In Network Settings, allow **SSH (22)**, **HTTP (80)**, and **HTTPS (443)** traffic from anywhere.
   - Launch the instance.

2. **Connect via SSH:**
   \`\`\`bash
   chmod 400 your-key.pem
   ssh -i "your-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP
   \`\`\`

3. **Install Dependencies (Node.js & Nginx):**
   \`\`\`bash
   sudo apt update && sudo apt upgrade -y
   # Install Node.js (v20)
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   # Install Nginx
   sudo apt install -y nginx
   \`\`\`

---

## 2. Prepare the Codebase

1. Clone your repository into the EC2 instance:
   \`\`\`bash
   git clone https://github.com/your-username/your-rms-repo.git
   cd your-rms-repo
   \`\`\`

### Backend Configuration
1. Navigate to the backend folder and install dependencies:
   \`\`\`bash
   cd Backend
   npm install
   \`\`\`
2. Create your `.env` file:
   \`\`\`bash
   nano .env
   \`\`\`
   Paste your variables:
   \`\`\`env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_super_secret_jwt_key
   
   # Gmail SMTP setup
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   EMAIL_FROM="RMS Support" <your_email@gmail.com>
   CONTACT_RECEIVER_EMAIL=admin_email@domain.com
   \`\`\`
   > **Note on App Password:** Go to your Google Account -> Security -> 2-Step Verification -> App Passwords. Generate an app password for "Mail" and use it in `EMAIL_PASS`.

### Frontend Configuration
1. Navigate to the frontend folder and install dependencies:
   \`\`\`bash
   cd ../Frontend
   npm install
   \`\`\`
2. Ensure API points to your backend (update `src/services/api.js` or `.env` if used to point to `/api` or your public domain).
3. Build the frontend for production:
   \`\`\`bash
   npm run build
   \`\`\`
   This will create a `dist` directory.

---

## 3. PM2 Process Management (Backend)

We use PM2 to keep the backend API running continuously in the background.

1. Install PM2 globally:
   \`\`\`bash
   sudo npm install -g pm2
   \`\`\`
2. Start the backend server:
   \`\`\`bash
   cd ../Backend
   pm2 start server.js --name "rms-api"
   \`\`\`
3. Set PM2 to restart on server reboot:
   \`\`\`bash
   pm2 startup
   # Run the command PM2 outputs, then save
   pm2 save
   \`\`\`

---

## 4. Nginx Reverse Proxy (Frontend & Backend)

Nginx will serve the static React frontend files and reverse proxy API requests to the Node.js backend.

1. Create a new Nginx configuration file:
   \`\`\`bash
   sudo nano /etc/nginx/sites-available/rms
   \`\`\`
2. Paste the following configuration (replace `your_domain.com` with your actual domain or Public IP):
   \`\`\`nginx
   server {
       listen 80;
       server_name your_domain.com; # Or EC2 public IP

       # Serve Frontend
       location / {
           root /home/ubuntu/your-rms-repo/Frontend/dist;
           index index.html index.htm;
           try_files $uri $uri/ /index.html;
       }

       # Reverse Proxy Backend API
       location /api/ {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Serve Uploaded Files
       location /uploads/ {
           alias /home/ubuntu/your-rms-repo/Backend/uploads/;
       }
   }
   \`\`\`
3. Enable the site and test configuration:
   \`\`\`bash
   sudo ln -s /etc/nginx/sites-available/rms /etc/nginx/sites-enabled/
   # Remove default nginx config
   sudo rm /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl restart nginx
   \`\`\`

---

## 5. SSL / HTTPS (Optional but Recommended)

To secure your site with HTTPS, use Certbot.
\`\`\`bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
\`\`\`

Your Recruitment Management System is now fully deployed and production-ready!
