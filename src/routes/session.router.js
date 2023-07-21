import { Router } from "express";
import userModel from "../dao/mongo/models/user.js";

const router = Router();

router.post('/register',async(req,res)=>{
    const { first_name, last_name, email, password } = req.body;

    // Crear un nuevo documento del modelo "User" sin incluir el campo "rol"
    const newUser = new userModel({ first_name, last_name, email, password });
  
    try {
      // Guardar el nuevo usuario en la base de datos
      const result = await newUser.save();
      res.send({ status: "success", payload: result });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ status: "error", error: "Error during registration" });
    }
  });

router.post('/login',async(req,res)=>{
    const {email, password} = req.body;
    //Número 1!!!!! buscar al usuario, ¿existe?
    const user = await userModel.findOne({email,password});
    if(!user) return res.status(400).send({status:"error",error:"Usuario o contraseña incorrectas"});
    
    //Número 2!!!! si sí existe el usuario, Créale una SESIÓN.
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        // Si es un administrador, agregar el campo "rol" a la sesión
        req.session.user = {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          rol: 'admin',
        };
      } else {
        // Si no es un administrador, agregar el campo "rol" a la sesión como "user" (puedes omitirlo, ya que es el valor predeterminado en el esquema del modelo)
        req.session.user = {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          rol: 'user',
        };
      }
      res.json({ status: 'success' });
    });
router.post('/logout', (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ status: "Error", error });
      }
      res.json({ status: "Success", message: "Logout successful" });
    });
  });
export default router;