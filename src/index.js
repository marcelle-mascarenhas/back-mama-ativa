const express = require('express')
const cors = require('cors')

const { Pool } = require('pg')
require('dotenv').config()

const PORT = process.env.PORT || 3333

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
})

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => { console.log('olá mundo') })

//milk bank

app.post('/milk-bank', async (req, res) => {
    const { name_bank, address } = req.body
    try {
        const milkBank = await pool.query('INSERT INTO milk_bank(name_bank, address) VALUES ($1, $2) RETURNING *', [name_bank, address])
        return res.status(200).send(milkBank.rows)
    } catch (err) {
        return res.status(400).send(err)
    }
})

app.get('/milk-bank', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM milk_bank')
        return res.status(200).send(rows)
    } catch (err) {
        return res.status(400).send(err)
    }

})

app.patch('/milk-bank/:milk_bank_id', async (req, res) => {
    const { milk_bank_id } = req.params
    const data = req.body

    try {
        const updatedMilkBank = await pool.query('UPDATE milk_bank SET name_bank = ($1), address = ($2) WHERE milk_bank_id = ($4) RETURNING *', [data.name_bank, data.address, milk_bank_id])
        return res.status(200).send(updatedMilkBank.rows)
    } catch (err) {
        return res.status(400).send(err)
    }
})

app.delete('/milk-bank/:milk_bank_id', async (req, res) => {
    const { milk_bank_id } = req.params
    try {
        const deletedMilkBank = await pool.query('DELETE FROM milk_bank WHERE milk_bank_id = ($1) RETURNING *', [milk_bank_id])
        return res.status(200).send({
            message: 'Milk Bank successfully deleted',
            deletedMilkBank: deletedMilkBank.rows
        })

    } catch (err) { res.status(400).send(err) }
})

//milk donations

app.post('/milk-donations', async (req, res) => {
    const { name, amount, date } = req.body
    try {
        const milkDonations = await pool.query('INSERT INTO milk_donations(name, amount, date) VALUES ($1, $2, $3) RETURNING *', [name, amount, date])
        return res.status(200).send(milkDonations.rows)
    } catch (err) {
        return res.status(400).send(err)
    }
})

app.get('/milk-donations', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM milk_donations')
        return res.status(200).send(rows)
    } catch (err) {
        return res.status(400).send(err)
    }

})

app.patch('/milk-donations/:milk_donations_id', async (req, res) => {
    const { milk_donations_id } = req.params
    const data = req.body

    try {
        const updatedDonations = await pool.query('UPDATE milk_donations SET name = ($1), amount = ($2), date = ($3) WHERE milk_donations_id = ($4) RETURNING *', [data.name, data.amount, data.date, milk_donations_id])
        return res.status(200).send(updatedDonations.rows)
    } catch (err) {
        return res.status(400).send(err)
    }
})

app.delete('/milk-donations/:milk_donations_id', async (req, res) => {
    const { milk_donations_id } = req.params
    try {
        const deletedDonations = await pool.query('DELETE FROM milk_donations WHERE milk_donations_id = ($1) RETURNING *', [milk_donations_id])
        return res.status(200).send({
            message: 'Donations successfully deleted',
            deletedDonations: deletedDonations.rows
        })

    } catch (err) { res.status(400).send(err) }
})

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))

