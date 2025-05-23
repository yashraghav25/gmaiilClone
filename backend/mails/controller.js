import MailSchema from "./model.js";
export const createMail = async (req, res) => {
  //added subject 
  // const { sender, reciever, type, body } = req.body;
  const { sender, reciever, subject, type, body } = req.body;
  try {
    const mail = new MailSchema({
      sender,
      reciever,
      type,
      //added subject 
      subject,
      body,
    });
    //this should be awaited
    //mail.save();
    //correct one-
    await mail.save();
    res.status(201).json(mail);
  } catch (error) {
    res.status(500).json({ message: "Error creating mail", error });
  }
};

export const getMails = async (req, res) => {
  try {
    const mails = await MailSchema.find();
    res.status(200).json(mails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMail = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the mail by ID and delete it
    const deletedMail = await MailSchema.findByIdAndDelete(id);
    if (deletedMail) {
      res.status(200).json({ message: "Mail deleted successfully" });
    } else {
      res.status(404).json({ message: "Mail not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting mail", error });
  }
};

export const starMail = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the mail by ID and mark it as starred
    const mail = await MailSchema.findById(
      id
    );
    if (mail) {
      mail.starred = !mail.starred;
      await mail.save();
      res.status(200).json(mail);
    } else {
      res.status(404).json({ message: "Mail not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error starring mail", error });
  }
};
//function defined but not exported
// const markAsRead = async (req, res) => {
export const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the mail by ID and mark it as read
    const mail = await MailSchema.findById(id);
    if (mail) {
      mail.status = "seen";
      await mail.save();
      res.status(200).json(mail);
    } else {
      res.status(404).json({ message: "Mail not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error marking mail as read", error });
  }
};
