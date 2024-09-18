const { User, Thought } = require('../models');

const userController = {
    async getAllUsers(req, res) {
        try {
            const userData = await User.find()
            res.json(userData)
        } catch (err) {
            res.status(500).json(err)
        }
    },

    async getOneUser(req, res) {
        try {
            const userData = await User.findOne({ _id: req.params.userId })
                .populate('friends')
                .populate('thoughts')
            if (!userData) {
                return res.status(404).json({ message: 'No user with that ID!' });
            }
            res.json(userData)
        }   catch (err) {
            res.status(500).json(err)
        }
    },

    async createUser(req, res) {
        try {
          const userData = await User.create(req.body);
          res.json(userData);
        } catch (err) {
          console.log(err);
          return res.status(500).json(err);
        }
      },

      async updateUser(req, res) {
        try {
          const userData = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
          );
    
          if (!userData) {
            res.status(404).json({ message: 'No user with that ID!' });
          }
    
          res.json(userData);
        } catch (err) {
          res.status(500).json(err);
        }
      },
      
      async deleteUser(req, res) {
        try {
          const userData = await User.findOneAndDelete({ _id: req.params.userId });
    
          if (!userData) {
            res.status(404).json({ message: 'No user with that ID' });
          }
    
          await Thought.deleteMany({ _id: { $in: userData.thoughts } });
          res.json({ message: 'User and their thoughts have been deleted!' });
        } catch (err) {
          res.status(500).json(err);
        }
      },

      async addFriend(req, res) {
        try {
          const userData = await User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true });
    
          if (!userData) {
            return res.status(404).json({ message: 'No user with that ID!' });
          }
    
          res.json(userData);
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
      
      async deleteFriend(req, res) {
        try {
          const userData = await User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true });
    
          if (!userData) {
            return res.status(404).json({ message: 'No user with that ID!' });
          }
    
          res.json(userData);
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },


}



module.exports = userController;


