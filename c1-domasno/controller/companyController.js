const User = require(`../model/companyModel`);

exports.createUser = async (req,res) => {
    try{
        const newUser = await User.create(req.body);

        res.status(201).json({
            status: `Success`,
            data: {
            company : newUser
        },
        })
    } catch(err) {
        res.status(500).json({
            status: `fail`,
            message: err.message,
          });
    }
}

exports.getAllUsers = async (req,res) => {
    try{
    const users = await User.find();
    
    res.status(201).json({
            status: `Success`,
            data: {
                users: users,
            }
        })
    }catch(err){
        res.status(500).json({
            status: `fail`,
            message: err.message,
          });
    }
}

exports.updateUser = async (req,res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
          });
        res.status(201).json({
            status: `Success`,
            data: updatedUser,
        });
    }catch(err){
        res.status(500).json({
            status: `fail`,
            message: err.message,
          });
    }
}

exports.deleteUser = async (req,res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        res.status(201).json({
            status:`Success`,
            data: deletedUser,
        });
    }catch(err){
        res.status(500).json({
            status: `fail`,
            message: err.message,
          });
    }
}
