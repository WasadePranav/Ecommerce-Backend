const connection = require("./Connection");
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


function validateFields(fields) {
    for (const field in fields) {
        if (!fields[field]) {
            return `Please check ${field}`;
        }
    }
    return null; 
}

app.get('/Orders', (req, res) => {
    connection.query('SELECT * FROM Orders', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(rows);
        }
    });
});

app.get('/Orders/:id', (req, res) => {
    connection.query('SELECT * FROM Orders WHERE id=?', [req.params.id], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            if (rows.length === 0) {
                res.status(404).send('Order not found');
            } else {
                res.send(rows[0]);
            }
        }
    });
});

app.delete('/Orders/:id', (req, res) => {
    connection.query('DELETE FROM Orders WHERE id=?', [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            if (result.affectedRows === 0) {
                res.status(404).send('Order not found');
            } else {
                res.send('Order deleted successfully');
            }
        }
    });
});

app.post('/Orders', (req, res) => {
    const emp = req.body;
    const validationError = validateFields(emp);
    if (validationError) {
        res.status(400).send(validationError);
        return;
    }
    const empData = [emp.id, emp.FirstName, emp.LastName, emp.City];
    connection.query('INSERT INTO Orders (id, FirstName ,LastName,  City) VALUES (?)', [empData], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send('Order added successfully');
        }
    });
});

app.patch('/Orders/:id', (req, res) => {
    const orderId = req.params.id;
    const updates = req.body;
    const validationError = validateFields(updates);
    if (validationError) {
        res.status(400).send(validationError);
        return;
    }
    connection.query('UPDATE Orders SET ? WHERE id=?', [updates, orderId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            if (result.affectedRows === 0) {
                res.status(404).send('Order not found');
            } else {
                res.send('Order updated successfully');
            }
        }
    });
});


app.use((req, res) => {
    res.status(404).send('Error: Please Check The Path');
});

app.listen(3000, () => console.log("Server is running on port 3000"));
