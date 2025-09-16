/* Reset admin password via MongoDB using MONGO_URI from .env
   Usage: node scripts/resetAdmin.js <email> <newPassword>
*/
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function main() {
  const [, , emailArg, newPassArg] = process.argv;
  const email = emailArg || process.env.ADMIN_EMAIL;
  const newPass = newPassArg || process.env.ADMIN_NEW_PASSWORD;
  if (!email || !newPass) {
    console.error('Usage: node scripts/resetAdmin.js <email> <newPassword>');
    process.exit(1);
  }
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prism_tech';
  await mongoose.connect(uri, { autoIndex: true });

  const userSchema = new mongoose.Schema(
    {
      email: { type: String, index: true },
      passwordHash: String,
      name: String,
      role: String,
    },
    { collection: 'users' }
  );
  const User = mongoose.model('User', userSchema);

  let user = await User.findOne({ email });
  const hash = bcrypt.hashSync(newPass, 10);
  if (!user) {
    await User.create({ email, passwordHash: hash, name: 'Admin', role: 'admin' });
    console.log('Admin created for', email);
  } else {
    user.passwordHash = hash;
    await user.save();
    console.log('Password updated for', email);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


