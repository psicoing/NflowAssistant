// Ephemeral browser-test accounts only. Never imported by the application.
import { randomUUID, randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import { pool } from "../server/db";

const action = process.argv[2];
try {
  if (action === "create" || action === "create-legacy") {
    const verified = action === "create";
    const suffix = randomUUID().slice(0, 8);
    const username = `trial-browser-${suffix}`;
    const email = `${username}@example.invalid`;
    const password = `Offline-${randomUUID()}`;
    const phoneHash = randomBytes(32).toString("hex");
    const emailHash = randomBytes(32).toString("hex");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const row = (await client.query(`INSERT INTO users
        (username,email,password,subscription_status,subscription_plan,monthly_question_limit,
         trial_email_verified_at,trial_phone_verified_at,trial_phone_hash,accepted_nuxa_notice)
        VALUES($1,$2,$3,'trial','trial',5,CASE WHEN $5 THEN NOW() END,CASE WHEN $5 THEN NOW() END,$4,TRUE) RETURNING id`,
      [username, email, await bcrypt.hash(password, 10), verified ? phoneHash : null, verified])).rows[0];
      if (verified) {
        await client.query("INSERT INTO nuxa_trial_identities(phone_hash,email_hash,user_id) VALUES($1,$2,$3)",
          [phoneHash, emailHash, row.id]);
      } else {
        await client.query("UPDATE users SET questions_used_this_month=3 WHERE id=$1", [row.id]);
      }
      await client.query("COMMIT");
      console.log(JSON.stringify({ userId: row.id, username, email, password }));
    } catch (error) { await client.query("ROLLBACK"); throw error; }
    finally { client.release(); }
  } else if (action === "cleanup") {
    const userId = Number(process.argv[3]);
    if (!Number.isSafeInteger(userId)) throw new Error("Invalid fixture id");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const test = await client.query("SELECT id FROM users WHERE id=$1 AND username LIKE 'trial-browser-%'", [userId]);
      if (!test.rowCount) throw new Error("Not an ephemeral fixture");
      await client.query("DELETE FROM messages WHERE conversation_id IN(SELECT id FROM conversations WHERE user_id=$1)", [userId]);
      await client.query("DELETE FROM conversations WHERE user_id=$1", [userId]);
      await client.query("DELETE FROM nuxa_trial_questions WHERE phone_hash IN(SELECT phone_hash FROM nuxa_trial_identities WHERE user_id=$1)", [userId]);
      await client.query("DELETE FROM nuxa_trial_identities WHERE user_id=$1", [userId]);
      if ((await client.query("SELECT to_regclass('nuxa_auth_sessions') AS name")).rows[0].name) {
        await client.query("DELETE FROM nuxa_auth_sessions WHERE sess->>'userId'=$1", [String(userId)]);
      }
      await client.query("DELETE FROM users WHERE id=$1", [userId]);
      await client.query("COMMIT");
      console.log("Ephemeral trial fixture removed");
    } catch (error) { await client.query("ROLLBACK"); throw error; }
    finally { client.release(); }
  } else throw new Error("Use create, create-legacy or cleanup <userId>");
} finally { await pool.end(); }
