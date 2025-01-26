const express=require('express')
const router=express.Router();
const User=require("../models/user")
//api cho users
router.post("/user/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json("Tên đăng nhập và mật khẩu không được để trống");
    }

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json("Tên đăng nhập hoặc mật khẩu không đúng");
        }
        if (user.password !== password) {
            return res.status(404).json("Tên đăng nhập hoặc mật khẩu không đúng");
        }

        const token = user.username;
        res.json({ token: user.username, role: user.role });
    } catch (error) {
        res.status(500).json("Server error");
    }
});


router.post("/user/register",async(req,res)=>{
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username });
        if(user){
            return res.status(404).json("Tên đăng nhập đã tồn tại");
        }
        const newUser=new User({
              username:username,
              password:password,
              role:req.body.role
        })
        newUser.save()
        .then(()=>res.status(201).json("Tạo tài khoản mới thành công"))
        .catch(err=>console.log(err))
    } catch (error) {
        console.log("Error internal");
        res.status(500).json("Add failed");
    }
});


router.post("/user/forgotpassword",async(req,res)=>{
    const {username,password}=req.body;
    console.log(username,password)
    try {
        const user=await User.findOne({username:username});
        console.log(user);
        if(user===null){
            res.status(404).json("Không tìm thấy tài khoản")
        }else{
            const updateUser = await User.findByIdAndUpdate(
                user.id, 
                { password: req.body.password },
                { new: true } // Để trả về user đã được cập nhật
            );
            res.status(201).json({message:"Đổi mật khẩu thành công"})
        }

    } catch (error) {
        res.status(500).json("Server error")
    }
});


module.exports=router;