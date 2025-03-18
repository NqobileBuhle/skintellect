import {Router}from "express";
import admin from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import {
    registerUser,
    userAuth,
   
    // getUserProfile,
    // updateUserProfile,
    // logoutUser,
    // updateUserRole,
    
  } from "../controllers/userController.js"; // Corrected

  const router=Router();
  
  
router.post("/register",registerUser),
router.post("/login",userAuth)
// router.get("/", protect, admin, getAllUsers);
// router.put("/:id/admin", protect, admin, updateUserRole);
// router.delete("/:id", protect, admin, deleteUser);
// router.post("/logout", logoutUser);


export default router;

