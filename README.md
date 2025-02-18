# Open Art Gallery Project

## Overview
The Open Art Gallery is a web application designed to provide exhibition space for artists to showcase their work and connect with the community. The application maintains a database of art items and supports two types of users: patrons and artists. 

## Features

### Patrons
Patrons can:
- Browse all information on the site
- Add reviews and "likes" to artworks
- "Follow" artists
- Join workshops

### Artists
Artists can:
- Add new artwork
- Host workshops

## User Accounts
Both artists and patrons are considered "users" of the application. However, their accounts will have different features to cater to their specific needs.

## Requirements
The following are the minimum requirements for the Open Gallery project:

1. **User Authentication and Authorization**
   - Implement user registration and login functionality.
   - Differentiate between artist and patron accounts.

2. **Artwork Management**
   - Artists should be able to add, edit, and delete artwork.
   - Patrons should be able to browse and search for artwork.

3. **Reviews and Likes**
   - Patrons should be able to add reviews and "likes" to artworks.
   - Display the number of "likes" and reviews for each artwork.

4. **Artist Follow and Workshops**
   - Patrons should be able to "follow" artists to receive updates on new artworks and workshops.
   - Artists should be able to create and manage workshops.
   - Patrons should be able to join workshops created by artists.

## Getting Started

### Prerequisites
- A web server (e.g., Apache, Nginx)
- A database server (e.g., MySQL, PostgreSQL)
- PHP, Python, or another server-side scripting language

### Installation
1. Clone the repository to your local machine:
   ```sh
   git clone https://github.com/yourusername/open-gallery.git
   ```
2. Navigate to the project directory:
   ```sh
   cd open-gallery
   ```
3. Install the necessary dependencies:
   ```sh
   npm install
   ```

### Running the Application
1. Start the web server:
   ```sh
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000` to access the application.

## Contributing
We welcome contributions to the Open Gallery project. Please submit issues or pull requests on GitHub, and adhere to the project's code of conduct.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact
If you have any questions or need further clarification about the project, please feel free to open an issue on GitHub.
