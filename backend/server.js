import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js'
import adminDashboardRouter from './routes/adminDashboardRoutes.js';
import compRouter from './routes/competitionRoutes.js';
import ticketRouter from './routes/ticketRouter.js';
import competitionRegistrationRouter from './routes/competitionRegistrationRoute.js';
import messageRouter from './routes/messageRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000
connectDB();


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/image', imageRouter)

app.use(express.json());
app.use(cookieParser());

//API Endpoints
app.get('/', (req, res) => res.send("API get working"));
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/admindashboard', adminDashboardRouter)
app.use('/api/competition', compRouter)
app.use('/api/ticket', ticketRouter)
app.use("/api/competitionRegistration", competitionRegistrationRouter);
app.use("/api/message", messageRouter);

app.listen(PORT, ()=>console.log(`server started on ${PORT}`));




 