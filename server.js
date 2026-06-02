const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// رابط قاعدة البيانات الصحيح الخاص بك 
const MONGO_URI = "mongodb+srv://elysia861_db_user:eB9dYzVeQ0swrpf@cluster0.sce1lve.mongodb.net/?appName=Cluster0"; 

mongoose.connect(MONGO_URI)
  .then(() => console.log("🏴‍☠️ تم الاتصال بقاعدة بيانات القراصنة بنجاح!"))
  .catch(err => console.error("خطأ في الاتصال بقاعدة البيانات:", err));

// هيكل بيانات اللاعب (حفظ المحافظ الحقيقية، الآي دي، ومكانتهم في اللعبة)
const UserSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String, default: "Pirate" },
  walletAddress: { type: String, default: "" }, // لربط المحافظ الحقيقية مستقبلاً
  mainBalance: { type: Number, default: 0.00 },
  userLevel: { type: Number, default: 1 },
  userXP: { type: Number, default: 0 }
});

const User = mongoose.model('User', UserSchema);

// ترحيب بسيط للتأكد من أن الخادم يعمل
app.get('/', (req, res) => {
  res.send('خادم لعبة ملك القراصنة يعمل بنجاح! 🏴‍☠️');
});

// المنفذ الذي يطلبه موقع Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`الخادم يعمل الآن على المنفذ ${PORT}`);
});
