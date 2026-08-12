import messagingModel from '../models/messagingModel.js';

export const getUnreadMessageCount = async (req, res) => {
  const { userId } = req.user;

  const count = await messagingModel.countDocuments({
    recipient: userId,
    read: false,
  });

  return res.status(200).json({
    success: true,
    count,
  });
};

export const getMyMessages = async (req, res) => {
  const { userId } = req.user;

  const messages = await messagingModel
    .find({
      recipient: userId,
    })
    .populate({
      path: 'sender',
      select: 'username userHash',
    })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: messages,
  });
};

export const markMessageAsRead = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const message = await messagingModel.findOneAndUpdate(
    {
      _id: id,
      recipient: userId,
    },
    {
      $set: {
        read: true,
      },
    },
    {
      new: true,
    },
  );

  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Nachricht nicht gefunden.',
    });
  }

  return res.status(200).json({
    success: true,
    data: message,
  });
};
