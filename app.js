const express = require('express');
const { json } = require('express/lib/response');
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const app = express();

app.use(express.json()); //middleware to translate data in the request body
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
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getSpecificTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((Element) => Element.id === id);
  if (!tour) {
    res.status(404).json({
      status: 'failure',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    tour: { tour: tour },
  });
};

const postNewTour = (req, res) => {
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
};
const patchSpecificTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((Element) => Element.id === id);
  if (!tour) {
    res.status(404).json({
      status: 'failure',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    tour: `Updated tour`,
  });
};

const deleteSpecificTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((Element) => Element.id === id);
  if (!tour) {
    res.status(404).json({
      status: 'failure',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    tour: null,
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getSpecificTour);
// app.post('/api/v1/tours', postNewTour);
// app.patch('/api/v1/tours/:id', patchSpecificTour);
// app.delete('/api/v1/tours/:id', deleteSpecificTour);

app.route('/api/v1/tours').get(getAllTours).post(postNewTour);

app
  .route('/api/v1/tours/:id')
  .get(getSpecificTour)
  .patch(patchSpecificTour)
  .delete(deleteSpecificTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
