const express = require('express');

const app = express();

app.use(express.json());

require('dotenv').config();

let port = process.env.PORT;

let rooms = [
  {
    room_name: 'Elite',
    room_id: 1,
    seats: 100,
    amenities: ['wifi,projection screen,AC,TV'],
    price_per_hour: 1500,
  },
  {
    room_name: 'Premium',
    room_id: 2,
    seats: 150,
    amenities: ['wifi,projection screen,AC,TV'],
    price_per_hour: 2500,
  },
];

let bookingDetails = [
  {
    customerName: 'vino',
    room_name: 'Elite',
    booked_room_id: 1,
    date: new Date('2022-06-19'),
    start_time: '15:00',
    end_time: '17:00',
    status: 'booked',
  },
  {
    customerName: 'vivek',
    room_name: 'Premium',
    booked_room_id: 2,
    date: new Date('2022-06-18'),
    start_time: '07:00',
    end_time: '10:00',
    status: 'booked',
  },
];

// home page

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to all',
    To_create_a_room: '/room/create',
    To_book_a_room: '/room/book',
    To_get_the_details_of_booked_rooms: ' /room/booked-details',
    To_get_the_details_of_booked_customer: '/room/customer-details',
  });
});
// creating a room

app.post('/room/create', (req, res) => {
  let id = rooms.length + 1;
  req.body.room_id = id;
  rooms.push({
    room_name: req.body.room_name,
    room_id: req.body.room_id,
    seats: req.body.seats,
    amenities: req.body.amenities,
    price_per_hour: req.body.price_per_hour,
  });
  res.status(201).json(`The id ${id} with room is created successfully`);
});

// Booking a room

app.post('/room/book', (req, res) => {
  let id = bookingDetails.length + 1;
  req.body.booked_room_id = id;
  try {
    req.body.date = new Date(req.body.date);
    let booking_detail = {
      customerName: req.body.customerName,
      booked_room_id: req.body.booked_room_id,
      room_name: req.body.room_name,
      date: req.body.date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      status: 'booked',
    };
    let result = undefined;
    for (const book of bookingDetails) {
      if (
        book.date.getTime() == req.body.date.getTime() &&
        book.start_time === req.body.start_time
      ) {
        console.log(book.date.getTime(), req.body.date.getTime());
        result = 0;
        console.log('in booking');
        return res
          .status(400)
          .send({ error: 'The room is not available with this time slot' });
      } else {
        result = 1;
        bookingDetails.push(booking_detail);
        return res
          .status(201)
          .send(
            `Room is successfully booked with the id ${req.body.booked_room_id}`
          );
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send('internal error');
  }
});

// List all rooms with booked data

app.get('/room/booked-details', (req, res) => {
  let roomArray = [];

  bookingDetails.forEach((customer) => {
    let roomObj = {};

    roomObj.room_name = customer.room_name;
    roomObj.status = customer.status;
    roomObj.customerName = customer.customerName;
    roomObj.date = customer.date;
    roomObj.start_time = customer.start_time;
    roomObj.end_time = customer.end_time;
    roomArray.push(roomObj);
  });

  res.status(200).send(roomArray);
});

// List all customers with booked data

app.get('/room/customer-details', (req, res) => {
  let customerArray = [];

  bookingDetails.forEach((customer) => {
    let customerObj = {};
    customerObj.customerName = customer.customerName;
    customerObj.room_name = customer.room_name;
    customerObj.date = customer.date;
    customerObj.start_time = customer.start_time;
    customerObj.end_time = customer.end_time;
    customerArray.push(customerObj);
  });

  res.status(200).send(customerArray);
});

app.listen(port, () => {
  console.log(`App is running on the port ${port}`);
});