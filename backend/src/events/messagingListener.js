import appEvents from './appEvents.js';
import messagingModel from '../models/messagingModel.js';
import commentModel from '../models/commentModel.js';
import userModel from '../models/userModel.js';

console.log('>>> Messaging listener loaded');

appEvents.on('comment.created', async ({ commentId }) => {
  try {
    const comment = await commentModel
      .findById(commentId)
      .populate({
        path: 'article',
        select: 'title createdBy category',
        populate: {
          path: 'category',
          select: 'title queryPath area',
          populate: {
            path: 'area',
          },
        },
      })
      .populate({
        path: 'user',
        select: 'username userHash',
      });

    if (!comment) {
      console.error(`Comment ${commentId} not found`);
      return;
    }

    const authorId = comment.article.createdBy;

    // Eigenen Kommentar nicht an sich selbst senden
    if (authorId.toString() === comment.user._id.toString()) {
      return;
    }

    const articleUrl =
      `/area/${comment.article.category.area.queryPath}` +
      `/category/${comment.article.category.queryPath}` +
      `/article/${comment.article._id}`;

    const messaging = await messagingModel.create({
      recipient: authorId,
      sender: comment.user._id,
      type: 'comment_created',
      titleKey: 'my_wiki.components.messaging_list.comment_title',
      messageKey: 'my_wiki.components.messaging_list.comment_created.message',
      messageParams: {
        articleTitle: comment.article.title,
        commentContent: comment.content,
      },
      article: comment.article._id,
      comment: comment._id,
      articleUrl,
    });

    console.log('>>> MESSAGE CREATED:', messaging);
  } catch (error) {
    console.error('Messaging error:', error);
  }
});

appEvents.on('creator.requested', async ({ userId }) => {
  try {
    const user = await userModel.findById(userId).select('_id username');

    if (!user) {
      console.error(`User ${userId} not found`);
      return;
    }

    const admins = await userModel.find({ role: 'admin' }).select('_id');

    if (!admins.length) {
      console.error('No administrators found');
      return;
    }

    await messagingModel.insertMany(
      admins.map((admin) => ({
        recipient: admin._id,
        sender: user._id,
        type: 'creator_request',
        titleKey: 'my_wiki.components.messaging_list.creator_title',
        messageKey: 'my_wiki.components.messaging_list.upgrade_creator_message',
        messageParams: {
          username: user.username,
        },
      })),
    );

    console.log(`>>> Creator request messaging created for ${admins.length} admin(s)`);
  } catch (error) {
    console.error('Creator request messaging error:', error);
  }
});
