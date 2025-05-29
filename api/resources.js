const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { pool } = require('../config/database');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Get all resources
router.get('/', async (req, res) => {
    try {
        const { subject, type, sort } = req.query;
        let sql = `
            SELECT r.*, 
                   array_agg(t.name) as tags,
                   COUNT(c.id) as comment_count
            FROM resources r
            LEFT JOIN resource_tags rt ON r.id = rt.resource_id
            LEFT JOIN tags t ON rt.tag_id = t.id
            LEFT JOIN comments c ON r.id = c.resource_id
        `;

        const params = [];
        const conditions = [];

        if (subject) {
            conditions.push('r.subject = $' + (params.length + 1));
            params.push(subject);
        }

        if (type) {
            conditions.push('r.type = $' + (params.length + 1));
            params.push(type);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' GROUP BY r.id';

        if (sort) {
            switch (sort) {
                case 'recent':
                    sql += ' ORDER BY r.upload_date DESC';
                    break;
                case 'popular':
                    sql += ' ORDER BY r.views DESC';
                    break;
                case 'rating':
                    sql += ' ORDER BY r.rating DESC';
                    break;
                case 'downloads':
                    sql += ' ORDER BY r.downloads DESC';
                    break;
            }
        }

        const result = await pool.query(sql, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
});

// Upload new resource
router.post('/upload', upload.single('file'), async (req, res) => {
    const client = await pool.connect();
    try {
        const { title, description, subject, type, tags } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        await client.query('BEGIN');

        // Insert resource
        const resourceResult = await client.query(
            `INSERT INTO resources 
            (title, description, subject, type, file_path, file_size, file_type, uploader_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [title, description, subject, type, file.path, file.size, file.mimetype, req.user?.id || 1]
        );

        const resource = resourceResult.rows[0];

        // Handle tags
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            for (const tagName of tagArray) {
                // Insert tag if it doesn't exist
                const tagResult = await client.query(
                    `INSERT INTO tags (name)
                    VALUES ($1)
                    ON CONFLICT (name) DO NOTHING
                    RETURNING id`,
                    [tagName]
                );

                const tagId = tagResult.rows[0]?.id || 
                    (await client.query('SELECT id FROM tags WHERE name = $1', [tagName])).rows[0].id;

                // Link tag to resource
                await client.query(
                    'INSERT INTO resource_tags (resource_id, tag_id) VALUES ($1, $2)',
                    [resource.id, tagId]
                );
            }
        }

        await client.query('COMMIT');
        res.json(resource);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error uploading resource:', error);
        res.status(500).json({ error: 'Failed to upload resource' });
    } finally {
        client.release();
    }
});

// Get resource details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT r.*, 
                    array_agg(t.name) as tags,
                    COUNT(c.id) as comment_count
             FROM resources r
             LEFT JOIN resource_tags rt ON r.id = rt.resource_id
             LEFT JOIN tags t ON rt.tag_id = t.id
             LEFT JOIN comments c ON r.id = c.resource_id
             WHERE r.id = $1
             GROUP BY r.id`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching resource:', error);
        res.status(500).json({ error: 'Failed to fetch resource' });
    }
});

// Download resource
router.get('/:id/download', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get resource details
        const result = await pool.query(
            'SELECT file_path, title FROM resources WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        const resource = result.rows[0];

        // Update download count
        await pool.query(
            'UPDATE resources SET downloads = downloads + 1 WHERE id = $1',
            [id]
        );

        // Send file
        res.download(resource.file_path, resource.title);
    } catch (error) {
        console.error('Error downloading resource:', error);
        res.status(500).json({ error: 'Failed to download resource' });
    }
});

// Add comment
router.post('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        const result = await pool.query(
            `INSERT INTO comments (resource_id, user_id, comment)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [id, req.user?.id || 1, comment]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Rate resource
router.post('/:id/rate', async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;

        const result = await pool.query(
            `UPDATE resources 
            SET rating = ((rating * rating_count) + $1) / (rating_count + 1),
                rating_count = rating_count + 1
            WHERE id = $2
            RETURNING *`,
            [rating, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error rating resource:', error);
        res.status(500).json({ error: 'Failed to rate resource' });
    }
});

module.exports = router; 