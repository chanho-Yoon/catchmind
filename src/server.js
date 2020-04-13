import { join } from 'path';
import express from 'express';
import socketIO from 'socket.io';
import morgan from 'morgan';
import socketController from './socketController';
import events from './events';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 4000;
const app = express();

app.set('view engine', 'pug');
app.use(morgan('dev'));
app.set('views', join(__dirname, 'views'));
app.use(express.static(join(__dirname, 'static')));

app.get('/', (req, res) => res.render('home', { events: JSON.stringify(events) }));

const handleListening = () => console.log(`✅ Server running: http://localhost:${PORT}`);
const server = app.listen(process.env.PORT || 3000, handleListening);
// socket io
const io = socketIO.listen(server);

io.on('connection', socket => socketController(socket, io));
