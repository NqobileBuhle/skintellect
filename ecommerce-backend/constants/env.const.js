import dotenv from "dotenv";

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI ||"mongodb+srv://nqobilebiyela3:BNBt6fNCJrMkiq0D@cluster0.gfhn9.mongodb.net/eCommerce?retryWrites=true&w=majority&appName=Cluster0";
export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET;