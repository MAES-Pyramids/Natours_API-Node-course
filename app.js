const express = require('express');
const { json } = require('express/lib/response');
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const app = express();

app.use(express.json()); //middle ware to translate data in the request body
//---------------------------------------------------------------------------
// app.get('/', (req, res) => {
//   // res.status(200).send(`Hello from the server side , it"s nice to meat you!"`);   //send used to send string
//   res.status(200).json({
//     message: `Hello from the server side , it's nice to meat you`,
//     app: 'Natrous',
//   }); //json used to send object {key: value}
// });

// app.post('/', (req, res) => {
//   res.status(401).send('Sorry, you are not allowed to post at the moment');
// });
//---------------------------------------------------------------------------
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body); //body is the property name of the body in the request
  const newId = tours.at(-1).id + 1;
  const newTours = Object.assign({ id: newId }, req.body);
  tours.push(newTours);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      res.status(201).json({
        status: 'success',
        results: tours.length,
        data: { tours: tours },
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
