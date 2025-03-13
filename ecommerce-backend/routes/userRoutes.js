import admin from "../middleware/adminMiddleware.js";
import {
    registerUser,
    userAuth,
    getAllUsers,
    getUserProfile,
    updateUserProfile,
    logoutUser,
    updateUserRole,
    deleteUser,
  } from "../controllers/userController.js"; // Corrected
  
  

router.get("/", protect, admin, getAllUsers);
router.put("/:id/admin", protect, admin, updateUserRole);
router.delete("/:id", protect, admin, deleteUser);
router.post("/logout", logoutUser);

