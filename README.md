# Student Connect Website

A platform for students to share and access educational resources, including notes, slides, code examples, and more.

## Features

- Resource sharing and downloading
- Advanced search and filtering
- Resource preview
- File upload with drag-and-drop support
- Resource ratings and comments
- Responsive design
- Dark mode support

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/student-connect-website.git
cd student-connect-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
PORT=3000
```

4. Create the database tables:
```bash
psql -U your_database_user -d your_database_name -f config/schema.sql
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
student-connect-website/
├── api/                 # API endpoints
├── config/             # Configuration files
├── js/                 # Frontend JavaScript
├── styles/             # CSS styles
├── uploads/            # Uploaded files
├── .env.example        # Environment variables template
├── package.json        # Project dependencies
├── README.md           # Project documentation
└── server.js           # Main server file
```

## API Endpoints

- `GET /api/resources` - Get all resources
- `POST /api/resources` - Upload a new resource
- `GET /api/resources/:id` - Get resource details
- `GET /api/resources/:id/download` - Download a resource
- `POST /api/resources/:id/comments` - Add a comment
- `POST /api/resources/:id/rate` - Rate a resource

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@studentconnect.com or open an issue in the repository. 