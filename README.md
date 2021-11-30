## About The Project
This is the frontend (dashboard) of DNA Gate, a SaaS app for robust biometric authentication. 

Check this [link](https://github.com/ArnolFokam/dna-gate) for more information.

### Built With

* [React](https://reactjs.org/)
* [Redux Toolkit](https://redux-toolkit.js.org/)
* [Windmill ReactUI](https://windmillui.com/react-ui/)
* [MongoDB](mongodb.com)
* [Express](https://expressjs.com/)


## Getting Started

1. Clone the repository
2. Enter the project's directory and edit the .env file as follows
```
SECRET_KEY=supersecretkey
STRIPE_SECRET_KEY=sk_test_
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_

DNA_GATE_API_KEY=you DNA Gate api ley available through the dashboard (key management section)
DNA_GATE_URL=the link to your DNA Gate backend

MONGODB_URI=link to a running instance of mongodb (eg. mongodb://localhost:27017/dna-gate-demo-app)

NODE_ENV=development
```
4. Run ```npm install```
5. Run ```npm run dev``` to run a development version of the project
6. Run ```npm run build && npm run build:server:nodemon``` to run a production version of the project. 

Note: 
- you should have NODE_ENV=production in the .env if you are running a production version.
- You must set ```STRIPE_SECRET_KEY``` and ```REACT_APP_STRIPE_PUBLISHABLE_KEY``` in the **.env** file accordingly to have the payment functionality of the exmaple app. See [docs](https://stripe.com/docs/keys).
You should have the frontend of the app front end up and running at [http://localhost:5000](http://localhost:5000).

## License

Distributed under the Apache 2.0 License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>


## Contact

Arnol Fokam - [@ArnolFokam](https://twitter.com/arnolfokam)

Project Link: [https://github.com/ArnolFokam/dna-gate](https://github.com/ArnolFokam/dna-gate-backend)

<p align="right">(<a href="#top">back to top</a>)</p>
