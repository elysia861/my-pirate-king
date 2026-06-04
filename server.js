const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// رابط قاعدة البيانات الخاص بك
const MONGO_URI = "mongodb+srv://elysia861_db_user:eB9dYzVeQ0swrpf@cluster0.sce1lve.mongodb.net/?appName=Cluster0"; 

// الاتصال بقاعدة البيانات مع منع التكرار
if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("🏴‍☠️ تم الاتصال بقاعدة بيانات القراصنة بنجاح!"))
    .catch(err => console.error("خطأ في الاتصال بقاعدة البيانات:", err));
}

// هيكل بيانات اللاعب الكامل (تمت إضافة السفن والمهام هنا ⚓)
const UserSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String, default: "Pirate" },
  walletAddress: { type: String, default: "" }, 
  mainBalance: { type: Number, default: 0.00 },
  userLevel: { type: Number, default: 1 },
  userXP: { type: Number, default: 0 },
  purchasedShips: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, // حفظ السفن المملوكة
  completedTasks: { type: [Number], default: [0, 0] } // حفظ المهام المكتملة
});

// لمنع إعادة تعريف الموديل
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// ترحيب للتأكد من عمل الخادم
app.get('/', (req, res) => {
  res.send('خادم لعبة ملك القراصنة يعمل بنجاح على Vercel! 🏴‍☠️');
});

// دالة (API) لاستقبال وحفظ وتحديث بيانات اللاعب بالكامل
app.post('/api/save-game', async (req, res) => {
  try {
    const { telegramId, username, walletAddress, mainBalance, userLevel, userXP, purchasedShips, completedTasks } = req.body;
    
    if (!telegramId) {
      return res.status(400).json({ success: false, message: "Missing telegramId" });
    }

    // تحديث البيانات أو إنشائها إن لم تكن موجودة
    const user = await User.findOneAndUpdate(
      { telegramId },
      { username, walletAddress, mainBalance, userLevel, userXP, purchasedShips, completedTasks },
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = app;
