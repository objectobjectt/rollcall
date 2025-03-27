# RollCall ✨
![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

*Smart, Secure, and Automated Attendance Tracking!*

## **Overview**
RollCall is an attendance system that ensures accurate, location-based, and multi-factor authenticated attendance tracking for students. By leveraging QR codes, geolocation, Bluetooth validation, and face recognition, RollCall prevents false attendance marking and eliminates manual errors.


## **Problem Statement**
Traditional attendance systems are prone to manipulation via:
- **Proxy attendance** (students marking attendance for others)
- **GPS spoofing & VPNs** to fake locations
- **QR code sharing** to mark attendance remotely

A **foolproof system** is required to ensure only physically present students can mark attendance.


## **Solution**
RollCall implements **multi-layer authentication** using:
1. **Session-Based QR Codes** — Dynamic QR codes refresh at intervals to prevent sharing.
2. **Geolocation & Classroom Boundaries** — Attendance is marked only if a student is within a predefined area.
3. **Bluetooth Proximity Validation** — Ensures students are near the teacher's device.
4. **Face Recognition & Liveness Detection** — Verifies the student’s identity via real-time camera detection.
5. **Bluetooth Chain of Devices** — If the teacher's Bluetooth is unavailable, a verified student device acts as a relay.


## Tech Stack

### Frontend
- **React Native** (Cross-platform mobile development)
- **Expo** (For quick development & testing)

### Backend
- **Node.js** with **Express.js** (REST API development)
- **PostgreSQL** with **Prisma ORM** (Database management)

### **Third-Party APIs & Libraries**
- **Google Play Services Location API** (For GPS-based authentication)
- **Groq (Llama-3)** (For AI-powered chatbot feature)

## ⚙️ Installation & Setup Guide

### ✅ Prerequisites
- Install **Node.js**
- Install **PostgreSQL**
- Install **React Native** (Expo)


### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/AdityaBavadekar/soa-backend.git
   cd soa-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Setup environment variables in `.env`:
   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/rollcall
   JWT_SECRET=your_secret_key
   ```
4. Run the database migration:
   ```sh
   npx prisma migrate dev
   npx prisma generate
   ```
5. Start the server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   git clone https://github.com/dhruvl2006/soa.git
   cd soa
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the Expo app:
   ```sh
   npx expo start
   ```




## User Roles

### **Admin**
- Modify/Add classroom GPS coordinates
- View attendance records

### **Teacher**
- Start attendance session (Generates session QR code)
- Monitor attendance statistics
- Override attendance manually (if required)

### **Student**
- Scan QR code to mark attendance
- View attendance records
- Check attendance status



## **Validation Flow**

```mermaid
graph TD;
    A[Student Scans QR Code] --> B{Validate Attendance}
    B -->|QR Code Valid| C{Check Location}
    C -->|Within Classroom Boundaries| D{Check Bluetooth}
    D -->|Bluetooth Available| E[Attendance Marked]
    D -->|Bluetooth Unavailable| F{Face Recognition}
    F -->|Face Verified| E
    C -->|Outside Boundaries| G[Attendance Denied]
```


## User Flow Diagram

```mermaid

flowchart TD
    %% Start of User Authentication
    A[Start] --> Login{User Login}
    Login --> |Admin| A1[Admin Dashboard]
    Login --> |Teacher| T1[Teacher Dashboard]
    Login --> |Student| S1[Student Dashboard]

    %% Admin User Flow
    A1 --> A2[Manage Classroom Coordinates]
    A2 --> A3[Update Class Boundaries]
    A3 --> A4[Manage User Accounts]
    A4 --> A5[System Configuration]
    A5 --> A6[Generate Reports]
    A6 --> A7[Export/Share Reports]

    %% Teacher User Flow
    T1 --> T2{Attendance Options}
    T2 --> |Start Attendance Session| T3[Generate Dynamic QR Code]
    T3 --> T4[Set Session Parameters]
    T4 --> T5[Activate Bluetooth]
    T5 --> T6[Monitor Attendance]
    T6 --> T7[View Attendance Records]
    T7 --> T8[Generate Attendance Report]
    T2 --> |View Statistics| T7
    T2 --> |Chatbot Queries| T9[Attendance Support Chatbot]

    %% Student User Flow
    S1 --> S2{Attendance Marking}
    S2 --> |Mark Attendance| S3[Scan QR Code]
    S3 --> S4[Bluetooth Proximity Check]
    S4 --> S5[Location Verification]
    S5 --> S6[Face Recognition]
    S6 --> |Verification Successful| S7[Attendance Marked]
    S7 --> S8[Receive Attendance Confirmation]
    S6 --> |Verification Failed| S9[Attendance Marking Denied]
    S2 --> |Check Attendance| S10[View Attendance Records]
    S2 --> |Chatbot Support| S11[Attendance Queries Chatbot]

    %% Authentication Flows
    Login --> |First Time User| Signup{Signup}
    Signup --> |Admin Signup| AS1[Enter Email]
    Signup --> |Teacher Signup| TS1[Enter Professional Details]
    Signup --> |Student Signup| SS1[Enter Student Details]

    %% Signup Flows
    AS1 --> AS2[Create Password]
    AS2 --> AS3[Verify Email]
    AS3 --> AS4[Complete Profile]

    TS1 --> TS2[Institutional Verification]
    TS2 --> TS3[Create Credentials]
    TS3 --> TS4[Face Registration]

    SS1 --> SS2[Verify Student ID]
    SS2 --> SS3[Create Account]
    SS3 --> SS4[First-time Face Registration]

```


## **Authors**
- **Dhruv Lohar**
- **Shubham Pawar**
- **Vivek Patil**
- **Aditya Bavadekar**


## **License**
This project is licensed under the **GNU Lesser General Public License v2.1**. See [LICENSE](/LICENSE) for more details.
 Copyright (C) 2025
