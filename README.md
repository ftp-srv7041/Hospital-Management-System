# Hospital Management System 🏥

A full-stack web application built to streamline operations for hospital staff, doctors, and patients. I developed this project to get hands-on experience with building a complete system from scratch using React for the frontend and Spring Boot for the backend, while wrapping everything in Docker for easy deployment.

## 🚀 Features

- **Dashboard Analytics:** Visual representation of patient demographics using Recharts.
- **Secure Authentication:** Custom JWT-based login and registration system. 
- **Role-Based Views:** Protects sensitive endpoints on the backend so unauthorized users can't modify patient records.
- **Pagination:** Handling large datasets efficiently on the backend using Spring Data Pageables to prevent browser crashes or slow loads.
- **Micro-Interactions:** A clean, modern UI utilizing Lucide icons and pure CSS without relying heavily on bloated CSS frameworks.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Recharts (for Data Visualization)
- Lucide React (Icons)
- CSS3 (Custom responsive styling)

**Backend:**
- Java 17 / Spring Boot 3
- Spring Security + Custom JWT Token logic
- Hibernate / Spring Data JPA
- MySQL

**DevOps & Infrastructure:**
- Docker & Docker Compose
- Multi-stage Docker builds (optimizing image size)

## ⚙️ How to Run Locally

If you have **Docker Desktop** installed on your machine, getting this project up and running is just one simple command. No manual installation of Java or Node is required.

1. Clone the repository
```bash
git clone https://github.com/ftp-srv7041/Hospital-Management-System.git
cd Hospital-Management-System
```

2. Start the Docker containers
```bash
docker-compose up --build -d
```

3. Access the application
- Open your browser and go to: `http://localhost:5173`
- The backend API logs can be seen running behind the scenes on port `8080`.

_Note: If you run into a port conflict with `3306` (meaning you already have MySQL running locally), the `docker-compose.yml` is already safely configured to map the DB to port `3307` on your host machine to prevent clashes._

## 💡 What I Learned
Building this wasn't without its challenges! Moving from a basic backend to integrating a persistent MySQL container taught me a lot about how Docker networking actually works. Getting Spring Security completely stateless for JWTs initially gave me some tough bugs, but putting the whole picture together finally clicked once I structured the controllers and repositories properly.

---
*Feel free to star ⭐ this repository if you found it helpful!*
