import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorController from './controllers/errorController.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import AppError from './utils/AppError.js';


const app = express();


app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('server is up');
});
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

app.use('/user', userRoutes);
app.get('*', (req, res, next) => {
    next(new AppError("no such route found", 404));
});









app.use(errorController);
export default app;
